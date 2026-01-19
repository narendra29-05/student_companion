import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import ResourcePage from './pages/ResourcePage'; // We will create this below
import Materials from './pages/Materials';
import TodoTracker from './pages/TodoTracker';// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/login" />;

    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/" />;
    }

    return children;
};

function AppContent() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Student Routes */}
                
                <Route 
                    path="/student/dashboard" 
                    element={
                        <ProtectedRoute allowedRole="student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/student/attendance" 
                    element={
                        <ProtectedRoute allowedRole="student">
                            <ResourcePage 
                                title="Attendance Portal" 
                                description="Check your semester-wise attendance and percentage."
                                link="https://attendance.sandyy.in/" 
                            />
                        </ProtectedRoute>
                    } 
                />
                

                {/* Faculty Routes */}
                <Route 
                    path="/faculty/dashboard" 
                    element={
                        <ProtectedRoute allowedRole="faculty">
                            <FacultyDashboard />
                        </ProtectedRoute>
                    } 
                />
<Route path="/student/todos" element={<TodoTracker />} />          
      <Route 
    path="/student/materials" 
    element={
        <ProtectedRoute allowedRole="student">
            <Materials />
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