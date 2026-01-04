import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import ShoppingListsRoute from "./routes/ShoppingListsRoute";
import ListDetailPage from "./routes/ListDetailPage";
import { getShoppingLists } from "./api/shoppingListsApi";
import { translations } from "./i18n/translations";

function App() {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [status, setStatus] = useState("pending"); //pending, ready, error
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => {return localStorage.getItem("theme") || "dark";});
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

  function t(key, params = {}) {
    const dict = translations[lang] || translations.en;
    let text = dict[key] ?? translations.en[key] ?? key;

    Object.keys(params).forEach((p) => {
      text = text.replace(`{${p}}`, String(params[p]));
    });

    return text;
  }

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect
  (() => {
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(theme === "light" ? "theme-light" : "theme-dark");
    localStorage.setItem("theme", theme);
    }, [theme]
  );

  useEffect
  (() => 
    {
      let isMounted = true;

      async function load() {
        try {
          setStatus("pending");
          setError(null);

          const lists = await getShoppingLists();

          if (!isMounted) return;
          setShoppingLists(lists);
          setStatus("ready");
        } catch (err) {
          console.error(err);
          if (!isMounted) return;
          setError("Nepodařilo se načíst nákupní seznamy.");
          setStatus("error");
        }
      }

      load();

      return () => {
        isMounted = false;
      };
    }, []
);

  return (
    <>    
    <Routes>
      <Route path="/" element={<Navigate to="/lists" replace />} />

      <Route
        path="/lists"
        element={
          <ShoppingListsRoute
            shoppingLists={shoppingLists}
            setShoppingLists={setShoppingLists}
            status={status}
            error={error}
            theme={theme}
            onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            t={t}
            lang={lang}
            setLang={setLang}
          />
        }
      />

    <Route
      path="/lists/:id"
      element={
        <ListDetailPage
          shoppingLists={shoppingLists}
          setShoppingLists={setShoppingLists}
          status={status}
          error={error}
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          t={t}
        />
      }
    />
    </Routes>
    </>
  );
}

export default App;