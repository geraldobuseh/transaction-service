const roleStyles = {
  ADMIN: 'border-white/25 bg-white/10 text-white',
  ANALYST: 'border-white/20 bg-white/[0.08] text-white',
  VIEWER: 'border-white/15 bg-white/[0.06] text-white/80'
};

export default function RoleBadge({ role }) {
  const normalizedRole = String(role || 'VIEWER').toUpperCase();

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
        roleStyles[normalizedRole] || roleStyles.VIEWER
      }`}
    >
      {normalizedRole}
    </span>
  );
}
