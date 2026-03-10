import React, { useState, useEffect } from 'react';
import {
    Typography, TextField, Button, Box, Stack, Alert,
    ToggleButton, ToggleButtonGroup, MenuItem, IconButton,
    InputAdornment, Grid, Stepper, Step, StepLabel, Chip
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import SchoolIcon from '@mui/icons-material/School';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ScienceIcon from '@mui/icons-material/Science';
import ComputerIcon from '@mui/icons-material/Computer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupsIcon from '@mui/icons-material/Groups';

const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML'];
const CAMPUSES = ['ACET', 'AUS'];

/* Floating animated icon (desktop left panel) */
const FloatingIcon = ({ icon, size, top, left, right, bottom, delay, duration, color, rotate }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
            opacity: [0, 0.6, 0.4, 0.6],
            scale: 1,
            y: [0, -20, 0, 20, 0],
            x: [0, 10, 0, -10, 0],
            rotate: rotate ? [0, 12, -12, 0] : 0,
        }}
        transition={{
            opacity: { delay, duration: 1.2 },
            scale: { delay, duration: 0.6, type: 'spring' },
            y: { delay: delay + 0.5, duration: duration || 6, repeat: Infinity, ease: 'easeInOut' },
            x: { delay: delay + 0.5, duration: (duration || 6) * 1.3, repeat: Infinity, ease: 'easeInOut' },
            rotate: { delay: delay + 0.5, duration: (duration || 6) * 0.8, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{
            position: 'absolute', top, left, right, bottom, zIndex: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: size, height: size, borderRadius: size * 0.3,
            background: `${color}15`,
            backdropFilter: 'blur(8px)',
            border: `1.5px solid ${color}25`,
            boxShadow: `0 10px 40px ${color}12`,
        }}
    >
        {React.cloneElement(icon, { sx: { color, fontSize: size * 0.48 } })}
    </motion.div>
);

/* Animated counter for stats */
const AnimCounter = ({ end, suffix = '' }) => {
    const [val, setVal] = useState(0);
    useEffect(() => {
        let start = 0;
        const inc = end / 40;
        const timer = setInterval(() => {
            start += inc;
            if (start >= end) { setVal(end); clearInterval(timer); }
            else setVal(Math.floor(start));
        }, 30);
        return () => clearInterval(timer);
    }, [end]);
    return <>{val}{suffix}</>;
};

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [role, setRole] = useState('student');
    const [showPwd, setShowPwd] = useState(false);
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        name: '', identifier: '', collegeEmail: '', department: '', campus: '', year: 1, password: '', confirmPassword: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

    // Step validation
    const canProceedStep0 = formData.name.trim().length >= 2;
    const canProceedStep1 = formData.identifier.trim() && formData.collegeEmail.trim() && formData.department;
    const canSubmit = formData.password.length >= 6 && passwordsMatch;

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
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            const userData = role === 'student'
                ? { rollNumber: formData.identifier.toUpperCase(), collegeEmail: formData.collegeEmail, password: formData.password, name: formData.name, department: formData.department, year: Number(formData.year), campus: formData.campus || undefined }
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
            borderRadius: '14px', background: '#f8fafc',
            '& fieldset': { borderColor: '#e2e8f0' },
            '&:hover fieldset': { borderColor: '#c7d2fe' },
            '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: 2 },
        },
        '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
    };

    const steps = [
        { label: 'Personal', icon: <PersonOutlineIcon sx={{ fontSize: 18 }} /> },
        { label: 'Academic', icon: <BadgeOutlinedIcon sx={{ fontSize: 18 }} /> },
        { label: 'Security', icon: <LockOutlinedIcon sx={{ fontSize: 18 }} /> },
    ];

    const testimonials = [
        { name: 'Rahul K.', dept: 'CSE', text: 'Got placed at Google through campus drives tracked here!' },
        { name: 'Priya S.', dept: 'ECE', text: 'Never missed an assignment deadline since I joined.' },
        { name: 'Arjun M.', dept: 'IT', text: 'Study materials saved me 100+ hours of searching.' },
    ];
    const [testimonialIdx, setTestimonialIdx] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setTestimonialIdx(i => (i + 1) % testimonials.length), 4000);
        return () => clearInterval(t);
    }, [testimonials.length]);

    return (
        <Box sx={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            background: '#f8fafc',
        }}>
            {/* ══════════ LEFT PANEL — Desktop ══════════ */}
            <Box sx={{
                display: { xs: 'none', md: 'flex' },
                flex: 1, flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center',
                background: 'linear-gradient(150deg, #312e81 0%, #4f46e5 35%, #6366f1 65%, #818cf8 100%)',
                px: 6, py: 6,
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Animated gradient orbs */}
                <motion.div
                    animate={{ scale: [1, 1.4, 1], x: [0, 30, 0], y: [0, -20, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ position: 'absolute', top: '5%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(129,140,248,0.3) 0%, transparent 70%)', filter: 'blur(40px)' }}
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], x: [0, -20, 0], y: [0, 30, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ position: 'absolute', bottom: '10%', right: '5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', filter: 'blur(50px)' }}
                />

                {/* Floating icons */}
                <FloatingIcon icon={<MenuBookIcon />} size={60} top="6%" left="8%" delay={0.2} duration={7} color="#fff" rotate />
                <FloatingIcon icon={<SchoolIcon />} size={52} top="10%" right="10%" delay={0.5} duration={5.5} color="#fbbf24" />
                <FloatingIcon icon={<AutoStoriesIcon />} size={46} bottom="18%" left="6%" delay={0.8} duration={6.5} color="#a5f3fc" rotate />
                <FloatingIcon icon={<EmojiEventsIcon />} size={54} bottom="8%" right="8%" delay={1} duration={8} color="#fcd34d" />
                <FloatingIcon icon={<WorkIcon />} size={42} top="38%" left="4%" delay={1.2} duration={5} color="#c4b5fd" rotate />
                <FloatingIcon icon={<AssignmentIcon />} size={44} top="52%" right="5%" delay={0.6} duration={7.5} color="#fbcfe8" />
                <FloatingIcon icon={<ScienceIcon />} size={38} bottom="38%" left="16%" delay={1.5} duration={6} color="#99f6e4" />
                <FloatingIcon icon={<ComputerIcon />} size={48} top="22%" left="28%" delay={0.3} duration={9} color="#e0e7ff" rotate />

                {/* Center content */}
                <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 440, width: '100%', textAlign: 'center' }}>
                    <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                        <Box sx={{
                            width: 68, height: 68, borderRadius: '20px',
                            background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            mb: 3, mx: 'auto', border: '1px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        }}>
                            <SchoolIcon sx={{ color: '#fff', fontSize: 36 }} />
                        </Box>
                    </motion.div>

                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
                        <Typography sx={{
                            color: '#fff', fontWeight: 900, fontSize: '2.5rem',
                            lineHeight: 1.12, letterSpacing: '-0.03em', mb: 1.5,
                        }}>
                            Join Student<br />Companion
                        </Typography>
                        <Typography sx={{
                            color: 'rgba(255,255,255,0.7)', fontSize: '1rem',
                            lineHeight: 1.6, maxWidth: 360, mx: 'auto', mb: 4,
                        }}>
                            Your all-in-one platform for placements, academics & campus life.
                        </Typography>
                    </motion.div>

                    {/* Animated stats */}
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55 }}>
                        <Box sx={{
                            display: 'flex', justifyContent: 'center', gap: 3,
                            p: 2.5, borderRadius: '18px',
                            background: 'rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.12)',
                        }}>
                            {[
                                { end: 230, suffix: '+', label: 'Resources', color: '#a5f3fc' },
                                { end: 50, suffix: '+', label: 'Subjects', color: '#fcd34d' },
                                { end: 8, suffix: '', label: 'Semesters', color: '#c4b5fd' },
                            ].map((s, i) => (
                                <Box key={i} sx={{ textAlign: 'center', flex: 1 }}>
                                    <Typography sx={{ color: s.color, fontWeight: 900, fontSize: '1.6rem', lineHeight: 1 }}>
                                        <AnimCounter end={s.end} suffix={s.suffix} />
                                    </Typography>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.72rem', fontWeight: 600, mt: 0.5 }}>{s.label}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </motion.div>

                    {/* Rotating testimonials */}
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.75 }}>
                        <Box sx={{
                            mt: 3.5, p: 2.5, borderRadius: '16px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            minHeight: 90,
                        }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={testimonialIdx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem', fontStyle: 'italic', lineHeight: 1.6, mb: 1.5 }}>
                                        "{testimonials[testimonialIdx].text}"
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>
                                            {testimonials[testimonialIdx].name}
                                        </Typography>
                                        <Chip label={testimonials[testimonialIdx].dept} size="small" sx={{
                                            height: 20, fontSize: '0.65rem', fontWeight: 700,
                                            bgcolor: 'rgba(255,255,255,0.15)', color: '#fff',
                                        }} />
                                    </Box>
                                </motion.div>
                            </AnimatePresence>
                            {/* Dots */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.8, mt: 1.5 }}>
                                {testimonials.map((_, i) => (
                                    <Box key={i} sx={{
                                        width: i === testimonialIdx ? 18 : 6, height: 6, borderRadius: 3,
                                        background: i === testimonialIdx ? '#fff' : 'rgba(255,255,255,0.3)',
                                        transition: 'all 0.3s',
                                    }} />
                                ))}
                            </Box>
                        </Box>
                    </motion.div>
                </Box>
            </Box>

            {/* ══════════ MOBILE — Branding header ══════════ */}
            <Box sx={{
                display: { xs: 'flex', md: 'none' },
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(180deg, #4338ca 0%, #6366f1 100%)',
                pt: 4, pb: 3, px: 2,
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Subtle animated orb */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    style={{ position: 'absolute', top: '-30%', right: '-20%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', filter: 'blur(30px)' }}
                />
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                    <Box sx={{
                        width: 50, height: 50, borderRadius: '16px',
                        background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mb: 1.5, mx: 'auto', border: '1px solid rgba(255,255,255,0.25)',
                    }}>
                        <SchoolIcon sx={{ color: '#fff', fontSize: 26 }} />
                    </Box>
                </motion.div>
                <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>
                    Create Account
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', mt: 0.3 }}>
                    Join Student Companion
                </Typography>
                {/* Mobile mini stats */}
                <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
                    {[{ n: '230+', l: 'Resources' }, { n: '50+', l: 'Subjects' }, { n: '8', l: 'Semesters' }].map((s, i) => (
                        <Box key={i} sx={{ textAlign: 'center' }}>
                            <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1rem', lineHeight: 1 }}>{s.n}</Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem', fontWeight: 600 }}>{s.l}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* ══════════ RIGHT PANEL — Multi-step Form ══════════ */}
            <Box sx={{
                flex: { xs: 1, md: 1 },
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'center' },
                background: { xs: '#fff', md: '#f8fafc' },
                borderRadius: { xs: '24px 24px 0 0', md: 0 },
                px: { xs: 2.5, sm: 3, md: 6 },
                pt: { xs: 3, sm: 3.5, md: 0 },
                pb: { xs: 3, md: 0 },
                mt: { xs: -1.5, md: 0 },
                overflowY: 'auto',
                position: 'relative', zIndex: 1,
            }}>
                <Box sx={{
                    width: '100%', maxWidth: { xs: '100%', sm: 460, md: 500 },
                    background: { md: '#fff' },
                    borderRadius: { md: '24px' },
                    px: { xs: 0, sm: 1, md: 5 }, py: { md: 4 },
                    boxShadow: { md: '0 4px 32px rgba(0,0,0,0.06)' },
                }}>
                    {/* Desktop form header */}
                    <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 1 }}>
                        <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#1e293b', letterSpacing: '-0.02em' }}>
                            Create your account
                        </Typography>
                        <Typography sx={{ color: '#64748b', fontSize: '0.88rem', mt: 0.3 }}>
                            Fill in your details to get started
                        </Typography>
                    </Box>

                    {/* Role toggle */}
                    <ToggleButtonGroup
                        value={role} exclusive fullWidth
                        onChange={(e, v) => { if (v) { setRole(v); setStep(0); } }}
                        sx={{
                            mb: 2, mt: { xs: 0, md: 2 },
                            background: '#f1f5f9', borderRadius: '14px', p: '4px',
                            '& .MuiToggleButton-root': {
                                border: 'none', borderRadius: '11px !important',
                                py: 0.8, textTransform: 'none', fontWeight: 700,
                                fontSize: '0.85rem', color: '#64748b',
                                '&.Mui-selected': {
                                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff',
                                    boxShadow: '0 2px 10px rgba(79,70,229,0.35)',
                                    '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #4338ca)' }
                                }
                            }
                        }}
                    >
                        <ToggleButton value="student">Student</ToggleButton>
                        <ToggleButton value="faculty">Faculty</ToggleButton>
                    </ToggleButtonGroup>

                    {/* Step indicator */}
                    <Stepper activeStep={step} alternativeLabel sx={{
                        mb: 3,
                        '& .MuiStepLabel-label': { fontSize: '0.75rem', fontWeight: 600, mt: 0.5 },
                        '& .MuiStepIcon-root': { color: '#e2e8f0', '&.Mui-active': { color: '#6366f1' }, '&.Mui-completed': { color: '#10b981' } },
                    }}>
                        {steps.map((s, i) => (
                            <Step key={i} completed={step > i}>
                                <StepLabel>{s.label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '12px', fontSize: '0.82rem' }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            {/* Step 0: Personal Info */}
                            {step === 0 && (
                                <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                                    <Stack spacing={2.5}>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, fontSize: '0.85rem' }}>Full Name</Typography>
                                            <TextField
                                                fullWidth placeholder="Enter your full name" name="name"
                                                value={formData.name} onChange={handleChange} sx={inputSx}
                                            />
                                        </Box>
                                        <Box sx={{
                                            p: 2.5, borderRadius: '16px',
                                            background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
                                            border: '1px solid #e0f2fe',
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <GroupsIcon sx={{ color: '#6366f1', fontSize: 20 }} />
                                                <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155' }}>What you'll get</Typography>
                                            </Box>
                                            <Stack spacing={0.8}>
                                                {['Placement drive notifications', 'Study materials access', 'Assignment tracking', 'Personal to-do manager'].map((f, i) => (
                                                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <CheckCircleOutlineIcon sx={{ color: '#10b981', fontSize: 16 }} />
                                                        <Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{f}</Typography>
                                                    </Box>
                                                ))}
                                            </Stack>
                                        </Box>
                                        <Button
                                            fullWidth variant="contained" disabled={!canProceedStep0}
                                            onClick={() => setStep(1)}
                                            endIcon={<ArrowForwardIcon />}
                                            sx={{
                                                py: 1.4, borderRadius: '14px', fontWeight: 800,
                                                fontSize: '0.9rem', textTransform: 'none',
                                                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                                boxShadow: '0 4px 16px rgba(79,70,229,0.35)',
                                                '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #4338ca)' },
                                                '&.Mui-disabled': { background: '#e2e8f0', color: '#94a3b8' },
                                            }}
                                        >
                                            Continue
                                        </Button>
                                    </Stack>
                                </motion.div>
                            )}

                            {/* Step 1: Academic Info */}
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, fontSize: '0.85rem' }}>
                                                {role === 'student' ? 'Roll Number' : 'Faculty ID'}
                                            </Typography>
                                            <TextField
                                                fullWidth placeholder={role === 'student' ? 'e.g. 22B01A0501' : 'e.g. FAC001'}
                                                name="identifier" value={formData.identifier} onChange={handleChange} sx={inputSx}
                                            />
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, fontSize: '0.85rem' }}>College Email</Typography>
                                            <TextField
                                                fullWidth placeholder="your.email@college.edu" name="collegeEmail"
                                                type="email" value={formData.collegeEmail} onChange={handleChange} sx={inputSx}
                                            />
                                        </Box>
                                        <Grid container spacing={1.5}>
                                            <Grid item xs={role === 'student' ? 7 : 12}>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, fontSize: '0.85rem' }}>Department</Typography>
                                                <TextField
                                                    select fullWidth name="department"
                                                    value={formData.department} onChange={handleChange} sx={inputSx}
                                                >
                                                    {DEPARTMENTS.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                                                </TextField>
                                            </Grid>
                                            {role === 'student' && (
                                                <Grid item xs={5}>
                                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, fontSize: '0.85rem' }}>Year</Typography>
                                                    <TextField
                                                        select fullWidth name="year"
                                                        value={formData.year} onChange={handleChange} sx={inputSx}
                                                    >
                                                        {[1, 2, 3, 4].map(y => <MenuItem key={y} value={y}>Year {y}</MenuItem>)}
                                                    </TextField>
                                                </Grid>
                                            )}
                                        </Grid>
                                        {role === 'student' && (
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, fontSize: '0.85rem' }}>Campus</Typography>
                                                <TextField
                                                    select fullWidth name="campus"
                                                    value={formData.campus} onChange={handleChange} sx={inputSx}
                                                >
                                                    <MenuItem value="">Select Campus (optional)</MenuItem>
                                                    {CAMPUSES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                                </TextField>
                                            </Box>
                                        )}
                                        <Stack direction="row" spacing={1.5}>
                                            <Button
                                                fullWidth variant="outlined"
                                                onClick={() => setStep(0)}
                                                startIcon={<ArrowBackIcon />}
                                                sx={{
                                                    py: 1.3, borderRadius: '14px', fontWeight: 700,
                                                    fontSize: '0.88rem', textTransform: 'none',
                                                    borderColor: '#e2e8f0', color: '#64748b',
                                                    '&:hover': { borderColor: '#cbd5e1', background: '#f8fafc' },
                                                }}
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                fullWidth variant="contained" disabled={!canProceedStep1}
                                                onClick={() => setStep(2)}
                                                endIcon={<ArrowForwardIcon />}
                                                sx={{
                                                    py: 1.3, borderRadius: '14px', fontWeight: 800,
                                                    fontSize: '0.88rem', textTransform: 'none',
                                                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                                    boxShadow: '0 4px 16px rgba(79,70,229,0.35)',
                                                    '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #4338ca)' },
                                                    '&.Mui-disabled': { background: '#e2e8f0', color: '#94a3b8' },
                                                }}
                                            >
                                                Continue
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </motion.div>
                            )}

                            {/* Step 2: Password */}
                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, fontSize: '0.85rem' }}>Password</Typography>
                                            <TextField
                                                fullWidth placeholder="Min 6 characters" name="password"
                                                type={showPwd ? 'text' : 'password'} value={formData.password}
                                                onChange={handleChange} sx={inputSx}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => setShowPwd(!showPwd)} size="small" edge="end">
                                                                {showPwd ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                            {/* Password strength indicator */}
                                            {formData.password && (
                                                <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                                                    {[1, 2, 3, 4].map(i => (
                                                        <Box key={i} sx={{
                                                            flex: 1, height: 4, borderRadius: 2,
                                                            background: formData.password.length >= i * 3
                                                                ? (formData.password.length >= 10 ? '#10b981' : formData.password.length >= 6 ? '#f59e0b' : '#ef4444')
                                                                : '#e2e8f0',
                                                            transition: 'all 0.3s',
                                                        }} />
                                                    ))}
                                                </Box>
                                            )}
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, fontSize: '0.85rem' }}>Confirm Password</Typography>
                                            <TextField
                                                fullWidth placeholder="Re-enter password" name="confirmPassword"
                                                type={showPwd ? 'text' : 'password'} value={formData.confirmPassword}
                                                onChange={handleChange}
                                                sx={{
                                                    ...inputSx,
                                                    '& .MuiOutlinedInput-root': {
                                                        ...inputSx['& .MuiOutlinedInput-root'],
                                                        '& fieldset': {
                                                            borderColor: formData.confirmPassword
                                                                ? (passwordsMatch ? '#10b981' : '#ef4444')
                                                                : '#e2e8f0'
                                                        },
                                                    }
                                                }}
                                            />
                                            {formData.confirmPassword && (
                                                <Typography sx={{ fontSize: '0.72rem', mt: 0.5, fontWeight: 600, color: passwordsMatch ? '#10b981' : '#ef4444' }}>
                                                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                                                </Typography>
                                            )}
                                        </Box>

                                        {/* Summary card */}
                                        <Box sx={{
                                            p: 2, borderRadius: '14px', background: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                        }}>
                                            <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#334155', mb: 1 }}>Account Summary</Typography>
                                            <Stack spacing={0.5}>
                                                {[
                                                    { l: 'Name', v: formData.name },
                                                    { l: role === 'student' ? 'Roll No' : 'Faculty ID', v: formData.identifier.toUpperCase() },
                                                    { l: 'Email', v: formData.collegeEmail },
                                                    { l: 'Dept', v: formData.department },
                                                ].filter(x => x.v).map((x, i) => (
                                                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>{x.l}</Typography>
                                                        <Typography sx={{ fontSize: '0.72rem', color: '#334155', fontWeight: 700 }}>{x.v}</Typography>
                                                    </Box>
                                                ))}
                                            </Stack>
                                        </Box>

                                        <Stack direction="row" spacing={1.5}>
                                            <Button
                                                fullWidth variant="outlined"
                                                onClick={() => setStep(1)}
                                                startIcon={<ArrowBackIcon />}
                                                sx={{
                                                    py: 1.3, borderRadius: '14px', fontWeight: 700,
                                                    fontSize: '0.88rem', textTransform: 'none',
                                                    borderColor: '#e2e8f0', color: '#64748b',
                                                }}
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                type="submit" fullWidth variant="contained"
                                                disabled={loading || !canSubmit}
                                                sx={{
                                                    py: 1.3, borderRadius: '14px', fontWeight: 800,
                                                    fontSize: '0.88rem', textTransform: 'none',
                                                    background: canSubmit
                                                        ? 'linear-gradient(135deg, #10b981, #059669)'
                                                        : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                                    boxShadow: canSubmit
                                                        ? '0 4px 16px rgba(16,185,129,0.35)'
                                                        : '0 4px 16px rgba(79,70,229,0.35)',
                                                    '&.Mui-disabled': { background: '#e2e8f0', color: '#94a3b8' },
                                                }}
                                            >
                                                {loading ? 'Creating...' : 'Create Account'}
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    <Box sx={{ textAlign: 'center', mt: 2.5, pb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.82rem' }}>
                            Already have an account?{' '}
                            <Button
                                onClick={() => navigate('/login')}
                                sx={{ fontWeight: 800, textTransform: 'none', color: '#6366f1', p: 0, minWidth: 'auto', fontSize: 'inherit', '&:hover': { background: 'none', textDecoration: 'underline' } }}
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
