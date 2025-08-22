import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskPage from './pages/TaskPage';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';

function AppRoutes() {
  const auth = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/tasks"
        element={auth?.token ? <TaskPage /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}