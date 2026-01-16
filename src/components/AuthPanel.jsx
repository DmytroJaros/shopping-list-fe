import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./AuthPanel.css";

function AuthPanel({ t }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isLogin = mode === "login";

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("invite");
    if (!token) return;

    localStorage.setItem("invite_token", token);
    url.searchParams.delete("invite");
    window.history.replaceState({}, "", url.pathname + url.search);
  }, []);

  async function handleEmailAuth(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          throw signInError;
        }
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) {
          throw signUpError;
        }
        setMessage(t("checkEmail"));
      }
    } catch (err) {
      setError(err.message ?? t("authFailed"));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleAuth() {
    setError("");
    setMessage("");
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });

    if (oauthError) {
      setError(oauthError.message ?? t("authFailed"));
    }
  }

  return (
    <div className="auth-panel">
      <h1 className="auth-title">{t("welcome")}</h1>
      <p className="auth-subtitle">{t("signInToContinue")}</p>

      <form className="auth-form" onSubmit={handleEmailAuth}>
        <label>
          {t("email")}
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          {t("password")}
          <input
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button type="submit" className="primary-button" disabled={isLoading}>
          {isLogin ? t("login") : t("signUp")}
        </button>
      </form>

      <button
        type="button"
        className="secondary-button"
        onClick={handleGoogleAuth}
        disabled={isLoading}
      >
        {t("continueWithGoogle")}
      </button>

      <button
        type="button"
        className="btn-ghost auth-mode-toggle"
        onClick={() => setMode(isLogin ? "signup" : "login")}
        disabled={isLoading}
      >
        {isLogin ? t("needAccount") : t("haveAccount")}
      </button>

      {message && <p className="auth-message">{message}</p>}
      {error && <p className="auth-error">{error}</p>}
    </div>
  );
}

export default AuthPanel;
