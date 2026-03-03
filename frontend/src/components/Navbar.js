import React, { useState, useEffect } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem,
    ListItemIcon, ListItemText, Divider, IconButton, Drawer, List,
    ListItem, ListItemButton, useTheme, useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import EventNoteIcon from '@mui/icons-material/EventNote';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AssignmentIcon from '@mui/icons-material/Assignment';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001';

/* Animated nav pill button */
const NavPill = ({ label, icon, active, onClick, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay * 0.08, duration: 0.4, type: 'spring', stiffness: 200 }}
    >
        <Button
            onClick={onClick}
            sx={{
                position: 'relative',
                color: active ? '#fff' : 'rgba(255,255,255,0.7)',
                fontWeight: active ? 800 : 600,
                px: 2.5,
                py: 1,
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '0.88rem',
                letterSpacing: '0.02em',
                overflow: 'hidden',
                transition: 'color 0.3s ease',
                '&:hover': {
                    color: '#fff',
                    backgroundColor: 'transparent',
                },
            }}
        >
            {/* Active background pill */}
            {active && (
                <motion.div
                    layoutId="navPill"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.15)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
            )}
            {/* Hover glow */}
            {!active && (
                <Box sx={{
                    position: 'absolute', inset: 0, borderRadius: '12px',
                    opacity: 0, transition: 'opacity 0.3s',
                    background: 'rgba(255,255,255,0.06)',
                    '.MuiButton-root:hover &': { opacity: 1 },
                }} />
            )}
            <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                {React.cloneElement(icon, { sx: { fontSize: 18 } })}
                {label}
            </Box>
            {/* Active bottom dot */}
            {active && (
                <motion.div
                    layoutId="navDot"
                    style={{
                        position: 'absolute',
                        bottom: 2,
                        left: '50%',
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: '#fff',
                        marginLeft: -2.5,
                        boxShadow: '0 0 8px rgba(255,255,255,0.8)',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
            )}
        </Button>
    </motion.div>
);

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

    // Scroll listener for glass effect
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

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

    const studentNavItems = [
        { label: 'Drives', path: '/student/dashboard', icon: <BusinessCenterIcon /> },
        { label: 'Attendance', path: '/student/attendance', icon: <EventNoteIcon /> },
        { label: 'Materials', path: '/student/materials', icon: <MenuBookIcon /> },
        { label: 'To-Do', path: '/student/todos', icon: <ChecklistIcon /> },
        { label: 'Assignments', path: '/student/assignments', icon: <AssignmentIcon /> },
    ];

    const facultyNavItems = [
        { label: 'Drives', path: '/faculty/dashboard', icon: <BusinessCenterIcon /> },
        { label: 'Assignments', path: '/faculty/assignments', icon: <AssignmentIcon /> },
    ];

    const navItems = user?.role === 'faculty' ? facultyNavItems : user?.role === 'student' ? studentNavItems : [];

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background: scrolled
                    ? 'rgba(15, 10, 40, 0.85)'
                    : 'linear-gradient(135deg, rgba(55, 48, 107, 0.95) 0%, rgba(88, 40, 120, 0.95) 50%, rgba(45, 35, 95, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)'}`,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.3)' : 'none',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                },
            }}
        >
            <Toolbar sx={{ py: { xs: 0.5, md: 0.8 }, px: { xs: 1.5, md: 3 } }}>
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                >
                    <Box
                        onClick={() => navigate('/')}
                        sx={{
                            display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer',
                            mr: { xs: 1, md: 3 },
                            '&:hover .logo-icon': { transform: 'rotate(-10deg) scale(1.1)' },
                            '&:hover .logo-text': { background: 'linear-gradient(135deg, #c4b5fd, #f9a8d4)', WebkitBackgroundClip: 'text' },
                        }}
                    >
                        <Avatar
                            className="logo-icon"
                            sx={{
                                width: 38, height: 38,
                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                                boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
                                transition: 'transform 0.3s ease',
                            }}
                        >
                            <WorkIcon sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Typography
                            className="logo-text"
                            sx={{
                                fontWeight: 900,
                                fontSize: { xs: '1rem', md: '1.15rem' },
                                background: 'linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.7) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                letterSpacing: '-0.01em',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {isMobile ? 'CPP' : 'Campus Placement Portal'}
                        </Typography>
                    </Box>
                </motion.div>

                {user ? (
                    <>
                        {/* Mobile: Hamburger + Animated Drawer */}
                        {isMobile && navItems.length > 0 && (
                            <>
                                <Box sx={{ flexGrow: 1 }} />
                                <motion.div whileTap={{ scale: 0.9 }}>
                                    <IconButton
                                        color="inherit"
                                        onClick={() => setDrawerOpen(true)}
                                        sx={{
                                            mr: 1,
                                            border: '1px solid rgba(255,255,255,0.15)',
                                            borderRadius: '10px',
                                            p: 0.8,
                                            '&:hover': { background: 'rgba(255,255,255,0.1)' },
                                        }}
                                    >
                                        <MenuIcon sx={{ fontSize: 22 }} />
                                    </IconButton>
                                </motion.div>
                                <Drawer
                                    anchor="left"
                                    open={drawerOpen}
                                    onClose={() => setDrawerOpen(false)}
                                    PaperProps={{
                                        sx: {
                                            width: 280,
                                            background: 'linear-gradient(180deg, #1e1145 0%, #2d1560 50%, #3b1a6e 100%)',
                                            color: '#fff',
                                            borderRight: '1px solid rgba(255,255,255,0.08)',
                                        },
                                    }}
                                >
                                    {/* Drawer Header */}
                                    <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar sx={{
                                                width: 36, height: 36,
                                                background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                                                boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
                                            }}>
                                                <WorkIcon sx={{ fontSize: 18 }} />
                                            </Avatar>
                                            <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>CPP</Typography>
                                        </Box>
                                        <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff' } }}>
                                            <CloseIcon sx={{ fontSize: 20 }} />
                                        </IconButton>
                                    </Box>
                                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />

                                    {/* Drawer Nav Items */}
                                    <List sx={{ px: 1.5, pt: 2 }}>
                                        {navItems.map((item, i) => (
                                            <motion.div
                                                key={item.path}
                                                initial={{ opacity: 0, x: -30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.06, type: 'spring', stiffness: 200 }}
                                            >
                                                <ListItem disablePadding sx={{ mb: 0.8 }}>
                                                    <ListItemButton
                                                        onClick={() => { navigate(item.path); setDrawerOpen(false); }}
                                                        sx={{
                                                            borderRadius: '14px',
                                                            py: 1.5,
                                                            bgcolor: isActive(item.path) ? 'rgba(99,102,241,0.2)' : 'transparent',
                                                            border: isActive(item.path) ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                                                            transition: 'all 0.25s ease',
                                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' },
                                                        }}
                                                    >
                                                        <ListItemIcon sx={{ color: isActive(item.path) ? '#a78bfa' : 'rgba(255,255,255,0.5)', minWidth: 40, transition: 'color 0.25s' }}>
                                                            {item.icon}
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={item.label}
                                                            primaryTypographyProps={{
                                                                fontWeight: isActive(item.path) ? 800 : 500,
                                                                fontSize: '0.95rem',
                                                                color: isActive(item.path) ? '#fff' : 'rgba(255,255,255,0.75)',
                                                            }}
                                                        />
                                                        {isActive(item.path) && (
                                                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#a78bfa', boxShadow: '0 0 8px rgba(167,139,250,0.6)' }} />
                                                        )}
                                                    </ListItemButton>
                                                </ListItem>
                                            </motion.div>
                                        ))}
                                    </List>

                                    {/* Drawer footer */}
                                    <Box sx={{ mt: 'auto', p: 2.5 }}>
                                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 2 }} />
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar
                                                src={user.profilePicPath ? `${API_BASE}/${user.profilePicPath}` : undefined}
                                                sx={{
                                                    width: 36, height: 36,
                                                    bgcolor: '#4f46e5',
                                                    border: '2px solid rgba(167,139,250,0.4)',
                                                    fontSize: '0.85rem', fontWeight: 800,
                                                }}
                                            >
                                                {!user.profilePicPath && (user.name?.charAt(0)?.toUpperCase() || 'U')}
                                            </Avatar>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }} noWrap>{user.name}</Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem' }} noWrap>{user.email || user.rollNumber || user.facultyId}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Drawer>
                            </>
                        )}

                        {/* Desktop: Animated nav pills */}
                        {!isMobile && (
                            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                {navItems.map((item, i) => (
                                    <NavPill
                                        key={item.path}
                                        label={item.label}
                                        icon={item.icon}
                                        active={isActive(item.path)}
                                        onClick={() => navigate(item.path)}
                                        delay={i}
                                    />
                                ))}
                            </Box>
                        )}

                        {/* Mobile spacer for roles without drawer */}
                        {isMobile && navItems.length === 0 && <Box sx={{ flexGrow: 1 }} />}

                        {/* Right side — Avatar with animated dropdown */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.4, type: 'spring' }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Typography variant="body2" sx={{
                                    color: 'rgba(255,255,255,0.75)', fontWeight: 600, fontSize: '0.85rem',
                                    display: { xs: 'none', sm: 'block' },
                                }}>
                                    {user.name}
                                </Typography>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.3 }}>
                                        <Box sx={{
                                            position: 'relative',
                                            borderRadius: '50%',
                                            padding: '2.5px',
                                            background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
                                            display: 'flex',
                                        }}>
                                            <Avatar
                                                src={user.profilePicPath ? `${API_BASE}/${user.profilePicPath}` : undefined}
                                                sx={{
                                                    width: 36, height: 36,
                                                    bgcolor: '#2d1560',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 800,
                                                    border: '2px solid rgba(15,10,40,0.8)',
                                                }}
                                            >
                                                {!user.profilePicPath && (user.name?.charAt(0)?.toUpperCase() || 'U')}
                                            </Avatar>
                                        </Box>
                                    </IconButton>
                                </motion.div>

                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={() => setAnchorEl(null)}
                                    PaperProps={{
                                        sx: {
                                            mt: 1.5, borderRadius: '16px', minWidth: 220,
                                            background: 'linear-gradient(180deg, #1e1145, #2a1558)',
                                            color: '#fff',
                                            boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            backdropFilter: 'blur(20px)',
                                            overflow: 'visible',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute', top: -6, right: 16,
                                                width: 12, height: 12,
                                                background: '#1e1145',
                                                transform: 'rotate(45deg)',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                                borderBottom: 'none', borderRight: 'none',
                                            },
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    {/* Profile header */}
                                    <Box sx={{ px: 2.5, py: 2 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>
                                            {user.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)' }}>
                                            {user.email || user.rollNumber || user.facultyId}
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

                                    {user.role === 'student' && (
                                        <MenuItem onClick={handleProfileClick} sx={{
                                            py: 1.5, mx: 1, my: 0.5, borderRadius: '10px',
                                            transition: 'all 0.2s',
                                            '&:hover': { bgcolor: 'rgba(99,102,241,0.15)' },
                                        }}>
                                            <ListItemIcon><PersonIcon fontSize="small" sx={{ color: '#a78bfa' }} /></ListItemIcon>
                                            <ListItemText primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>My Profile</ListItemText>
                                        </MenuItem>
                                    )}

                                    <MenuItem onClick={handleLogout} sx={{
                                        py: 1.5, mx: 1, my: 0.5, borderRadius: '10px',
                                        transition: 'all 0.2s',
                                        '&:hover': { bgcolor: 'rgba(239,68,68,0.12)' },
                                    }}>
                                        <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: '#f87171' }} /></ListItemIcon>
                                        <ListItemText primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem', color: '#f87171' }}>Logout</ListItemText>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </motion.div>
                    </>
                ) : (
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <Button
                                onClick={() => navigate('/login')}
                                sx={{
                                    color: 'rgba(255,255,255,0.85)', fontWeight: 700, textTransform: 'none',
                                    borderRadius: '10px', px: 2.5, fontSize: '0.88rem',
                                    '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.08)' },
                                }}
                            >
                                Login
                            </Button>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Button
                                onClick={() => navigate('/register')}
                                sx={{
                                    color: '#fff', fontWeight: 800, textTransform: 'none',
                                    borderRadius: '10px', px: 3, fontSize: '0.88rem',
                                    background: 'rgba(255,255,255,0.12)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(10px)',
                                    '&:hover': { background: 'rgba(255,255,255,0.2)' },
                                }}
                            >
                                Register
                            </Button>
                        </motion.div>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
