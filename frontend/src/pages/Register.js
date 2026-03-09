import React, { useState } from 'react';
import {
    Typography, TextField, Button, Box, Stack, Alert,
    ToggleButton, ToggleButtonGroup, MenuItem, IconButton,
    InputAdornment, Grid
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML'];

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [role, setRole] = useState('student');
    const [showPwd, setShowPwd] = useState(false);
    const [formData, setFormData] = useState({
        name: '', identifier: '', collegeEmail: '', department: '', year: 1, password: '', confirmPassword: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.name || !formData.identifier || !formData.collegeEmail || !formData.department || !formData.password) {
            setError('All fields are required');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const userData = role === 'student'
                ? { rollNumber: formData.identifier.toUpperCase(), collegeEmail: formData.collegeEmail, password: formData.password, name: formData.name, department: formData.department, year: Number(formData.year) }
                : { facultyId: formData.identifier.toUpperCase(), collegeEmail: formData.collegeEmail, password: formData.password, name: formData.name, department: formData.department };
            await register(userData, role);
            toast.success('Registration successful!');
            navigate(role === 'student' ? '/student/dashboard' : '/faculty/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const inputSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '12px', background: { xs: '#f8fafc', md: '#f8fafc' },
            '& fieldset': { borderColor: '#e2e8f0' },
            '&:hover fieldset': { borderColor: '#cbd5e1' },
            '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
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
            {/* Left Panel — Branding (desktop) */}
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
                <Box sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', top: -100, left: -100 }} />
                <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -50, right: -50 }} />

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
                            Join Student<br />Companion
                        </Typography>
                        <Typography sx={{
                            color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem',
                            lineHeight: 1.6, mb: 6, maxWidth: 400,
                        }}>
                            Create your account and get access to placement drives, study materials, and more.
                        </Typography>
                    </motion.div>

                    <Stack spacing={2}>
                        {features.map((f, i) => (
                            <motion.div key={i} initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 + i * 0.1 }}>
                                <Box sx={{
                                    display: 'flex', alignItems: 'center', gap: 2, p: 2,
                                    borderRadius: '14px', background: 'rgba(255,255,255,0.08)',
                                    backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)',
                                    transition: 'all 0.3s',
                                    '&:hover': { background: 'rgba(255,255,255,0.14)', transform: 'translateX(8px)' },
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
                                        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{f.title}</Typography>
                                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>{f.desc}</Typography>
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
                pt: 3, pb: 2, px: 2,
            }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                    <Box sx={{
                        width: 52, height: 52, borderRadius: '18px',
                        background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mb: 1.5, mx: 'auto', border: '1px solid rgba(255,255,255,0.3)',
                    }}>
                        <SchoolIcon sx={{ color: '#fff', fontSize: 28 }} />
                    </Box>
                </motion.div>
                <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>
                    Create Account
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', mt: 0.3 }}>
                    Join Student Companion
                </Typography>
            </Box>

            {/* Right Panel — Form */}
            <Box sx={{
                flex: { xs: 1, md: 1 },
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: { xs: '#fff', md: '#f8fafc' },
                borderRadius: { xs: '28px 28px 0 0', md: 0 },
                px: { xs: 2.5, sm: 3, md: 6 },
                pt: { xs: 2.5, sm: 3, md: 0 },
                pb: { xs: 2, md: 0 },
                mt: { xs: -2, md: 0 },
                overflowY: 'auto',
                position: 'relative', zIndex: 1,
            }}>
                <Box sx={{
                    width: '100%', maxWidth: 480,
                    background: { md: '#fff' },
                    borderRadius: { md: '28px' },
                    px: { md: 5 }, py: { md: 4 },
                    boxShadow: { md: '0 4px 24px rgba(0,0,0,0.06)' },
                }}>
                    {/* Desktop form header */}
                    <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 3 }}>
                        <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#1e293b', letterSpacing: '-0.02em' }}>
                            Create your account
                        </Typography>
                        <Typography sx={{ color: '#64748b', fontSize: '0.9rem', mt: 0.5 }}>
                            Fill in your details to get started
                        </Typography>
                    </Box>

                    {/* Role toggle */}
                    <ToggleButtonGroup
                        value={role} exclusive fullWidth
                        onChange={(e, v) => v && setRole(v)}
                        sx={{
                            mb: 2,
                            background: '#f1f5f9', borderRadius: '14px', p: '4px',
                            '& .MuiToggleButton-root': {
                                border: 'none', borderRadius: '11px !important',
                                py: 0.8, textTransform: 'none', fontWeight: 700,
                                fontSize: '0.85rem', color: '#64748b',
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

                    {error && <Alert severity="error" sx={{ mb: 1.5, borderRadius: '12px' }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <TextField fullWidth placeholder="Full Name" name="name" onChange={handleChange} sx={inputSx} />

                            <Grid container spacing={1.5}>
                                <Grid item xs={12} sm={7}>
                                    <TextField fullWidth placeholder={role === 'student' ? "Roll Number" : "Faculty ID"} name="identifier" onChange={handleChange} sx={inputSx} />
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <TextField
                                        select fullWidth name="department" label="Department"
                                        value={formData.department} onChange={handleChange} sx={inputSx}
                                    >
                                        {DEPARTMENTS.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                                    </TextField>
                                </Grid>
                            </Grid>

                            <TextField fullWidth placeholder="College Email" name="collegeEmail" type="email" onChange={handleChange} sx={inputSx} />

                            {role === 'student' && (
                                <TextField select fullWidth label="Year" name="year" value={formData.year} onChange={handleChange} sx={inputSx}>
                                    {[1,2,3,4].map(y => <MenuItem key={y} value={y}>Year {y}</MenuItem>)}
                                </TextField>
                            )}

                            <Grid container spacing={1.5}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth placeholder="Password" name="password"
                                        type={showPwd ? 'text' : 'password'} onChange={handleChange} sx={inputSx}
                                        InputProps={{ endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPwd(!showPwd)} size="small" edge="end">
                                                    {showPwd ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                                                </IconButton>
                                            </InputAdornment>
                                        )}}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth placeholder="Confirm Password" name="confirmPassword"
                                        type={showPwd ? 'text' : 'password'} onChange={handleChange}
                                        sx={{
                                            ...inputSx,
                                            '& .MuiOutlinedInput-root': {
                                                ...inputSx['& .MuiOutlinedInput-root'],
                                                '& fieldset': { borderColor: passwordsMatch ? '#10b981' : '#e2e8f0' },
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <Button
                                type="submit" fullWidth variant="contained" disabled={loading}
                                sx={{
                                    mt: 0.5, py: 1.4, borderRadius: '14px', fontWeight: 800,
                                    fontSize: '0.9rem', textTransform: 'none',
                                    background: '#4f46e5',
                                    boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
                                    '&:hover': { background: '#4338ca' },
                                }}
                            >
                                {loading ? 'Creating...' : 'Create Account'}
                            </Button>
                        </Stack>
                    </form>

                    <Box sx={{ textAlign: 'center', mt: 2.5, pb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                            Already have an account?{' '}
                            <Button
                                onClick={() => navigate('/login')}
                                sx={{ fontWeight: 800, textTransform: 'none', color: '#4f46e5', p: 0, minWidth: 'auto', fontSize: 'inherit', '&:hover': { background: 'none', textDecoration: 'underline' } }}
                            >
                                Sign In
                            </Button>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Register;
