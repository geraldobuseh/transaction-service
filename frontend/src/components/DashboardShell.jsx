import MoneyBackdrop from './MoneyBackdrop';
import Navbar from './Navbar';
import { useTheme } from '../theme/ThemeContext';

export default function DashboardShell({ children }) {
  const { backgroundMode } = useTheme();

  return (
    <div
      className={`min-h-screen overflow-hidden text-white transition-colors duration-500 ${
        backgroundMode === 'white' ? 'theme-white bg-[#f7f5ef]' : 'theme-black bg-black'
      }`}
    >
      <MoneyBackdrop />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-80 bg-gradient-to-b from-emerald-300/10 via-transparent to-transparent" />

      <Navbar />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
