import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import  Auth  from "./pages/Auth";
import  ForgotPasswordPage  from "./pages/ForgotPasswordPage";
import { DonationsPage } from "./pages/DonationsPage";
import { CreateDonationPage } from "./pages/CreateDonationPage";
import { MapPage } from "./pages/MapPage";
import LeaderboardPage  from "./pages/LeaderboardPage";
import { DonorDashboard } from "./pages/dashboard/DonorDashboard";
import { NGODashboard } from "./pages/dashboard/NGODashboard";
import { VolunteerDashboard } from "./pages/dashboard/VolunteerDashboard";
import { AdminDashboard } from "./pages/dashboard/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
      
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        {/* <Route path="/donations" element={<DonationsPage />} /> */}
        {/* <Route path="/create-donation" element={<CreateDonationPage />} /> */}
        {/* <Route path="/map" element={<MapPage />} /> */}
        {/* <Route path="/leaderboard" element={<LeaderboardPage />} /> */}
        {/* <Route path="/dashboard/donor" element={<DonorDashboard />} /> */}
        {/* <Route path="/dashboard/ngo" element={<NGODashboard />} /> */}
        {/* <Route path="/dashboard/volunteer" element={<VolunteerDashboard />} /> */}
        {/* <Route path="/dashboard/admin" element={<AdminDashboard />} /> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
