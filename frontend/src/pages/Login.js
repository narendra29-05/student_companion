import React, { useState } from 'react';
import {
    Container, Typography, TextField, Button, Box,
    ToggleButton, ToggleButtonGroup, Alert, Paper, Grid, Avatar, Chip, Stack, IconButton,
    InputAdornment
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Icons
import SecurityIcon from '@mui/icons-material/Security';
import HubIcon from '@mui/icons-material/Hub';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
    const [role, setRole] = useState('student');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const theme = {
        bg: isDarkMode ? '#020617' : '#f8fafc',
        card: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.8)',
        glassBorder: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
        text: isDarkMode ? '#ffffff' : '#0f172a',
        subText: isDarkMode ? '#94a3b8' : '#475569',
        inputBg: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
        shadow: isDarkMode ? '0 40px 100px rgba(0,0,0,0.5)' : '0 20px 50px rgba(0,0,0,0.1)'
    };

    const roleContent = {
        student: {
            title: "Student Portal",
            desc: "Access your personalized placement cockpit, track attendance, and sync materials.",
            icon: <FingerprintIcon sx={{ fontSize: 40 }} />,
            color: "#6366f1",
            status: "Student Network Active"
        },
        faculty: {
            title: "Faculty Command",
            desc: "Oversee placement cycles, manage student eligibility, and broadcast new drives.",
            icon: <SecurityIcon sx={{ fontSize: 40 }} />,
            color: "#a855f7",
            status: "Admin Secure-Line"
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const credentials = role === 'student'
                ? { rollNumber: formData.identifier, password: formData.password }
                : { facultyId: formData.identifier, password: formData.password };

            await login(credentials, role);
            toast.success('Identity Verified');
            navigate(role === 'student' ? '/student/dashboard' : '/faculty/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
            toast.error('Invalid Credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            height: '100dvh',
            background: theme.bg,
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            transition: 'background 0.5s ease'
        }}>
            {/* --- THEME TOGGLE --- */}
            <Box sx={{ position: 'absolute', top: { xs: 12, md: 30 }, right: { xs: 12, md: 30 }, zIndex: 10 }}>
                <IconButton
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    sx={{
                        bgcolor: theme.card,
                        border: `1px solid ${theme.glassBorder}`,
                        color: isDarkMode ? '#fbbf24' : '#6366f1',
                        backdropFilter: 'blur(10px)',
                        '&:hover': { bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
                    }}
                >
                    {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
            </Box>

            {/* --- COSMIC BACKGROUND --- */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: isDarkMode ? 0.15 : 0.08 }}
                transition={{ duration: 10, repeat: Infinity }}
                style={{
                    position: 'absolute', top: '10%', left: '10%', width: '600px', height: '600px',
                    background: `radial-gradient(circle, ${roleContent[role].color} 0%, transparent 70%)`,
                    filter: 'blur(120px)', zIndex: 0
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={{ xs: 0, md: 8 }} alignItems="center">

                    {/* --- LEFT SIDE: AUTH VISUALIZER (desktop only) --- */}
                    <Grid item xs={12} md={7} sx={{ display: { xs: 'none', md: 'block' } }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={role}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Box sx={{ p: 2 }}>
                                    <Chip
                                        icon={<HubIcon sx={{ color: `${roleContent[role].color} !important`, fontSize: '1rem' }} />}
                                        label={roleContent[role].status}
                                        sx={{
                                            bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.05)',
                                            color: theme.text, mb: 3, px: 2, py: 2,
                                            borderRadius: '12px', border: `1px solid ${theme.glassBorder}`
                                        }}
                                    />
                                    <Typography variant="h2" sx={{ fontWeight: 900, color: theme.text, mb: 2, letterSpacing: '-0.05em', lineHeight: 1.1 }}>
                                        Secure <Box component="span" sx={{
                                            display: 'inline-block',
                                            background: isDarkMode
                                                ? `linear-gradient(90deg, ${roleContent[role].color}, #fff)`
                                                : `linear-gradient(90deg, ${roleContent[role].color}, #1e293b)`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}>Access.</Box>
                                    </Typography>
                                    <Typography variant="h5" sx={{ color: theme.subText, mb: 6, maxWidth: '520px', fontWeight: 400, lineHeight: 1.6 }}>
                                        {roleContent[role].desc}
                                    </Typography>

                                    <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
                                        <Paper sx={{
                                            p: 5, width: '380px', borderRadius: '40px',
                                            background: theme.card,
                                            border: `1px solid ${theme.glassBorder}`,
                                            backdropFilter: 'blur(20px)',
                                            textAlign: 'center',
                                            position: 'relative', overflow: 'hidden',
                                            boxShadow: theme.shadow
                                        }}>
                                            <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                                                <Avatar sx={{
                                                    bgcolor: roleContent[role].color, width: 80, height: 80, mx: 'auto',
                                                    boxShadow: `0 0 40px ${roleContent[role].color}40`
                                                }}>
                                                    {roleContent[role].icon}
                                                </Avatar>
                                                <motion.div
                                                    animate={{ top: ['0%', '100%', '0%'] }}
                                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                    style={{
                                                        position: 'absolute', left: 0, width: '100%', height: '2px',
                                                        background: '#fff', boxShadow: `0 0 15px #fff`, zIndex: 10
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="h6" sx={{ color: theme.text, fontWeight: 800, mb: 1 }}>
                                                {roleContent[role].title}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: theme.subText, letterSpacing: 1, textTransform: 'uppercase' }}>
                                                Biometric Verified • AES-256
                                            </Typography>
                                        </Paper>
                                    </motion.div>
                                </Box>
                            </motion.div>
                        </AnimatePresence>
                    </Grid>

                    {/* --- RIGHT SIDE: LOGIN FORM --- */}
                    <Grid item xs={12} md={5}>
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                            <Paper sx={{
                                p: { xs: 3, sm: 4, md: 6 },
                                borderRadius: { xs: '24px', md: '40px' },
                                background: theme.card,
                                backdropFilter: 'blur(40px)',
                                border: `1px solid ${theme.glassBorder}`,
                                boxShadow: theme.shadow,
                                mx: { xs: 1, sm: 2, md: 0 },
                            }}>
                                <Box sx={{ mb: { xs: 3, md: 5 }, textAlign: 'center' }}>
                                    {/* Mobile-only icon */}
                                    <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 2 }}>
                                        <Avatar sx={{
                                            bgcolor: roleContent[role].color, width: 56, height: 56,
                                            boxShadow: `0 0 30px ${roleContent[role].color}40`
                                        }}>
                                            {React.cloneElement(roleContent[role].icon, { sx: { fontSize: 28 } })}
                                        </Avatar>
                                    </Box>
                                    <Typography variant="h4" sx={{
                                        fontWeight: 900, color: theme.text, mb: 0.5, letterSpacing: '-0.02em',
                                        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' }
                                    }}>
                                        Authentication
                                    </Typography>
                                    <Typography sx={{ color: theme.subText, fontWeight: 500, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                                        Student Companion v2.0
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 3, md: 5 } }}>
                                    <ToggleButtonGroup
                                        value={role} exclusive
                                        onChange={(e, next) => next && setRole(next)}
                                        sx={{
                                            background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                            borderRadius: '16px', p: 0.5,
                                            '& .MuiToggleButton-root': {
                                                border: 'none', borderRadius: '12px !important',
                                                px: { xs: 3, md: 4 }, py: { xs: 0.8, md: 1 },
                                                color: theme.subText, textTransform: 'none', fontWeight: 700,
                                                fontSize: { xs: '0.85rem', md: '0.9rem' },
                                                '&.Mui-selected': {
                                                    background: isDarkMode ? '#fff' : '#0f172a',
                                                    color: isDarkMode ? '#020617' : '#fff',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                                }
                                            }
                                        }}
                                    >
                                        <ToggleButton value="student">Student</ToggleButton>
                                        <ToggleButton value="faculty">Faculty</ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>

                                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '12px', fontSize: '0.85rem' }}>{error}</Alert>}

                                <form onSubmit={handleSubmit}>
                                    <Stack spacing={{ xs: 2, md: 3 }}>
                                        <TextField
                                            fullWidth label={role === 'student' ? 'Roll Number' : 'Faculty ID'}
                                            variant="filled" size="medium"
                                            value={formData.identifier}
                                            onChange={(e) => setFormData({ ...formData, identifier: e.target.value.toUpperCase() })}
                                            InputProps={{
                                                disableUnderline: true,
                                                sx: {
                                                    borderRadius: '14px', background: theme.inputBg, color: theme.text,
                                                    border: `1px solid ${theme.glassBorder}`, transition: '0.3s',
                                                    '&.Mui-focused': { border: `1px solid ${roleContent[role].color}` }
                                                }
                                            }}
                                            InputLabelProps={{ sx: { color: theme.subText, '&.Mui-focused': { color: theme.text } } }}
                                        />
                                        <TextField
                                            fullWidth label="Password" type={showPwd ? 'text' : 'password'}
                                            variant="filled" size="medium"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            InputProps={{
                                                disableUnderline: true,
                                                sx: {
                                                    borderRadius: '14px', background: theme.inputBg, color: theme.text,
                                                    border: `1px solid ${theme.glassBorder}`, transition: '0.3s',
                                                    '&.Mui-focused': { border: `1px solid ${roleContent[role].color}` }
                                                },
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowPwd(!showPwd)} edge="end" sx={{ color: theme.subText }}>
                                                            {showPwd ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            InputLabelProps={{ sx: { color: theme.subText, '&.Mui-focused': { color: theme.text } } }}
                                        />

                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                                type="submit" fullWidth disabled={loading}
                                                sx={{
                                                    py: { xs: 1.5, md: 2 }, borderRadius: '14px', fontWeight: 900,
                                                    fontSize: { xs: '0.9rem', md: '1.05rem' },
                                                    background: `linear-gradient(45deg, ${roleContent[role].color}, ${roleContent[role].color}cc)`,
                                                    color: '#fff', textTransform: 'none',
                                                    boxShadow: `0 12px 24px ${roleContent[role].color}40`,
                                                    '&:hover': { filter: 'brightness(1.1)' }
                                                }}
                                            >
                                                {loading ? 'Processing...' : 'Verify Identity'}
                                            </Button>
                                        </motion.div>
                                    </Stack>
                                </form>

                                <Typography align="center" sx={{ mt: { xs: 2.5, md: 5 }, color: theme.subText, fontWeight: 500, fontSize: { xs: '0.85rem', md: '0.9rem' } }}>
                                    New Member? <Button onClick={() => navigate('/register')} sx={{ color: isDarkMode ? '#fff' : roleContent[role].color, fontWeight: 800, textTransform: 'none', fontSize: 'inherit' }}>Initialize Account</Button>
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Login;
