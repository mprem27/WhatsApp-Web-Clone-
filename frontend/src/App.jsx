import "./App.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";

import AuthPage from "./pages/AuthPage";
import ProfileSetup from "./pages/ProfileSetup";

import { getStoredUser, getToken } from "./services/authService";

function isProfileCompleted(user) {
  return Boolean(user?.username && user?.fullName);
}

function ProfileSetupLayout() {
  const navigate = useNavigate();

  const handleProfileComplete = () => {
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-orange-100">
      <Navbar />

      <main className="min-h-screen pt-12">
        <ProfileSetup onProfileComplete={handleProfileComplete} />
      </main>
    </div>
  );
}

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-orange-100">
      <Navbar />
      <Sidebar activePage="chats" onNavigate={() => {}} />

      <main className="min-h-screen pl-16 pt-12">
        <Dashboard />
      </main>
    </div>
  );
}

function AuthRoute() {
  const navigate = useNavigate();
  const token = getToken();
  const user = getStoredUser();

  if (token && isProfileCompleted(user)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (token && !isProfileCompleted(user)) {
    return <Navigate to="/profile-setup" replace />;
  }

  const handleAuthSuccess = (data) => {
    if (data.profileSetupRequired || !isProfileCompleted(data.user)) {
      navigate("/profile-setup", { replace: true });
      return;
    }

    navigate("/dashboard", { replace: true });
  };

  return <AuthPage onAuthSuccess={handleAuthSuccess} />;
}

function ProtectedProfileRoute() {
  const token = getToken();
  const user = getStoredUser();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (isProfileCompleted(user)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <ProfileSetupLayout />;
}

function ProtectedDashboardRoute() {
  const token = getToken();
  const user = getStoredUser();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!isProfileCompleted(user)) {
    return <Navigate to="/profile-setup" replace />;
  }

  return <DashboardLayout />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthRoute />} />
      <Route path="/profile-setup" element={<ProtectedProfileRoute />} />
      <Route path="/dashboard" element={<ProtectedDashboardRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
