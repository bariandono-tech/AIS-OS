import { useState, useEffect } from "react";
import "./index.css";
import { getStacks, getPurchases, purchaseStack } from "./services/dataService";
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

  useEffect(() => {
    getStacks().then((data) => setStacks(data));

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

  useEffect(() => {
    if (user) {
      getPurchases().then((purchasedIds) => {
        setPurchases(purchasedIds || []);
      });
    } else {
      setPurchases([]);
    }
  }, [user]);

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
    if (stack.color === "#free") return false;
    if (!HAS_SUPABASE) return false;
    return !purchases.includes(stack.id);
  };

  const navigateTo = (page, data) => {
    if (page === "dashboard") {
      setCurrentPage("dashboard");
      setCurrentStack(null);
      setCurrentContent(null);
    } else if (page === "stack") {
      setCurrentPage("stack");
      setCurrentStack(data);
      setCurrentContent(null);
    } else if (page === "viewer") {
      setCurrentPage("viewer");
      setCurrentContent(data);
    } else if (page === "auth") {
      setCurrentPage("auth");
    }
    window.scrollTo(0, 0);
  };

  return (
    <div className="app">
      {/* Background gradient orbs */}
      <div className="bg-gradient-orb bg-gradient-orb--purple" />
      <div className="bg-gradient-orb bg-gradient-orb--pink" />

      {/* Navbar */}
      <nav className="navbar" id="navbar">
        <div className="container navbar__inner">
          <div
            className="navbar__logo"
            onClick={() => navigateTo("dashboard")}
            id="logo"
          >
            <div className="navbar__logo-icon">📚</div>
            <div className="navbar__logo-text">
              Studi<span>OS</span>
            </div>
          </div>
          <div className="navbar__nav">
            <button
              className={`navbar__link ${currentPage === "dashboard" ? "navbar__link--active" : ""}`}
              onClick={() => navigateTo("dashboard")}
              id="nav-dashboard"
            >
              Dashboard
            </button>
            {currentStack && (
              <button
                className={`navbar__link ${currentPage === "stack" ? "navbar__link--active" : ""}`}
                onClick={() => navigateTo("stack", currentStack)}
                id="nav-stack"
              >
                {currentStack.title}
              </button>
            )}
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-secondary)" }}>
                  👤 {user.email}
                </span>
                <button
                  className="navbar__link"
                  onClick={handleLogout}
                  id="nav-logout"
                  style={{ color: "var(--color-reference)", border: "1px solid rgba(225,112,85,0.2)", padding: "4px 12px", borderRadius: "var(--radius-sm)" }}
                >
                  Keluar
                </button>
              </div>
            ) : (
              <button
                className={`navbar__link ${currentPage === "auth" ? "navbar__link--active" : ""}`}
                onClick={() => navigateTo("auth")}
                id="nav-login"
                style={{ border: "1px solid var(--border-subtle)", padding: "4px 12px", borderRadius: "var(--radius-sm)" }}
              >
                Masuk
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>
        {currentPage === "dashboard" && (
          <Dashboard
            stacks={stacks}
            onStackClick={(stack) => navigateTo("stack", stack)}
          />
        )}
        {currentPage === "stack" && currentStack && (
          <StackPage
            stack={currentStack}
            isLocked={isStackLocked(currentStack)}
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
    </div>
  );
}

export default App;
