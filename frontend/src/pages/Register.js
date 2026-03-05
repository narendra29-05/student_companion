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
            flexDirection: 'column',
            background: 'linear-gradient(180deg, #4f46e5 0%, #6366f1 40%, #818cf8 100%)',
        }}>
            {/* Top branding */}
            <Box sx={{
                flex: '0 0 auto',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                pt: { xs: 3, sm: 4, md: 6 },
                pb: { xs: 2, sm: 3, md: 4 },
                px: 2,
            }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                    <Box sx={{
                        width: { xs: 52, md: 64 }, height: { xs: 52, md: 64 },
                        borderRadius: '18px', background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mb: 1.5, mx: 'auto',
                        border: '1px solid rgba(255,255,255,0.3)',
                    }}>
                        <SchoolIcon sx={{ color: '#fff', fontSize: { xs: 28, md: 34 } }} />
                    </Box>
                </motion.div>
                <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: { xs: '1.2rem', md: '1.6rem' } }}>
                    Create Account
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: { xs: '0.8rem', md: '0.9rem' }, mt: 0.3 }}>
                    Join Student Companion
                </Typography>
            </Box>

            {/* Form card */}
            <Box sx={{
                flex: 1,
                background: '#fff',
                borderRadius: { xs: '28px 28px 0 0', md: '32px 32px 0 0' },
                px: { xs: 2.5, sm: 3, md: 0 },
                pt: { xs: 2.5, sm: 3, md: 4 },
                pb: { xs: 2, md: 4 },
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                overflowY: 'auto',
            }}>
                <Box sx={{ width: '100%', maxWidth: 440 }}>
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
                        <Stack spacing={1.5}>
                            <TextField fullWidth placeholder="Full Name" name="name" onChange={handleChange} size="small" sx={inputSx} />

                            <Grid container spacing={1.5}>
                                <Grid item xs={7}>
                                    <TextField fullWidth placeholder={role === 'student' ? "Roll Number" : "Faculty ID"} name="identifier" onChange={handleChange} size="small" sx={inputSx} />
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField
                                        select fullWidth name="department" label="Dept"
                                        value={formData.department} onChange={handleChange} size="small" sx={inputSx}
                                    >
                                        {DEPARTMENTS.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                                    </TextField>
                                </Grid>
                            </Grid>

                            <TextField fullWidth placeholder="College Email" name="collegeEmail" type="email" onChange={handleChange} size="small" sx={inputSx} />

                            {role === 'student' && (
                                <TextField select fullWidth label="Year" name="year" value={formData.year} onChange={handleChange} size="small" sx={inputSx}>
                                    {[1,2,3,4].map(y => <MenuItem key={y} value={y}>Year {y}</MenuItem>)}
                                </TextField>
                            )}

                            <Grid container spacing={1.5}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth placeholder="Password" name="password" size="small"
                                        type={showPwd ? 'text' : 'password'} onChange={handleChange} sx={inputSx}
                                        InputProps={{ endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPwd(!showPwd)} size="small" edge="end">
                                                    {showPwd ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                                                </IconButton>
                                            </InputAdornment>
                                        )}}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth placeholder="Confirm" name="confirmPassword" size="small"
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
