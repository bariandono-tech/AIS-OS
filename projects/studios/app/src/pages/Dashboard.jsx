import { useState, useEffect } from "react";
import { contentItems } from "../data/mockData";

export default function Dashboard({ stacks, onStackClick }) {
  const [search, setSearch] = useState("");
  const [completedCountMap, setCompletedCountMap] = useState({});
  const [stackItemsCountMap, setStackItemsCountMap] = useState({});

  useEffect(() => {
    const completedIds = JSON.parse(localStorage.getItem("studios-completed-content") || "[]");
    
    const completedCounts = {};
    const totalCounts = {};
    
    contentItems.forEach(item => {
      const sId = item.stack_id;
      totalCounts[sId] = (totalCounts[sId] || 0) + 1;
      if (completedIds.includes(item.id)) {
        completedCounts[sId] = (completedCounts[sId] || 0) + 1;
      }
    });

    setCompletedCountMap(completedCounts);
    setStackItemsCountMap(totalCounts);
  }, []);

  const filteredStacks = stacks.filter(
    (s) =>
      s.is_published &&
      (s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      {/* Hero — Editorial Forge Style */}
      <section className="hero" id="hero">
        <div className="container">
          <div className="hero__badge">✦ knowledge platform</div>
          <h1 className="hero__title">
            Belajar Lebih <span>Cerdas</span>,<br />
            Bukan Lebih Keras.
          </h1>
          <p className="hero__subtitle">
            Semua materi kuliah kamu — dirangkum, diorganisir, dan dibuat
            interaktif dalam satu aplikasi.
          </p>
          <div className="hero__search">
            <div className="search-bar">
              <span className="search-bar__icon">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input
                type="text"
                className="search-bar__input"
                placeholder="Cari stack... (cth: pajak, syariah, statistika)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="search-input"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stack Grid — Library Style */}
      <section className="section" id="stacks-section">
        <div className="container">
          <div className="section__header">
            <div>
              <h2 className="section__title">
                Semua <em>Stack</em>
              </h2>
              <p className="section__subtitle">
                {filteredStacks.length} stack tersedia
              </p>
            </div>
          </div>

          {filteredStacks.length > 0 ? (
            <div className="stack-grid">
              {filteredStacks.map((stack) => {
                const total = stackItemsCountMap[stack.id] || stack.content_count || 0;
                const completed = completedCountMap[stack.id] || 0;
                const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

                return (
                  <div
                    key={stack.id}
                    className="stack-card animate-in"
                    style={{ "--stack-color": stack.color }}
                    onClick={() => onStackClick(stack)}
                    id={`stack-card-${stack.slug}`}
                  >
                    <div className="stack-card__icon">{stack.icon}</div>
                    <h3 className="stack-card__title">{stack.title}</h3>
                    <p className="stack-card__description">{stack.description}</p>
                    
                    {/* Editorial progress indicator */}
                    {total > 0 && (
                      <div className="lib-progress" style={{ margin: "16px 0 12px 0" }}>
                        <div className="progress-bar" style={{ height: "4px", background: "var(--bg-3)" }}>
                          <div 
                            className={`progress-fill ${pct === 100 ? "done" : ""}`} 
                            style={{ 
                              width: `${pct}%`, 
                              height: "100%", 
                              background: pct === 100 ? "var(--sage)" : "var(--accent)",
                              transition: "width 0.3s ease"
                            }}
                          ></div>
                        </div>
                        <div className="progress-label" style={{ fontSize: "10px", color: "var(--ink-3)", marginTop: "6px", fontFamily: "var(--mono)" }}>
                          <strong>{completed}</strong> / {total} selesai {pct > 0 && `· ${pct}%`}
                        </div>
                      </div>
                    )}

                    <div className="stack-card__meta">
                      <span className="stack-card__meta-item">
                        {total} konten
                      </span>
                      <span style={{ color: "var(--rule)" }}>·</span>
                      <span className="stack-card__tag">stack</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon">✦</div>
              <p className="empty-state__text">
                Tidak ada stack yang cocok dengan "{search}"
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
