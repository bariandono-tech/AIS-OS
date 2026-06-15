import { useState } from "react";

export default function Dashboard({ stacks, onStackClick }) {
  const [search, setSearch] = useState("");

  const filteredStacks = stacks.filter(
    (s) =>
      s.is_published &&
      (s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      {/* Hero */}
      <section className="hero" id="hero">
        <div className="container">
          <div className="hero__badge">✨ Knowledge Platform</div>
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
              <span className="search-bar__icon">🔍</span>
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

      {/* Stack Grid */}
      <section className="section" id="stacks-section">
        <div className="container">
          <div className="section__header">
            <div>
              <h2 className="section__title">Semua Stack</h2>
              <p className="section__subtitle">
                {filteredStacks.length} stack tersedia
              </p>
            </div>
          </div>

          {filteredStacks.length > 0 ? (
            <div className="stack-grid">
              {filteredStacks.map((stack, index) => (
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
                  <div className="stack-card__meta">
                    <span className="stack-card__meta-item">
                      📄 {stack.content_count} konten
                    </span>
                    <span className="stack-card__tag">Stack</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon">🔍</div>
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
