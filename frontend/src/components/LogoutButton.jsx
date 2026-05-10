import { LogOut } from 'lucide-react';
import { useAuth } from '../auth/useAuth';

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      type="button"
      onClick={() => logout()}
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-2.5 text-sm font-medium text-white/82 transition hover:bg-white/[0.085]"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
