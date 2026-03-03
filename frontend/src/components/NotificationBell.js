import React, { useState, useEffect, useCallback } from 'react';
import {
    IconButton, Badge, Popover, Box, Typography, List, ListItem,
    ListItemText, Button, Divider, CircularProgress
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AssignmentIcon from '@mui/icons-material/Assignment';
import UpdateIcon from '@mui/icons-material/Update';
import AlarmIcon from '@mui/icons-material/Alarm';
import CelebrationIcon from '@mui/icons-material/Celebration';
import API from '../services/api';

const typeIcons = {
    new_drive: <BusinessCenterIcon sx={{ fontSize: 20, color: '#6366f1' }} />,
    drive_updated: <UpdateIcon sx={{ fontSize: 20, color: '#f59e0b' }} />,
    deadline_reminder: <AlarmIcon sx={{ fontSize: 20, color: '#ef4444' }} />,
    assignment_created: <AssignmentIcon sx={{ fontSize: 20, color: '#10b981' }} />,
    assignment_submitted: <AssignmentIcon sx={{ fontSize: 20, color: '#3b82f6' }} />,
    welcome: <CelebrationIcon sx={{ fontSize: 20, color: '#a855f7' }} />,
};

const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

const NotificationBell = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await API.get('/notifications');
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unreadCount);
        } catch {
            // silently fail
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const handleOpen = (e) => {
        setAnchorEl(e.currentTarget);
        fetchNotifications();
    };

    const handleClose = () => setAnchorEl(null);

    const markAsRead = async (id) => {
        try {
            await API.patch(`/notifications/${id}/read`);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch {
            // silently fail
        }
    };

    const markAllRead = async () => {
        setLoading(true);
        try {
            await API.patch('/notifications/read-all');
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <IconButton onClick={handleOpen} sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#fff' } }}>
                <Badge
                    badgeContent={unreadCount}
                    max={99}
                    sx={{
                        '& .MuiBadge-badge': {
                            bgcolor: '#ef4444',
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: '0.7rem',
                            minWidth: 18,
                            height: 18,
                        },
                    }}
                >
                    <NotificationsIcon sx={{ fontSize: 22 }} />
                </Badge>
            </IconButton>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        mt: 1.5, width: 360, maxHeight: 480, borderRadius: '16px',
                        background: 'linear-gradient(180deg, #1e1145, #2a1558)',
                        color: '#fff',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.08)',
                    },
                }}
            >
                {/* Header */}
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>Notifications</Typography>
                    {unreadCount > 0 && (
                        <Button
                            size="small"
                            startIcon={loading ? <CircularProgress size={14} sx={{ color: '#a78bfa' }} /> : <DoneAllIcon />}
                            onClick={markAllRead}
                            disabled={loading}
                            sx={{
                                color: '#a78bfa', textTransform: 'none', fontWeight: 700,
                                fontSize: '0.75rem', '&:hover': { bgcolor: 'rgba(167,139,250,0.1)' },
                            }}
                        >
                            Mark all read
                        </Button>
                    )}
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

                {/* List */}
                <List sx={{ p: 0, overflowY: 'auto', maxHeight: 380 }}>
                    {notifications.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <NotificationsIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.15)', mb: 1 }} />
                            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                                No notifications yet
                            </Typography>
                        </Box>
                    ) : (
                        notifications.map((n) => (
                            <ListItem
                                key={n.id}
                                onClick={() => !n.isRead && markAsRead(n.id)}
                                sx={{
                                    cursor: n.isRead ? 'default' : 'pointer',
                                    bgcolor: n.isRead ? 'transparent' : 'rgba(99,102,241,0.08)',
                                    borderLeft: n.isRead ? 'none' : '3px solid #6366f1',
                                    transition: 'all 0.2s',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                                    py: 1.5, px: 2,
                                }}
                            >
                                <Box sx={{ mr: 1.5, mt: 0.5 }}>
                                    {typeIcons[n.type] || <NotificationsIcon sx={{ fontSize: 20, color: '#94a3b8' }} />}
                                </Box>
                                <ListItemText
                                    primary={n.title}
                                    secondary={
                                        <>
                                            <Typography component="span" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', display: 'block' }}>
                                                {n.message}
                                            </Typography>
                                            <Typography component="span" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>
                                                {timeAgo(n.createdAt)}
                                            </Typography>
                                        </>
                                    }
                                    primaryTypographyProps={{
                                        fontWeight: n.isRead ? 500 : 700,
                                        fontSize: '0.85rem',
                                        color: n.isRead ? 'rgba(255,255,255,0.6)' : '#fff',
                                    }}
                                />
                            </ListItem>
                        ))
                    )}
                </List>
            </Popover>
        </>
    );
};

export default NotificationBell;
