const INDICATOR_COLORS = {
  primary: '#fff',
  secondary: '#2563eb',
};

export function useButton({ variant = 'primary' }) {
  return {
    activityIndicatorColor: INDICATOR_COLORS[variant] ?? INDICATOR_COLORS.secondary,
  };
}
