import React, { useState, useEffect, useMemo } from 'react';
import {
    Typography, Grid, Box, CircularProgress, Avatar, Paper, Chip,
    Stack, Button, LinearProgress
} from '@mui/material';
import {
    WorkOutline, Assignment, ChecklistRtl,
    MenuBook, EventNote, Person,
    CheckCircle, Star, CalendarToday,
    Schedule, EmojiEvents, Bolt,
    RadioButtonUnchecked, FiberManualRecord,
    ArrowForward, AccessTime
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const fadeUp = (delay = 0) => ({
    initial: { y: 16, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] },
});

const StudentDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [drives, setDrives] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [todos, setTodos] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAll = async () => {
            const results = await Promise.allSettled([
                API.get('/drives/student'),
                API.get('/assignments/student'),
                API.get('/todos'),
            ]);
            if (results[0].status === 'fulfilled') setDrives(results[0].value.data.drives || []);
            if (results[1].status === 'fulfilled') setAssignments(results[1].value.data.assignments || []);
            if (results[2].status === 'fulfilled') setTodos(results[2].value.data.todos || []);
            setLoading(false);
        };
        fetchAll();
    }, []);

    const stats = useMemo(() => ({
        totalDrives: drives.length,
        eligibleDrives: drives.filter(d => d.isEligible).length,
        appliedDrives: drives.filter(d => d.applicationStatus === 'applied').length,
        totalAssignments: assignments.length,
        submittedAssignments: assignments.filter(a => a.submission).length,
        pendingAssignments: assignments.filter(a => !a.submission && !a.isPastDeadline).length,
        overdueAssignments: assignments.filter(a => !a.submission && a.isPastDeadline).length,
        totalTodos: todos.length,
        completedTodos: todos.filter(t => t.isCompleted).length,
        pendingTodos: todos.filter(t => !t.isCompleted).length,
    }), [drives, assignments, todos]);

    const upcomingAssignments = useMemo(() =>
        assignments
            .filter(a => !a.submission && !a.isPastDeadline)
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
            .slice(0, 4),
        [assignments]);

    const recentDrives = useMemo(() =>
        drives
            .filter(d => d.isEligible)
            .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
            .slice(0, 4),
        [drives]);

    const pendingTodosList = useMemo(() =>
        todos.filter(t => !t.isCompleted).slice(0, 5),
        [todos]);

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good Morning';
        if (h < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const formatDeadline = (date) => {
        const diff = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
        if (diff <= 0) return { text: 'Overdue', color: '#ef4444', urgent: true };
        if (diff === 1) return { text: 'Tomorrow', color: '#f59e0b', urgent: true };
        if (diff <= 3) return { text: `${diff} days left`, color: '#f59e0b', urgent: false };
        if (diff <= 7) return { text: `${diff} days left`, color: '#0ea5e9', urgent: false };
        return { text: `${diff} days left`, color: '#10b981', urgent: false };
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 2 }}>
                <CircularProgress size={40} thickness={4} sx={{ color: '#6366f1' }} />
                <Typography sx={{ color: '#94a3b8', fontWeight: 500, fontSize: '0.9rem' }}>Loading dashboard...</Typography>
            </Box>
        );
    }

    const quickActions = [
        { icon: <WorkOutline />, label: 'Drives', path: '/student/drives', color: '#6366f1', bg: '#eef2ff', count: stats.eligibleDrives, sub: 'eligible' },
        { icon: <Assignment />, label: 'Assignments', path: '/student/assignments', color: '#ec4899', bg: '#fdf2f8', count: stats.pendingAssignments, sub: 'pending' },
        { icon: <ChecklistRtl />, label: 'To-Do', path: '/student/todos', color: '#10b981', bg: '#ecfdf5', count: stats.pendingTodos, sub: 'pending' },
        { icon: <MenuBook />, label: 'Materials', path: '/student/materials', color: '#f59e0b', bg: '#fffbeb' },
        { icon: <EventNote />, label: 'Attendance', path: '/student/attendance', color: '#8b5cf6', bg: '#f5f3ff' },
        { icon: <Person />, label: 'Profile', path: '/student/profile', color: '#0ea5e9', bg: '#f0f9ff' },
    ];

    const statCards = [
        {
            label: 'Drives Applied', value: stats.appliedDrives, total: stats.totalDrives,
            icon: <WorkOutline />, color: '#6366f1', bg: '#eef2ff',
        },
        {
            label: 'Assignments Done', value: stats.submittedAssignments, total: stats.totalAssignments,
            icon: <Assignment />, color: '#ec4899', bg: '#fdf2f8',
        },
        {
            label: 'Tasks Complete', value: stats.completedTodos, total: stats.totalTodos,
            icon: <ChecklistRtl />, color: '#10b981', bg: '#ecfdf5',
        },
        {
            label: 'Eligible Drives', value: stats.eligibleDrives, total: stats.totalDrives,
            icon: <EmojiEvents />, color: '#f59e0b', bg: '#fffbeb',
        },
    ];

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto' }}>

            {/* ── Hero Section ── */}
            <motion.div {...fadeUp(0)}>
                <Paper
                    elevation={0}
                    sx={{
                        mb: 3, p: { xs: 2.5, sm: 3 },
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        background: '#fff',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Subtle accent stripe */}
                    <Box sx={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                        background: 'linear-gradient(90deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)',
                    }} />

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500, mb: 0.25 }}>
                                {getGreeting()}
                            </Typography>
                            <Typography sx={{
                                fontWeight: 700, fontSize: { xs: '1.4rem', sm: '1.6rem' },
                                color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2,
                            }}>
                                {user?.name?.split(' ')[0] || 'Student'}
                            </Typography>
                            <Typography sx={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 400, mt: 0.5 }}>
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                            </Typography>
                        </Box>

                        {/* Alert pills */}
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5, mt: { xs: 0, sm: 0.5 } }}>
                            {stats.overdueAssignments > 0 && (
                                <Chip
                                    icon={<Schedule sx={{ fontSize: 14 }} />}
                                    label={`${stats.overdueAssignments} overdue`}
                                    size="small"
                                    sx={{
                                        bgcolor: '#fef2f2', color: '#ef4444', fontWeight: 600,
                                        fontSize: '0.75rem', border: '1px solid #fecaca',
                                        '& .MuiChip-icon': { color: '#ef4444' },
                                    }}
                                />
                            )}
                            {stats.pendingAssignments > 0 && (
                                <Chip
                                    icon={<Assignment sx={{ fontSize: 14 }} />}
                                    label={`${stats.pendingAssignments} pending`}
                                    size="small"
                                    sx={{
                                        bgcolor: '#fffbeb', color: '#d97706', fontWeight: 600,
                                        fontSize: '0.75rem', border: '1px solid #fde68a',
                                        '& .MuiChip-icon': { color: '#d97706' },
                                    }}
                                />
                            )}
                            {stats.eligibleDrives > 0 && (
                                <Chip
                                    icon={<WorkOutline sx={{ fontSize: 14 }} />}
                                    label={`${stats.eligibleDrives} drives open`}
                                    size="small"
                                    sx={{
                                        bgcolor: '#eef2ff', color: '#6366f1', fontWeight: 600,
                                        fontSize: '0.75rem', border: '1px solid #c7d2fe',
                                        '& .MuiChip-icon': { color: '#6366f1' },
                                    }}
                                />
                            )}
                        </Stack>
                    </Box>
                </Paper>
            </motion.div>

            {/* ── Profile Completion Alert ── */}
            {user?.profileCompleted === false && (
                <motion.div {...fadeUp(0.08)}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2, mb: 3, borderRadius: '14px',
                            bgcolor: '#fffbeb', border: '1px solid #fde68a',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            flexWrap: 'wrap', gap: 1.5,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{
                                width: 36, height: 36, borderRadius: '10px',
                                bgcolor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Bolt sx={{ color: '#f59e0b', fontSize: 20 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: '#92400e' }}>Complete your profile</Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: '#a16207' }}>Add CGPA and resume to unlock placement drives</Typography>
                            </Box>
                        </Box>
                        <Button
                            size="small"
                            onClick={() => navigate('/student/profile')}
                            sx={{
                                borderRadius: '8px', fontWeight: 600, textTransform: 'none', px: 2,
                                bgcolor: '#f59e0b', color: '#fff', fontSize: '0.82rem',
                                '&:hover': { bgcolor: '#d97706' },
                            }}
                        >
                            Complete Now
                        </Button>
                    </Paper>
                </motion.div>
            )}

            {/* ── Stat Cards ── */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {statCards.map((s, i) => {
                    const pct = s.total > 0 ? Math.round((s.value / s.total) * 100) : 0;
                    return (
                        <Grid size={{ xs: 6, md: 3 }} key={i}>
                            <motion.div {...fadeUp(0.06 + i * 0.04)}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2.5, borderRadius: '14px',
                                        border: '1px solid #e2e8f0', bgcolor: '#fff',
                                        transition: 'all 0.2s ease',
                                        '&:hover': { borderColor: `${s.color}40`, boxShadow: `0 4px 16px ${s.color}10` },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                        <Box sx={{
                                            width: 38, height: 38, borderRadius: '10px',
                                            bgcolor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            {React.cloneElement(s.icon, { sx: { color: s.color, fontSize: 20 } })}
                                        </Box>
                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8' }}>
                                            {pct}%
                                        </Typography>
                                    </Box>

                                    <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', color: '#0f172a', lineHeight: 1 }}>
                                        {s.value}
                                        <Typography component="span" sx={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>
                                            /{s.total}
                                        </Typography>
                                    </Typography>

                                    <Typography sx={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, mt: 0.5, mb: 1.5 }}>
                                        {s.label}
                                    </Typography>

                                    <LinearProgress
                                        variant="determinate"
                                        value={pct}
                                        sx={{
                                            height: 4, borderRadius: 2,
                                            bgcolor: `${s.color}12`,
                                            '& .MuiLinearProgress-bar': {
                                                borderRadius: 2, bgcolor: s.color,
                                            },
                                        }}
                                    />
                                </Paper>
                            </motion.div>
                        </Grid>
                    );
                })}
            </Grid>

            {/* ── Quick Actions ── */}
            <motion.div {...fadeUp(0.2)}>
                <Box sx={{ mb: 3 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a', mb: 1.5 }}>
                        Quick Actions
                    </Typography>
                    <Grid container spacing={1.5}>
                        {quickActions.map((a, i) => (
                            <Grid size={{ xs: 4, sm: 2 }} key={i}>
                                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                                    <Paper
                                        elevation={0}
                                        onClick={() => navigate(a.path)}
                                        sx={{
                                            p: { xs: 1.5, sm: 2 }, borderRadius: '12px',
                                            border: '1px solid #e2e8f0', bgcolor: '#fff',
                                            textAlign: 'center', cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: `${a.color}40`,
                                                bgcolor: a.bg,
                                            },
                                        }}
                                    >
                                        <Box sx={{
                                            width: 42, height: 42, mx: 'auto', mb: 1,
                                            borderRadius: '10px', bgcolor: a.bg,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            {React.cloneElement(a.icon, { sx: { color: a.color, fontSize: 22 } })}
                                        </Box>
                                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>
                                            {a.label}
                                        </Typography>
                                        {a.count !== undefined && a.count > 0 && (
                                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 500, color: '#94a3b8', mt: 0.25 }}>
                                                {a.count} {a.sub}
                                            </Typography>
                                        )}
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </motion.div>

            {/* ── Two Column: Assignments + Drives ── */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>

                {/* Upcoming Assignments */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <motion.div {...fadeUp(0.25)}>
                        <Paper elevation={0} sx={{ borderRadius: '14px', border: '1px solid #e2e8f0', bgcolor: '#fff', height: '100%' }}>
                            <Box sx={{
                                px: 2.5, py: 1.75,
                                borderBottom: '1px solid #f1f5f9',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box sx={{
                                        width: 32, height: 32, borderRadius: '8px', bgcolor: '#fdf2f8',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Assignment sx={{ fontSize: 18, color: '#ec4899' }} />
                                    </Box>
                                    <Typography sx={{ fontWeight: 600, fontSize: '0.92rem', color: '#0f172a' }}>
                                        Upcoming Assignments
                                    </Typography>
                                </Box>
                                <Button
                                    size="small"
                                    endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
                                    onClick={() => navigate('/student/assignments')}
                                    sx={{
                                        textTransform: 'none', fontWeight: 600, fontSize: '0.78rem',
                                        color: '#ec4899', borderRadius: '8px', minWidth: 'auto', px: 1,
                                    }}
                                >
                                    View all
                                </Button>
                            </Box>

                            <Box sx={{ p: 2 }}>
                                {upcomingAssignments.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <CheckCircle sx={{ fontSize: 36, mb: 1, color: '#d1fae5' }} />
                                        <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#64748b' }}>All caught up!</Typography>
                                        <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mt: 0.25 }}>No pending assignments</Typography>
                                    </Box>
                                ) : (
                                    <Stack spacing={0.75}>
                                        {upcomingAssignments.map((a, i) => {
                                            const dl = formatDeadline(a.deadline);
                                            return (
                                                <motion.div key={a.id || i} {...fadeUp(0.3 + i * 0.04)}>
                                                    <Box
                                                        onClick={() => navigate('/student/assignments')}
                                                        sx={{
                                                            p: 1.5, borderRadius: '10px',
                                                            border: '1px solid #f1f5f9',
                                                            display: 'flex', alignItems: 'center', gap: 1.5,
                                                            cursor: 'pointer',
                                                            transition: 'all 0.15s ease',
                                                            '&:hover': { bgcolor: '#fafafa', borderColor: '#e2e8f0' },
                                                        }}
                                                    >
                                                        <Box sx={{
                                                            width: 3, height: 32, borderRadius: 2,
                                                            bgcolor: dl.color, flexShrink: 0,
                                                        }} />
                                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                                            <Typography sx={{ fontWeight: 600, fontSize: '0.84rem', color: '#0f172a' }} noWrap>
                                                                {a.title}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                                                                <AccessTime sx={{ fontSize: 12, color: '#94a3b8' }} />
                                                                <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                                                    {formatDate(a.deadline)}
                                                                </Typography>
                                                                <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#d1d5db' }} />
                                                                <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                                                    {a.faculty?.name || 'Faculty'}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        <Chip
                                                            label={dl.text}
                                                            size="small"
                                                            sx={{
                                                                height: 22, fontSize: '0.65rem', fontWeight: 600,
                                                                bgcolor: `${dl.color}10`, color: dl.color,
                                                                border: `1px solid ${dl.color}20`,
                                                                flexShrink: 0,
                                                            }}
                                                        />
                                                    </Box>
                                                </motion.div>
                                            );
                                        })}
                                    </Stack>
                                )}
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>

                {/* Eligible Drives */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <motion.div {...fadeUp(0.3)}>
                        <Paper elevation={0} sx={{ borderRadius: '14px', border: '1px solid #e2e8f0', bgcolor: '#fff', height: '100%' }}>
                            <Box sx={{
                                px: 2.5, py: 1.75,
                                borderBottom: '1px solid #f1f5f9',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box sx={{
                                        width: 32, height: 32, borderRadius: '8px', bgcolor: '#eef2ff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <WorkOutline sx={{ fontSize: 18, color: '#6366f1' }} />
                                    </Box>
                                    <Typography sx={{ fontWeight: 600, fontSize: '0.92rem', color: '#0f172a' }}>
                                        Eligible Drives
                                    </Typography>
                                </Box>
                                <Button
                                    size="small"
                                    endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
                                    onClick={() => navigate('/student/drives')}
                                    sx={{
                                        textTransform: 'none', fontWeight: 600, fontSize: '0.78rem',
                                        color: '#6366f1', borderRadius: '8px', minWidth: 'auto', px: 1,
                                    }}
                                >
                                    View all
                                </Button>
                            </Box>

                            <Box sx={{ p: 2 }}>
                                {recentDrives.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <WorkOutline sx={{ fontSize: 36, mb: 1, color: '#e0e7ff' }} />
                                        <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#64748b' }}>No open drives</Typography>
                                        <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mt: 0.25 }}>Check back later for opportunities</Typography>
                                    </Box>
                                ) : (
                                    <Stack spacing={0.75}>
                                        {recentDrives.map((d, i) => {
                                            const dl = formatDeadline(d.expiryDate);
                                            return (
                                                <motion.div key={d.id || i} {...fadeUp(0.35 + i * 0.04)}>
                                                    <Box
                                                        onClick={() => navigate('/student/drives')}
                                                        sx={{
                                                            p: 1.5, borderRadius: '10px',
                                                            border: '1px solid #f1f5f9',
                                                            display: 'flex', alignItems: 'center', gap: 1.5,
                                                            cursor: 'pointer',
                                                            transition: 'all 0.15s ease',
                                                            '&:hover': { bgcolor: '#fafafa', borderColor: '#e2e8f0' },
                                                        }}
                                                    >
                                                        <Avatar sx={{
                                                            width: 36, height: 36, borderRadius: '8px',
                                                            bgcolor: '#eef2ff', color: '#6366f1',
                                                            fontWeight: 700, fontSize: '0.85rem',
                                                        }}>
                                                            {d.companyName?.charAt(0)?.toUpperCase() || 'C'}
                                                        </Avatar>
                                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                                            <Typography sx={{ fontWeight: 600, fontSize: '0.84rem', color: '#0f172a' }} noWrap>
                                                                {d.companyName}
                                                            </Typography>
                                                            <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8' }} noWrap>
                                                                {d.role}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                                                            {d.package && (
                                                                <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#10b981', lineHeight: 1 }}>
                                                                    {d.package}
                                                                </Typography>
                                                            )}
                                                            <Typography sx={{ fontSize: '0.65rem', color: dl.color, fontWeight: 600, mt: 0.25 }}>
                                                                {dl.text}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </motion.div>
                                            );
                                        })}
                                    </Stack>
                                )}
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>

            {/* ── Pending Tasks ── */}
            <motion.div {...fadeUp(0.35)}>
                <Paper elevation={0} sx={{ borderRadius: '14px', border: '1px solid #e2e8f0', bgcolor: '#fff', mb: 2 }}>
                    <Box sx={{
                        px: 2.5, py: 1.75,
                        borderBottom: '1px solid #f1f5f9',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{
                                width: 32, height: 32, borderRadius: '8px', bgcolor: '#ecfdf5',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <ChecklistRtl sx={{ fontSize: 18, color: '#10b981' }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.92rem', color: '#0f172a' }}>
                                    Pending Tasks
                                </Typography>
                                {stats.pendingTodos > 0 && (
                                    <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 400 }}>
                                        {stats.completedTodos} of {stats.totalTodos} completed
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        <Button
                            size="small"
                            endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
                            onClick={() => navigate('/student/todos')}
                            sx={{
                                textTransform: 'none', fontWeight: 600, fontSize: '0.78rem',
                                color: '#10b981', borderRadius: '8px', minWidth: 'auto', px: 1,
                            }}
                        >
                            View all
                        </Button>
                    </Box>

                    <Box sx={{ p: 2 }}>
                        {pendingTodosList.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Star sx={{ fontSize: 36, mb: 1, color: '#fef3c7' }} />
                                <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#64748b' }}>All tasks done!</Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mt: 0.25 }}>You're on top of everything</Typography>
                            </Box>
                        ) : (
                            <Grid container spacing={1}>
                                {pendingTodosList.map((t, i) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={t.id || i}>
                                        <motion.div {...fadeUp(0.4 + i * 0.03)}>
                                            <Box sx={{
                                                p: 1.5, borderRadius: '10px',
                                                border: '1px solid #f1f5f9',
                                                display: 'flex', alignItems: 'center', gap: 1,
                                                transition: 'all 0.15s ease',
                                                '&:hover': { bgcolor: '#fafafa', borderColor: '#e2e8f0' },
                                            }}>
                                                <RadioButtonUnchecked sx={{ fontSize: 16, color: '#d1d5db', flexShrink: 0 }} />
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography sx={{ fontWeight: 500, fontSize: '0.82rem', color: '#0f172a' }} noWrap>
                                                        {t.task}
                                                    </Typography>
                                                    {t.deadline && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.2 }}>
                                                            <FiberManualRecord sx={{ fontSize: 5, color: formatDeadline(t.deadline).color }} />
                                                            <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                                                                {formatDate(t.deadline)}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Box>
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default StudentDashboard;
