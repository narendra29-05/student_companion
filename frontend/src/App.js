import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import StudentLayout from './components/StudentLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import StudentDrives from './pages/StudentDrives';
import StudentProfile from './pages/StudentProfile';
import FacultyDashboard from './pages/FacultyDashboard';
import ResourcePage from './pages/ResourcePage';
import Materials from './pages/Materials';
import TodoTracker from './pages/TodoTracker';
import FacultyAssignments from './pages/FacultyAssignments';
import StudentAssignments from './pages/StudentAssignments';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;
    return children;
};

// Conditionally render Navbar (only for faculty + public non-auth pages)
const ConditionalNavbar = () => {
    const location = useLocation();
    const hideOn = ['/', '/login', '/register'];
    // Hide navbar on all student routes (sidebar handles it)
    if (hideOn.includes(location.pathname)) return null;
    if (location.pathname.startsWith('/student')) return null;
    return <Navbar />;
};

function AppContent() {
    return (
        <Router>
            <ConditionalNavbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Student Routes — wrapped in sidebar layout */}
                <Route
                    path="/student"
                    element={
                        <ProtectedRoute allowedRole="student">
                            <StudentLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="drives" element={<StudentDrives />} />
                    <Route path="profile" element={<StudentProfile />} />
                    <Route path="assignments" element={<StudentAssignments />} />
                    <Route path="todos" element={<TodoTracker />} />
                    <Route path="materials" element={<Materials />} />
                    <Route path="attendance" element={
                        <ResourcePage
                            title="Attendance Portal"
                            description="Check your semester-wise attendance and percentage."
                            link="https://attendance.sandyy.in/"
                        />
                    } />
                </Route>

                {/* Faculty Routes */}
                <Route
                    path="/faculty/dashboard"
                    element={
                        <ProtectedRoute allowedRole="faculty">
                            <FacultyDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/faculty/assignments"
                    element={
                        <ProtectedRoute allowedRole="faculty">
                            <FacultyAssignments />
                        </ProtectedRoute>
                    }
                />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
