import { useState } from "react";
import "./index.css";
import { stacks, getContentByStack, contentItems } from "./data/mockData";
import Dashboard from "./pages/Dashboard";
import StackPage from "./pages/StackPage";
import ContentViewer from "./pages/ContentViewer";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [currentStack, setCurrentStack] = useState(null);
  const [currentContent, setCurrentContent] = useState(null);

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
            contentItems={getContentByStack(currentStack.slug)}
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
      </main>
    </div>
  );
}

export default App;
