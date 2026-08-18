import { AuthForm } from "./AuthForm";

interface AuthGateProps {
  onSuccessNotice?: (message: string) => void;
}

export function AuthGate({ onSuccessNotice }: AuthGateProps) {
  return (
    <div className="auth-gate">
      <div className="auth-gate-inner">
        <div className="gate-brand">
          <span className="brand-mark"><i /><i /><i /></span>
          <strong>Room planner</strong>
        </div>
        <p className="gate-tagline">Modular 2 m interior assemblies, saved to your cloud account.</p>
        <div className="gate-card">
          <AuthForm onSuccessNotice={onSuccessNotice} />
        </div>
        <p className="gate-footnote">
          Your session stays signed in on this device. Use the sign-out button in the app to switch accounts.
        </p>
      </div>
    </div>
  );
}