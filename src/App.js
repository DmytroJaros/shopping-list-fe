import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import ShoppingListsRoute from "./routes/ShoppingListsRoute";
import ListDetailPage from "./routes/ListDetailPage";
import { getShoppingLists } from "./api/shoppingListsApi";
import { translations } from "./i18n/translations";
import { supabase } from "./supabaseClient";
import AuthPanel from "./components/AuthPanel";
import { acceptInvite } from "./api/invitesApi";
import NavBar from "./components/NavBar";

function App() {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [status, setStatus] = useState("pending"); //pending, ready, error
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => {return localStorage.getItem("theme") || "dark";});
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);

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

      if (!session) {
        setShoppingLists([]);
        setStatus("ready");
        setError(null);
        return () => {
          isMounted = false;
        };
      }

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
    }, [session]
);

  useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data, error: sessionError }) => {
        if (!isMounted) return;
        if (sessionError) {
          console.error(sessionError);
        }
        setSession(data.session ?? null);
        setAuthReady(true);
      });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  useEffect(() => {
    if (!session) return;

    const url = new URL(window.location.href);
    const tokenFromUrl = url.searchParams.get("invite");
    const tokenFromStorage = localStorage.getItem("invite_token");
    const token = tokenFromUrl || tokenFromStorage;

    if (!token) return;

    localStorage.removeItem("invite_token");
    url.searchParams.delete("invite");
    window.history.replaceState({}, "", url.pathname + url.search);

    acceptInvite(token).catch((err) => {
      console.error(err);
    });
  }, [session]);

  if (!authReady) {
    return (
      <div className="page">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <NavBar
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          lang={lang}
          setLang={setLang}
          isSignedIn={false}
          t={t}
        />
        <AuthPanel t={t} />
      </>
    );
  }

  return (
    <>
    <NavBar
      theme={theme}
      onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      lang={lang}
      setLang={setLang}
      onSignOut={handleSignOut}
      isSignedIn
      t={t}
    />
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
            t={t}
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
          t={t}
        />
      }
    />
    </Routes>
    </>
  );
}

export default App;
