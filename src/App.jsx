import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminDashboard from "./admin/AdminDashboard/AdminDashboard";
import AdminLogin from "./admin/AdminLogin/AdminLogin";

import StudentList from "./admin/StudentList/StudentList";
import StudentDetails from "./admin/StudentDetails/StudentDetails";
import StudentProgressScreen from "./admin/StudentProgressScreen/StudentProgressScreen";
import StudentProfile from "./StudentProfile/StudentProfile.jsx";

import AdminModules from "./admin/AdminModules/AdminModules";
import AdminPeerFeedback from "./admin/AdminPeerFeedback/AdminPeerFeedback";
import AdminAnnouncements from "./admin/AdminAnnouncements/AdminAnnouncements";
import AdminSettings from "./admin/AdminSettings/AdminSettings";
import ModuleViewer from "./admin/AdminModules/ModuleViewer";

import AdminGame from "./admin/AdminGame/AdminGame";
import GameRecords from "./admin/AdminGame/GameRecords"; // ✅ FIXED PATH

// -------- PROTECTED ROUTE --------
function ProtectedRoute({ children }) {
  const loggedIn = localStorage.getItem("admin_logged_in") === "true";
  return loggedIn ? children : <Navigate to="/login" replace />;
}

// -------- BLOCK LOGIN IF LOGGED IN --------
function PublicOnlyRoute({ children }) {
  const loggedIn = localStorage.getItem("admin_logged_in") === "true";
  return loggedIn ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* -------- LOGIN -------- */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <AdminLogin />
            </PublicOnlyRoute>
          }
        />

        {/* -------- DASHBOARD -------- */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* -------- STUDENTS -------- */}
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <StudentList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/students/:id"
          element={
            <ProtectedRoute>
              <StudentDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress/:id"
          element={
            <ProtectedRoute>
              <StudentProgressScreen />
            </ProtectedRoute>
          }
        />

        <Route
          path="/studentprofile"
          element={
            <ProtectedRoute>
              <StudentProfile />
            </ProtectedRoute>
          }
        />

        {/* -------- ADMIN MODULES -------- */}
        <Route
          path="/admin-modules"
          element={
            <ProtectedRoute>
              <AdminModules />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-modules/:id"
          element={
            <ProtectedRoute>
              <ModuleViewer />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN GAMES (FIXED) ================= */}
        <Route
          path="/admin-games"
          element={
            <ProtectedRoute>
              <AdminGame />
            </ProtectedRoute>
          }
        >
          {/* 🔽 NESTED ROUTE (THIS FIXES EMPTY PAGE) */}
          <Route
            path="records/:gameType"
            element={<GameRecords />}
          />
        </Route>

        {/* -------- ADMIN PEER FEEDBACK -------- */}
        <Route
          path="/admin-peerfeedback"
          element={
            <ProtectedRoute>
              <AdminPeerFeedback />
            </ProtectedRoute>
          }
        />

        {/* -------- ADMIN ANNOUNCEMENTS -------- */}
        <Route
          path="/admin-announcements"
          element={
            <ProtectedRoute>
              <AdminAnnouncements />
            </ProtectedRoute>
          }
        />

        {/* -------- ADMIN SETTINGS -------- */}
        <Route
          path="/admin-settings"
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
