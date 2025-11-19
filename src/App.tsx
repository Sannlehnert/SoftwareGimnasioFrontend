import { AuthProvider } from './context/AuthProvider';
import { ToastProvider } from './context/ToastProvider';
import Router from './Router';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
