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

    return (
        <Box sx={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(180deg, #4f46e5 0%, #6366f1 40%, #818cf8 100%)',
        }}>
            {/* Top section with branding */}
            <Box sx={{
                flex: '0 0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pt: { xs: 5, sm: 6, md: 8 },
                pb: { xs: 3, sm: 4, md: 5 },
                px: 2,
            }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}>
                    <Box sx={{
                        width: { xs: 60, md: 72 }, height: { xs: 60, md: 72 },
                        borderRadius: '20px', background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mb: 2, mx: 'auto',
                        border: '1px solid rgba(255,255,255,0.3)',
                    }}>
                        <SchoolIcon sx={{ color: '#fff', fontSize: { xs: 32, md: 38 } }} />
                    </Box>
                </motion.div>
                <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: { xs: '1.4rem', md: '1.8rem' }, letterSpacing: '-0.02em' }}>
                    Student Companion
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: { xs: '0.85rem', md: '0.95rem' }, mt: 0.5 }}>
                    Sign in to continue
                </Typography>
            </Box>

            {/* Bottom card with form */}
            <Box sx={{
                flex: 1,
                background: '#fff',
                borderRadius: { xs: '28px 28px 0 0', md: '32px 32px 0 0' },
                px: { xs: 2.5, sm: 3, md: 0 },
                pt: { xs: 3, sm: 4, md: 5 },
                pb: { xs: 2, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Box sx={{ width: '100%', maxWidth: 400 }}>
                    {/* Role toggle */}
                    <ToggleButtonGroup
                        value={role} exclusive fullWidth
                        onChange={(e, next) => next && setRole(next)}
                        sx={{
                            mb: { xs: 2.5, md: 4 },
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
                    <Box sx={{ textAlign: 'center', mt: { xs: 3, md: 5 } }}>
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
