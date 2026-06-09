import { toast } from 'react-hot-toast';

const baseStyle = {
  borderRadius: '999px',
  fontWeight: 700,
  fontFamily: 'inherit',
  fontSize: '0.9rem',
  padding: '12px 24px',
  boxShadow: '0 4px 20px rgba(127,131,230,0.25)',
};

export const showSuccess = (message) =>
  toast.success(message, {
    style: {
      ...baseStyle,
      background: 'linear-gradient(90deg, #8b8ff4 0%, #6366f1 100%)',
      color: '#fff',
    },
    iconTheme: { primary: '#fff', secondary: '#8b8ff4' },
  });

export const showError = (message) =>
  toast.error(message, {
    style: {
      ...baseStyle,
      background: 'linear-gradient(90deg, #ef4444 0%, #b91c1c 100%)',
      color: '#fff',
    },
    iconTheme: { primary: '#fff', secondary: '#ef4444' },
  });

export const showInfo = (message) =>
  toast(message, {
    style: {
      ...baseStyle,
      background: 'linear-gradient(90deg, #bfc3fb 0%, #9095e8 100%)',
      color: '#fff',
    },
  });
