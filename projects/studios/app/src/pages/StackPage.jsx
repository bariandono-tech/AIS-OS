import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { contentTypeConfig } from "../data/mockData";
import { getContentByStack } from "../services/dataService";
import PaymentSimulatorModal from "../components/PaymentSimulatorModal";
import { generateGraphLayout } from "../utils/graphUtils";
import ForceGraph2D from 'react-force-graph-2d';

export default function StackPage({ 
  stack, 
  isLocked, 
  user, 
  onUnlock, 
  onLoginRedirect, 
  onContentClick, 
  onBack 
}) {
  const [contentItems, setContentItems] = useState([]);
  const [activeType, setActiveType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [completedItems, setCompletedItems] = useState([]);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  
  const containerRef = useRef(null);
  const fgRef = useRef(null);
  const [graphDim, setGraphDim] = useState({ width: 600, height: 500 });

  // Sync completion states
  useEffect(() => {
    const completed = JSON.parse(localStorage.getItem("studios-completed-content") || "[]");
    setCompletedItems(completed);
  }, []);

  useEffect(() => {
    if (isLocked) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getContentByStack(stack.slug).then((data) => {
      setContentItems(data || []);
      setLoading(false);
    });
  }, [stack.slug, isLocked]);

  // Compute graph data
  const graph = useMemo(() => {
    return generateGraphLayout(contentItems);
  }, [contentItems]);

  // Find first uncompleted item (which acts as current)
  const currentId = useMemo(() => {
    const sorted = [...contentItems].sort((a, b) => a.order_index - b.order_index);
    const uncompleted = sorted.find(item => !completedItems.includes(item.id));
    return uncompleted ? uncompleted.id : null;
  }, [contentItems, completedItems]);

  // Force Graph Data
  const forceGraphData = useMemo(() => {
    if (!graph || !graph.nodes) return { nodes: [], links: [] };
    
    return {
      nodes: graph.nodes.map(node => ({
        id: String(node.id),
        name: node.label,
        contentItem: contentItems.find(item => item.id === node.id),
        isDone: completedItems.includes(node.id),
        isCurrent: node.id === currentId,
        val: 1.5 + (graph.adjacency[node.id]?.length || 0) * 0.5 // Node size based on connections
      })),
      links: graph.edges.map(edge => ({
        source: String(edge.from),
        target: String(edge.to),
        dashed: edge.dashed
      }))
    };
  }, [graph, contentItems, completedItems, currentId]);

  // Adjust physics forces for Obsidian feel
  useEffect(() => {
    if (fgRef.current) {
      // Repel nodes further apart, but keep it tight enough so isolated nodes don't fly away
      fgRef.current.d3Force('charge').strength(-250);
      // Ensure links are comfortably spaced
      fgRef.current.d3Force('link').distance(80);
      // Re-heat simulation to apply new forces
      fgRef.current.d3ReheatSimulation();
      
      // Center the graph precisely after a short delay
      setTimeout(() => {
        if (fgRef.current) {
          fgRef.current.centerAt(0, 0, 800);
          fgRef.current.zoom(1.2, 800);
        }
      }, 300);
    }
  }, [forceGraphData, fgRef]);

  // Handle Resize
  useEffect(() => {
    const updateDim = () => {
      if (containerRef.current) {
        setGraphDim({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    updateDim();
    window.addEventListener('resize', updateDim);
    return () => window.removeEventListener('resize', updateDim);
  }, [loading, isLocked]);

  // Count items per type
  const typeCounts = useMemo(() => {
    const counts = { all: contentItems.length };
    contentItems.forEach((item) => {
      counts[item.type] = (counts[item.type] || 0) + 1;
    });
    return counts;
  }, [contentItems]);

  // Filter content
  const filteredContent = useMemo(() => {
    return activeType === "all"
      ? contentItems
      : contentItems.filter((item) => item.type === activeType);
  }, [contentItems, activeType]);

  // Available types (only show tabs for types that have content)
  const availableTypes = useMemo(() => {
    return ["all", ...Object.keys(contentTypeConfig).filter((t) => typeCounts[t])];
  }, [typeCounts]);

  // Highlighting checking
  const isNodeHighlighted = useCallback((nodeId) => {
    if (!hoveredNodeId) return false;
    if (hoveredNodeId === nodeId) return true;
    const connected = graph.adjacency[hoveredNodeId] || [];
    return connected.includes(nodeId);
  }, [hoveredNodeId, graph.adjacency]);

  const isNodeDimmed = useCallback((nodeId) => {
    if (!hoveredNodeId) return false;
    return !isNodeHighlighted(nodeId);
  }, [hoveredNodeId, isNodeHighlighted]);

  const isEdgeHighlighted = useCallback((from, to) => {
    if (!hoveredNodeId) return false;
    return from === hoveredNodeId || to === hoveredNodeId;
  }, [hoveredNodeId]);

  const isEdgeDimmed = useCallback((from, to) => {
    if (!hoveredNodeId) return false;
    return !isEdgeHighlighted(from, to);
  }, [hoveredNodeId, isEdgeHighlighted]);

  const drawNode = useCallback((node, ctx, globalScale) => {
    const isHighlighted = isNodeHighlighted(node.id);
    const isDimmed = isNodeDimmed(node.id);
    
    const size = node.val * 3;
    
    if (isDimmed) {
      ctx.globalAlpha = 0.15;
    } else {
      ctx.globalAlpha = 1;
    }
    
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
    
    if (node.isCurrent) {
      ctx.fillStyle = '#8a2317'; // var(--accent)
      ctx.fill();
    } else if (node.isDone) {
      ctx.fillStyle = '#5d7440'; // var(--sage)
      ctx.fill();
    } else {
      ctx.fillStyle = '#fbf3db'; // var(--bg)
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#4a4338'; // var(--ink-2)
      ctx.stroke();
    }
    
    // Draw text label
    if (!isDimmed && (globalScale > 1.2 || isHighlighted)) {
      const label = node.name;
      const fontSize = 12 / globalScale;
      ctx.font = `${isHighlighted ? 'bold ' : ''}${fontSize}px 'Inter', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Add background stroke to make text readable over lines
      ctx.lineWidth = 3 / globalScale;
      ctx.strokeStyle = '#fbf3db'; // var(--bg)
      ctx.strokeText(label, node.x, node.y + size + fontSize + 2);
      
      ctx.fillStyle = isHighlighted ? '#8a2317' : '#1c1813'; // var(--accent) : var(--ink)
      ctx.fillText(label, node.x, node.y + size + fontSize + 2);
    }
    
    ctx.globalAlpha = 1; // reset
  }, [isNodeHighlighted, isNodeDimmed]);

  const drawLink = useCallback((link, ctx) => {
    // ForceGraph2D provides link.source and link.target as objects once initialized
    const srcId = typeof link.source === 'object' ? link.source.id : link.source;
    const tgtId = typeof link.target === 'object' ? link.target.id : link.target;

    const isHighlighted = isEdgeHighlighted(srcId, tgtId);
    const isDimmed = isEdgeDimmed(srcId, tgtId);
    
    if (isDimmed) {
      ctx.globalAlpha = 0.15;
    } else {
      ctx.globalAlpha = 1;
    }
    
    ctx.beginPath();
    ctx.moveTo(link.source.x, link.source.y);
    ctx.lineTo(link.target.x, link.target.y);
    
    ctx.lineWidth = isHighlighted ? 2 : 1;
    ctx.strokeStyle = isHighlighted ? '#1c1813' : '#c9be9f'; // var(--ink) : var(--rule)
    
    if (link.dashed) {
      ctx.setLineDash([4, 4]);
    } else {
      ctx.setLineDash([]);
    }
    
    ctx.stroke();
    ctx.globalAlpha = 1;
  }, [isEdgeHighlighted, isEdgeDimmed]);

  const handleNodeClick = useCallback(node => {
    if (node && node.contentItem) {
      onContentClick(node.contentItem);
    }
  }, [onContentClick]);

  const handleNodeHover = useCallback(node => {
    setHoveredNodeId(node ? node.id : null);
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
        <p style={{ color: "var(--text-secondary)", fontSize: "16px", opacity: 0.8 }}>
          Memuat materi {stack.title}...
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Stack Header */}
      <div className="stack-header" id="stack-header">
        <button className="viewer__back" onClick={onBack} id="back-to-dashboard" style={{ marginBottom: "20px" }}>
          ← Kembali ke Dashboard
        </button>
        <div className="stack-header__top">
          <div
            className="stack-header__icon"
            style={{ borderColor: stack.color + "40" }}
          >
            {stack.icon}
          </div>
          <div>
            <h1 className="stack-header__title">{stack.title}</h1>
            <p className="stack-header__description">{stack.description}</p>
          </div>
        </div>
        {!isLocked && (
          <div className="stack-header__stats">
            <span className="stack-header__stat">
              <strong>{contentItems.length}</strong> konten
            </span>
            <span className="stack-header__stat">
              <strong>{availableTypes.length - 1}</strong> kategori
            </span>
            <span className="stack-header__stat">
              <strong>{completedItems.filter(id => contentItems.some(item => item.id === id)).length}</strong> selesai
            </span>
          </div>
        )}
      </div>

      {isLocked ? (
        <div className="lock-container">
          <div className="lock-card animate-in" id="premium-lock-screen">
            <div className="lock-icon-wrapper">🔒</div>
            <h2 className="lock-title">Buka Akses Premium</h2>
            <p className="lock-description">
              Materi kuliah ini dilindungi. Silakan aktifkan akses Premium untuk membuka seluruh rangkuman, mind map, flashcard latihan, dan referensi eksternal.
            </p>
            <div className="lock-price">
              Rp 49.000 <span>/ akses selamanya</span>
            </div>
            {user ? (
              <button 
                className="form-submit" 
                onClick={() => setShowPaymentModal(true)}
                id="btn-unlock-premium"
              >
                Beli & Buka Akses Sekarang
              </button>
            ) : (
              <button 
                className="form-submit" 
                onClick={onLoginRedirect}
                id="btn-login-to-unlock"
              >
                Masuk untuk Membeli
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Dual Column Layout: Map & Chapter List */}
          <div className="series-grid" style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr",
            gap: "36px",
            marginBottom: "56px",
            alignItems: "start"
          }}>
            {/* Left: Prereq Map */}
            <div className="prereq-panel">
              <div className="prereq-head">
                <span className="prereq-title">{stack.title} · peta dependensi</span>
                <span className="prereq-hint">sentuh/arahkan kursor untuk melihat jalur</span>
              </div>
              
              <div ref={containerRef} style={{ height: 600, width: '100%', border: '1px solid var(--rule)', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--bg)' }}>
                {forceGraphData.nodes.length > 0 && (
                  <ForceGraph2D
                    ref={fgRef}
                    width={graphDim.width}
                    height={600}
                    backgroundColor="transparent"
                    graphData={forceGraphData}
                    nodeRelSize={4}
                    nodeId="id"
                    linkSource="source"
                    linkTarget="target"
                    nodeCanvasObject={drawNode}
                    linkCanvasObject={drawLink}
                    onNodeHover={handleNodeHover}
                    onNodeClick={handleNodeClick}
                    warmupTicks={100}
                    cooldownTicks={100}
                    d3AlphaDecay={0.02}
                    d3VelocityDecay={0.4}
                    enableZoomInteraction={true}
                    enablePanInteraction={true}
                  />
                )}
              </div>

              <div className="map-legend">
                <span><span className="legend-swatch"></span>belum mulai</span>
                <span><span className="legend-swatch done"></span>selesai</span>
                <span><span className="legend-swatch current"></span>sedang dibaca</span>
                <span><span className="legend-swatch line"></span>prasyarat</span>
                <span><span className="legend-swatch line-dashed"></span>rekomendasi</span>
              </div>
            </div>

            {/* Right: Chapter List */}
            <div className="chapter-list-panel">
              <div className="chapter-list-head">
                <span>Daftar Materi</span>
                <em>{contentItems.length} total</em>
              </div>
              <ol className="chapter-list-items">
                {contentItems
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((item) => {
                    const isDone = completedItems.includes(item.id);
                    const isCurrent = item.id === currentId;

                    let stateLabel = "belum mulai";
                    if (isDone) stateLabel = "selesai";
                    else if (isCurrent) stateLabel = "sedang dibaca";

                    return (
                      <li
                        key={item.id}
                        className={`${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`}
                        onClick={() => onContentClick(item)}
                        onMouseEnter={() => setHoveredNodeId(item.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                      >
                        <span className="ch-num">
                          {String(item.order_index).padStart(2, "0")}
                        </span>
                        <span className="ch-title">{item.title}</span>
                        <span className="ch-state">{stateLabel}</span>
                      </li>
                    );
                  })}
              </ol>
            </div>
          </div>

          {/* Section Divider */}
          <div style={{ borderTop: "1px solid var(--rule)", margin: "48px 0" }} />

          {/* Detailed Card Explorer */}
          <div className="section__header" style={{ marginBottom: "28px" }}>
            <div>
              <h2 className="section__title" style={{ fontSize: "22px", fontFamily: "var(--serif-display)" }}>
                Pustaka <em>Materi Lengkap</em>
              </h2>
              <p className="section__subtitle" style={{ fontSize: "13px" }}>
                Filter materi berdasarkan jenis konten
              </p>
            </div>
          </div>

          {/* Type Filter Tabs */}
          <div className="type-tabs" id="type-tabs" style={{ marginBottom: "32px" }}>
            {availableTypes.map((type) => (
              <button
                key={type}
                className={`type-tab ${activeType === type ? "type-tab--active" : ""}`}
                onClick={() => setActiveType(type)}
                id={`tab-${type}`}
              >
                {type === "all" ? "Semua" : `${contentTypeConfig[type]?.icon} ${contentTypeConfig[type]?.label}`}
                <span className="type-tab__count">({typeCounts[type] || 0})</span>
              </button>
            ))}
          </div>

          {/* Content Grid */}
          <section className="section" style={{ paddingTop: 0 }}>
            {filteredContent.length > 0 ? (
              <div className="content-grid">
                {filteredContent
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="content-card animate-in"
                      onClick={() => onContentClick(item)}
                      id={`content-card-${item.id}`}
                    >
                      <span className={`content-card__type-badge content-card__type-badge--${item.type}`}>
                        {contentTypeConfig[item.type]?.icon}{" "}
                        {contentTypeConfig[item.type]?.label}
                      </span>
                      <h3 className="content-card__title" style={{ fontSize: "19px", fontFamily: "var(--serif-display)", margin: "12px 0 8px" }}>
                        {item.title}
                      </h3>
                      <p className="content-card__preview" style={{ fontSize: "14px", color: "var(--ink-2)", lineHeight: "1.5" }}>
                        {getPreview(item)}
                      </p>
                      {completedItems.includes(item.id) && (
                        <div style={{ marginTop: "12px", fontSize: "11px", color: "var(--sage)", fontVariant: "small-caps", letterSpacing: "0.06em", fontWeight: "600" }}>
                          ✓ Selesai dibaca
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state__icon">📭</div>
                <p className="empty-state__text">
                  Belum ada konten tipe "{contentTypeConfig[activeType]?.label}" di stack ini.
                </p>
              </div>
            )}
          </section>
        </>
      )}

      {showPaymentModal && (
        <PaymentSimulatorModal
          stack={stack}
          user={user}
          onSuccess={async () => {
            setShowPaymentModal(false);
            await onUnlock();
          }}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}

// Helper to extract preview text from content body
function getPreview(item) {
  if (item.type === "resume" && item.body?.sections?.length) {
    return item.body.sections[0].content.substring(0, 120) + "...";
  }
  if (item.type === "notes" && item.body?.markdown) {
    const text = item.body.markdown.replace(/[#*`>\[\]]/g, "").trim();
    return text.substring(0, 120) + "...";
  }
  if (item.type === "brainstorm" && item.body?.nodes?.length) {
    return `Mind map dengan ${item.body.nodes.length} node — klik untuk melihat visualisasi interaktif.`;
  }
  if (item.type === "flashcard") {
    return "Set flashcard interaktif — klik untuk mulai latihan.";
  }
  if (item.type === "reference") {
    return "Kumpulan link dan referensi penting untuk topik ini.";
  }
  return "Klik untuk membuka konten ini.";
}
