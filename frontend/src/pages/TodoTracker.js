import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    Container, Typography, TextField, Button, Box, 
    Paper, IconButton, List, ListItem, ListItemText, 
    Chip, Avatar, Stack, Tooltip, Zoom
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

const TodoTracker = () => {
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

    const API_URL = 'http://localhost:5000/api/todos';
    const token = localStorage.getItem('token');

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
            const res = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data.todos || []); 
        } catch (err) {
            console.error("Fetch failed");
        }
    }, [token, API_URL]);

    useEffect(() => { fetchTasks(); }, [fetchTasks]);

    const handleAdd = async () => {
        if (!input.trim()) return;
        setLoading(true);
        try {
            await axios.post(API_URL, { task: input }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInput('');
            fetchTasks(); 
        } catch (err) {
            console.error("Add failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks(); 
        } catch (err) {
            console.error("Delete failed");
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            background: theme.bg, 
            py: 10,
            position: 'relative',
            overflow: 'hidden',
            transition: 'background 0.5s ease'
        }}>
            {/* --- TOP RIGHT CONTROLS --- */}
            <Box sx={{ position: 'absolute', top: 30, right: 30, zIndex: 10 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    {/* Task Counter HUD */}
                    <Zoom in={true}>
                        <Paper sx={{ 
                            px: 3, py: 1, borderRadius: '12px', 
                            background: isDarkMode ? 'rgba(99, 102, 241, 0.1)' : '#6366f1',
                            color: '#fff', border: '1px solid rgba(99, 102, 241, 0.2)',
                            boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)',
                            display: 'flex', alignItems: 'center', gap: 1.5
                        }}>
                            <Typography variant="h6" sx={{ fontWeight: 900 }}>{tasks.length}</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.8, letterSpacing: 1 }}>TASKS</Typography>
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
                    <Typography variant="h3" sx={{ fontWeight: 900, color: theme.text, letterSpacing: '-0.04em' }}>
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
                            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
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
                </Paper>

                {/* --- HIGHLIGHTED LIST --- */}
                <Box>
                    <AnimatePresence mode='popLayout'>
                        {tasks.length > 0 ? tasks.map((t, index) => (
                            <motion.div
                                key={t._id}
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
                                    '&:hover': {
                                        borderColor: '#6366f1',
                                        transform: 'translateY(-5px)',
                                        boxShadow: isDarkMode ? '0 10px 30px rgba(99, 102, 241, 0.2)' : '0 10px 30px rgba(0,0,0,0.05)'
                                    }
                                }}>
                                    <Box sx={{ 
                                        position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', 
                                        background: 'linear-gradient(to bottom, #6366f1, #a855f7)' 
                                    }} />

                                    <ListItem sx={{ py: 3, px: 4 }}>
                                        <Avatar sx={{ 
                                            bgcolor: isDarkMode ? 'rgba(99, 102, 241, 0.1)' : '#eef2ff', 
                                            color: '#6366f1', 
                                            mr: 3, width: 48, height: 48, border: `1px solid ${theme.border}`
                                        }}>
                                            <AssignmentIcon fontSize="small" />
                                        </Avatar>
                                        <ListItemText 
                                            primary={t.task} 
                                            primaryTypographyProps={{ 
                                                fontWeight: 800, color: theme.text, fontSize: '1.2rem',
                                                letterSpacing: '-0.02em'
                                            }}
                                            secondary="Identity Verified • Secured"
                                            secondaryTypographyProps={{ color: theme.subText, fontWeight: 700, mt: 0.5 }}
                                        />
                                        <IconButton 
                                            onClick={() => handleDelete(t._id)}
                                            sx={{ color: isDarkMode ? 'rgba(244, 63, 94, 0.4)' : '#fda4af', '&:hover': { color: '#f43f5e', background: 'rgba(244, 63, 94, 0.1)' } }}
                                        >
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </ListItem>
                                </Paper>
                            </motion.div>
                        )) : (
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