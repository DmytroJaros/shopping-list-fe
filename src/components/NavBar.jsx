import React from "react";

function NavBar({ theme, onToggleTheme, lang, setLang, onSignOut, isSignedIn, t }) {
  return (
    <div className="app-navbar">
      <div className="app-navbar-spacer" />
      <div className="app-navbar-actions">
        <button type="button" className="theme-toggle" onClick={onToggleTheme}>
          {theme === "dark" ? t("lightMode") : t("darkMode")}
        </button>

        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="nav-select"
          aria-label={t("language")}
        >
          <option value="en">EN</option>
          <option value="cs">CZ</option>
        </select>

        {isSignedIn && (
          <button type="button" className="btn-ghost" onClick={onSignOut}>
            {t("signOut")}
          </button>
        )}
      </div>
    </div>
  );
}

export default NavBar;
