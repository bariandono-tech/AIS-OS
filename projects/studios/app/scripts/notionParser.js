import { Client } from "@notionhq/client";

// Helper to convert rich text array to markdown string
export function getRichText(richTextArray) {
  if (!richTextArray || !richTextArray.length) return "";
  return richTextArray.map(item => {
    let text = item.plain_text;
    if (item.annotations) {
      if (item.annotations.bold) text = `**${text}**`;
      if (item.annotations.code) text = `\`${text}\``;
      if (item.annotations.italic) text = `*${text}*`;
      if (item.annotations.strikethrough) text = `~~${text}~~`;
    }
    return text;
  }).join("");
}

// Convert children blocks of a page to Markdown (for notes)
export async function blocksToMarkdown(notion, blockId) {
  const blocks = await fetchAllChildBlocks(notion, blockId);
  let markdown = "";
  let listDepth = 0;

  for (const block of blocks) {
    markdown += await blockToMarkdown(notion, block, listDepth);
  }

  return markdown.trim();
}

// Helper to fetch all children recursively if paginated
async function fetchAllChildBlocks(notion, blockId) {
  let results = [];
  let hasMore = true;
  let cursor = undefined;

  while (hasMore) {
    try {
      const response = await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
        page_size: 100
      });
      results = results.concat(response.results);
      hasMore = response.has_more;
      cursor = response.next_cursor;
    } catch (err) {
      console.error(`Error fetching blocks for ${blockId}:`, err.message);
      break;
    }
  }
  return results;
}

// Convert a single block to Markdown
async function blockToMarkdown(notion, block, depth = 0) {
  const type = block.type;
  const content = block[type];
  if (!content) return "";

  const text = getRichText(content.rich_text);

  switch (type) {
    case "paragraph":
      return `${text}\n\n`;
    case "heading_1":
      return `# ${text}\n\n`;
    case "heading_2":
      return `## ${text}\n\n`;
    case "heading_3":
      return `### ${text}\n\n`;
    case "bulleted_list_item":
      let bulletChildrenStr = "";
      if (block.has_children) {
        const children = await fetchAllChildBlocks(notion, block.id);
        for (const child of children) {
          bulletChildrenStr += await blockToMarkdown(notion, child, depth + 1);
        }
      }
      return `${"  ".repeat(depth)}- ${text}\n${bulletChildrenStr}`;
    case "numbered_list_item":
      let numChildrenStr = "";
      if (block.has_children) {
        const children = await fetchAllChildBlocks(notion, block.id);
        for (const child of children) {
          numChildrenStr += await blockToMarkdown(notion, child, depth + 1);
        }
      }
      return `${"  ".repeat(depth)}1. ${text}\n${numChildrenStr}`;
    case "quote":
      return `> ${text}\n\n`;
    case "code":
      const rawCode = content.rich_text.map(t => t.plain_text).join("");
      return `\`\`\`${content.language || ""}\n${rawCode}\n\`\`\`\n\n`;
    case "bookmark":
      return `[${content.url}](${content.url})\n\n`;
    case "table":
      return await parseTableBlock(notion, block.id);
    case "divider":
      return "---\n\n";
    default:
      return "";
  }
}

// Parse Notion table block to Markdown table syntax
async function parseTableBlock(notion, tableBlockId) {
  try {
    const rows = await fetchAllChildBlocks(notion, tableBlockId);
    if (!rows.length) return "";

    const tableRows = rows.map(row => {
      const cells = row.table_row.cells;
      return cells.map(cell => getRichText(cell));
    });

    let markdownTable = "\n";
    
    // Header
    const headerRow = tableRows[0];
    markdownTable += `| ${headerRow.join(" | ")} |\n`;
    
    // Separator
    markdownTable += `| ${headerRow.map(() => "---").join(" | ")} |\n`;
    
    // Body
    for (let i = 1; i < tableRows.length; i++) {
      markdownTable += `| ${tableRows[i].join(" | ")} |\n`;
    }
    
    markdownTable += "\n";
    return markdownTable;
  } catch (err) {
    console.error("Error parsing table block:", err.message);
    return "";
  }
}

// Convert children blocks to structured Sections (for resume)
export async function blocksToResume(notion, blockId) {
  const blocks = await fetchAllChildBlocks(notion, blockId);
  const sections = [];
  let currentSection = { title: "Pengantar", content: "" };

  for (const block of blocks) {
    if (block.type === "heading_1" || block.type === "heading_2") {
      if (currentSection.content.trim()) {
        sections.push({
          title: currentSection.title,
          content: currentSection.content.trim()
        });
      }
      currentSection = {
        title: getRichText(block[block.type].rich_text),
        content: ""
      };
    } else {
      const md = await blockToMarkdown(notion, block, 0);
      currentSection.content += md;
    }
  }

  // Push final section
  if (currentSection.content.trim() || currentSection.title !== "Pengantar") {
    sections.push({
      title: currentSection.title,
      content: currentSection.content.trim()
    });
  }

  return { sections };
}

