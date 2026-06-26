import { useState, useEffect } from "react";

export default function MarginaliaView({ content, user, onBack }) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const contentId = content?.id;

  // Initial mock comments database per content item
  const defaultComments = {
    "1.4 modul": [
      {
        id: "m1",
        author: "Lia Park",
        role: "author",
        time: "3 hari yang lalu",
        text: "Mekanisme feedback negatif pada homeostasis adalah kunci utama bab ini. Pastikan Anda memahami perbedaan regulasi intrinsik (lokal) dan ekstrinsik (melibatkan saraf/endokrin)."
      },
      {
        id: "m2",
        author: "Budi Santoso",
        role: "student",
        time: "2 hari yang lalu",
        text: "Apakah proses melahirkan itu satu-satunya contoh feedback positif yang normal dalam tubuh manusia? Rasanya jarang sekali feedback positif dibahas di buku teks."
      },
      {
        id: "m3",
        author: "Helena Voss",
        role: "author",
        time: "1 hari yang lalu",
        text: "Selain proses melahirkan, pembekuan darah (blood clotting) dan generasi potensial aksi pada sel saraf juga merupakan contoh feedback positif fisiologis yang sehat. Keduanya memperkuat sinyal awal untuk mencapai respon cepat."
      }
    ]
  };

  // Load comments on mount
  useEffect(() => {
    if (!contentId) return;

    const stored = localStorage.getItem(`studios-comments-${contentId}`);
    if (stored) {
      setComments(JSON.parse(stored));
    } else {
      // Fallback to default mock comments or empty array
      const defaults = defaultComments[content.title] || defaultComments["1.4 modul"] || [];
      setComments(defaults);
      localStorage.setItem(`studios-comments-${contentId}`, JSON.stringify(defaults));
    }
  }, [contentId, content?.title]);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    // Extract name from user email or default to Guest
    const authorName = user 
      ? user.email.split("@")[0].replace(/[._-]/g, " ")
      : "Guest Student";

    const newComment = {
      id: "user-" + Date.now(),
      author: authorName.charAt(0).toUpperCase() + authorName.slice(1),
      role: user ? "student" : "guest",
      time: "Baru saja",
      text: commentText.trim()
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(`studios-comments-${contentId}`, JSON.stringify(updated));
    setCommentText("");
  };

  const handleDeleteComment = (commentId) => {
    const updated = comments.filter(c => c.id !== commentId);
    setComments(updated);
    localStorage.setItem(`studios-comments-${contentId}`, JSON.stringify(updated));
  };

  const getInitials = (name) => {
    if (!name) return "US";
    const parts = name.split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="viewer" id="marginalia-view" style={{ maxWidth: "1000px", padding: "48px 36px" }}>
      
      {/* Top action header */}
      <button className="viewer__back" onClick={onBack} style={{ marginBottom: "36px" }}>
        ← Kembali ke Bacaan
      </button>

      <div className="marginalia-layout">
        
        {/* Left Column: House Rules */}
        <aside className="marginalia-rules">
          <div className="toc-label" style={{ borderBottom: "1px solid var(--rule)", paddingBottom: "8px", marginBottom: "16px" }}>
            The House Rules
          </div>
          <div className="rules-content" style={{ fontSize: "13px", color: "var(--ink-2)", lineHeight: "1.5" }}>
            <p style={{ marginBottom: "16px" }}>
              Catatan dan diskusi pada StudiOS dimoderasi agar tetap fokus pada pemahaman akademis.
            </p>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: "12px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <span style={{ color: "var(--accent)" }}>—</span>
                <span>Rujuk bab atau bagian spesifik dari teks saat bertanya.</span>
              </li>
              <li style={{ marginBottom: "12px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <span style={{ color: "var(--accent)" }}>—</span>
                <span>Jika menemukan kesalahan data ilmiah, cantumkan sumber alternatif.</span>
              </li>
              <li style={{ marginBottom: "12px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <span style={{ color: "var(--accent)" }}>—</span>
                <span>Sampaikan ketidaksetujuan secara akademis dan sopan.</span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Right Column: Discussion Feed */}
        <div className="marginalia-feed">
          <div className="marginalia-feed-header" style={{ marginBottom: "36px", borderBottom: "1px solid var(--rule)", paddingBottom: "24px" }}>
            <span className="diff-label" style={{ display: "block", marginBottom: "8px", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              V. Marginalia
            </span>
            <h1 style={{ fontFamily: "var(--serif-display)", fontSize: "32px", fontWeight: "700", lineHeight: "1.2" }}>
              Reader notes on {content?.title} · <em style={{ fontStyle: "italic", fontWeight: "400", color: "var(--accent)" }}>{comments.length} so far.</em>
            </h1>
          </div>

          {/* Form to submit note */}
          <form className="new-note-form" onSubmit={handleSubmitComment} style={{ marginBottom: "48px" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div className="avatar-badge" style={{
                width: "40px",
                height: "40px",
                backgroundColor: "var(--bg-3)",
                color: "var(--ink)",
                border: "1px solid var(--rule)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "600",
                fontSize: "14px",
                flexShrink: 0
              }}>
                {user ? getInitials(user.email.split("@")[0]) : "G"}
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                <textarea
                  className="form-input"
                  placeholder="Tambahkan catatan pinggir, pertanyaan, atau koreksi mengenai bab ini..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={{
                    minHeight: "100px",
                    resize: "vertical",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "var(--bg-code)",
                    border: "1px solid var(--rule)"
                  }}
                  required
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--ink-3)", fontStyle: "italic" }}>
                    Mendukung tulisan teks terformat.
                  </span>
                  <button type="submit" className="form-submit" style={{ width: "auto", padding: "8px 20px", fontSize: "11px" }}>
                    SUBMIT NOTE
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments Feed List */}
          <div className="comments-list" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {comments.map((comment) => (
              <div key={comment.id} className="comment-card" style={{ display: "flex", gap: "16px", borderBottom: "1px dotted var(--rule-soft)", paddingBottom: "24px" }}>
                <div className="avatar-badge" style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: comment.role === "author" ? "var(--accent)" : "var(--bg-2)",
                  color: comment.role === "author" ? "var(--bg-2)" : "var(--ink)",
                  border: `1px solid ${comment.role === "author" ? "var(--accent)" : "var(--rule)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "600",
                  fontSize: "14px",
                  flexShrink: 0
                }}>
                  {getInitials(comment.author)}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="comment-header" style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", width: "100%" }}>
                    <span className="comment-author" style={{ fontFamily: "var(--serif-display)", fontSize: "15px", fontWeight: "600", color: "var(--ink)" }}>
                      {comment.author}
                    </span>
                    {comment.role === "author" && (
                      <span className="comment-role-tag" style={{
                        fontSize: "8px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        border: "1px solid var(--accent)",
                        color: "var(--accent)",
                        padding: "1px 5px",
                        letterSpacing: "0.08em",
                        fontFamily: "var(--mono)"
                      }}>
                        CHAPTER AUTHOR
                      </span>
                    )}
                    <span className="comment-time" style={{ fontSize: "11px", color: "var(--ink-3)" }}>
                      · {comment.time}
                    </span>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      style={{
                        marginLeft: "auto",
                        fontSize: "11px",
                        color: "var(--ink-3)",
                        cursor: "pointer",
                        textDecoration: "underline"
                      }}
                      className="delete-comment-btn"
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="comment-body" style={{ fontSize: "15px", color: "var(--ink-2)", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                    {comment.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
