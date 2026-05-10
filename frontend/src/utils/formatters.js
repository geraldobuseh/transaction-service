const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2
});

const timestampFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZoneName: 'short',
  timeZone: 'America/Chicago'
});

export function formatCurrency(value) {
  const amount = Number(value);
  return currencyFormatter.format(Number.isFinite(amount) ? amount : 0);
}

export function formatTimestamp(value) {
  if (!value) {
    return 'Not recorded';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return timestampFormatter.format(date);
}

export function formatAuditTimestamp(value) {
  if (!value) {
    return {
      absolute: 'Not recorded',
      relative: ''
    };
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      absolute: value,
      relative: ''
    };
  }

  return {
    absolute: timestampFormatter.format(date).replace(',', ' -'),
    relative: formatRelativeTime(date)
  };
}

function formatRelativeTime(date) {
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const absoluteSeconds = Math.abs(seconds);

  if (absoluteSeconds < 60) {
    return seconds <= 0 ? 'just now' : 'in a few seconds';
  }

  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60]
  ];

  const formatter = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });
  const [unit, unitSeconds] = units.find(([, value]) => absoluteSeconds >= value);
  return formatter.format(Math.round(seconds / unitSeconds), unit);
}

export function formatTransactionId(id) {
  if (id === null || id === undefined) {
    return 'Pending';
  }

  return `TX-${String(id).padStart(6, '0')}`;
}

export function formatType(type) {
  return type ? String(type).toUpperCase() : 'UNKNOWN';
}
