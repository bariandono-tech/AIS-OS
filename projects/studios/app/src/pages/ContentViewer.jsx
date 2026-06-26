import { useState, useEffect, useRef, useMemo } from "react";
import { contentTypeConfig } from "../data/mockData";
import { getFlashcards } from "../services/dataService";

/* ============ Helper to Play Soft Audio Chime ============ */
function playChime() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    
    // Two-tone soft chime - perfect fifth
    const notes = [
      { freq: 880, start: 0,    dur: 0.5 },
      { freq: 1318, start: 0.08, dur: 0.6 }
    ];
    
    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = n.freq;
      gain.gain.setValueAtTime(0, now + n.start);
      gain.gain.linearRampToValueAtTime(0.06, now + n.start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.start);
      osc.stop(now + n.start + n.dur + 0.05);
    });
  } catch(e) { /* silent */ }
}

/* ============ Code Playground Component ============ */
function CodePlayground({ initialCode }) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [isError, setIsError] = useState(false);

  const runCode = (codeToRun) => {
    const lines = [];
    const fakeConsole = {
      log: (...args) => {
        const formatted = args.map(a => {
          if (a === null) return 'null';
          if (a === undefined) return 'undefined';
          if (typeof a === 'string') return a;
          try { return JSON.stringify(a); } catch(e) { return String(a); }
        }).join(' ');
        lines.push(formatted);
      },
      error: (...args) => lines.push('Error: ' + args.join(' ')),
      warn: (...args) => lines.push('Warning: ' + args.join(' '))
    };
    
    try {
      const fn = new Function('console', codeToRun);
      fn(fakeConsole);
      setIsError(false);
      setOutput(lines.length 
        ? lines.map((l, idx) => `<span class="result-line" key="${idx}">${escapeHtml(l)}</span>`).join('')
        : '<span style="color: var(--ink-3); font-style: italic;">(no output)</span>'
      );
    } catch (e) {
      setIsError(true);
      setOutput('→ ' + e.message);
    }
  };

  const escapeHtml = (s) => {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  };

  useEffect(() => {
    runCode(code);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCodeChange = (e) => {
    const val = e.target.value;
    setCode(val);
    runCode(val);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const val = e.target.value;
      const newCode = val.substring(0, start) + '  ' + val.substring(end);
      setCode(newCode);
      runCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="playground">
      <div className="pg-head">
        <span className="pg-label">Live · JavaScript</span>
        <span className="pg-title"><strong>Simulasi Interaktif</strong></span>
      </div>
      <div className="pg-grid">
        <div className="pg-code">
          <textarea 
            className="pg-input" 
            value={code} 
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            spellCheck="false"
          />
        </div>
        <div className="pg-output">
          <div className="pg-output-label">stdout</div>
          <pre 
            className={`pg-output-content ${isError ? "error" : ""}`}
            dangerouslySetInnerHTML={{ __html: output }}
          />
        </div>
      </div>
    </div>
  );
}

/* ============ Diff Widget Component ============ */
function DiffWidget({ diffText }) {
  const [collapsed, setCollapsed] = useState(false);
  const lines = useMemo(() => {
    return diffText.split('\n').filter(l => l.trim() !== '');
  }, [diffText]);

  return (
    <div className={`diff-widget ${collapsed ? "collapsed" : ""}`}>
      <div className="diff-head">
        <div className="diff-meta">
          <span className="diff-label">Refaktor · Kode</span>
          <span className="diff-title">Perbandingan Perubahan</span>
        </div>
        <button 
          className={`diff-action ${collapsed ? "applied" : ""}`} 
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "reset ←" : "apply change →"}
        </button>
      </div>
      <div className="diff-body">
        {lines.map((line, idx) => {
          let type = "unchanged";
          let displayLine = line;
          if (line.startsWith("- ")) {
            type = "removed";
            displayLine = line.slice(2);
          } else if (line.startsWith("+ ")) {
            type = "added";
            displayLine = line.slice(2);
          } else if (line.startsWith("-") || line.startsWith("+")) {
            type = line.startsWith("-") ? "removed" : "added";
            displayLine = line.slice(1);
          }

          return (
            <div key={idx} className={`diff-line ${type}`}>
              <span className="gutter"></span>
              <span className="code">{displayLine}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============ Main Content Viewer Component ============ */
export default function ContentViewer({ content, stack, onBack, onFlashcardProgress, showCelebration }) {
  const [completed, setCompleted] = useState(false);
  const [checklist, setChecklist] = useState({
    intro: false,
    middle: false,
    playground: false,
    scrolled: false
  });
  
  const isHTML = content.type === "notes" && content.body?.markdown && (
    content.body.markdown.trim().startsWith("<") || 
    content.body.markdown.trim().includes("</script>") ||
    content.body.markdown.toLowerCase().includes("<iframe") ||
    content.body.markdown.toLowerCase().includes("<html")
  );

  // Sync completion state initially
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("studios-completed-content") || "[]");
    const isDone = list.includes(content.id);
    setCompleted(isDone);
    if (isDone) {
      setChecklist({
        intro: true,
        middle: true,
        playground: true,
        scrolled: true
      });
    } else {
      setChecklist({
        intro: false,
        middle: false,
        playground: false,
        scrolled: false
      });
    }
  }, [content.id]);

  // Extract headings for Table of Contents
  const extractedHeadings = useMemo(() => {
    const list = [];
    if (content.type === "notes" && content.body?.markdown) {
      const lines = content.body.markdown.split('\n');
      lines.forEach((line, idx) => {
        if (line.startsWith("## ")) {
          list.push({ id: `h-${idx}`, text: line.slice(3) });
        } else if (line.startsWith("### ")) {
          list.push({ id: `h-${idx}`, text: line.slice(4) });
        }
      });
    } else if (content.type === "resume" && content.body?.sections) {
      content.body.sections.forEach((sec, idx) => {
        list.push({ id: `sec-${idx}`, text: sec.title });
      });
    }
    return list;
  }, [content]);

  // Track active header during scroll
  const [activeHeadingId, setActiveHeadingId] = useState("");
  
  // Track reading progress
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (extractedHeadings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeadingId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    extractedHeadings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [extractedHeadings]);

  // Viewport scroll listener for checklists and auto-completions
  useEffect(() => {
    if (content.type !== "notes" && content.type !== "resume") return;
    
    const el = document.querySelector(".app-main-viewport-immersive");
    if (!el) return;

    const handleScroll = () => {
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;

      // Update progress ticks
      if (progress > 0.2) {
        setChecklist(prev => ({ ...prev, intro: true }));
      }
      if (progress > 0.55) {
        setChecklist(prev => ({ ...prev, middle: true }));
      }
      if (progress >= 0.75 && !checklist.scrolled) {
        setChecklist(prev => ({ ...prev, scrolled: true }));
        
        // Auto mark complete if not completed yet
        const list = JSON.parse(localStorage.getItem("studios-completed-content") || "[]");
        if (!list.includes(content.id)) {
          triggerCompletion();
        }
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [content.id, checklist.scrolled]); // eslint-disable-line react-hooks/exhaustive-deps

  const triggerCompletion = () => {
    const list = JSON.parse(localStorage.getItem("studios-completed-content") || "[]");
    if (!list.includes(content.id)) {
      list.push(content.id);
      localStorage.setItem("studios-completed-content", JSON.stringify(list));
    }
    setCompleted(true);
    setChecklist({
      intro: true,
      middle: true,
      playground: true,
      scrolled: true
    });
    playChime();

    // Call global app toast if provided
    if (showCelebration) {
      showCelebration(`${content.title}`, "Materi ditandai selesai.");
    } else {
      // Internal notification log
      console.log(`Celebrated completion of ${content.title}`);
    }
  };

  const hasPlayground = useMemo(() => {
    if (content.type !== "notes" || !content.body?.markdown) return false;
    return content.body.markdown.includes("js-playground") || content.body.markdown.includes("javascript-playground");
  }, [content]);

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
        <div className="viewer-interactive__header" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          background: "var(--bg-2)",
          borderBottom: "1px solid var(--rule)",
          flexShrink: 0,
          zIndex: 100
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button 
              className="viewer__back" 
              onClick={onBack} 
              id="back-to-stack"
              style={{ margin: 0, padding: "4px 12px", border: "1px solid var(--rule)", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", background: "none" }}
            >
              ← Kembali ke {stack?.title}
            </button>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)", fontFamily: "var(--serif-display)" }}>
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

  // Determine if we should render in the dual column layout (Notes and Resumes)
  const isEditorialText = content.type === "notes" || content.type === "resume";

  return (
    <div className="viewer" id="content-viewer">
      <div className="reading-progress-container">
        <div className="reading-progress-bar" style={{ width: `${readingProgress}%` }} />
      </div>

      <button className="viewer__back" onClick={onBack} id="back-to-stack" style={{ marginBottom: "24px" }}>
        ← Kembali ke {stack?.title}
      </button>

      {isEditorialText ? (
        <div className="chapter-layout">
          {/* TOC Sidebar */}
          <aside className="chapter-toc">
            {extractedHeadings.length > 0 && (
              <div className="toc-section">
                <div className="toc-label">On This Page</div>
                <ul className="toc-list" id="toc-list">
                  {extractedHeadings.map((h) => (
                    <li key={h.id} className={activeHeadingId === h.id ? "active" : ""}>
                      <a href={`#${h.id}`}>{h.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="toc-section">
              <div className="toc-label">Your Progress</div>
              <ul className="checklist" id="checklist">
                <li className={checklist.intro ? "checked" : ""}>
                  <span className="check-box"></span>
                  <span>Read the intro</span>
                </li>
                <li className={checklist.middle ? "checked" : ""}>
                  <span className="check-box"></span>
                  <span>Read through section</span>
                </li>
                {hasPlayground && (
                  <li className={checklist.playground ? "checked" : ""}>
                    <span className="check-box"></span>
                    <span>Try it yourself</span>
                  </li>
                )}
                <li className={`auto ${checklist.scrolled ? "checked celebrated" : ""}`}>
                  <span className="check-box"></span>
                  <span>Finish reading <em style={{ fontSize: "10px", display: "inline" }}>(auto at 80%)</em></span>
                </li>
              </ul>
            </div>

            <div className="toc-section">
              <button 
                className={`mark-done-btn ${completed ? "done" : ""}`}
                onClick={triggerCompletion}
                disabled={completed}
              >
                {completed ? "✓ completed" : "Mark Completed"}
              </button>
            </div>
          </aside>

          {/* Document Body */}
          <article className="chapter-body fade-in-cascade" style={{ maxWidth: "680px" }}>
            <div className="viewer__header" style={{ borderBottom: "1px solid var(--rule)", paddingBottom: "24px", marginBottom: "32px" }}>
              <span className={`content-card__type-badge content-card__type-badge--${content.type}`} style={{ marginBottom: "16px" }}>
                {contentTypeConfig[content.type]?.icon}{" "}
                {contentTypeConfig[content.type]?.label}
              </span>
              <h1 className="viewer__title" style={{ fontSize: "36px", fontFamily: "var(--serif-display)", lineHeight: "1.1", marginBottom: "12px" }}>
                {content.title}
              </h1>
              <div className="viewer__meta" style={{ fontSize: "13px", color: "var(--ink-3)", fontStyle: "italic" }}>
                <span>{stack?.icon} {stack?.title} · Bab {content.order_index}</span>
              </div>
            </div>

            {content.type === "resume" && <ResumeRenderer body={content.body} />}
            {content.type === "notes" && <NotesRenderer body={content.body} />}
          </article>
        </div>
      ) : (
        <div className="fade-in-cascade">
          <div className="viewer__header" style={{ borderBottom: "1px solid var(--rule)", paddingBottom: "24px", marginBottom: "32px" }}>
            <span className={`content-card__type-badge content-card__type-badge--${content.type}`} style={{ marginBottom: "16px" }}>
              {contentTypeConfig[content.type]?.icon}{" "}
              {contentTypeConfig[content.type]?.label}
            </span>
            <h1 className="viewer__title" style={{ fontSize: "36px", fontFamily: "var(--serif-display)", lineHeight: "1.1", marginBottom: "12px" }}>
              {content.title}
            </h1>
            <div className="viewer__meta" style={{ fontSize: "13px", color: "var(--ink-3)", fontStyle: "italic" }}>
              <span>{stack?.icon} {stack?.title} · Bab {content.order_index}</span>
            </div>
          </div>

          {/* Full width for Flashcards, Mindmaps, and References */}
          <article className="fade-in-cascade" style={{ maxWidth: "800px", margin: "0 auto" }}>
            {content.type === "flashcard" && <FlashcardRenderer contentId={content.id} onProgress={onFlashcardProgress} />}
            {content.type === "brainstorm" && <BrainstormRenderer body={content.body} />}
            {content.type === "reference" && <ReferenceRenderer contentId={content.id} />}
            {content.type === "brainstorm" && !content.body && <p className="viewer__placeholder">Halaman catatan bebas (Brainstorm) belum tersedia.</p>}
            
            <div style={{ textAlign: "center", marginTop: "48px", paddingBottom: "24px" }}>
              <button 
                className={`mark-done-btn ${completed ? "done" : ""}`}
                onClick={triggerCompletion}
                disabled={completed}
                style={{ width: "auto", padding: "12px 48px", display: "inline-block" }}
              >
                {completed ? "✓ Selesai Dibaca" : "Tandai Selesai"}
              </button>
            </div>
          </article>
        </div>
      )}
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
    <div style={{ overflowX: "auto", margin: "24px 0" }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "14px",
        color: "var(--ink-2)",
        border: "1px solid var(--rule)",
        background: "var(--bg-2)"
      }}>
        <thead>
          <tr style={{ background: "var(--bg)", borderBottom: "1px solid var(--rule)" }}>
            {headerCells.map((cell, idx) => (
              <th key={idx} style={{
                padding: "10px 14px",
                textAlign: "left",
                fontWeight: 600,
                color: "var(--ink)",
              }}>
                {formatText(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((rowCells, rowIdx) => (
            <tr key={rowIdx} style={{ borderBottom: "1px solid var(--rule-soft)" }}>
              {rowCells.map((cell, cellIdx) => (
                <td key={cellIdx} style={{ padding: "10px 14px" }}>
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
  let codeBlockType = ""; // "normal", "playground", "diff"
  let codeContent = "";

  const flushTable = (key) => {
    if (currentTable.length > 0) {
      elements.push(<TableRenderer key={`table-${key}`} rows={[...currentTable]} />);
      currentTable = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      flushTable(i);
      if (inCodeBlock) {
        if (codeBlockType === "playground") {
          elements.push(<CodePlayground key={`playground-${i}`} initialCode={codeContent.trim()} />);
        } else if (codeBlockType === "diff") {
          elements.push(<DiffWidget key={`diff-${i}`} diffText={codeContent} />);
        } else {
          elements.push(
            <pre key={`code-${i}`} className="code-block">
              <code>{codeContent.trim()}</code>
            </pre>
          );
        }
        codeContent = "";
        inCodeBlock = false;
        codeBlockType = "";
      } else {
        inCodeBlock = true;
        const type = line.slice(3).trim();
        if (type === "js-playground" || type === "javascript-playground") {
          codeBlockType = "playground";
        } else if (type === "diff-widget" || type === "diff") {
          codeBlockType = "diff";
        } else {
          codeBlockType = "normal";
        }
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent += line + "\n";
      continue;
    }

    if (line.startsWith("|")) {
      currentTable.push(line);
      continue;
    } else {
      flushTable(i);
    }

    if (line.startsWith("# ")) {
      elements.push(<h2 key={i} style={{ marginTop: "36px", fontFamily: "var(--serif-display)" }} id={`h-${i}`}>{line.slice(2)}</h2>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} style={{ marginTop: "28px", fontFamily: "var(--serif-display)" }} id={`h-${i}`}>{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} style={{ marginTop: "24px", fontFamily: "var(--serif-display)" }} id={`h-${i}`}>{line.slice(4)}</h3>);
    } else if (line.startsWith("> ")) {
      const parts = line.slice(2).split(" — ");
      if (parts.length > 1) {
        elements.push(
          <blockquote key={i} className="pull-quote">
            {formatText(parts[0])}
            <span className="pull-quote-attr">— {parts[1]}</span>
          </blockquote>
        );
      } else {
        const lineContent = line.slice(2).trim();
        const emojiRegex = /^(\p{Extended_Pictographic}|\p{Emoji_Presentation})/u;
        const match = lineContent.match(emojiRegex);
        let emoji = "💡";
        let text = lineContent;
        if (match) {
          emoji = match[0];
          text = lineContent.slice(match[0].length).trim();
        }
        elements.push(
          <div key={i} className="notion-callout">
            <span className="notion-callout-emoji">{emoji}</span>
            <span className="notion-callout-text">{formatText(text)}</span>
          </div>
        );
      }
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
      elements.push(
        <p key={i} style={{ paddingLeft: "16px", marginBottom: "8px" }}>
          • {formatText(line.slice(2))}
        </p>
      );
    } else if (/^\d+\s*\.\s/.test(line)) {
      elements.push(<p key={i} style={{ paddingLeft: "16px", marginBottom: "8px" }}>{formatText(line)}</p>);
    } else if (line.trim()) {
      elements.push(<p key={i} style={{ marginBottom: "18px" }}>{formatText(line)}</p>);
    }
  }

  flushTable(lines.length);
  return elements;
}

/* --- Resume Renderer --- */
function ResumeRenderer({ body }) {
  if (!body?.sections) return null;

  return (
    <div className="chapter-body">
      {body.sections.map((section, i) => (
        <div key={i} id={`sec-${i}`}>
          <h2 style={{ fontFamily: "var(--serif-display)", marginTop: "32px", borderBottom: "1px solid var(--rule-soft)", paddingBottom: "8px", marginBottom: "16px" }}>
            {section.title}
          </h2>
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
    
    const resizeObserver = new ResizeObserver(() => {
      const iframe = containerRef.current.querySelector("iframe");
      if (iframe && iframe.contentWindow) {
        try {
          iframe.contentWindow.dispatchEvent(new Event("resize"));
        } catch (e) {
          console.warn("Could not dispatch resize to iframe:", e);
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
        background: "var(--bg)",
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
          overflow: "hidden",
          border: "1px solid var(--rule)",
          background: "var(--bg-2)",
          position: "relative"
        };

  return (
    <div style={containerStyle} ref={containerRef}>
      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        style={{
          position: "absolute",
          top: "16px",
          right: "24px",
          zIndex: 100000,
          background: "var(--bg)",
          border: "1px solid var(--rule)",
          color: "var(--ink)",
          padding: "8px 16px",
          fontSize: "12px",
          fontVariant: "small-caps",
          letterSpacing: "0.08em",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "all 0.2s ease"
        }}
      >
        {isFullscreen ? "✕ Keluar Layar Penuh" : "↗ Layar Penuh"}
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
                      color: #1c1813;
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
  return parseAndRenderBlocks(body.markdown.split("\n"));
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
        <p style={{ color: "var(--ink-2)" }}>Memuat flashcard...</p>
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
  const progressPercent = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "16px 0" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
        fontSize: "13px",
        color: "var(--ink-3)"
      }}>
        <span>Kartu {currentIndex + 1} dari {cards.length}</span>
        <button
          id="btn-reset-flashcard-deck"
          onClick={() => { setCurrentIndex(0); setIsFlipped(false); }}
          style={{ fontSize: "11px", color: "var(--accent)", textDecoration: "underline" }}
        >
          Reset Deck
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{
        height: "4px",
        background: "var(--bg-3)",
        overflow: "hidden",
        marginBottom: "24px",
      }}>
        <div style={{
          width: `${progressPercent}%`,
          height: "100%",
          background: "var(--accent)",
          transition: "width 0.3s ease",
        }} />
      </div>

      {/* Card Box */}
      <div
        className={`flashcard ${isFlipped ? "flashcard--flipped" : ""}`}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ height: "280px", marginBottom: "24px" }}
        id="flashcard-active"
      >
        <div className="flashcard__inner" style={{ height: "100%" }}>
          {/* Front */}
          <div className="flashcard__face flashcard__front" style={{ border: "1px solid var(--rule)", background: "var(--bg-2)" }}>
            <span className="flashcard__label" style={{ fontVariant: "small-caps", letterSpacing: "0.06em", color: "var(--accent)" }}>Pertanyaan</span>
            <p className="flashcard__text" style={{ fontSize: "18px", fontFamily: "var(--serif-display)", color: "var(--ink)" }}>{card.front}</p>
            {card.tags && card.tags.length > 0 && (
              <div style={{ marginTop: "16px", display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                {card.tags.map(tag => (
                  <span key={tag} className="stack-card__tag" style={{ fontSize: "10px", padding: "2px 8px", border: "1px solid var(--rule)" }}>#{tag}</span>
                ))}
              </div>
            )}
            <span className="flashcard__hint" style={{ fontStyle: "italic", fontSize: "12px", color: "var(--ink-3)" }}>Klik kartu untuk melihat jawaban</span>
          </div>

          {/* Back */}
          <div className="flashcard__face flashcard__back" style={{ border: "1px solid var(--accent)", background: "var(--bg-code)" }}>
            <span className="flashcard__label" style={{ fontVariant: "small-caps", letterSpacing: "0.06em", color: "var(--accent)" }}>Jawaban</span>
            <p className="flashcard__text" style={{ fontSize: "16px", whiteSpace: "pre-line", color: "var(--ink)" }}>
              {card.back}
            </p>
            <span className="flashcard__hint" style={{ fontStyle: "italic", fontSize: "12px", color: "var(--ink-3)" }}>Klik kartu untuk melihat pertanyaan</span>
          </div>
        </div>
      </div>

      {/* Next / Prev Controls */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "space-between" }}>
        <button
          className="type-tab"
          onClick={() => { if (currentIndex > 0) { setCurrentIndex(currentIndex - 1); setIsFlipped(false); } }}
          disabled={currentIndex === 0}
          style={{
            flex: 1,
            opacity: currentIndex === 0 ? 0.3 : 1,
            cursor: currentIndex === 0 ? "not-allowed" : "pointer",
            padding: "12px",
            border: "1px solid var(--rule)",
            textAlign: "center"
          }}
          id="btn-prev-card"
        >
          ◀ Sebelumnya
        </button>
        <button
          className="type-tab type-tab--active"
          onClick={() => { if (currentIndex < cards.length - 1) { setCurrentIndex(currentIndex + 1); setIsFlipped(false); } }}
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
    <div style={{ padding: "24px 0" }}>
      <p style={{
        color: "var(--ink-3)",
        fontSize: "13px",
        fontStyle: "italic",
        marginBottom: "16px",
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
          marginBottom: "6px",
          background: depth === 0 ? `${node.color}15` : "var(--bg-2)",
          border: `1px solid ${node.color || "var(--rule)"}`,
          cursor: children.length ? "pointer" : "default",
          transition: "all 0.2s",
          fontSize: depth === 0 ? "17px" : "14px",
          fontFamily: depth === 0 ? "var(--serif-display)" : "var(--serif-body)",
          fontWeight: depth === 0 ? 600 : 400,
          color: node.color || "var(--ink)",
        }}
        id={`mindmap-${node.id}`}
      >
        {children.length > 0 && (
          <span style={{ fontSize: "11px", opacity: 0.6 }}>
            {isExpanded ? "▼" : "▶"}
          </span>
        )}
        <span
          style={{
            width: 8,
            height: 8,
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
      <div className="empty-state__icon" style={{ fontSize: "64px", color: "var(--accent)" }}>🔗</div>
      <h2 style={{ color: "var(--ink)", fontSize: "22px", fontFamily: "var(--serif-display)", margin: "16px 0 8px" }}>Daftar Referensi & Regulasi Tersemat</h2>
      <p style={{ color: "var(--ink-2)", fontSize: "14px", maxWidth: "450px", margin: "0 auto", lineHeight: "1.6" }}>
        Semua pranala luar, regulasi kementerian, jurnal ilmiah, dan rujukan penting untuk materi ini telah diintegrasikan di <strong>Panel Informasi Sebelah Kanan</strong>.
      </p>
      <p style={{ color: "var(--ink-3)", fontSize: "12px", marginTop: "24px", fontStyle: "italic" }}>
        Silakan klik ikon informasi (i) di kanan atas jika panel kanan tertutup.
      </p>
    </div>
  );
}

/* --- Text formatting helper --- */
function formatText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    const codeParts = part.split(/(`[^`]+`)/g);
    return codeParts.map((cp, j) => {
      if (cp.startsWith("`") && cp.endsWith("`")) {
        return <code key={`${i}-${j}`}>{cp.slice(1, -1)}</code>;
      }
      return cp;
    });
  });
}
