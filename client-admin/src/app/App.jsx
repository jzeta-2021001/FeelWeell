import { Toaster } from 'react-hot-toast';
import { AppRoutes } from './routes/AppRoutes';

export const App = () => {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: 'inherit',
            fontWeight: '600',
            fontSize: '0.9rem',
            borderRadius: '12px',
          },
        }}
      />
      <AppRoutes />
    </>
  );
};