import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WorkIcon from '@mui/icons-material/Work';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)' }}>
            <Toolbar>
                <WorkIcon sx={{ mr: 2 }} />
                <Typography 
                    variant="h6" 
                    sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                >
                    Campus Placement Portal
                </Typography>
                
                {user ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* Student Specific Navigation */}
                        {user.role === 'student' && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button color="inherit" onClick={() => navigate('/student/dashboard')}>Drives</Button>
                                <Button color="inherit" onClick={() => navigate('/student/attendance')}>Attendance</Button>
                                <Button color="inherit" onClick={() => navigate('/student/materials')}>Materials</Button>
                                <Button color="inherit" onClick={() => navigate('/student/todos')}>To-Do</Button>
                            </Box>
                        )}

                        <Typography variant="body1" sx={{ ml: 1 }}>
                            Hello, {user.name}
                        </Typography>
                        
                        <Button color="inherit" variant="outlined" onClick={handleLogout} sx={{ borderColor: 'white' }}>
                            Logout
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <Button color="inherit" onClick={() => navigate('/login')}>
                            Login
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/register')}>
                            Register
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;