// Parse recursive nested list to mind map nodes (for brainstorm)
export async function blocksToBrainstorm(notion, blockId, stackColor = "#6c5ce7") {
  const nodes = [];
  
  // Color palette for tree levels
  const colors = [stackColor, "#00b894", "#fd79a8", "#fdcb6e", "#e17055", "#00cec9"];

  async function recurse(parentId, currentBlockId, depth) {
    const blocks = await fetchAllChildBlocks(notion, currentBlockId);
    const bulletItems = blocks.filter(b => b.type === "bulleted_list_item");
    
    for (const item of bulletItems) {
      const nodeId = item.id;
      const label = getRichText(item.bulleted_list_item.rich_text);
      const color = colors[depth % colors.length];

      nodes.push({
        id: nodeId,
        label,
        parent_id: parentId,
        color
      });

      if (item.has_children) {
        await recurse(nodeId, item.id, depth + 1);
      }
    }
  }

  await recurse(null, blockId, 0);
  return { nodes };
}

// Parse toggle blocks to flashcards
export async function blocksToFlashcards(notion, blockId) {
  const blocks = await fetchAllChildBlocks(notion, blockId);
  const flashcards = [];

  for (const block of blocks) {
    if (block.type === "toggle") {
      const front = getRichText(block.toggle.rich_text);
      let back = "";
      
      if (block.has_children) {
        const children = await fetchAllChildBlocks(notion, block.id);
        const backMdArray = [];
        for (const child of children) {
          const md = await blockToMarkdown(notion, child, 0);
          if (md.trim()) backMdArray.push(md.trim());
        }
        back = backMdArray.join("\n");
      }

      // Extract tags using simple regex for words starting with hash in front/back
      const tags = [];
      const tagRegex = /#([a-zA-Z0-9_-]+)/g;
      let match;
      const combinedText = `${front} ${back}`;
      while ((match = tagRegex.exec(combinedText)) !== null) {
        const tag = match[1].toLowerCase();
        if (!tags.includes(tag)) tags.push(tag);
      }

      // Strip tag markers from display front/back to clean it up (optional)
      const cleanFront = front.replace(/#[a-zA-Z0-9_-]+/g, "").trim();
      const cleanBack = back.replace(/#[a-zA-Z0-9_-]+/g, "").trim();

      flashcards.push({
        front: cleanFront || front,
        back: cleanBack || back,
        tags
      });
    }
  }

  return flashcards;
}

// Parse links/bookmarks/markdown links to references
export async function blocksToReferences(notion, blockId) {
  const blocks = await fetchAllChildBlocks(notion, blockId);
  const references = [];

  for (const block of blocks) {
    // 1. Handle native bookmark blocks
    if (block.type === "bookmark") {
      const url = block.bookmark.url;
      const description = getRichText(block.bookmark.caption);
      
      // Auto-detect type
      let ref_type = "article";
      if (url.includes("youtube.com") || url.includes("youtu.be") || url.includes("vimeo.com")) {
        ref_type = "video";
      } else if (url.includes("scholar.google") || url.endsWith(".pdf")) {
        ref_type = "paper";
      } else if (url.includes("book") || url.includes("amazon.com")) {
        ref_type = "book";
      }

      // Extract domain as a default title
      let title = "Tautan Referensi";
      try {
        const parsedUrl = new URL(url);
        title = parsedUrl.hostname.replace("www.", "");
      } catch (e) {}

      references.push({
        url,
        ref_type,
        title,
        description: description || `Referensi ke ${url}`
      });
    }

    // 2. Handle bullet items formatted like "- [Title](URL) - Description"
    if (block.type === "bulleted_list_item") {
      const richText = block.bulleted_list_item.rich_text;
      
      // Look for a link in rich text
      const linkItem = richText.find(item => item.href);
      if (linkItem) {
        const url = linkItem.href;
        const title = linkItem.plain_text;
        
        // Combine the rest of text as description
        const textStr = richText.map(t => t.plain_text).join("");
        const description = textStr.replace(title, "").replace(/^\s*[-:]\s*/, "").trim();

        let ref_type = "article";
        if (url.includes("youtube.com") || url.includes("youtu.be") || url.includes("vimeo.com")) {
          ref_type = "video";
        } else if (url.includes("scholar.google") || url.endsWith(".pdf")) {
          ref_type = "paper";
        } else if (url.includes("book") || url.includes("amazon.com")) {
          ref_type = "book";
        }

        references.push({
          url,
          ref_type,
          title,
          description: description || `Tautan: ${title}`
        });
      }
    }
  }

  return references;
}
