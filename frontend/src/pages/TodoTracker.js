import React, { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import {
    Container, Typography, TextField, Button, Box,
    Paper, IconButton, ListItem, ListItemText,
    Chip, Avatar, Stack, Zoom, Checkbox, Tooltip
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TerminalIcon from '@mui/icons-material/Terminal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const TodoTracker = () => {
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState('');
    const [deadline, setDeadline] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Dynamic Theme Colors
    const theme = {
        bg: isDarkMode ? '#020617' : '#f8fafc',
        card: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : '#ffffff',
        text: isDarkMode ? '#ffffff' : '#0f172a',
        subText: isDarkMode ? '#64748b' : '#475569',
        border: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#e2e8f0',
        inputBg: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : '#f1f5f9',
    };

    const fetchTasks = useCallback(async () => {
        try {
            const res = await API.get('/todos');
            setTasks(res.data.todos || []);
        } catch (err) {
            console.error("Fetch failed");
        }
    }, []);

    useEffect(() => { fetchTasks(); }, [fetchTasks]);

    const handleAdd = async () => {
        if (!input.trim()) return;
        setLoading(true);
        try {
            await API.post('/todos', { task: input, deadline: deadline || null });
            setInput('');
            setDeadline('');
            fetchTasks();
        } catch (err) {
            console.error("Add failed");
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (id) => {
        try {
            // Optimistic update
            setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
            await API.patch(`/todos/${id}/toggle`);
        } catch (err) {
            console.error("Toggle failed");
            fetchTasks(); // Revert on failure
        }
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`/todos/${id}`);
            fetchTasks();
        } catch (err) {
            console.error("Delete failed");
        }
    };

    const formatDeadline = (date) => {
        if (!date) return null;
        const d = new Date(date);
        const now = new Date();
        const diffDays = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
        const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        return { label, overdue: diffDays < 0, urgent: diffDays >= 0 && diffDays <= 2 };
    };

    const completedCount = tasks.filter(t => t.isCompleted).length;
    const pendingCount = tasks.length - completedCount;

    return (
        <Box sx={{
            minHeight: '100vh',
            background: theme.bg,
            py: { xs: 4, sm: 6, md: 10 },
            position: 'relative',
            overflow: 'hidden',
            transition: 'background 0.5s ease'
        }}>
            {/* --- TOP RIGHT CONTROLS --- */}
            <Box sx={{ position: { xs: 'relative', md: 'absolute' }, top: { md: 30 }, right: { md: 30 }, zIndex: 10, display: 'flex', justifyContent: 'center', mb: { xs: 3, md: 0 } }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    {/* Task Counter HUD */}
                    <Zoom in={true}>
                        <Paper sx={{
                            px: 3, py: 1, borderRadius: '12px',
                            background: isDarkMode ? 'rgba(99, 102, 241, 0.1)' : '#6366f1',
                            color: '#fff', border: '1px solid rgba(99, 102, 241, 0.2)',
                            boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)',
                            display: 'flex', alignItems: 'center', gap: 2
                        }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1 }}>{pendingCount}</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.8, letterSpacing: 1, fontSize: '0.6rem' }}>PENDING</Typography>
                            </Box>
                            <Box sx={{ width: 1, height: 24, bgcolor: 'rgba(255,255,255,0.2)' }} />
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1, color: '#34d399' }}>{completedCount}</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.8, letterSpacing: 1, fontSize: '0.6rem' }}>DONE</Typography>
                            </Box>
                        </Paper>
                    </Zoom>

                    {/* Theme Toggle Button */}
                    <IconButton
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        sx={{
                            bgcolor: theme.card, border: `1px solid ${theme.border}`,
                            color: isDarkMode ? '#fbbf24' : '#6366f1',
                            '&:hover': { bgcolor: theme.inputBg }
                        }}
                    >
                        {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>
                </Stack>
            </Box>

            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                {/* --- HEADER --- */}
                <Box sx={{ mb: 6 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <TerminalIcon sx={{ color: '#6366f1', fontSize: 20 }} />
                        <Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 900, letterSpacing: 2 }}>
                            WORKSPACE_CORE
                        </Typography>
                    </Stack>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: theme.text, letterSpacing: '-0.04em', fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' } }}>
                        Task <span style={{ color: '#6366f1' }}>Highlights.</span>
                    </Typography>
                </Box>

                {/* --- INPUT TERMINAL --- */}
                <Paper elevation={0} sx={{
                    p: 1.5, mb: 6, borderRadius: '20px',
                    background: theme.card,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${theme.border}`,
                    boxShadow: isDarkMode ? '0 20px 40px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.05)'
                }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            variant="standard"
                            placeholder="Initialize new objective..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            InputProps={{
                                disableUnderline: true,
                                sx: { px: 2, py: 1, color: theme.text, fontSize: '1.1rem', fontWeight: 500 }
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleAdd}
                            disabled={loading}
                            sx={{
                                borderRadius: '14px', minWidth: '56px',
                                background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                                '&:hover': { background: 'linear-gradient(45deg, #4f46e5, #9333ea)' }
                            }}
                        >
                            <AddCircleIcon />
                        </Button>
                    </Box>
                    {/* Deadline Row */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, pt: 1 }}>
                        <EventIcon sx={{ fontSize: 16, color: theme.subText }} />
                        <TextField
                            variant="standard"
                            type="date"
                            placeholder="Deadline"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            InputProps={{
                                disableUnderline: true,
                                sx: { color: theme.subText, fontSize: '0.85rem' }
                            }}
                            sx={{ maxWidth: 160 }}
                        />
                        {deadline && (
                            <Chip
                                label="Clear"
                                size="small"
                                onDelete={() => setDeadline('')}
                                sx={{ fontSize: '0.7rem', height: 22, color: theme.subText }}
                            />
                        )}
                    </Box>
                </Paper>

                {/* --- TASK LIST --- */}
                <Box>
                    <AnimatePresence mode='popLayout'>
                        {tasks.length > 0 ? tasks.map((t) => {
                            const dl = formatDeadline(t.deadline);
                            return (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                >
                                    <Paper sx={{
                                        p: 0, mb: 3, borderRadius: '24px',
                                        background: theme.card,
                                        border: `1px solid ${theme.border}`,
                                        overflow: 'hidden',
                                        position: 'relative',
                                        transition: '0.3s',
                                        opacity: t.isCompleted ? 0.6 : 1,
                                        '&:hover': {
                                            borderColor: '#6366f1',
                                            transform: 'translateY(-5px)',
                                            boxShadow: isDarkMode ? '0 10px 30px rgba(99, 102, 241, 0.2)' : '0 10px 30px rgba(0,0,0,0.05)'
                                        }
                                    }}>
                                        <Box sx={{
                                            position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px',
                                            background: t.isCompleted
                                                ? 'linear-gradient(to bottom, #10b981, #34d399)'
                                                : 'linear-gradient(to bottom, #6366f1, #a855f7)'
                                        }} />

                                        <ListItem sx={{ py: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3, md: 4 } }}>
                                            {/* Toggle Checkbox */}
                                            <Tooltip title={t.isCompleted ? "Mark as pending" : "Mark as done"}>
                                                <Checkbox
                                                    checked={t.isCompleted}
                                                    onChange={() => handleToggle(t.id)}
                                                    icon={<RadioButtonUncheckedIcon sx={{ color: theme.subText, fontSize: 28 }} />}
                                                    checkedIcon={<CheckCircleOutlineIcon sx={{ color: '#10b981', fontSize: 28 }} />}
                                                    sx={{ mr: 1, p: 0.5 }}
                                                />
                                            </Tooltip>

                                            <Avatar sx={{
                                                bgcolor: t.isCompleted
                                                    ? (isDarkMode ? 'rgba(16, 185, 129, 0.1)' : '#ecfdf5')
                                                    : (isDarkMode ? 'rgba(99, 102, 241, 0.1)' : '#eef2ff'),
                                                color: t.isCompleted ? '#10b981' : '#6366f1',
                                                mr: { xs: 1.5, sm: 3 }, width: { xs: 36, sm: 48 }, height: { xs: 36, sm: 48 }, border: `1px solid ${theme.border}`
                                            }}>
                                                <AssignmentIcon fontSize="small" />
                                            </Avatar>
                                            <ListItemText
                                                primary={t.task}
                                                primaryTypographyProps={{
                                                    fontWeight: 800, color: theme.text, fontSize: { xs: '0.95rem', sm: '1.2rem' },
                                                    letterSpacing: '-0.02em',
                                                    sx: {
                                                        textDecoration: t.isCompleted ? 'line-through' : 'none',
                                                        opacity: t.isCompleted ? 0.7 : 1,
                                                    }
                                                }}
                                                secondary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                        <Chip
                                                            label={t.isCompleted ? "Completed" : "Pending"}
                                                            size="small"
                                                            sx={{
                                                                fontWeight: 700, fontSize: '0.7rem', height: 22,
                                                                bgcolor: t.isCompleted
                                                                    ? (isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5')
                                                                    : (isDarkMode ? 'rgba(251, 191, 36, 0.15)' : '#fff7ed'),
                                                                color: t.isCompleted ? '#10b981' : '#f59e0b',
                                                                border: `1px solid ${t.isCompleted ? '#10b981' : '#f59e0b'}`,
                                                            }}
                                                        />
                                                        {dl && (
                                                            <Chip
                                                                icon={<EventIcon sx={{ fontSize: 12 }} />}
                                                                label={dl.label}
                                                                size="small"
                                                                sx={{
                                                                    fontWeight: 700, fontSize: '0.7rem', height: 22,
                                                                    bgcolor: dl.overdue
                                                                        ? (isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2')
                                                                        : dl.urgent
                                                                            ? (isDarkMode ? 'rgba(251, 191, 36, 0.15)' : '#fff7ed')
                                                                            : 'transparent',
                                                                    color: dl.overdue ? '#ef4444' : dl.urgent ? '#f59e0b' : theme.subText,
                                                                    border: `1px solid ${dl.overdue ? '#ef4444' : dl.urgent ? '#f59e0b' : theme.border}`,
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                }
                                            />
                                            <IconButton
                                                onClick={() => handleDelete(t.id)}
                                                sx={{ color: isDarkMode ? 'rgba(244, 63, 94, 0.4)' : '#fda4af', '&:hover': { color: '#f43f5e', background: 'rgba(244, 63, 94, 0.1)' } }}
                                            >
                                                <DeleteOutlineIcon />
                                            </IconButton>
                                        </ListItem>
                                    </Paper>
                                </motion.div>
                            );
                        }) : (
                            <Box sx={{ py: 10, textAlign: 'center', opacity: 0.4 }}>
                                <CheckCircleIcon sx={{ fontSize: 60, color: theme.text, mb: 2 }} />
                                <Typography sx={{ color: theme.text, fontWeight: 800 }}>OBJECTIVES CLEAR</Typography>
                            </Box>
                        )}
                    </AnimatePresence>
                </Box>
            </Container>
        </Box>
    );
};

export default TodoTracker;
