import React, { useState } from 'react';
import {
    Box, Typography, Avatar, IconButton, Drawer, List, ListItem,
    ListItemButton, ListItemIcon, ListItemText, Divider, Chip,
    useMediaQuery, useTheme, Tooltip
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SchoolIcon from '@mui/icons-material/School';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001';
const resolveUrl = (path) => {
    if (!path) return undefined;
    return path.startsWith('http') ? path : `${API_BASE}/${path}`;
};

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED = 72;

const navItems = [
    { label: 'Dashboard', path: '/student/dashboard', icon: <DashboardRoundedIcon />, color: '#0ea5e9' },
    { label: 'Drives', path: '/student/drives', icon: <BusinessCenterIcon />, color: '#6366f1' },
    { label: 'Assignments', path: '/student/assignments', icon: <AssignmentIcon />, color: '#ec4899' },
    { label: 'To-Do', path: '/student/todos', icon: <ChecklistRtlIcon />, color: '#10b981' },
    { label: 'Materials', path: '/student/materials', icon: <MenuBookIcon />, color: '#f59e0b' },
    { label: 'Attendance', path: '/student/attendance', icon: <EventNoteIcon />, color: '#8b5cf6' },
];

const bottomItems = [
    { label: 'Profile', path: '/student/profile', icon: <PersonIcon />, color: '#64748b' },
];

const StudentLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const isActive = (path) => location.pathname === path;
    const sidebarW = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleNav = (path) => {
        navigate(path);
        if (isMobile) setDrawerOpen(false);
    };

    /* ─── Sidebar Content ─── */
    const SidebarContent = ({ mobile = false }) => (
        <Box sx={{
            display: 'flex', flexDirection: 'column', height: '100%',
            background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
            color: '#fff',
        }}>
            {/* Logo */}
            <Box sx={{
                px: collapsed && !mobile ? 1.5 : 2.5, py: 2.5,
                display: 'flex', alignItems: 'center',
                justifyContent: collapsed && !mobile ? 'center' : 'space-between',
            }}>
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    cursor: 'pointer',
                    overflow: 'hidden',
                }}
                    onClick={() => navigate('/student/dashboard')}
                >
                    <Avatar sx={{
                        width: 36, height: 36, flexShrink: 0,
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                        boxShadow: '0 4px 14px rgba(14,165,233,0.4)',
                    }}>
                        <SchoolIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                    {(!collapsed || mobile) && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Typography sx={{ fontWeight: 900, fontSize: '1.05rem', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                                Student<span style={{ color: '#38bdf8' }}>Companion</span>
                            </Typography>
                        </motion.div>
                    )}
                </Box>
                {mobile ? (
                    <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        <CloseRoundedIcon />
                    </IconButton>
                ) : !collapsed ? (
                    <IconButton onClick={() => setCollapsed(true)} sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#fff' } }}>
                        <KeyboardDoubleArrowLeftIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                ) : null}
            </Box>

            {!mobile && collapsed && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <IconButton onClick={() => setCollapsed(false)} sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#fff' } }}>
                        <KeyboardDoubleArrowRightIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Box>
            )}

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: collapsed && !mobile ? 1 : 2 }} />

            {/* Nav Items */}
            <List sx={{ px: collapsed && !mobile ? 0.8 : 1.5, pt: 2, flex: 1 }}>
                {(!collapsed || mobile) && (
                    <Typography sx={{ px: 1.5, mb: 1, fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                        Menu
                    </Typography>
                )}
                {navItems.map((item, i) => {
                    const active = isActive(item.path);
                    const btn = (
                        <ListItem disablePadding sx={{ mb: 0.5 }} key={item.path}>
                            <ListItemButton
                                onClick={() => handleNav(item.path)}
                                sx={{
                                    borderRadius: '12px',
                                    py: 1.2,
                                    px: collapsed && !mobile ? 1.5 : 2,
                                    justifyContent: collapsed && !mobile ? 'center' : 'flex-start',
                                    bgcolor: active ? `${item.color}18` : 'transparent',
                                    border: active ? `1px solid ${item.color}30` : '1px solid transparent',
                                    transition: 'all 0.2s',
                                    '&:hover': { bgcolor: active ? `${item.color}22` : 'rgba(255,255,255,0.04)' },
                                }}
                            >
                                <ListItemIcon sx={{
                                    color: active ? item.color : 'rgba(255,255,255,0.4)',
                                    minWidth: collapsed && !mobile ? 'auto' : 38,
                                    transition: 'color 0.2s',
                                }}>
                                    {React.cloneElement(item.icon, { sx: { fontSize: 22 } })}
                                </ListItemIcon>
                                {(!collapsed || mobile) && (
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontWeight: active ? 700 : 500,
                                            fontSize: '0.88rem',
                                            color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                                        }}
                                    />
                                )}
                                {active && (!collapsed || mobile) && (
                                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: item.color, boxShadow: `0 0 10px ${item.color}` }} />
                                )}
                            </ListItemButton>
                        </ListItem>
                    );
                    return collapsed && !mobile ? (
                        <Tooltip key={item.path} title={item.label} placement="right" arrow>{btn}</Tooltip>
                    ) : btn;
                })}
            </List>

            {/* Bottom section */}
            <Box sx={{ px: collapsed && !mobile ? 0.8 : 1.5, pb: 1.5 }}>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 1.5, mx: collapsed && !mobile ? 0 : 0.5 }} />
                {bottomItems.map((item) => {
                    const active = isActive(item.path);
                    const btn = (
                        <ListItem disablePadding sx={{ mb: 0.5 }} key={item.path}>
                            <ListItemButton
                                onClick={() => handleNav(item.path)}
                                sx={{
                                    borderRadius: '12px', py: 1.2,
                                    px: collapsed && !mobile ? 1.5 : 2,
                                    justifyContent: collapsed && !mobile ? 'center' : 'flex-start',
                                    bgcolor: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
                                }}
                            >
                                <ListItemIcon sx={{ color: active ? '#fff' : 'rgba(255,255,255,0.4)', minWidth: collapsed && !mobile ? 'auto' : 38 }}>
                                    {React.cloneElement(item.icon, { sx: { fontSize: 22 } })}
                                </ListItemIcon>
                                {(!collapsed || mobile) && (
                                    <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: active ? 700 : 500, fontSize: '0.88rem', color: active ? '#fff' : 'rgba(255,255,255,0.65)' }} />
                                )}
                            </ListItemButton>
                        </ListItem>
                    );
                    return collapsed && !mobile ? (
                        <Tooltip key={item.path} title={item.label} placement="right" arrow>{btn}</Tooltip>
                    ) : btn;
                })}

                {/* Logout */}
                {(() => {
                    const btn = (
                        <ListItem disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={handleLogout}
                                sx={{
                                    borderRadius: '12px', py: 1.2,
                                    px: collapsed && !mobile ? 1.5 : 2,
                                    justifyContent: collapsed && !mobile ? 'center' : 'flex-start',
                                    '&:hover': { bgcolor: 'rgba(239,68,68,0.08)' },
                                }}
                            >
                                <ListItemIcon sx={{ color: '#f87171', minWidth: collapsed && !mobile ? 'auto' : 38 }}>
                                    <LogoutIcon sx={{ fontSize: 22 }} />
                                </ListItemIcon>
                                {(!collapsed || mobile) && (
                                    <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.88rem', color: '#f87171' }} />
                                )}
                            </ListItemButton>
                        </ListItem>
                    );
                    return collapsed && !mobile ? <Tooltip title="Logout" placement="right" arrow>{btn}</Tooltip> : btn;
                })()}

                {/* User card */}
                {(!collapsed || mobile) && (
                    <Box sx={{
                        p: 1.5, borderRadius: '14px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex', alignItems: 'center', gap: 1.5,
                    }}>
                        <Avatar
                            src={resolveUrl(user?.profilePicPath)}
                            sx={{ width: 36, height: 36, bgcolor: '#6366f1', fontSize: '0.85rem', fontWeight: 800, border: '2px solid rgba(255,255,255,0.1)' }}
                        >
                            {!user?.profilePicPath && (user?.name?.charAt(0)?.toUpperCase() || 'S')}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#fff' }} noWrap>{user?.name}</Typography>
                            <Typography sx={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }} noWrap>{user?.rollNumber || user?.email}</Typography>
                        </Box>
                    </Box>
                )}
                {collapsed && !mobile && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title={user?.name} placement="right" arrow>
                            <Avatar
                                src={resolveUrl(user?.profilePicPath)}
                                sx={{ width: 36, height: 36, bgcolor: '#6366f1', fontSize: '0.85rem', fontWeight: 800, border: '2px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                                onClick={() => handleNav('/student/profile')}
                            >
                                {!user?.profilePicPath && (user?.name?.charAt(0)?.toUpperCase() || 'S')}
                            </Avatar>
                        </Tooltip>
                    </Box>
                )}
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
            {/* Desktop Sidebar */}
            {!isMobile && (
                <Box sx={{
                    width: sidebarW, flexShrink: 0,
                    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
                    boxShadow: '4px 0 24px rgba(0,0,0,0.08)',
                }}>
                    <SidebarContent />
                </Box>
            )}

            {/* Mobile Drawer */}
            {isMobile && (
                <Drawer
                    open={drawerOpen} onClose={() => setDrawerOpen(false)}
                    PaperProps={{ sx: { width: 280, border: 'none' } }}
                >
                    <SidebarContent mobile />
                </Drawer>
            )}

            {/* Main Content */}
            <Box sx={{
                flex: 1,
                ml: { xs: 0, md: `${sidebarW}px` },
                transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex', flexDirection: 'column',
                minHeight: '100vh',
            }}>
                {/* Top Bar */}
                <Box sx={{
                    position: 'sticky', top: 0, zIndex: 50,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    px: { xs: 2, sm: 3 }, py: 1.5,
                    background: 'rgba(241,245,249,0.85)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid #e2e8f0',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {isMobile && (
                            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#334155' }}>
                                <MenuRoundedIcon />
                            </IconButton>
                        )}
                        <Typography sx={{ fontWeight: 800, fontSize: { xs: '1rem', sm: '1.15rem' }, color: '#0f172a' }}>
                            {navItems.find(n => isActive(n.path))?.label
                                || bottomItems.find(n => isActive(n.path))?.label
                                || 'Dashboard'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <NotificationBell />
                        <Avatar
                            src={resolveUrl(user?.profilePicPath)}
                            onClick={() => handleNav('/student/profile')}
                            sx={{
                                width: 34, height: 34, bgcolor: '#6366f1', cursor: 'pointer',
                                fontSize: '0.85rem', fontWeight: 800,
                                border: '2px solid #e2e8f0',
                                transition: 'border-color 0.2s',
                                '&:hover': { borderColor: '#6366f1' },
                            }}
                        >
                            {!user?.profilePicPath && (user?.name?.charAt(0)?.toUpperCase() || 'S')}
                        </Avatar>
                    </Box>
                </Box>

                {/* Page Content */}
                <Box sx={{ flex: 1, p: { xs: 2, sm: 3 } }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default StudentLayout;
