import { useState } from 'react';
import { Sun, Moon, LogOut, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Topbar from '@/components/layout/Topbar';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, signOut } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const navigate = useNavigate();
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out. See you next time!');
    navigate('/login');
  };

  return (
    <div>
      <Topbar title="Settings" subtitle="Manage your account and preferences" />

      <div className="space-y-5 px-5 py-6 lg:px-8">
        <section className="card p-5">
          <h2 className="text-sm font-semibold text-muted">Account</h2>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-matcha-100 text-base font-semibold text-matcha-700 dark:bg-matcha-900 dark:text-matcha-300">
              {(user?.displayName || user?.email || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{user?.displayName || 'Student'}</p>
              <p className="text-sm text-muted">{user?.email}</p>
            </div>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-sm font-semibold text-muted">Appearance</h2>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-matcha-50 px-4 py-3 dark:bg-white/5">
            <div className="flex items-center gap-3">
              {theme === 'light' ? <Sun className="h-5 w-5 text-matcha-600" /> : <Moon className="h-5 w-5 text-matcha-400" />}
              <div>
                <p className="text-sm font-medium">{theme === 'light' ? 'Light mode' : 'Dark mode'}</p>
                <p className="text-xs text-muted">Switch between light and dark themes</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative h-7 w-12 rounded-full transition ${theme === 'dark' ? 'bg-matcha-500' : 'bg-matcha-200'}`}
              aria-label="Toggle theme"
              role="switch"
              aria-checked={theme === 'dark'}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-sm font-semibold text-muted">Session</h2>
          <button onClick={() => setConfirmSignOut(true)} className="btn-secondary mt-3 w-full justify-start text-red-500">
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </section>

        <section className="card border-red-100 p-5 dark:border-red-500/20">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-red-500">
            <Trash2 className="h-4 w-4" /> Danger zone
          </h2>
          <p className="mt-1 text-xs text-muted">
            Account deletion isn't available yet from this screen. Contact support or delete your project's row directly in Supabase
            during development.
          </p>
        </section>
      </div>

      <ConfirmDialog
        open={confirmSignOut}
        title="Log out of AssignMate?"
        description="You'll need to sign in again to access your assignments."
        confirmLabel="Log out"
        onConfirm={handleSignOut}
        onCancel={() => setConfirmSignOut(false)}
      />
    </div>
  );
}
