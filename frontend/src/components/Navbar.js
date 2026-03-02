import React, { useState } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem,
    ListItemIcon, ListItemText, Divider, IconButton
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleLogout = () => {
        setAnchorEl(null);
        logout();
        navigate('/');
    };

    const handleProfileClick = () => {
        setAnchorEl(null);
        navigate('/student/profile');
    };

    const isActive = (path) => location.pathname === path;

    const navBtnSx = (path) => ({
        color: 'inherit',
        fontWeight: isActive(path) ? 900 : 500,
        borderBottom: isActive(path) ? '2px solid #fff' : '2px solid transparent',
        borderRadius: 0,
        px: 1.5,
        py: 0.5,
        minWidth: 'auto',
        textTransform: 'none',
        '&:hover': { borderBottom: '2px solid rgba(255,255,255,0.5)' },
    });

    return (
        <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)' }}>
            <Toolbar>
                <WorkIcon sx={{ mr: 2 }} />
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', cursor: 'pointer', mr: 4 }}
                    onClick={() => navigate('/')}
                >
                    Campus Placement Portal
                </Typography>

                {user ? (
                    <>
                        {/* Nav Links — true center */}
                        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                            {user.role === 'student' && (
                                <>
                                    <Button sx={navBtnSx('/student/dashboard')} onClick={() => navigate('/student/dashboard')}>Drives</Button>
                                    <Button sx={navBtnSx('/student/attendance')} onClick={() => navigate('/student/attendance')}>Attendance</Button>
                                    <Button sx={navBtnSx('/student/materials')} onClick={() => navigate('/student/materials')}>Materials</Button>
                                    <Button sx={navBtnSx('/student/todos')} onClick={() => navigate('/student/todos')}>To-Do</Button>
                                </>
                            )}
                        </Box>

                        {/* Right side — Avatar with dropdown */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
                                {user.name}
                            </Typography>
                            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
                                <Avatar
                                    src={user.profilePicPath ? `${API_BASE}/${user.profilePicPath}` : undefined}
                                    sx={{
                                        width: 38, height: 38,
                                        bgcolor: '#4f46e5',
                                        border: '2px solid rgba(255,255,255,0.6)',
                                        fontSize: '1rem',
                                        fontWeight: 800,
                                    }}
                                >
                                    {!user.profilePicPath && (user.name?.charAt(0)?.toUpperCase() || 'U')}
                                </Avatar>
                            </IconButton>

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                                PaperProps={{
                                    sx: {
                                        mt: 1, borderRadius: '14px', minWidth: 200,
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                                        border: '1px solid #e2e8f0',
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                {/* Profile header inside menu */}
                                <Box sx={{ px: 2, py: 1.5 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                        {user.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                        {user.email || user.rollNumber || user.facultyId}
                                    </Typography>
                                </Box>
                                <Divider />

                                {user.role === 'student' && (
                                    <MenuItem onClick={handleProfileClick} sx={{ py: 1.5 }}>
                                        <ListItemIcon><PersonIcon fontSize="small" sx={{ color: '#6366f1' }} /></ListItemIcon>
                                        <ListItemText primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}>My Profile</ListItemText>
                                    </MenuItem>
                                )}

                                <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                                    <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon>
                                    <ListItemText primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem', color: '#ef4444' }}>Logout</ListItemText>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </>
                ) : (
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
                        <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
