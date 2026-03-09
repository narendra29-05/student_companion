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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

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

    const features = [
        { icon: <TrendingUpIcon />, title: 'Placement Drives', desc: 'Browse & apply to matching opportunities' },
        { icon: <MenuBookIcon />, title: 'Study Resources', desc: 'Access faculty-shared materials' },
        { icon: <AssignmentTurnedInIcon />, title: 'Assignments', desc: 'Track deadlines & submissions' },
        { icon: <GroupsIcon />, title: 'Campus Connect', desc: 'Stay updated with notifications' },
    ];

    return (
        <Box sx={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            background: '#f8fafc',
        }}>
            {/* Left Panel — Branding (desktop only, hidden on mobile) */}
            <Box sx={{
                display: { xs: 'none', md: 'flex' },
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 40%, #818cf8 100%)',
                px: 6,
                py: 8,
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Background decorative circles */}
                <Box sx={{
                    position: 'absolute', width: 400, height: 400, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)', top: -100, left: -100,
                }} />
                <Box sx={{
                    position: 'absolute', width: 300, height: 300, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)', bottom: -50, right: -50,
                }} />
                <Box sx={{
                    position: 'absolute', width: 200, height: 200, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.03)', top: '40%', right: '20%',
                }} />

                <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 480, width: '100%' }}>
                    <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                        <Box sx={{
                            width: 72, height: 72, borderRadius: '20px',
                            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            mb: 4, border: '1px solid rgba(255,255,255,0.25)',
                        }}>
                            <SchoolIcon sx={{ color: '#fff', fontSize: 38 }} />
                        </Box>
                    </motion.div>

                    <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                        <Typography sx={{
                            color: '#fff', fontWeight: 900, fontSize: '2.75rem',
                            lineHeight: 1.15, letterSpacing: '-0.03em', mb: 2,
                        }}>
                            Student<br />Companion
                        </Typography>
                        <Typography sx={{
                            color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem',
                            lineHeight: 1.6, mb: 6, maxWidth: 400,
                        }}>
                            Your all-in-one platform for placement drives, academic resources, and campus life management.
                        </Typography>
                    </motion.div>

                    {/* Feature cards */}
                    <Stack spacing={2}>
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: -40, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                            >
                                <Box sx={{
                                    display: 'flex', alignItems: 'center', gap: 2,
                                    p: 2, borderRadius: '14px',
                                    background: 'rgba(255,255,255,0.08)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        background: 'rgba(255,255,255,0.14)',
                                        transform: 'translateX(8px)',
                                    },
                                }}>
                                    <Box sx={{
                                        width: 42, height: 42, borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.15)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#fff', flexShrink: 0,
                                    }}>
                                        {f.icon}
                                    </Box>
                                    <Box>
                                        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
                                            {f.title}
                                        </Typography>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                                            {f.desc}
                                        </Typography>
                                    </Box>
                                </Box>
                            </motion.div>
                        ))}
                    </Stack>
                </Box>
            </Box>

            {/* Mobile Top Branding */}
            <Box sx={{
                display: { xs: 'flex', md: 'none' },
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(180deg, #4f46e5 0%, #6366f1 40%, #818cf8 100%)',
                pt: 5, pb: 3, px: 2,
            }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}>
                    <Box sx={{
                        width: 60, height: 60, borderRadius: '20px',
                        background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mb: 2, mx: 'auto', border: '1px solid rgba(255,255,255,0.3)',
                    }}>
                        <SchoolIcon sx={{ color: '#fff', fontSize: 32 }} />
                    </Box>
                </motion.div>
                <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.02em' }}>
                    Student Companion
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', mt: 0.5 }}>
                    Sign in to continue
                </Typography>
            </Box>

            {/* Right Panel — Form */}
            <Box sx={{
                flex: { xs: 1, md: 1 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: { xs: '#fff', md: '#f8fafc' },
                borderRadius: { xs: '28px 28px 0 0', md: 0 },
                px: { xs: 2.5, sm: 3, md: 6 },
                pt: { xs: 3, sm: 4, md: 0 },
                pb: { xs: 2, md: 0 },
                mt: { xs: -2, md: 0 },
                position: 'relative',
                zIndex: 1,
            }}>
                <Box sx={{
                    width: '100%',
                    maxWidth: 440,
                    background: { md: '#fff' },
                    borderRadius: { md: '28px' },
                    px: { md: 5 },
                    py: { md: 5 },
                    boxShadow: { md: '0 4px 24px rgba(0,0,0,0.06)' },
                }}>
                    {/* Desktop form header */}
                    <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 4 }}>
                        <Typography sx={{ fontWeight: 900, fontSize: '1.75rem', color: '#1e293b', letterSpacing: '-0.02em' }}>
                            Welcome back
                        </Typography>
                        <Typography sx={{ color: '#64748b', fontSize: '0.95rem', mt: 0.5 }}>
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
                            borderRadius: '14px', p: '4px',
                            '& .MuiToggleButton-root': {
                                border: 'none', borderRadius: '11px !important',
                                py: 1, textTransform: 'none', fontWeight: 700,
                                fontSize: '0.9rem', color: '#64748b',
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

                    {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, fontSize: '0.85rem' }}>
                                    {role === 'student' ? 'Roll Number' : 'Faculty ID'}
                                </Typography>
                                <TextField
                                    fullWidth placeholder={role === 'student' ? 'e.g. 22B01A0501' : 'e.g. FAC001'}
                                    value={formData.identifier}
                                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value.toUpperCase() })}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px', background: '#f8fafc',
                                            '& fieldset': { borderColor: '#e2e8f0' },
                                            '&:hover fieldset': { borderColor: '#cbd5e1' },
                                            '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
                                        }
                                    }}
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
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px', background: '#f8fafc',
                                            '& fieldset': { borderColor: '#e2e8f0' },
                                            '&:hover fieldset': { borderColor: '#cbd5e1' },
                                            '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
                                        }
                                    }}
                                />
                            </Box>

                            <Button
                                type="submit" fullWidth variant="contained" disabled={loading}
                                sx={{
                                    mt: 1, py: 1.5, borderRadius: '14px', fontWeight: 800,
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

                    {/* Register link */}
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
