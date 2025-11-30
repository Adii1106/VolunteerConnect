import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import OrganiserDashboard from "./pages/OrganiserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/volunteer"
          element={
            <ProtectedRoute role="VOLUNTEER">
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organiser"
          element={
            <ProtectedRoute role="ORGANISER">
              <OrganiserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
