import React, { useState } from 'react';
import {
    Typography, TextField, Button, Box, ToggleButton, ToggleButtonGroup,
    Alert, Stack, IconButton, InputAdornment
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ScienceIcon from '@mui/icons-material/Science';
import ComputerIcon from '@mui/icons-material/Computer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

/* Floating animated icon component (desktop only) */
const FloatingIcon = ({ icon, size, top, left, right, bottom, delay, duration, color, rotate }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
            opacity: [0, 0.7, 0.5, 0.7],
            scale: 1,
            y: [0, -18, 0, 18, 0],
            x: [0, 8, 0, -8, 0],
            rotate: rotate ? [0, 10, -10, 0] : 0,
        }}
        transition={{
            opacity: { delay, duration: 1 },
            scale: { delay, duration: 0.6, type: 'spring' },
            y: { delay: delay + 0.5, duration: duration || 6, repeat: Infinity, ease: 'easeInOut' },
            x: { delay: delay + 0.5, duration: (duration || 6) * 1.3, repeat: Infinity, ease: 'easeInOut' },
            rotate: { delay: delay + 0.5, duration: (duration || 6) * 0.8, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{
            position: 'absolute', top, left, right, bottom, zIndex: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: size, height: size, borderRadius: size * 0.28,
            background: `${color}18`,
            backdropFilter: 'blur(6px)',
            border: `1.5px solid ${color}30`,
            boxShadow: `0 8px 32px ${color}15`,
        }}
    >
        {React.cloneElement(icon, { sx: { color, fontSize: size * 0.5 } })}
    </motion.div>
);

const Login = () => {
    const [role, setRole] = useState('student');
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const credentials = role === 'student'
                ? { rollNumber: formData.identifier, password: formData.password }
                : { facultyId: formData.identifier, password: formData.password };
            await login(credentials, role);
            toast.success('Login successful!');
            navigate(role === 'student' ? '/student/dashboard' : '/faculty/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const inputSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '12px', background: '#f8fafc',
            '& fieldset': { borderColor: '#e2e8f0' },
            '&:hover fieldset': { borderColor: '#cbd5e1' },
            '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
        }
    };

    return (
        <Box sx={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            background: '#f8fafc',
        }}>
            {/* ══════ LEFT PANEL — Desktop branding with floating animated objects ══════ */}
            <Box sx={{
                display: { xs: 'none', md: 'flex' },
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 40%, #818cf8 100%)',
                px: 6, py: 8,
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Background blurs */}
                <Box sx={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: -150, left: -150 }} />
                <Box sx={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', bottom: -80, right: -80 }} />

                {/* Floating animated student objects */}
                <FloatingIcon icon={<MenuBookIcon />} size={64} top="8%" left="10%" delay={0.2} duration={7} color="#fff" rotate />
                <FloatingIcon icon={<SchoolIcon />} size={56} top="12%" right="12%" delay={0.5} duration={5.5} color="#fbbf24" />
                <FloatingIcon icon={<AutoStoriesIcon />} size={50} bottom="22%" left="8%" delay={0.8} duration={6.5} color="#a5f3fc" rotate />
                <FloatingIcon icon={<EmojiEventsIcon />} size={58} bottom="10%" right="10%" delay={1} duration={8} color="#fcd34d" />
                <FloatingIcon icon={<WorkIcon />} size={44} top="40%" left="5%" delay={1.2} duration={5} color="#c4b5fd" rotate />
                <FloatingIcon icon={<AssignmentIcon />} size={48} top="55%" right="6%" delay={0.6} duration={7.5} color="#fbcfe8" />
                <FloatingIcon icon={<ScienceIcon />} size={42} bottom="40%" left="18%" delay={1.5} duration={6} color="#99f6e4" />
                <FloatingIcon icon={<ComputerIcon />} size={52} top="25%" left="30%" delay={0.3} duration={9} color="#e0e7ff" rotate />

                {/* Center text content */}
                <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 440, width: '100%', textAlign: 'center' }}>
                    <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                        <Box sx={{
                            width: 72, height: 72, borderRadius: '22px',
                            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            mb: 3, mx: 'auto', border: '1px solid rgba(255,255,255,0.25)',
                        }}>
                            <SchoolIcon sx={{ color: '#fff', fontSize: 38 }} />
                        </Box>
                    </motion.div>

                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                        <Typography sx={{
                            color: '#fff', fontWeight: 900, fontSize: '2.6rem',
                            lineHeight: 1.15, letterSpacing: '-0.03em', mb: 2,
                        }}>
                            Student<br />Companion
                        </Typography>
                        <Typography sx={{
                            color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem',
                            lineHeight: 1.6, maxWidth: 380, mx: 'auto',
                        }}>
                            Your all-in-one platform for placement drives, academic resources, and campus life management.
                        </Typography>
                    </motion.div>

                    {/* Animated features row */}
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
                        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 5 }}>
                            {[
                                { icon: <TrendingUpIcon sx={{ fontSize: 20 }} />, label: 'Placements' },
                                { icon: <MenuBookIcon sx={{ fontSize: 20 }} />, label: 'Materials' },
                                { icon: <AssignmentIcon sx={{ fontSize: 20 }} />, label: 'Tasks' },
                            ].map((f, i) => (
                                <Box key={i} sx={{
                                    display: 'flex', alignItems: 'center', gap: 1,
                                    px: 2, py: 1, borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                }}>
                                    <Box sx={{ color: '#fff' }}>{f.icon}</Box>
                                    <Typography sx={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>{f.label}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </motion.div>
                </Box>
            </Box>

            {/* ══════ MOBILE — Compact branding header ══════ */}
            <Box sx={{
                display: { xs: 'flex', md: 'none' },
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(180deg, #4f46e5 0%, #6366f1 100%)',
                pt: 5, pb: 3, px: 2,
            }}>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                    <Box sx={{
                        width: 52, height: 52, borderRadius: '18px',
                        background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mb: 1.5, mx: 'auto', border: '1px solid rgba(255,255,255,0.3)',
                    }}>
                        <SchoolIcon sx={{ color: '#fff', fontSize: 28 }} />
                    </Box>
                </motion.div>
                <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.02em' }}>
                    Student Companion
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', mt: 0.3 }}>
                    Sign in to continue
                </Typography>
            </Box>

            {/* ══════ RIGHT PANEL / MOBILE FORM ══════ */}
            <Box sx={{
                flex: { xs: 1, md: 1 },
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'center' },
                background: { xs: '#fff', md: '#f8fafc' },
                borderRadius: { xs: '24px 24px 0 0', md: 0 },
                px: { xs: 2.5, sm: 3, md: 6 },
                pt: { xs: 3, sm: 4, md: 0 },
                pb: { xs: 2, md: 0 },
                mt: { xs: -1.5, md: 0 },
                position: 'relative', zIndex: 1,
            }}>
                <Box sx={{
                    width: '100%', maxWidth: 440,
                    background: { md: '#fff' },
                    borderRadius: { md: '24px' },
                    px: { md: 5 }, py: { md: 5 },
                    boxShadow: { md: '0 4px 24px rgba(0,0,0,0.06)' },
                }}>
                    {/* Desktop form header */}
                    <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 4 }}>
                        <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: '#1e293b', letterSpacing: '-0.02em' }}>
                            Welcome back
                        </Typography>
                        <Typography sx={{ color: '#64748b', fontSize: '0.9rem', mt: 0.5 }}>
                            Sign in to your account
                        </Typography>
                    </Box>

                    {/* Role toggle */}
                    <ToggleButtonGroup
                        value={role} exclusive fullWidth
                        onChange={(e, next) => next && setRole(next)}
                        sx={{
                            mb: { xs: 2.5, md: 3 },
                            background: '#f1f5f9',
                            borderRadius: '12px', p: '3px',
                            '& .MuiToggleButton-root': {
                                border: 'none', borderRadius: '10px !important',
                                py: 0.9, textTransform: 'none', fontWeight: 700,
                                fontSize: '0.88rem', color: '#64748b',
                                '&.Mui-selected': {
                                    background: '#4f46e5', color: '#fff',
                                    boxShadow: '0 2px 8px rgba(79,70,229,0.3)',
                                    '&:hover': { background: '#4338ca' }
                                }
                            }
                        }}
                    >
                        <ToggleButton value="student">Student</ToggleButton>
                        <ToggleButton value="faculty">Faculty</ToggleButton>
                    </ToggleButtonGroup>

                    {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2.5}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, fontSize: '0.85rem' }}>
                                    {role === 'student' ? 'Roll Number' : 'Faculty ID'}
                                </Typography>
                                <TextField
                                    fullWidth placeholder={role === 'student' ? 'e.g. 22B01A0501' : 'e.g. FAC001'}
                                    value={formData.identifier}
                                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value.toUpperCase() })}
                                    sx={inputSx}
                                />
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, fontSize: '0.85rem' }}>
                                    Password
                                </Typography>
                                <TextField
                                    fullWidth type={showPwd ? 'text' : 'password'} placeholder="Enter password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPwd(!showPwd)} edge="end" size="small">
                                                    {showPwd ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={inputSx}
                                />
                            </Box>

                            <Button
                                type="submit" fullWidth variant="contained" disabled={loading}
                                sx={{
                                    mt: 1, py: 1.5, borderRadius: '12px', fontWeight: 800,
                                    fontSize: '0.95rem', textTransform: 'none',
                                    background: '#4f46e5',
                                    boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
                                    '&:hover': { background: '#4338ca' },
                                }}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </Stack>
                    </form>

                    <Box sx={{ textAlign: 'center', mt: { xs: 3, md: 4 } }}>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                            Don't have an account?{' '}
                            <Button
                                onClick={() => navigate('/register')}
                                sx={{ fontWeight: 800, textTransform: 'none', color: '#4f46e5', p: 0, minWidth: 'auto', fontSize: 'inherit', '&:hover': { background: 'none', textDecoration: 'underline' } }}
                            >
                                Register
                            </Button>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;
