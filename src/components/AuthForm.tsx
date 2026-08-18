import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Icon } from "../icons";

interface AuthFormProps {
  initialMode?: "signin" | "signup" | "forgot";
  onSuccessNotice?: (message: string) => void;
  onSignedIn?: () => void;
}

export function AuthForm({ initialMode = "signin", onSuccessNotice, onSignedIn }: AuthFormProps) {
  const { signIn, signUp, resetPassword } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup" | "forgot">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg("Please provide your email address.");
      return;
    }

    if (mode === "forgot") {
      setLoading(true);
      const res = await resetPassword(email);
      setLoading(false);
      if (res.error) {
        setErrorMsg(res.error.message);
      } else {
        setSuccessMsg("Password reset link sent to your email!");
        onSuccessNotice?.("Password reset link sent.");
      }
      return;
    }

    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }

    if (mode === "signup") {
      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
      setLoading(true);
      const res = await signUp(email, password);
      setLoading(false);
      if (res.error) {
        if (/already registered|already been registered/i.test(res.error.message)) {
          setErrorMsg("An account with this email already exists. Sign in instead.");
        } else {
          setErrorMsg(res.error.message);
        }
      } else {
        setSuccessMsg("Account created! You are signed in.");
        onSuccessNotice?.("Account created successfully.");
      }
      return;
    }

    if (mode === "signin") {
      setLoading(true);
      const res = await signIn(email, password);
      setLoading(false);
      if (res.error) {
        if (/invalid login credentials/i.test(res.error.message)) {
          setErrorMsg("Incorrect email or password. Double-check and try again, or use \"Forgot password?\".");
        } else if (/email not confirmed/i.test(res.error.message)) {
          setErrorMsg("Your email is not confirmed yet. Check your inbox (and spam) for the confirmation link.");
        } else {
          setErrorMsg(res.error.message);
        }
      } else {
        onSuccessNotice?.(`Welcome back, ${res.session?.user.email ?? "Architect"}!`);
        onSignedIn?.();
      }
    }
  };

  return (
    <>
      <nav className="modal-tabs" role="tablist">
        <button
          type="button"
          className={mode === "signin" ? "active" : ""}
          onClick={() => { setMode("signin"); setErrorMsg(null); setSuccessMsg(null); }}
        >
          Sign In
        </button>
        <button
          type="button"
          className={mode === "signup" ? "active" : ""}
          onClick={() => { setMode("signup"); setErrorMsg(null); setSuccessMsg(null); }}
        >
          Sign Up
        </button>
      </nav>

      <form onSubmit={handleSubmit} className="modal-body">
        {errorMsg && (
          <div className="alert-box error" role="alert">
            <span>!</span>
            <div>{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="alert-box success" role="status">
            <Icon name="check" />
            <div>{successMsg}</div>
          </div>
        )}

        <div className="form-fields">
          <label className="form-field">
            <span>Email address</span>
            <div className="input-with-icon">
              <Icon name="mail" />
              <input
                type="email"
                placeholder="architect@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </label>

          {mode !== "forgot" && (
            <label className="form-field">
              <span>Password</span>
              <div className="input-with-icon">
                <Icon name="lock" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
              </div>
            </label>
          )}

          {mode === "signup" && (
            <label className="form-field">
              <span>Confirm Password</span>
              <div className="input-with-icon">
                <Icon name="lock" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </label>
          )}

          <div className="form-helper-row">
            {mode === "signin" && (
              <button
                type="button"
                className="text-link"
                onClick={() => { setMode("forgot"); setErrorMsg(null); setSuccessMsg(null); }}
              >
                Forgot password?
              </button>
            )}
            {mode === "forgot" && (
              <button
                type="button"
                className="text-link"
                onClick={() => { setMode("signin"); setErrorMsg(null); setSuccessMsg(null); }}
              >
                Back to sign in
              </button>
            )}
          </div>

          <button type="submit" className="submit-btn primary" disabled={loading}>
            {loading && "Please wait..."}
            {!loading && mode === "signin" && "Sign In"}
            {!loading && mode === "signup" && "Create Account"}
            {!loading && mode === "forgot" && "Send Reset Link"}
          </button>

          <div className="modal-switch-mode">
            {mode === "signin" ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  className="inline-link"
                  onClick={() => { setMode("signup"); setErrorMsg(null); setSuccessMsg(null); }}
                >
                  Sign up now
                </button>
              </p>
            ) : mode === "signup" ? (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  className="inline-link"
                  onClick={() => { setMode("signin"); setErrorMsg(null); setSuccessMsg(null); }}
                >
                  Sign in
                </button>
              </p>
            ) : null}
          </div>
        </div>
      </form>
    </>
  );
}