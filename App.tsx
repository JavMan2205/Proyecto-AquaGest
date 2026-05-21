import { RouterProvider } from 'react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
