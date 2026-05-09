import { Routes, Route } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/shared/Footer";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Routes>
        <Route path="/" element={<><Navbar /><HomePage /><Footer /></>} />
        <Route path="/account" element={
          <ProtectedRoute>
            <Navbar /><AccountPage /><Footer />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}