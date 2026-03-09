import React, { useState, useEffect, useMemo } from 'react';
import {
    Container, Typography, Grid, Card, CardContent,
    Button, Chip, Box, CircularProgress, Alert, Select, MenuItem,
    FormControl, InputLabel, Collapse, IconButton, Avatar,
    Paper, Tooltip, TextField, InputAdornment, ToggleButton, ToggleButtonGroup,
    LinearProgress, Divider
} from '@mui/material';
import {
    Business, AccessTime, ExpandMore as ExpandMoreIcon,
    CheckCircle, Cancel, Search, FilterList,
    TrendingUp, WorkOutline, BookmarkBorder, Timer,
    Assignment, ChecklistRtl, MenuBook, Person,
    ArrowForward, CalendarToday, Schedule
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import ApplyDialog from '../components/ApplyDialog';
import { toast } from 'react-toastify';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const StudentDashboard = () => {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [applyDialog, setApplyDialog] = useState({ open: false, drive: null, profile: null });
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // New: dashboard overview data
    const [assignments, setAssignments] = useState([]);
    const [todos, setTodos] = useState([]);
    const [overviewLoading, setOverviewLoading] = useState(true);

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDrives();
        fetchOverviewData();
    }, []);

    const fetchDrives = async () => {
        try {
            const response = await API.get('/drives/student');
            setDrives(response.data.drives);
        } catch (err) {
            setError('Failed to fetch drives');
        } finally {
            setLoading(false);
        }
    };

    const fetchOverviewData = async () => {
        try {
            const [assignRes, todoRes] = await Promise.allSettled([
                API.get('/assignments/student'),
                API.get('/todos'),
            ]);
            if (assignRes.status === 'fulfilled') setAssignments(assignRes.value.data.assignments || []);
            if (todoRes.status === 'fulfilled') setTodos(todoRes.value.data.todos || []);
        } catch (err) {
            // silently fail — overview is supplementary
        } finally {
            setOverviewLoading(false);
        }
    };

    // Computed stats
    const stats = useMemo(() => {
        const eligible = drives.filter(d => d.isEligible).length;
        const applied = drives.filter(d => d.applicationStatus === 'applied').length;
        const expiringSoon = drives.filter(d => {
            const days = Math.ceil((new Date(d.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
            return days <= 3 && days > 0;
        }).length;
        return { total: drives.length, eligible, applied, expiringSoon };
    }, [drives]);

    // Assignment stats
    const assignmentStats = useMemo(() => {
        const pending = assignments.filter(a => a.submissionStatus === 'not_submitted' && !a.isPastDeadline);
        const overdue = assignments.filter(a => a.submissionStatus === 'not_submitted' && a.isPastDeadline);
        const upcoming = pending.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 3);
        return { pendingCount: pending.length, overdueCount: overdue.length, upcoming };
    }, [assignments]);

    // Todo stats
    const todoStats = useMemo(() => {
        const pending = todos.filter(t => !t.isCompleted);
        const completed = todos.filter(t => t.isCompleted);
        const recentPending = pending.slice(0, 3);
        return { pendingCount: pending.length, completedCount: completed.length, recentPending };
    }, [todos]);

    // Sorted & filtered drives (expiring soon first)
    const filteredDrives = useMemo(() => {
        let result = [...drives].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(d =>
                d.companyName.toLowerCase().includes(q) ||
                d.role.toLowerCase().includes(q) ||
                (d.package && d.package.toLowerCase().includes(q))
            );
        }

        switch (filterStatus) {
            case 'eligible': result = result.filter(d => d.isEligible); break;
            case 'applied': result = result.filter(d => d.applicationStatus === 'applied'); break;
            case 'notApplied': result = result.filter(d => d.isEligible && !d.applicationStatus); break;
            default: break;
        }

        return result;
    }, [drives, searchQuery, filterStatus]);

    const handleExpandClick = (id) => setExpandedId(expandedId === id ? null : id);

    const handleStatusChange = async (driveId, newStatus) => {
        try {
            await API.patch(`/drives/apply/${driveId}`, { status: newStatus });
            setDrives(prev => prev.map(d => d.id === driveId ? { ...d, applicationStatus: newStatus } : d));
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handleApplyClick = async (drive) => {
        if (!user?.profileCompleted) {
            toast.error('Please complete your profile before applying');
            navigate('/student/profile');
            return;
        }
        if (!drive.isEligible) {
            toast.error('You are not eligible for this drive');
            return;
        }
        try {
            const response = await API.post(`/drives/apply/${drive.id}`);
            setApplyDialog({ open: true, drive, profile: response.data.studentProfile });
            setDrives(prev => prev.map(d => d.id === drive.id ? { ...d, applicationStatus: d.applicationStatus || 'interested' } : d));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to apply');
        }
    };

    const handleApplied = () => {
        if (applyDialog.drive) handleStatusChange(applyDialog.drive.id, 'applied');
    };

    const getDaysRemaining = (expiryDate) => Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

    const formatDeadline = (date) => {
        const d = new Date(date);
        const now = new Date();
        const diffMs = d - now;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return 'Overdue';
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        return `${diffDays}d left`;
    };

    if (loading) return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <CircularProgress thickness={5} size={60} sx={{ color: '#6366f1' }} />
            <Typography sx={{ mt: 2, color: '#94a3b8', fontWeight: 500 }}>Loading Dashboard...</Typography>
        </Box>
    );

    const driveStatCards = [
        { label: 'Active Drives', value: stats.total, icon: <WorkOutline />, color: '#6366f1', bg: '#eef2ff' },
        { label: 'Eligible', value: stats.eligible, icon: <CheckCircle />, color: '#10b981', bg: '#ecfdf5' },
        { label: 'Applied', value: stats.applied, icon: <TrendingUp />, color: '#f59e0b', bg: '#fffbeb' },
        { label: 'Expiring Soon', value: stats.expiringSoon, icon: <Timer />, color: '#ef4444', bg: '#fef2f2' },
    ];

    const quickActions = [
        { label: 'Assignments', icon: <Assignment />, path: '/student/assignments', color: '#8b5cf6', bg: '#f5f3ff', count: assignmentStats.pendingCount },
        { label: 'To-Do', icon: <ChecklistRtl />, path: '/student/todos', color: '#f59e0b', bg: '#fffbeb', count: todoStats.pendingCount },
        { label: 'Materials', icon: <MenuBook />, path: '/student/materials', color: '#06b6d4', bg: '#ecfeff' },
        { label: 'Profile', icon: <Person />, path: '/student/profile', color: '#ec4899', bg: '#fdf2f8' },
    ];

    return (
        <Box sx={{ background: '#f8fafc', minHeight: '100vh', py: { xs: 2, sm: 3, md: 4 } }}>
            <Container maxWidth="lg">
                {/* Profile Completion Banner */}
                {user?.profileCompleted === false && (
                    <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                        <Alert
                            severity="warning"
                            sx={{ mb: 3, borderRadius: '14px', fontWeight: 600 }}
                            action={
                                <Button color="inherit" size="small" onClick={() => navigate('/student/profile')} sx={{ fontWeight: 700 }}>
                                    Complete Profile
                                </Button>
                            }
                        >
                            Complete your profile to apply for drives. Add your name, CGPA, and resume.
                        </Alert>
                    </motion.div>
                )}

                {/* Header */}
                <motion.div initial={{ y: -15, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <Box sx={{ mb: { xs: 2.5, md: 3.5 } }}>
                        <Typography sx={{
                            fontWeight: 900, color: '#1e293b', mb: 0.5,
                            fontSize: { xs: '1.5rem', sm: '1.85rem', md: '2.25rem' },
                            letterSpacing: '-0.03em',
                        }}>
                            Welcome back, <span style={{ color: '#6366f1' }}>{user?.name?.split(' ')[0] || user?.name}</span>
                        </Typography>
                        <Typography sx={{ color: '#64748b', fontWeight: 500, fontSize: { xs: '0.85rem', md: '0.95rem' } }}>
                            Here's your campus overview for today
                        </Typography>
                    </Box>
                </motion.div>

                {/* Quick Actions */}
                <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 2.5, md: 3.5 } }}>
                    {quickActions.map((action, i) => (
                        <Grid item xs={6} sm={3} key={i}>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.05 + i * 0.04 }}
                            >
                                <Paper
                                    elevation={0}
                                    onClick={() => navigate(action.path)}
                                    sx={{
                                        p: { xs: 1.5, md: 2 }, borderRadius: '14px',
                                        border: '1px solid #e2e8f0', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: 1.5,
                                        transition: 'all 0.2s',
                                        '&:hover': { borderColor: action.color, boxShadow: `0 4px 12px ${action.color}15`, transform: 'translateY(-2px)' },
                                    }}
                                >
                                    <Avatar sx={{
                                        bgcolor: action.bg, color: action.color,
                                        width: 38, height: 38, borderRadius: '10px',
                                    }}>
                                        {action.icon}
                                    </Avatar>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#1e293b' }}>
                                            {action.label}
                                        </Typography>
                                        {action.count > 0 && (
                                            <Typography sx={{ fontSize: '0.65rem', color: action.color, fontWeight: 700 }}>
                                                {action.count} pending
                                            </Typography>
                                        )}
                                    </Box>
                                    <ArrowForward sx={{ fontSize: 16, color: '#cbd5e1' }} />
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                {/* Overview Widgets Row */}
                {!overviewLoading && (assignmentStats.upcoming.length > 0 || todoStats.recentPending.length > 0) && (
                    <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 2.5, md: 3.5 } }}>
                        {/* Upcoming Assignments Widget */}
                        {assignmentStats.upcoming.length > 0 && (
                            <Grid item xs={12} md={6}>
                                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
                                    <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 }, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar sx={{ bgcolor: '#f5f3ff', color: '#8b5cf6', width: 32, height: 32, borderRadius: '8px' }}>
                                                    <Assignment sx={{ fontSize: 18 }} />
                                                </Avatar>
                                                <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#1e293b' }}>
                                                    Upcoming Assignments
                                                </Typography>
                                            </Box>
                                            {assignmentStats.overdueCount > 0 && (
                                                <Chip label={`${assignmentStats.overdueCount} overdue`} size="small" sx={{
                                                    fontWeight: 700, fontSize: '0.65rem', height: 22,
                                                    bgcolor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
                                                }} />
                                            )}
                                        </Box>
                                        {assignmentStats.upcoming.map((a, i) => {
                                            const deadlineText = formatDeadline(a.deadline);
                                            const isUrgent = deadlineText === 'Today' || deadlineText === 'Tomorrow';
                                            return (
                                                <Box key={a.id} sx={{
                                                    display: 'flex', alignItems: 'center', gap: 1.5,
                                                    py: 1.2, borderBottom: i < assignmentStats.upcoming.length - 1 ? '1px solid #f1f5f9' : 'none',
                                                }}>
                                                    <Box sx={{
                                                        width: 4, height: 32, borderRadius: 2,
                                                        bgcolor: isUrgent ? '#ef4444' : '#8b5cf6',
                                                    }} />
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#1e293b' }} noWrap>
                                                            {a.title}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                                            {a.faculty?.name}
                                                        </Typography>
                                                    </Box>
                                                    <Chip label={deadlineText} size="small" sx={{
                                                        fontWeight: 700, fontSize: '0.6rem', height: 20,
                                                        bgcolor: isUrgent ? '#fef2f2' : '#f8fafc',
                                                        color: isUrgent ? '#dc2626' : '#64748b',
                                                        border: `1px solid ${isUrgent ? '#fecaca' : '#e2e8f0'}`,
                                                    }} />
                                                </Box>
                                            );
                                        })}
                                        <Button
                                            size="small" fullWidth
                                            onClick={() => navigate('/student/assignments')}
                                            sx={{
                                                mt: 1.5, fontWeight: 700, fontSize: '0.75rem',
                                                textTransform: 'none', color: '#8b5cf6', borderRadius: '10px',
                                                bgcolor: '#f5f3ff', '&:hover': { bgcolor: '#ede9fe' },
                                            }}
                                        >
                                            View All Assignments
                                        </Button>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        )}

                        {/* Pending Todos Widget */}
                        {todoStats.recentPending.length > 0 && (
                            <Grid item xs={12} md={assignmentStats.upcoming.length > 0 ? 6 : 12}>
                                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                                    <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 }, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar sx={{ bgcolor: '#fffbeb', color: '#f59e0b', width: 32, height: 32, borderRadius: '8px' }}>
                                                    <ChecklistRtl sx={{ fontSize: 18 }} />
                                                </Avatar>
                                                <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#1e293b' }}>
                                                    Pending Tasks
                                                </Typography>
                                            </Box>
                                            <Chip label={`${todoStats.completedCount} done`} size="small" sx={{
                                                fontWeight: 700, fontSize: '0.65rem', height: 22,
                                                bgcolor: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0',
                                            }} />
                                        </Box>
                                        {todoStats.recentPending.map((t, i) => {
                                            const dl = t.deadline ? formatDeadline(t.deadline) : null;
                                            return (
                                                <Box key={t.id} sx={{
                                                    display: 'flex', alignItems: 'center', gap: 1.5,
                                                    py: 1.2, borderBottom: i < todoStats.recentPending.length - 1 ? '1px solid #f1f5f9' : 'none',
                                                }}>
                                                    <Box sx={{ width: 4, height: 32, borderRadius: 2, bgcolor: '#f59e0b' }} />
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#1e293b' }} noWrap>
                                                            {t.task}
                                                        </Typography>
                                                    </Box>
                                                    {dl && (
                                                        <Chip label={dl} size="small" sx={{
                                                            fontWeight: 700, fontSize: '0.6rem', height: 20,
                                                            bgcolor: '#f8fafc', color: '#64748b',
                                                            border: '1px solid #e2e8f0',
                                                        }} />
                                                    )}
                                                </Box>
                                            );
                                        })}
                                        <Button
                                            size="small" fullWidth
                                            onClick={() => navigate('/student/todos')}
                                            sx={{
                                                mt: 1.5, fontWeight: 700, fontSize: '0.75rem',
                                                textTransform: 'none', color: '#f59e0b', borderRadius: '10px',
                                                bgcolor: '#fffbeb', '&:hover': { bgcolor: '#fef3c7' },
                                            }}
                                        >
                                            View All Tasks
                                        </Button>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        )}
                    </Grid>
                )}

                {/* Drives Section Header */}
                <Box sx={{ mb: { xs: 2, md: 3 }, mt: { xs: 1, md: 2 } }}>
                    <Typography sx={{
                        fontWeight: 900, fontSize: { xs: '1.2rem', md: '1.5rem' },
                        color: '#1e293b', letterSpacing: '-0.02em',
                    }}>
                        Placement Drives
                    </Typography>
                </Box>

                {/* Drive Stats */}
                <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 2, md: 3 } }}>
                    {driveStatCards.map((stat, i) => (
                        <Grid item xs={6} sm={3} key={i}>
                            <motion.div initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.04 }}>
                                <Paper elevation={0} sx={{
                                    p: { xs: 1.5, md: 2 }, borderRadius: '14px',
                                    border: '1px solid #e2e8f0', display: 'flex',
                                    alignItems: 'center', gap: { xs: 1, md: 1.5 },
                                }}>
                                    <Avatar sx={{
                                        bgcolor: stat.bg, color: stat.color,
                                        width: { xs: 36, md: 42 }, height: { xs: 36, md: 42 },
                                        borderRadius: '10px',
                                    }}>
                                        {stat.icon}
                                    </Avatar>
                                    <Box>
                                        <Typography sx={{
                                            fontWeight: 800, fontSize: { xs: '1.1rem', md: '1.3rem' },
                                            color: '#1e293b', lineHeight: 1,
                                        }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography sx={{
                                            color: '#94a3b8', fontWeight: 600,
                                            fontSize: { xs: '0.6rem', md: '0.7rem' },
                                            textTransform: 'uppercase', letterSpacing: '0.03em',
                                        }}>
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                {/* Search & Filters */}
                <motion.div initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
                    <Paper elevation={0} sx={{
                        p: { xs: 1.5, md: 2 }, borderRadius: '14px',
                        border: '1px solid #e2e8f0', mb: { xs: 2, md: 3 },
                        display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 1.5, sm: 2 }, alignItems: { sm: 'center' },
                    }}>
                        <TextField
                            placeholder="Search by company, role, or package..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            size="small"
                            sx={{
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px', background: '#f8fafc',
                                    '& fieldset': { borderColor: '#e2e8f0' },
                                    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: '#94a3b8', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FilterList sx={{ color: '#94a3b8', fontSize: 20, display: { xs: 'none', sm: 'block' } }} />
                            <ToggleButtonGroup
                                value={filterStatus} exclusive size="small"
                                onChange={(e, val) => val !== null && setFilterStatus(val)}
                                sx={{
                                    '& .MuiToggleButton-root': {
                                        border: '1px solid #e2e8f0', borderRadius: '10px !important',
                                        textTransform: 'none', fontWeight: 700, fontSize: '0.73rem',
                                        px: { xs: 1.2, sm: 1.5 }, color: '#64748b',
                                        '&.Mui-selected': {
                                            background: '#eef2ff', color: '#4f46e5', borderColor: '#c7d2fe',
                                        }
                                    }
                                }}
                            >
                                <ToggleButton value="all">All</ToggleButton>
                                <ToggleButton value="eligible">Eligible</ToggleButton>
                                <ToggleButton value="applied">Applied</ToggleButton>
                                <ToggleButton value="notApplied">New</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Paper>
                </motion.div>

                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

                {/* Results count */}
                {(searchQuery || filterStatus !== 'all') && (
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                            {filteredDrives.length} drive{filteredDrives.length !== 1 ? 's' : ''} found
                        </Typography>
                        <Chip
                            label="Clear filters" size="small"
                            onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}
                            sx={{ fontWeight: 600, fontSize: '0.7rem', cursor: 'pointer' }}
                        />
                    </Box>
                )}

                {/* Drives Grid */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                        <AnimatePresence>
                            {filteredDrives.map((drive) => {
                                const daysRemaining = getDaysRemaining(drive.expiryDate);
                                const appStatus = drive.applicationStatus;
                                const isApplied = appStatus === 'applied';

                                return (
                                    <Grid item xs={12} sm={6} lg={4} key={drive.id}>
                                        <motion.div variants={cardVariants} whileHover={{ y: -5 }}>
                                            <Card sx={{
                                                borderRadius: '18px', border: '1px solid #e2e8f0',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                                position: 'relative', overflow: 'hidden', background: '#fff',
                                                opacity: drive.isEligible ? 1 : 0.8,
                                                transition: 'box-shadow 0.3s',
                                                '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.07)' },
                                            }}>
                                                {/* Top Status Bar */}
                                                <Box sx={{
                                                    height: '4px',
                                                    background: !drive.isEligible
                                                        ? 'linear-gradient(90deg, #ef4444, #f87171)'
                                                        : isApplied
                                                            ? 'linear-gradient(90deg, #10b981, #34d399)'
                                                            : 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                                }} />

                                                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                        <Avatar sx={{
                                                            bgcolor: '#f1f5f9', color: '#6366f1',
                                                            width: 44, height: 44, borderRadius: '12px',
                                                        }}>
                                                            <Business />
                                                        </Avatar>
                                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                                            {drive.isEligible ? (
                                                                <Chip icon={<CheckCircle sx={{ fontSize: 13 }} />}
                                                                    label="Eligible" size="small"
                                                                    sx={{ fontWeight: 700, px: 0.5, height: 24, bgcolor: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', fontSize: '0.7rem' }}
                                                                />
                                                            ) : (
                                                                <Tooltip title={drive.eligibilityReasons?.join(', ') || 'Not eligible'} arrow>
                                                                    <Chip icon={<Cancel sx={{ fontSize: 13 }} />}
                                                                        label="Not Eligible" size="small"
                                                                        sx={{ fontWeight: 700, px: 0.5, height: 24, bgcolor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontSize: '0.7rem' }}
                                                                    />
                                                                </Tooltip>
                                                            )}
                                                            {appStatus && (
                                                                <Chip label={isApplied ? 'Applied' : 'Interested'} size="small"
                                                                    sx={{
                                                                        fontWeight: 700, px: 0.5, height: 24, fontSize: '0.7rem',
                                                                        bgcolor: isApplied ? '#ecfdf5' : '#fff7ed',
                                                                        color: isApplied ? '#059669' : '#d97706',
                                                                        border: `1px solid ${isApplied ? '#a7f3d0' : '#fed7aa'}`,
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Box>

                                                    <Typography sx={{ fontWeight: 800, color: '#1e293b', mb: 0.3, fontSize: '1.05rem', lineHeight: 1.3 }}>
                                                        {drive.companyName}
                                                    </Typography>
                                                    <Typography sx={{ color: '#6366f1', fontWeight: 700, mb: 2, fontSize: '0.8rem' }}>
                                                        {drive.role}
                                                    </Typography>

                                                    {/* Info Badges */}
                                                    <Box sx={{ display: 'flex', gap: 0.8, mb: 2, flexWrap: 'wrap' }}>
                                                        {[
                                                            { label: 'Package', value: drive.package || 'TBD' },
                                                            { label: 'Min CGPA', value: drive.minCGPA || '0.0' },
                                                            { label: 'Backlogs', value: drive.maxBacklogs || 0 },
                                                        ].map((info, idx) => (
                                                            <Box key={idx} sx={{ flex: 1, minWidth: 70, p: 1.2, borderRadius: '9px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                                                <Typography sx={{ fontSize: '0.55rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>{info.label}</Typography>
                                                                <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#1e293b' }}>{info.value}</Typography>
                                                            </Box>
                                                        ))}
                                                    </Box>

                                                    {/* Eligible Branches */}
                                                    {drive.eligibleDepartments?.length > 0 && (
                                                        <Box sx={{ mb: 2 }}>
                                                            <Typography sx={{ fontSize: '0.55rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', mb: 0.6, letterSpacing: '0.05em' }}>
                                                                Eligible Branches
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4 }}>
                                                                {drive.eligibleDepartments.map((dept, idx) => (
                                                                    <Chip key={idx} label={dept.department || dept} size="small"
                                                                        sx={{ borderRadius: '6px', fontSize: '0.6rem', fontWeight: 700, height: 20 }} />
                                                                ))}
                                                            </Box>
                                                        </Box>
                                                    )}

                                                    {/* Self-Track Status */}
                                                    {drive.isEligible && (
                                                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                                            <InputLabel sx={{ fontSize: '0.85rem' }}>Self-Track Status</InputLabel>
                                                            <Select
                                                                value={appStatus || 'none'}
                                                                label="Self-Track Status"
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    if (val === 'none') return;
                                                                    handleStatusChange(drive.id, val);
                                                                }}
                                                                sx={{ borderRadius: '10px', fontSize: '0.8rem' }}
                                                            >
                                                                <MenuItem value="none" disabled>Select Status</MenuItem>
                                                                <MenuItem value="interested">Mark as Interested</MenuItem>
                                                                <MenuItem value="applied">Mark as Applied</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    )}

                                                    <Box sx={{
                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                        pt: 1.5, borderTop: '1px solid #f1f5f9',
                                                    }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <AccessTime sx={{ fontSize: 14, color: daysRemaining <= 3 ? '#ef4444' : '#64748b' }} />
                                                            <Typography sx={{
                                                                fontWeight: 700, fontSize: '0.72rem',
                                                                color: daysRemaining <= 3 ? '#ef4444' : '#64748b',
                                                            }}>
                                                                {daysRemaining > 0 ? `${daysRemaining}d left` : 'Expired'}
                                                            </Typography>
                                                        </Box>
                                                        <Button
                                                            size="small"
                                                            onClick={() => handleExpandClick(drive.id)}
                                                            endIcon={<ExpandMoreIcon sx={{
                                                                transform: expandedId === drive.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                                                transition: '0.3s', fontSize: '15px !important',
                                                            }} />}
                                                            sx={{
                                                                fontWeight: 700, fontSize: '0.72rem',
                                                                textTransform: 'none', color: '#64748b',
                                                                minWidth: 'auto', px: 1,
                                                            }}
                                                        >
                                                            Details
                                                        </Button>
                                                    </Box>

                                                    <Collapse in={expandedId === drive.id} timeout="auto" unmountOnExit>
                                                        <Typography sx={{
                                                            mt: 1.5, color: '#475569', lineHeight: 1.6,
                                                            background: '#f8fafc', p: 1.5, borderRadius: '9px',
                                                            fontSize: '0.78rem',
                                                        }}>
                                                            {drive.description || "No specific details shared."}
                                                        </Typography>
                                                    </Collapse>
                                                </CardContent>

                                                <Box sx={{ px: { xs: 2.5, md: 3 }, pb: { xs: 2, md: 2.5 }, pt: 0 }}>
                                                    <Button
                                                        variant="contained" fullWidth
                                                        onClick={() => handleApplyClick(drive)}
                                                        disabled={!drive.isEligible || (!user?.profileCompleted && !appStatus)}
                                                        sx={{
                                                            py: 1.2, borderRadius: '11px', fontWeight: 800,
                                                            textTransform: 'none', fontSize: '0.85rem',
                                                            background: !drive.isEligible ? '#f1f5f9'
                                                                : isApplied ? '#f1f5f9'
                                                                : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                                            color: !drive.isEligible ? '#94a3b8' : isApplied ? '#64748b' : '#fff',
                                                            boxShadow: !drive.isEligible || isApplied ? 'none' : '0 4px 10px rgba(99,102,241,0.2)',
                                                            '&:hover': { background: !drive.isEligible ? '#f1f5f9' : isApplied ? '#e2e8f0' : '#4338ca' },
                                                            '&.Mui-disabled': { background: '#f1f5f9', color: '#94a3b8' },
                                                        }}
                                                    >
                                                        {!drive.isEligible ? 'Not Eligible' : isApplied ? 'View Details & Apply Again' : 'Apply Now'}
                                                    </Button>
                                                </Box>
                                            </Card>
                                        </motion.div>
                                    </Grid>
                                );
                            })}
                        </AnimatePresence>
                    </Grid>
                </motion.div>

                {/* Empty state */}
                {!loading && filteredDrives.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                        <Avatar sx={{ width: 72, height: 72, mx: 'auto', mb: 2.5, bgcolor: '#f1f5f9', color: '#94a3b8' }}>
                            <BookmarkBorder sx={{ fontSize: 32 }} />
                        </Avatar>
                        <Typography sx={{ fontWeight: 700, color: '#475569', mb: 0.5, fontSize: '1rem' }}>
                            {searchQuery || filterStatus !== 'all' ? 'No matching drives' : 'No active drives'}
                        </Typography>
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                            {searchQuery || filterStatus !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Check back soon for new placement opportunities'}
                        </Typography>
                    </Box>
                )}

                {/* Apply Dialog */}
                <ApplyDialog
                    open={applyDialog.open}
                    onClose={() => setApplyDialog({ open: false, drive: null, profile: null })}
                    drive={applyDialog.drive}
                    studentProfile={applyDialog.profile}
                    onApplied={handleApplied}
                />
            </Container>
        </Box>
    );
};

export default StudentDashboard;
