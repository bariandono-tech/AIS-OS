import { useState, useEffect, useMemo } from "react";
import { contentTypeConfig } from "../data/mockData";
import { getContentByStack } from "../services/dataService";

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

  // Count items per type
  const typeCounts = useMemo(() => {
    const counts = { all: contentItems.length };
    contentItems.forEach((item) => {
      counts[item.type] = (counts[item.type] || 0) + 1;
    });
    return counts;
  }, [contentItems]);

  // Filter content
  const filteredContent =
    activeType === "all"
      ? contentItems
      : contentItems.filter((item) => item.type === activeType);

  // Available types (only show tabs for types that have content)
  const availableTypes = ["all", ...Object.keys(contentTypeConfig).filter((t) => typeCounts[t])];

  if (loading) {
    return (
      <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
        <p style={{ color: "var(--text-secondary)", fontSize: "var(--font-size-md)", opacity: 0.8 }}>
          Memuat materi {stack.title}...
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Stack Header */}
      <div className="stack-header" id="stack-header">
        <button className="viewer__back" onClick={onBack} id="back-to-dashboard">
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
              <strong>{Object.keys(typeCounts).length - 1}</strong> tipe
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
              Dapatkan akses penuh ke seluruh rangkuman materi, mind map, flashcard interaktif, dan bank referensi penting untuk topik ini.
            </p>
            <div className="lock-benefits">
              <div className="lock-benefit-item">
                <span>⚡</span> Rangkuman Terstruktur (Resume & Catatan)
              </div>
              <div className="lock-benefit-item">
                <span>🃏</span> Dek Flashcard Latihan Mengingat
              </div>
              <div className="lock-benefit-item">
                <span>🌿</span> Visualisasi Mind Map / Brainstorm
              </div>
              <div className="lock-benefit-item">
                <span>🔗</span> Link Referensi Jurnal & Regulasi Resmi
              </div>
            </div>
            <div className="lock-price">
              Rp 49.000 <span>/ akses selamanya</span>
            </div>
            {user ? (
              <button 
                className="form-submit" 
                onClick={onUnlock}
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
          {/* Type Filter Tabs */}
          <div className="type-tabs" id="type-tabs">
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
                      <h3 className="content-card__title">{item.title}</h3>
                      <p className="content-card__preview">
                        {getPreview(item)}
                      </p>
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
