import { useState, useEffect, useRef } from "react";
import { contentTypeConfig } from "../data/mockData";
import { getFlashcards, getReferences } from "../services/dataService";

export default function ContentViewer({ content, stack, onBack, onFlashcardProgress }) {
  const isHTML = content.type === "notes" && content.body?.markdown && (
    content.body.markdown.trim().startsWith("<") || 
    content.body.markdown.trim().includes("</script>") ||
    content.body.markdown.toLowerCase().includes("<iframe") ||
    content.body.markdown.toLowerCase().includes("<html")
  );

  if (isHTML) {
    return (
      <div className="viewer-interactive" id="content-viewer-interactive" style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative"
      }}>
        {/* Sleek, thin bar for navigation & context to save space */}
        <div className="viewer-interactive__header" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          background: "rgba(10, 10, 15, 0.6)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border-subtle)",
          flexShrink: 0,
          zIndex: 100
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button 
              className="viewer__back" 
              onClick={onBack} 
              id="back-to-stack"
              style={{ margin: 0, padding: "4px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", fontSize: "12px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
            >
              ← Kembali ke {stack?.title}
            </button>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.2px" }}>
              {content.title}
            </span>
          </div>
          <span className={`content-card__type-badge content-card__type-badge--${content.type}`} style={{ margin: 0 }}>
            {contentTypeConfig[content.type]?.icon}{" "}
            Interactive Widget
          </span>
        </div>
        
        <div style={{ flex: 1, position: "relative", overflow: "hidden", width: "100%", height: "100%" }}>
          <HTMLContentRenderer html={content.body.markdown} isWidgetMode={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="viewer" id="content-viewer">
      <button className="viewer__back" onClick={onBack} id="back-to-stack">
        ← Kembali ke {stack?.title}
      </button>

      <div className="viewer__header">
        <span className={`content-card__type-badge content-card__type-badge--${content.type}`}>
          {contentTypeConfig[content.type]?.icon}{" "}
          {contentTypeConfig[content.type]?.label}
        </span>
        <h1 className="viewer__title">{content.title}</h1>
        <div className="viewer__meta">
          <span>{stack?.icon} {stack?.title}</span>
        </div>
      </div>

      {/* Render based on content type */}
      {content.type === "resume" && <ResumeRenderer body={content.body} />}
      {content.type === "notes" && <NotesRenderer body={content.body} />}
      {content.type === "flashcard" && <FlashcardRenderer contentId={content.id} onProgress={onFlashcardProgress} />}
      {content.type === "brainstorm" && <BrainstormRenderer body={content.body} />}
      {content.type === "reference" && <ReferenceRenderer contentId={content.id} />}
    </div>
  );
}

/* --- Table Renderer Component --- */
function TableRenderer({ rows }) {
  const isSeparator = (row) => /^[|\s-:]+$/.test(row);
  const cleanRows = rows.filter(row => !isSeparator(row));

  if (cleanRows.length === 0) return null;

  const parseRow = (row) => {
    const cells = row.split("|").map(cell => cell.trim());
    if (cells[0] === "") cells.shift();
    if (cells[cells.length - 1] === "") cells.pop();
    return cells;
  };

  const headerCells = parseRow(cleanRows[0]);
  const bodyRows = cleanRows.slice(1).map(parseRow);

  return (
    <div style={{ overflowX: "auto", margin: "var(--space-md) 0" }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "var(--font-size-sm)",
        color: "var(--text-secondary)",
        border: "1px solid var(--border-subtle)",
        background: "var(--bg-glass-light)",
        borderRadius: "var(--radius-sm)",
      }}>
        <thead>
          <tr style={{ background: "rgba(255, 255, 255, 0.02)", borderBottom: "1px solid var(--border-subtle)" }}>
            {headerCells.map((cell, idx) => (
              <th key={idx} style={{
                padding: "12px var(--space-md)",
                textAlign: "left",
                fontWeight: 600,
                color: "var(--text-primary)",
              }}>
                {formatText(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((rowCells, rowIdx) => (
            <tr key={rowIdx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
              {rowCells.map((cell, cellIdx) => (
                <td key={cellIdx} style={{ padding: "12px var(--space-md)" }}>
                  {formatText(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* --- Block parser and formatter helper --- */
function parseAndRenderBlocks(lines) {
  const elements = [];
  let currentTable = [];
  let inCodeBlock = false;
  let codeContent = "";

  const flushTable = (key) => {
    if (currentTable.length > 0) {
      elements.push(<TableRenderer key={`table-${key}`} rows={[...currentTable]} />);
      currentTable = [];
    }
  };

  lines.forEach((line, index) => {
    if (line.startsWith("```")) {
      flushTable(index);
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${index}`} style={{
            background: "var(--bg-secondary)",
            padding: "var(--space-md)",
            borderRadius: "var(--radius-sm)",
            fontSize: "var(--font-size-sm)",
            overflowX: "auto",
            marginBottom: "var(--space-md)",
            border: "1px solid var(--border-subtle)",
            color: "var(--accent-secondary)",
          }}>
            <code>{codeContent.trim()}</code>
          </pre>
        );
        codeContent = "";
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeContent += line + "\n";
      return;
    }

    if (line.startsWith("|")) {
      currentTable.push(line);
      return;
    } else {
      flushTable(index);
    }

    if (line.startsWith("# ")) {
      elements.push(<h2 key={index} style={{ marginTop: "var(--space-xl)" }}>{line.slice(2)}</h2>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={index}>{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={index}>{line.slice(4)}</h3>);
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={index}>{formatText(line.slice(2))}</blockquote>
      );
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
      elements.push(
        <p key={index} style={{ paddingLeft: "16px" }}>
          • {formatText(line.slice(2))}
        </p>
      );
    } else if (/^\d+\.\s/.test(line)) {
      elements.push(<p key={index} style={{ paddingLeft: "16px" }}>{formatText(line)}</p>);
    } else if (line.trim()) {
      elements.push(<p key={index}>{formatText(line)}</p>);
    }
  });

  flushTable(lines.length);
  return elements;
}

/* --- Resume Renderer --- */
function ResumeRenderer({ body }) {
  if (!body?.sections) return null;

  return (
    <div className="viewer__body">
      {body.sections.map((section, i) => (
        <div key={i}>
          <h2>{section.title}</h2>
          {parseAndRenderBlocks(section.content.split("\n"))}
        </div>
      ))}
    </div>
  );
}

/* --- HTML Content Renderer using isolated sandbox iframe with premium fullscreen support --- */
function HTMLContentRenderer({ html, isWidgetMode = false }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !isWidgetMode) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const iframe = containerRef.current.querySelector("iframe");
        if (iframe && iframe.contentWindow) {
          try {
            iframe.contentWindow.dispatchEvent(new Event("resize"));
          } catch (e) {
            console.warn("Could not dispatch resize to iframe:", e);
          }
        }
      }
    });
    
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [isWidgetMode]);

  const containerStyle = isFullscreen 
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 99999,
        background: "#03070c",
        border: "none",
        borderRadius: 0,
        overflow: "hidden"
      }
    : isWidgetMode
      ? {
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          background: "transparent"
        }
      : {
          width: "100%",
          height: "750px",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid var(--border-subtle)",
          background: "rgba(10, 17, 28, 0.4)",
          position: "relative"
        };

  return (
    <div style={containerStyle} ref={containerRef}>
      {/* Floating Control Button */}
      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        style={{
          position: "absolute",
          top: "16px",
          right: "24px",
          zIndex: 100000,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "8px",
          color: "#ffffff",
          padding: "8px 16px",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          transition: "all 0.2s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
          e.currentTarget.style.borderColor = "#6c5ce7";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
        }}
      >
        {isFullscreen ? (
          <>
            <span>✕</span> Keluar Layar Penuh
          </>
        ) : (
          <>
            <span>↗</span> Mode Layar Penuh
          </>
        )}
      </button>

      <iframe
        title="Interactive Resource"
        srcDoc={
          html.trim().toLowerCase().startsWith("<!doctype html>") || html.trim().toLowerCase().startsWith("<html")
            ? html
            : `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    html, body {
                      margin: 0;
                      padding: 0;
                      width: 100%;
                      height: 100%;
                      background: transparent;
                      color: #f1f5f9;
                      overflow: hidden;
                    }
                    iframe {
                      width: 100% !important;
                      height: 100% !important;
                      border: none !important;
                    }
                  </style>
                </head>
                <body>
                  ${html}
                </body>
              </html>
            `
        }
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
          background: "transparent"
        }}
        sandbox="allow-scripts allow-same-origin allow-popups"
        loading="lazy"
      />
    </div>
  );
}

/* --- Notes Renderer (Markdown) --- */
function NotesRenderer({ body }) {
  if (!body?.markdown) return null;
  
  const isHTML = body.markdown.trim().startsWith("<") || 
    body.markdown.trim().includes("</script>") ||
    body.markdown.toLowerCase().includes("<iframe") ||
    body.markdown.toLowerCase().includes("<html");
  
  if (isHTML) {
    return (
      <div className="viewer__body" style={{ height: "100%" }}>
        <HTMLContentRenderer html={body.markdown} isWidgetMode={true} />
      </div>
    );
  }
  
  return <div className="viewer__body">{parseAndRenderBlocks(body.markdown.split("\n"))}</div>;
}

/* --- Flashcard Renderer --- */
function FlashcardRenderer({ contentId, onProgress }) {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getFlashcards(contentId).then((data) => {
      setCards(data || []);
      setCurrentIndex(0);
      setIsFlipped(false);
      setLoading(false);
    });
  }, [contentId]);

  useEffect(() => {
    if (onProgress && cards.length > 0) {
      onProgress(currentIndex + 1, cards.length);
    }
  }, [currentIndex, cards.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p style={{ color: "var(--text-secondary)" }}>Memuat flashcard...</p>
      </div>
    );
  }

  if (!cards.length) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">🃏</div>
        <p className="empty-state__text">Belum ada flashcard.</p>
      </div>
    );
  }

  const card = cards[currentIndex];

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const progressPercent = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "var(--space-md) 0" }}>
      {/* Progress Info */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "var(--space-sm)",
        fontSize: "var(--font-size-sm)",
        color: "var(--text-secondary)"
      }}>
        <span>Kartu {currentIndex + 1} dari {cards.length}</span>
        <button
          id="btn-reset-flashcard-deck"
          onClick={() => { setCurrentIndex(0); setIsFlipped(false); }}
          style={{ fontSize: "var(--font-size-xs)", color: "var(--accent-secondary)", textDecoration: "underline" }}
        >
          Reset Deck
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{
        height: "4px",
        background: "var(--bg-glass-light)",
        borderRadius: "var(--radius-full)",
        overflow: "hidden",
        marginBottom: "var(--space-xl)",
      }}>
        <div style={{
          width: `${progressPercent}%`,
          height: "100%",
          background: "var(--accent-gradient)",
          transition: "width var(--transition-base)",
        }} />
      </div>

      {/* Interactive Card */}
      <div
        className={`flashcard ${isFlipped ? "flashcard--flipped" : ""}`}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ height: "280px", marginBottom: "var(--space-xl)" }}
        id="flashcard-active"
      >
        <div className="flashcard__inner" style={{ height: "100%" }}>
          {/* Front */}
          <div className="flashcard__face flashcard__front" style={{ border: "1px solid var(--border-hover)", background: "var(--bg-card)" }}>
            <span className="flashcard__label">Pertanyaan</span>
            <p className="flashcard__text" style={{ fontSize: "var(--font-size-lg)" }}>{card.front}</p>
            {card.tags && card.tags.length > 0 && (
              <div style={{ marginTop: "var(--space-md)", display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                {card.tags.map(tag => (
                  <span key={tag} className="stack-card__tag" style={{ fontSize: "10px", padding: "1px 6px" }}>#{tag}</span>
                ))}
              </div>
            )}
            <span className="flashcard__hint">Klik kartu untuk melihat jawaban</span>
          </div>

          {/* Back */}
          <div className="flashcard__face flashcard__back">
            <span className="flashcard__label" style={{ color: "rgba(255, 255, 255, 0.7)" }}>Jawaban</span>
            <p className="flashcard__text" style={{ fontSize: "var(--font-size-md)", whiteSpace: "pre-line" }}>
              {card.back}
            </p>
            <span className="flashcard__hint" style={{ color: "rgba(255, 255, 255, 0.7)" }}>Klik kartu untuk melihat pertanyaan</span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "space-between" }}>
        <button
          className="type-tab"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{
            flex: 1,
            opacity: currentIndex === 0 ? 0.3 : 1,
            cursor: currentIndex === 0 ? "not-allowed" : "pointer",
            padding: "12px",
            textAlign: "center"
          }}
          id="btn-prev-card"
        >
          ◀ Sebelumnya
        </button>
        <button
          className="type-tab type-tab--active"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          style={{
            flex: 1,
            opacity: currentIndex === cards.length - 1 ? 0.3 : 1,
            cursor: currentIndex === cards.length - 1 ? "not-allowed" : "pointer",
            padding: "12px",
            textAlign: "center"
          }}
          id="btn-next-card"
        >
          Selanjutnya ▶
        </button>
      </div>
    </div>
  );
}

/* --- Brainstorm / Mind Map Renderer --- */
function BrainstormRenderer({ body }) {
  if (!body?.nodes?.length) return null;

  const rootNodes = body.nodes.filter((n) => n.parent_id === null);

  return (
    <div style={{ padding: "var(--space-lg) 0" }}>
      <p style={{
        color: "var(--text-muted)",
        fontSize: "var(--font-size-sm)",
        marginBottom: "var(--space-lg)",
      }}>
        Mind map interaktif — {body.nodes.length} node
      </p>
      {rootNodes.map((root) => (
        <MindMapNode key={root.id} node={root} allNodes={body.nodes} depth={0} />
      ))}
    </div>
  );
}

function MindMapNode({ node, allNodes, depth }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const children = allNodes.filter((n) => n.parent_id === node.id);

  return (
    <div style={{ marginLeft: depth * 24 }}>
      <div
        onClick={() => children.length && setIsExpanded(!isExpanded)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          marginBottom: "4px",
          background: depth === 0 ? `${node.color}20` : "var(--bg-glass-light)",
          border: `1px solid ${node.color}30`,
          borderRadius: "var(--radius-sm)",
          cursor: children.length ? "pointer" : "default",
          transition: "all var(--transition-fast)",
          fontSize: depth === 0 ? "var(--font-size-lg)" : "var(--font-size-md)",
          fontWeight: depth === 0 ? 700 : depth === 1 ? 600 : 400,
          color: node.color || "var(--text-primary)",
        }}
        id={`mindmap-${node.id}`}
      >
        {children.length > 0 && (
          <span style={{ fontSize: "12px", opacity: 0.6 }}>
            {isExpanded ? "▼" : "▶"}
          </span>
        )}
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: node.color,
            flexShrink: 0,
          }}
        />
        {node.label}
      </div>
      {isExpanded &&
        children.map((child) => (
          <MindMapNode
            key={child.id}
            node={child}
            allNodes={allNodes}
            depth={depth + 1}
          />
        ))}
    </div>
  );
}

/* --- Reference Renderer --- */
function ReferenceRenderer({ contentId }) {
  return (
    <div className="empty-state" style={{ padding: "80px 0" }}>
      <div className="empty-state__icon" style={{ fontSize: "64px", color: "var(--accent-secondary)", textShadow: "0 0 20px rgba(162, 155, 254, 0.4)" }}>🔗</div>
      <h2 style={{ color: "var(--text-primary)", fontSize: "20px", fontWeight: "700", marginBottom: "12px" }}>Daftar Referensi & Regulasi Tersemat</h2>
      <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: "450px", margin: "0 auto", lineHeight: "1.6" }}>
        Semua pranala luar, regulasi kementerian, jurnal ilmiah, dan rujukan penting untuk materi ini telah diintegrasikan di <strong>Panel Informasi Sebelah Kanan</strong>.
      </p>
      <p style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "24px" }}>
        Silakan klik ikon informasi (i) di kanan atas jika panel kanan tertutup.
      </p>
    </div>
  );
}

/* --- Text formatting helper --- */
function formatText(text) {
  // Bold
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    // Inline code
    const codeParts = part.split(/(`[^`]+`)/g);
    return codeParts.map((cp, j) => {
      if (cp.startsWith("`") && cp.endsWith("`")) {
        return <code key={`${i}-${j}`}>{cp.slice(1, -1)}</code>;
      }
      return cp;
    });
  });
}
