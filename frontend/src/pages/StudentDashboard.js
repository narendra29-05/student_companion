import React, { useState, useEffect, useMemo } from 'react';
import {
    Typography, Grid, Box, CircularProgress, Avatar, Paper, Chip,
    Stack, Button
} from '@mui/material';
import {
    WorkOutline, Assignment, ChecklistRtl,
    MenuBook, EventNote, Person,
    CheckCircle, Star, CalendarToday,
    Schedule, EmojiEvents, Bolt, NavigateNext,
    RadioButtonUnchecked, FiberManualRecord
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ─── Circular Progress Ring ─── */
const ProgressRing = ({ value, total, color, size = 52, thickness = 4 }) => {
    const pct = total > 0 ? (value / total) * 100 : 0;
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
                variant="determinate" value={100}
                size={size} thickness={thickness}
                sx={{ color: `${color}18`, position: 'absolute' }}
            />
            <CircularProgress
                variant="determinate" value={pct}
                size={size} thickness={thickness}
                sx={{ color, '& circle': { strokeLinecap: 'round' } }}
            />
            <Box sx={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <Typography sx={{ fontWeight: 800, fontSize: size * 0.24, color: '#1e293b', lineHeight: 1 }}>
                    {value}
                </Typography>
            </Box>
        </Box>
    );
};

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
                <Box sx={{ position: 'relative' }}>
                    <CircularProgress size={48} thickness={3} sx={{ color: '#6366f1' }} />
                    <CircularProgress size={48} thickness={3} sx={{ color: '#e0e7ff', position: 'absolute', left: 0 }} variant="determinate" value={100} />
                </Box>
                <Typography sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.85rem' }}>Loading your dashboard...</Typography>
            </Box>
        );
    }

    const quickActions = [
        { icon: <WorkOutline />, label: 'Drives', path: '/student/drives', gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', count: stats.eligibleDrives, sub: 'eligible' },
        { icon: <Assignment />, label: 'Assignments', path: '/student/assignments', gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', count: stats.pendingAssignments, sub: 'pending' },
        { icon: <ChecklistRtl />, label: 'To-Do', path: '/student/todos', gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)', count: stats.pendingTodos, sub: 'pending' },
        { icon: <MenuBook />, label: 'Materials', path: '/student/materials', gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)' },
        { icon: <EventNote />, label: 'Attendance', path: '/student/attendance', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' },
        { icon: <Person />, label: 'Profile', path: '/student/profile', gradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)' },
    ];

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
            {/* ═══ Hero Greeting ═══ */}
            <motion.div initial={{ y: -15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                <Box sx={{
                    mb: 3, p: { xs: 2.5, sm: 3.5 }, borderRadius: '22px', position: 'relative', overflow: 'hidden',
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4338ca 70%, #6366f1 100%)',
                    boxShadow: '0 8px 32px rgba(99,102,241,0.25)',
                }}>
                    {/* Decorative orbs */}
                    <Box sx={{ position: 'absolute', top: -40, right: -20, width: 180, height: 180, borderRadius: '50%', background: 'rgba(139,92,246,0.15)', filter: 'blur(40px)' }} />
                    <Box sx={{ position: 'absolute', bottom: -30, left: '30%', width: 120, height: 120, borderRadius: '50%', background: 'rgba(14,165,233,0.12)', filter: 'blur(30px)' }} />

                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', fontWeight: 600, mb: 0.5 }}>
                            {getGreeting()}
                        </Typography>
                        <Typography sx={{
                            fontWeight: 900, fontSize: { xs: '1.5rem', sm: '1.85rem' }, color: '#fff',
                            letterSpacing: '-0.03em', lineHeight: 1.15,
                        }}>
                            {user?.name?.split(' ')[0] || 'Student'}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontWeight: 500, mt: 0.8 }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </Typography>

                        {/* Inline summary pills */}
                        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 0.5 }}>
                            {stats.overdueAssignments > 0 && (
                                <Chip
                                    icon={<Schedule sx={{ fontSize: 14, color: '#fca5a5 !important' }} />}
                                    label={`${stats.overdueAssignments} overdue`}
                                    size="small"
                                    sx={{ bgcolor: 'rgba(239,68,68,0.2)', color: '#fca5a5', fontWeight: 700, fontSize: '0.72rem', backdropFilter: 'blur(8px)', border: '1px solid rgba(239,68,68,0.2)' }}
                                />
                            )}
                            {stats.pendingAssignments > 0 && (
                                <Chip
                                    icon={<Assignment sx={{ fontSize: 14, color: '#fcd34d !important' }} />}
                                    label={`${stats.pendingAssignments} pending`}
                                    size="small"
                                    sx={{ bgcolor: 'rgba(245,158,11,0.15)', color: '#fcd34d', fontWeight: 700, fontSize: '0.72rem', border: '1px solid rgba(245,158,11,0.15)' }}
                                />
                            )}
                            {stats.eligibleDrives > 0 && (
                                <Chip
                                    icon={<WorkOutline sx={{ fontSize: 14, color: '#93c5fd !important' }} />}
                                    label={`${stats.eligibleDrives} drives open`}
                                    size="small"
                                    sx={{ bgcolor: 'rgba(59,130,246,0.15)', color: '#93c5fd', fontWeight: 700, fontSize: '0.72rem', border: '1px solid rgba(59,130,246,0.15)' }}
                                />
                            )}
                        </Stack>
                    </Box>
                </Box>
            </motion.div>

            {/* ═══ Profile Completion Alert ═══ */}
            {user?.profileCompleted === false && (
                <motion.div initial={{ y: -5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
                    <Paper sx={{
                        p: 2, mb: 3, borderRadius: '16px',
                        background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                        border: '1px solid #fde68a',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: 1,
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 38, height: 38, bgcolor: '#fef3c7', border: '2px solid #fbbf24' }}>
                                <Bolt sx={{ color: '#f59e0b', fontSize: 20 }} />
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#92400e' }}>Complete your profile</Typography>
                                <Typography sx={{ fontSize: '0.72rem', color: '#a16207' }}>Add CGPA and resume to unlock placement drives</Typography>
                            </Box>
                        </Box>
                        <Button size="small" onClick={() => navigate('/student/profile')}
                            sx={{
                                borderRadius: '10px', fontWeight: 700, textTransform: 'none', px: 2.5,
                                bgcolor: '#f59e0b', color: '#fff',
                                boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
                                '&:hover': { bgcolor: '#d97706' },
                            }}>
                            Complete Now
                        </Button>
                    </Paper>
                </motion.div>
            )}

            {/* ═══ Stats Overview ═══ */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    {
                        icon: <WorkOutline />, label: 'Applied Drives', value: stats.appliedDrives, total: stats.totalDrives,
                        color: '#6366f1', gradient: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
                        iconBg: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                    },
                    {
                        icon: <Assignment />, label: 'Assignments Done', value: stats.submittedAssignments, total: stats.totalAssignments,
                        color: '#ec4899', gradient: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
                        iconBg: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                    },
                    {
                        icon: <ChecklistRtl />, label: 'Todos Complete', value: stats.completedTodos, total: stats.totalTodos,
                        color: '#10b981', gradient: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                        iconBg: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                    },
                    {
                        icon: <EmojiEvents />, label: 'Eligible Drives', value: stats.eligibleDrives, total: stats.totalDrives,
                        color: '#f59e0b', gradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                        iconBg: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                    },
                ].map((s, i) => (
                    <Grid item xs={6} md={3} key={i}>
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.06 }}>
                            <Paper sx={{
                                p: 2.5, borderRadius: '18px',
                                background: s.gradient,
                                border: '1px solid transparent',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 28px ${s.color}18`, borderColor: `${s.color}30` },
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Avatar sx={{
                                        width: 42, height: 42, borderRadius: '12px',
                                        background: s.iconBg,
                                        boxShadow: `0 4px 12px ${s.color}30`,
                                    }}>
                                        {React.cloneElement(s.icon, { sx: { color: '#fff', fontSize: 22 } })}
                                    </Avatar>
                                    {s.total !== undefined && (
                                        <ProgressRing value={s.value} total={s.total} color={s.color} size={44} thickness={3.5} />
                                    )}
                                </Box>
                                <Typography sx={{ fontWeight: 900, fontSize: '1.65rem', color: '#0f172a', lineHeight: 1 }}>
                                    {s.value}
                                    {s.total !== undefined && (
                                        <Typography component="span" sx={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                                            /{s.total}
                                        </Typography>
                                    )}
                                </Typography>
                                <Typography sx={{
                                    fontSize: '0.72rem', color: '#64748b', fontWeight: 600, mt: 0.5,
                                    textTransform: 'uppercase', letterSpacing: '0.06em',
                                }}>
                                    {s.label}
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            {/* ═══ Quick Actions ═══ */}
            <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', mb: 1.5, px: 0.5 }}>
                        Quick Actions
                    </Typography>
                    <Grid container spacing={1.5}>
                        {quickActions.map((a, i) => (
                            <Grid item xs={4} sm={2} key={i}>
                                <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}>
                                    <Paper
                                        onClick={() => navigate(a.path)}
                                        sx={{
                                            p: { xs: 1.5, sm: 2 }, borderRadius: '16px',
                                            border: '1px solid #e2e8f0',
                                            textAlign: 'center', cursor: 'pointer',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                borderColor: 'transparent',
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                            },
                                        }}
                                    >
                                        <Avatar sx={{
                                            width: 44, height: 44, mx: 'auto', mb: 1,
                                            borderRadius: '14px',
                                            background: a.gradient,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        }}>
                                            {React.cloneElement(a.icon, { sx: { color: '#fff', fontSize: 22 } })}
                                        </Avatar>
                                        <Typography sx={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155' }}>
                                            {a.label}
                                        </Typography>
                                        {a.count !== undefined && a.count > 0 && (
                                            <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, color: '#94a3b8', mt: 0.3 }}>
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

            {/* ═══ Two Column: Assignments + Drives ═══ */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {/* Upcoming Assignments */}
                <Grid item xs={12} md={6}>
                    <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
                        <Paper sx={{
                            borderRadius: '20px', border: '1px solid #e2e8f0', height: '100%',
                            overflow: 'hidden',
                        }}>
                            {/* Card Header */}
                            <Box sx={{
                                px: 2.5, py: 2,
                                background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
                                borderBottom: '1px solid #fce7f3',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Avatar sx={{ width: 34, height: 34, borderRadius: '10px', background: 'linear-gradient(135deg, #ec4899, #f43f5e)', boxShadow: '0 3px 10px rgba(236,72,153,0.3)' }}>
                                        <Assignment sx={{ fontSize: 18, color: '#fff' }} />
                                    </Avatar>
                                    <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: '#1e293b' }}>
                                        Upcoming Assignments
                                    </Typography>
                                </Box>
                                <Button size="small" endIcon={<NavigateNext sx={{ fontSize: 16 }} />}
                                    onClick={() => navigate('/student/assignments')}
                                    sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', color: '#ec4899', borderRadius: '8px', minWidth: 'auto' }}>
                                    All
                                </Button>
                            </Box>

                            <Box sx={{ p: 2 }}>
                                {upcomingAssignments.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 4, color: '#94a3b8' }}>
                                        <CheckCircle sx={{ fontSize: 40, mb: 1, opacity: 0.3, color: '#10b981' }} />
                                        <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#64748b' }}>All caught up!</Typography>
                                        <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', mt: 0.3 }}>No pending assignments</Typography>
                                    </Box>
                                ) : (
                                    <Stack spacing={1}>
                                        {upcomingAssignments.map((a, i) => {
                                            const dl = formatDeadline(a.deadline);
                                            return (
                                                <motion.div key={a.id || i} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 + i * 0.05 }}>
                                                    <Box sx={{
                                                        p: 1.5, borderRadius: '14px',
                                                        bgcolor: '#fafafa',
                                                        border: `1px solid ${dl.urgent ? `${dl.color}25` : '#f1f5f9'}`,
                                                        display: 'flex', alignItems: 'center', gap: 1.5,
                                                        transition: 'all 0.25s',
                                                        cursor: 'pointer',
                                                        '&:hover': { bgcolor: '#fdf2f8', borderColor: '#ec489930', transform: 'translateX(4px)' },
                                                    }}
                                                    onClick={() => navigate('/student/assignments')}
                                                    >
                                                        <Box sx={{
                                                            width: 4, height: 36, borderRadius: 2,
                                                            bgcolor: dl.color, flexShrink: 0,
                                                        }} />
                                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                                            <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a' }} noWrap>
                                                                {a.title}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                                                                <CalendarToday sx={{ fontSize: 11, color: '#94a3b8' }} />
                                                                <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                                                                    {formatDate(a.deadline)}
                                                                </Typography>
                                                                <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8', mx: 0.3 }}>|</Typography>
                                                                <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                                                                    {a.Faculty?.name || 'Faculty'}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        <Chip label={dl.text} size="small" sx={{
                                                            height: 24, fontSize: '0.65rem', fontWeight: 700,
                                                            bgcolor: `${dl.color}12`, color: dl.color,
                                                            border: `1px solid ${dl.color}20`,
                                                        }} />
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
                <Grid item xs={12} md={6}>
                    <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                        <Paper sx={{
                            borderRadius: '20px', border: '1px solid #e2e8f0', height: '100%',
                            overflow: 'hidden',
                        }}>
                            {/* Card Header */}
                            <Box sx={{
                                px: 2.5, py: 2,
                                background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
                                borderBottom: '1px solid #e0e7ff',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Avatar sx={{ width: 34, height: 34, borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 3px 10px rgba(99,102,241,0.3)' }}>
                                        <WorkOutline sx={{ fontSize: 18, color: '#fff' }} />
                                    </Avatar>
                                    <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: '#1e293b' }}>
                                        Eligible Drives
                                    </Typography>
                                </Box>
                                <Button size="small" endIcon={<NavigateNext sx={{ fontSize: 16 }} />}
                                    onClick={() => navigate('/student/drives')}
                                    sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', color: '#6366f1', borderRadius: '8px', minWidth: 'auto' }}>
                                    All
                                </Button>
                            </Box>

                            <Box sx={{ p: 2 }}>
                                {recentDrives.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 4, color: '#94a3b8' }}>
                                        <WorkOutline sx={{ fontSize: 40, mb: 1, opacity: 0.3 }} />
                                        <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#64748b' }}>No open drives</Typography>
                                        <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', mt: 0.3 }}>Check back later for opportunities</Typography>
                                    </Box>
                                ) : (
                                    <Stack spacing={1}>
                                        {recentDrives.map((d, i) => {
                                            const dl = formatDeadline(d.expiryDate);
                                            return (
                                                <motion.div key={d.id || i} initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.45 + i * 0.05 }}>
                                                    <Box onClick={() => navigate('/student/drives')} sx={{
                                                        p: 1.5, borderRadius: '14px',
                                                        bgcolor: '#fafafa',
                                                        border: '1px solid #f1f5f9', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', gap: 1.5,
                                                        transition: 'all 0.25s',
                                                        '&:hover': { bgcolor: '#eef2ff', borderColor: '#6366f130', transform: 'translateX(4px)' },
                                                    }}>
                                                        <Avatar sx={{
                                                            width: 40, height: 40, borderRadius: '12px',
                                                            bgcolor: '#f0f0ff',
                                                            fontWeight: 800, fontSize: '0.85rem', color: '#6366f1',
                                                        }}>
                                                            {d.companyName?.charAt(0)?.toUpperCase() || 'C'}
                                                        </Avatar>
                                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                                            <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a' }} noWrap>
                                                                {d.companyName}
                                                            </Typography>
                                                            <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8' }} noWrap>
                                                                {d.role}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                                                            {d.package && (
                                                                <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#10b981', lineHeight: 1 }}>
                                                                    {d.package}
                                                                </Typography>
                                                            )}
                                                            <Typography sx={{ fontSize: '0.6rem', color: dl.color, fontWeight: 700, mt: 0.3 }}>
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

            {/* ═══ Pending Tasks ═══ */}
            <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}>
                <Paper sx={{
                    borderRadius: '20px', border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                }}>
                    <Box sx={{
                        px: 2.5, py: 2,
                        background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                        borderBottom: '1px solid #d1fae5',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 34, height: 34, borderRadius: '10px', background: 'linear-gradient(135deg, #10b981, #14b8a6)', boxShadow: '0 3px 10px rgba(16,185,129,0.3)' }}>
                                <ChecklistRtl sx={{ fontSize: 18, color: '#fff' }} />
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontWeight: 800, fontSize: '0.92rem', color: '#1e293b' }}>
                                    Pending Tasks
                                </Typography>
                                {stats.pendingTodos > 0 && (
                                    <Typography sx={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 500 }}>
                                        {stats.completedTodos} of {stats.totalTodos} completed
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        <Button size="small" endIcon={<NavigateNext sx={{ fontSize: 16 }} />}
                            onClick={() => navigate('/student/todos')}
                            sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', color: '#10b981', borderRadius: '8px', minWidth: 'auto' }}>
                            All
                        </Button>
                    </Box>

                    <Box sx={{ p: 2 }}>
                        {pendingTodosList.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 4, color: '#94a3b8' }}>
                                <Star sx={{ fontSize: 40, mb: 1, opacity: 0.3, color: '#f59e0b' }} />
                                <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#64748b' }}>All tasks done!</Typography>
                                <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', mt: 0.3 }}>You're on top of everything</Typography>
                            </Box>
                        ) : (
                            <Grid container spacing={1}>
                                {pendingTodosList.map((t, i) => (
                                    <Grid item xs={12} sm={6} key={t.id || i}>
                                        <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 + i * 0.04 }}>
                                            <Box sx={{
                                                p: 1.5, borderRadius: '12px', bgcolor: '#fafafa',
                                                border: '1px solid #f1f5f9',
                                                display: 'flex', alignItems: 'center', gap: 1.2,
                                                transition: 'all 0.2s',
                                                '&:hover': { bgcolor: '#ecfdf5', borderColor: '#10b98120' },
                                            }}>
                                                <RadioButtonUnchecked sx={{ fontSize: 18, color: '#cbd5e1', flexShrink: 0 }} />
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#0f172a' }} noWrap>
                                                        {t.task}
                                                    </Typography>
                                                    {t.deadline && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mt: 0.2 }}>
                                                            <FiberManualRecord sx={{ fontSize: 6, color: formatDeadline(t.deadline).color }} />
                                                            <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8' }}>
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
