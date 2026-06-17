import { useState, useEffect } from "react";
import "./index.css";
import { getStacks, getPurchases, purchaseStack, getReferences, getContentByStack } from "./services/dataService";
import { supabase, HAS_SUPABASE } from "./lib/supabaseClient";
import Dashboard from "./pages/Dashboard";
import StackPage from "./pages/StackPage";
import ContentViewer from "./pages/ContentViewer";
import AuthPage from "./pages/AuthPage";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [currentStack, setCurrentStack] = useState(null);
  const [currentContent, setCurrentContent] = useState(null);
  const [stacks, setStacks] = useState([]);
  const [user, setUser] = useState(null);
  const [purchases, setPurchases] = useState([]);

  // Sidebar visibility states
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  // Cache contents of all stacks to list them hierarchically in left sidebar
  const [contentsCache, setContentsCache] = useState({});
  const [expandedStacks, setExpandedStacks] = useState({});
  const [sidebarSearch, setSidebarSearch] = useState("");

  // Contextual items for Right Sidebar
  const [activeReferences, setActiveReferences] = useState([]);
  const [flashcardProgress, setFlashcardProgress] = useState(null);

  // Load stacks and session info
  useEffect(() => {
    getStacks().then((data) => {
      setStacks(data || []);
      // Pre-load content items for all stacks to build Left Sidebar explorer
      const initialExpanded = {};
      data?.forEach((stack) => {
        getContentCacheForStack(stack);
        initialExpanded[stack.slug] = true;
      });
      setExpandedStacks(initialExpanded);
    });

    if (HAS_SUPABASE && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user || null);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Sync purchases on user state change
  useEffect(() => {
    if (user) {
      getPurchases().then((purchasedIds) => {
        setPurchases(purchasedIds || []);
      });
    } else {
      setPurchases([]);
    }
  }, [user]);

  // Fetch references and context for active content
  useEffect(() => {
    if (currentContent) {
      // Clear previous
      setActiveReferences([]);
      
      // Fetch new references
      getReferences(currentContent.id).then((refs) => {
        setActiveReferences(refs || []);
      });
    } else {
      setActiveReferences([]);
      setFlashcardProgress(null);
    }
  }, [currentContent]);

  // Helper to load content items for a specific stack slug
  const getContentCacheForStack = (stack) => {
    getContentByStack(stack.slug).then((items) => {
      setContentsCache((prev) => ({
        ...prev,
        [stack.slug]: items || [],
      }));
    });
  };

  const handleUnlockStack = async (stackId) => {
    try {
      await purchaseStack(stackId);
      const purchasedIds = await getPurchases();
      setPurchases(purchasedIds || []);
    } catch (err) {
      alert("Gagal membeli stack: " + err.message);
    }
  };

  const handleLogout = async () => {
    if (HAS_SUPABASE && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    navigateTo("dashboard");
  };

  const isStackLocked = (stack) => {
    if (!stack) return false;
    if (stack.color === "#free" || stack.color === "free") return false;
    if (!HAS_SUPABASE) return false;
    return !purchases.includes(stack.id);
  };

  const navigateTo = (page, data) => {
    if (page === "dashboard") {
      setCurrentPage("dashboard");
      setCurrentStack(null);
      setCurrentContent(null);
      setLeftSidebarOpen(true);
      setRightSidebarOpen(true);
    } else if (page === "stack") {
      setCurrentPage("stack");
      setCurrentStack(data);
      setCurrentContent(null);
      setLeftSidebarOpen(true);
      setRightSidebarOpen(true);
      if (data) {
        setExpandedStacks((prev) => ({ ...prev, [data.slug]: true }));
        // If content cache not loaded yet, fetch it
        if (!contentsCache[data.slug]) {
          getContentCacheForStack(data);
        }
      }
    } else if (page === "viewer") {
      setCurrentPage("viewer");
      setCurrentContent(data);
      if (data && (!currentStack || currentStack.id !== data.stack_id)) {
        const matchingStack = stacks.find((s) => s.id === data.stack_id);
        if (matchingStack) {
          setCurrentStack(matchingStack);
          setExpandedStacks((prev) => ({ ...prev, [matchingStack.slug]: true }));
        }
      }
      // Check if it is interactive HTML widget
      const isHTML = data && data.type === "notes" && data.body?.markdown && (
        data.body.markdown.trim().startsWith("<") || 
        data.body.markdown.trim().includes("</script>") ||
        data.body.markdown.toLowerCase().includes("<iframe")
      );
      if (isHTML) {
        setLeftSidebarOpen(false);
        setRightSidebarOpen(false);
      }
    } else if (page === "auth") {
      setCurrentPage("auth");
    }

    // Scroll inner viewport to top
    const viewport = document.querySelector(".app-main-viewport-immersive");
    if (viewport) {
      viewport.scrollTop = 0;
    }
  };

  // Toggle handlers
  const toggleLeftSidebar = () => setLeftSidebarOpen(!leftSidebarOpen);
  const toggleRightSidebar = () => setRightSidebarOpen(!rightSidebarOpen);

  // Search filter logic for side bar
  const filteredStacksForSidebar = stacks.filter((stack) => {
    if (!sidebarSearch) return true;
    const matchStack =
      stack.title.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
      stack.description.toLowerCase().includes(sidebarSearch.toLowerCase());
    const items = contentsCache[stack.slug] || [];
    const matchItems = items.some((item) =>
      item.title.toLowerCase().includes(sidebarSearch.toLowerCase())
    );
    return matchStack || matchItems;
  });

  const isStackNodeExpanded = (stackSlug) => {
    if (sidebarSearch) return true; // auto-expand on search
    return !!expandedStacks[stackSlug];
  };

  const handleStackToggle = (e, stack) => {
    e.stopPropagation(); // prevent navigating if just clicking chevron
    setExpandedStacks((prev) => ({
      ...prev,
      [stack.slug]: !prev[stack.slug],
    }));
  };

  const currentStackLocked = isStackLocked(currentStack);

  return (
    <div className="app-shell-immersive">
      {/* 1. Header Navbar Persisten */}
      <header className="app-header-immersive">
        <div className="header-left-group">
          <button
            onClick={toggleLeftSidebar}
            className={`header-toggle-btn ${leftSidebarOpen ? "header-toggle-btn--active" : ""}`}
            title="Toggle File Explorer (Kiri)"
            id="toggle-left-sidebar"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          
          <div className="app-logo-immersive" onClick={() => navigateTo("dashboard")}>
            <div className="navbar__logo-icon" style={{ fontSize: "14px", width: "28px", height: "28px" }}>📚</div>
            <div className="navbar__logo-text" style={{ fontSize: "16px" }}>
              Studi<span>OS</span>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="app-breadcrumb-immersive">
            <span className="app-breadcrumb-item" onClick={() => navigateTo("dashboard")}>
              root
            </span>
            {currentStack && (
              <>
                <span>/</span>
                <span 
                  className={`app-breadcrumb-item ${!currentContent ? "active" : ""}`}
                  onClick={() => navigateTo("stack", currentStack)}
                >
                  {currentStack.icon} {currentStack.title}
                </span>
              </>
            )}
            {currentContent && (
              <>
                <span>/</span>
                <span className="app-breadcrumb-item active">
                  {currentContent.title}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="header-right-group">
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                👤 {user.email}
              </span>
              <button
                className="type-tab"
                onClick={handleLogout}
                id="header-logout"
                style={{ fontSize: "11px", padding: "4px 10px" }}
              >
                Keluar
              </button>
            </div>
          ) : (
            <button
              className="type-tab type-tab--active"
              onClick={() => navigateTo("auth")}
              id="header-login"
              style={{ fontSize: "11px", padding: "4px 10px" }}
            >
              Masuk
            </button>
          )}

          <button
            onClick={toggleRightSidebar}
            className={`header-toggle-btn ${rightSidebarOpen ? "header-toggle-btn--active" : ""}`}
            title="Toggle Detail & Referensi (Kanan)"
            id="toggle-right-sidebar"
          >
            <i className="fa-solid fa-circle-info"></i>
          </button>
        </div>
      </header>

      {/* 2. Workspace Area */}
      <div className="app-workspace-immersive">
        {/* Sidebar Kiri: Stacks & Content Explorer */}
        <aside className={`app-sidebar-left-immersive ${leftSidebarOpen ? "" : "closed"}`}>
          <div className="sidebar-search-container">
            <div className="sidebar-search-wrapper">
              <span className="sidebar-search-icon">🔍</span>
              <input
                type="text"
                className="sidebar-search-input"
                placeholder="Cari materi / stack..."
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                id="sidebar-search"
              />
            </div>
          </div>

          <div className="sidebar-explorer-scroll">
            <div className="explorer-section-header">WORKSPACE EXPLORER</div>
            
            {filteredStacksForSidebar.map((stack) => {
              const isLocked = isStackLocked(stack);
              const items = contentsCache[stack.slug] || [];
              const expanded = isStackNodeExpanded(stack.slug);
              
              // Filter content items if searching
              const matchingItems = items.filter(item => 
                !sidebarSearch || item.title.toLowerCase().includes(sidebarSearch.toLowerCase())
              );

              const stackActive = currentStack && currentStack.id === stack.id;

              return (
                <div key={stack.id} className="explorer-stack-node">
                  {/* Stack Row */}
                  <div 
                    className={`explorer-stack-header ${stackActive && !currentContent ? "active" : ""}`}
                    onClick={() => navigateTo("stack", stack)}
                    id={`explorer-stack-${stack.slug}`}
                  >
                    <div className="explorer-stack-title-group">
                      <span className="explorer-stack-icon">{stack.icon}</span>
                      <span style={{ textDecoration: isLocked ? "line-through" : "none", opacity: isLocked ? 0.7 : 1 }}>
                        {stack.title}
                      </span>
                      {isLocked && <span className="sidebar-locked-badge">LOCK</span>}
                    </div>
                    
                    <span 
                      className={`explorer-stack-arrow ${expanded ? "expanded" : ""}`}
                      onClick={(e) => handleStackToggle(e, stack)}
                    >
                      ▶
                    </span>
                  </div>

                  {/* Collapsible Content List */}
                  {expanded && (
                    <div className="explorer-content-list">
                      {matchingItems.length > 0 ? (
                        matchingItems.map((item) => {
                          const itemActive = currentContent && currentContent.id === item.id;
                          return (
                            <div
                              key={item.id}
                              className={`explorer-content-item ${itemActive ? "active" : ""}`}
                              onClick={() => {
                                if (isLocked) {
                                  // Navigate to stack detail page to unlock it
                                  navigateTo("stack", stack);
                                } else {
                                  navigateTo("viewer", item);
                                }
                              }}
                              id={`explorer-content-${item.id}`}
                            >
                              <span className={`explorer-content-type-dot explorer-content-type-dot--${item.type}`} />
                              <span className="explorer-content-title" title={item.title}>
                                {item.title}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div style={{ padding: "4px 12px", fontSize: "11px", color: "var(--text-muted)", fontStyle: "italic" }}>
                          {isLocked ? "Akses Terkunci (Buka Premium)" : "Tidak ada konten"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Viewport Tengah: Halaman Aktif */}
        <main className="app-main-viewport-immersive">
          {currentPage === "dashboard" && (
            <Dashboard
              stacks={stacks}
              onStackClick={(stack) => navigateTo("stack", stack)}
            />
          )}
          
          {currentPage === "stack" && currentStack && (
            <StackPage
              stack={currentStack}
              isLocked={currentStackLocked}
              user={user}
              onUnlock={() => handleUnlockStack(currentStack.id)}
              onLoginRedirect={() => navigateTo("auth")}
              onContentClick={(content) => navigateTo("viewer", content)}
              onBack={() => navigateTo("dashboard")}
            />
          )}

          {currentPage === "viewer" && currentContent && (
            <ContentViewer
              content={currentContent}
              stack={currentStack}
              onBack={() => navigateTo("stack", currentStack)}
              onFlashcardProgress={(index, total) => setFlashcardProgress({ index, total })}
            />
          )}

          {currentPage === "auth" && (
            <AuthPage
              onLoginSuccess={(loggedInUser) => {
                setUser(loggedInUser);
                navigateTo("dashboard");
              }}
              onBack={() => navigateTo("dashboard")}
            />
          )}
        </main>

        {/* Sidebar Kanan: Contextual Info & Panel Aksi */}
        <aside className={`app-sidebar-right-immersive ${rightSidebarOpen ? "" : "closed"}`}>
          <div className="sidebar-right-scroll">
            
            {/* Context 1: Dashboard Context */}
            {currentPage === "dashboard" && (
              <>
                <div className="right-sidebar-section">
                  <div className="right-sidebar-section-title">Informasi Akun</div>
                  <div className="sidebar-meta-list">
                    <div className="sidebar-meta-item">
                      <span className="sidebar-meta-label">Status Sesi</span>
                      <span className="sidebar-meta-val">
                        {user ? "Terautentikasi" : "Tamu (Belum Masuk)"}
                      </span>
                    </div>
                    {user && (
                      <div className="sidebar-meta-item">
                        <span className="sidebar-meta-label">Email</span>
                        <span className="sidebar-meta-val" style={{ wordBreak: "break-all" }}>
                          {user.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="right-sidebar-section">
                  <div className="right-sidebar-section-title">Informasi Workspace</div>
                  <div className="sidebar-meta-list">
                    <div className="sidebar-meta-item">
                      <span className="sidebar-meta-label">Total Topik (Stacks)</span>
                      <span className="sidebar-meta-val">{stacks.length} mata kuliah</span>
                    </div>
                    <div className="sidebar-meta-item">
                      <span className="sidebar-meta-label">Fitur Utama</span>
                      <span className="sidebar-meta-val" style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                        Navigasi instan antar-kuliah menggunakan Explorer sebelah kiri. Aktifkan drawer kanan untuk melihat referensi, progress deck, dan ringkasan.
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Context 2: Stack Detail Context (Locked / Unlocked) */}
            {currentPage === "stack" && currentStack && (
              <>
                <div className="right-sidebar-section">
                  <div className="right-sidebar-section-title">Detail Mata Kuliah</div>
                  <div className="sidebar-meta-list">
                    <div className="sidebar-meta-item">
                      <span className="sidebar-meta-label">Nama Stack</span>
                      <span className="sidebar-meta-val">
                        {currentStack.icon} {currentStack.title}
                      </span>
                    </div>
                    <div className="sidebar-meta-item">
                      <span className="sidebar-meta-label">Status Pembelian</span>
                      <span className="sidebar-meta-val">
                        {currentStackLocked ? "🔒 Terkunci (Premium)" : "🔓 Terbuka / Free"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* If Stack is Locked, display checkout box in sidebar! */}
                {currentStackLocked && (
                  <div className="right-sidebar-section" style={{ background: "rgba(255, 255, 255, 0.02)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(225,112,85,0.3)" }}>
                    <div className="right-sidebar-section-title" style={{ color: "var(--color-reference)", border: "none" }}>PAKET PREMIUM</div>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: "1.4" }}>
                      Buka akses lengkap ke resume terstruktur, flashcard, dan bank referensi untuk topik ini.
                    </p>
                    <div className="sidebar-right-benefits" style={{ marginBottom: "16px" }}>
                      <div className="sidebar-right-benefit-item">
                        <span>⚡</span> Rangkuman (Resume & Catatan)
                      </div>
                      <div className="sidebar-right-benefit-item">
                        <span>🃏</span> Dek Flashcard Latihan Mengingat
                      </div>
                      <div className="sidebar-right-benefit-item">
                        <span>🌿</span> Visualisasi Mind Map Interaktif
                      </div>
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "16px" }}>
                      Rp 49.000 <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>/ akses selamanya</span>
                    </div>
                    
                    {user ? (
                      <button 
                        className="form-submit" 
                        onClick={() => {
                          // Dispatch a click on the main unlock button
                          const unlockBtn = document.getElementById("btn-unlock-premium");
                          if (unlockBtn) unlockBtn.click();
                        }}
                        style={{ width: "100%", padding: "10px" }}
                      >
                        Beli Sekarang
                      </button>
                    ) : (
                      <button 
                        className="form-submit" 
                        onClick={() => navigateTo("auth")}
                        style={{ width: "100%", padding: "10px" }}
                      >
                        Masuk untuk Membeli
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Context 3: Content Viewer Context */}
            {currentPage === "viewer" && currentContent && (
              <>
                <div className="right-sidebar-section">
                  <div className="right-sidebar-section-title">Info Konten</div>
                  <div className="sidebar-meta-list">
                    <div className="sidebar-meta-item">
                      <span className="sidebar-meta-label">Mata Kuliah</span>
                      <span className="sidebar-meta-val">
                        {currentStack?.icon} {currentStack?.title}
                      </span>
                    </div>
                    <div className="sidebar-meta-item">
                      <span className="sidebar-meta-label">Judul</span>
                      <span className="sidebar-meta-val" style={{ fontSize: "12px", lineHeight: "1.3" }}>
                        {currentContent.title}
                      </span>
                    </div>
                  </div>
                </div>

                {/* If type is flashcard, show flashcard progress in Right Sidebar */}
                {currentContent.type === "flashcard" && flashcardProgress && (
                  <div className="right-sidebar-section">
                    <div className="right-sidebar-section-title">Progress Latihan</div>
                    <div className="sidebar-meta-list" style={{ marginBottom: "16px" }}>
                      <div className="sidebar-meta-item">
                        <span className="sidebar-meta-label">Kartu Aktif</span>
                        <span className="sidebar-meta-val" style={{ fontSize: "18px", fontWeight: "800" }}>
                          {flashcardProgress.index} / {flashcardProgress.total}
                        </span>
                      </div>
                    </div>
                    <button
                      className="type-tab"
                      onClick={() => {
                        const resetBtn = document.getElementById("btn-reset-flashcard-deck");
                        // Trigger resetting deck
                        if (resetBtn) {
                          resetBtn.click();
                        }
                      }}
                      style={{ fontSize: "11px", padding: "6px 12px", width: "100%", textAlign: "center" }}
                    >
                      Mulai Ulang Latihan (Reset)
                    </button>
                  </div>
                )}

                {/* If notes/resume, display References in the Right Sidebar */}
                {(currentContent.type === "notes" || currentContent.type === "resume" || currentContent.type === "reference") && (
                  <div className="right-sidebar-section">
                    <div className="right-sidebar-section-title">Referensi & Regulasi</div>
                    {activeReferences.length > 0 ? (
                      <div className="sidebar-right-ref-list">
                        {activeReferences.map((ref) => (
                          <div key={ref.id} className="sidebar-right-ref-card">
                            <div className="sidebar-right-ref-title">{ref.title}</div>
                            <div className="sidebar-right-ref-desc">{ref.description}</div>
                            <a
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="sidebar-right-ref-link"
                            >
                              Buka tautan eksternal ↗
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: "11px", color: "var(--text-muted)", fontStyle: "italic" }}>
                        Tidak ada referensi eksternal untuk materi ini.
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Context 4: Auth Page Context */}
            {currentPage === "auth" && (
              <div className="right-sidebar-section">
                <div className="right-sidebar-section-title">Autentikasi Aman</div>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                  StudiOS mengamankan akun Anda menggunakan sistem otentikasi Supabase. Anda dapat masuk menggunakan akun demo yang disediakan untuk menguji status sinkronisasi.
                </p>
              </div>
            )}

          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
