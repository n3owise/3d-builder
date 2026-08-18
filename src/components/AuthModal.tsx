import { AuthForm } from "./AuthForm";
import { Icon } from "../icons";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup" | "forgot" | "setup";
  onSuccessNotice?: (message: string) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "signin",
  onSuccessNotice,
}: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title-group">
            <span className="modal-tag">AUTHENTICATION</span>
            <h3>Account access</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </header>
        <AuthForm initialMode={initialMode} onSuccessNotice={onSuccessNotice} onSignedIn={onClose} />
      </div>
    </div>
  );
}