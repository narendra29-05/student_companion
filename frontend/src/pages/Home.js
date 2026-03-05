import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Grid, Box, Button, Stack, Chip, Avatar, Paper, IconButton, Divider } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BoltIcon from '@mui/icons-material/Bolt';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import InsightsIcon from '@mui/icons-material/Insights';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ChecklistIcon from '@mui/icons-material/Checklist';
import EventNoteIcon from '@mui/icons-material/EventNote';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SchoolIcon from '@mui/icons-material/School';
import TimerIcon from '@mui/icons-material/Timer';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkIcon from '@mui/icons-material/Work';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

/* ═══════ HELPER COMPONENTS ═══════ */

const useCounter = (end, duration, shouldAnimate) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!shouldAnimate) { setCount(0); return; }
        let start = 0;
        const inc = end / (duration / 16);
        const timer = setInterval(() => {
            start += inc;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [end, duration, shouldAnimate]);
    return count;
};

const StatCounter = ({ end, suffix, label, icon, color, theme }) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.3 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    const count = useCounter(end, 2000, inView);
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Box sx={{ textAlign: 'center', py: { xs: 3, md: 4 } }}>
                <Avatar sx={{ bgcolor: `${color}15`, width: 64, height: 64, mx: 'auto', mb: 2.5 }}>
                    {React.cloneElement(icon, { sx: { color, fontSize: 32 } })}
                </Avatar>
                <Typography sx={{ fontWeight: 900, color: theme.textMain, fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.5rem' }, lineHeight: 1, mb: 0.5 }}>
                    {count}{suffix}
                </Typography>
                <Typography variant="body1" sx={{ color: theme.textSub, fontWeight: 600, fontSize: '0.95rem' }}>{label}</Typography>
            </Box>
        </motion.div>
    );
};

const ComparisonBar = ({ label, withoutPct, withPct, delay = 0, theme }) => (
    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay, duration: 0.5 }}>
        <Box sx={{ mb: 3.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 800, color: theme.textMain, mb: 1.5, fontSize: '0.95rem' }}>{label}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Typography variant="caption" sx={{ minWidth: 70, color: theme.textSub, fontWeight: 700, fontSize: '0.75rem' }}>Without</Typography>
                <Box sx={{ flex: 1, height: 14, borderRadius: 7, background: theme.barTrack, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${withoutPct}%` }} viewport={{ once: true }}
                        transition={{ delay: delay + 0.3, duration: 1, ease: 'easeOut' }}
                        style={{ height: '100%', borderRadius: 7, background: 'linear-gradient(90deg, #ef4444, #f87171)' }} />
                </Box>
                <Typography variant="caption" sx={{ minWidth: 36, textAlign: 'right', fontWeight: 900, color: '#ef4444', fontSize: '0.85rem' }}>{withoutPct}%</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="caption" sx={{ minWidth: 70, color: '#10b981', fontWeight: 700, fontSize: '0.75rem' }}>With CPP</Typography>
                <Box sx={{ flex: 1, height: 14, borderRadius: 7, background: theme.barTrack, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${withPct}%` }} viewport={{ once: true }}
                        transition={{ delay: delay + 0.6, duration: 1.2, ease: 'easeOut' }}
                        style={{ height: '100%', borderRadius: 7, background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
                </Box>
                <Typography variant="caption" sx={{ minWidth: 36, textAlign: 'right', fontWeight: 900, color: '#10b981', fontSize: '0.85rem' }}>{withPct}%</Typography>
            </Box>
        </Box>
    </motion.div>
);

const CircularStat = ({ percentage, label, color, theme, delay = 0 }) => {
    const size = 120, sw = 9, r = (size - sw) / 2;
    const circ = 2 * Math.PI * r;
    return (
        <motion.div initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay, duration: 0.7, type: 'spring', stiffness: 120 }}>
            <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={theme.barTrack} strokeWidth={sw} />
                        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw}
                            strokeLinecap="round" strokeDasharray={circ}
                            initial={{ strokeDashoffset: circ }}
                            whileInView={{ strokeDashoffset: circ * (1 - percentage / 100) }}
                            viewport={{ once: true }}
                            transition={{ delay: delay + 0.4, duration: 1.8, ease: 'easeOut' }} />
                    </svg>
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography sx={{ fontWeight: 900, color, fontSize: '1.4rem' }}>{percentage}%</Typography>
                    </Box>
                </Box>
                <Typography variant="body2" sx={{ color: theme.textSub, fontWeight: 700, mt: 1.5, fontSize: '0.82rem' }}>{label}</Typography>
            </Box>
        </motion.div>
    );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */

const Home = () => {
    const navigate = useNavigate();
    const [activeFeature, setActiveFeature] = useState(0);
    const [cycleIndex, setCycleIndex] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(true);

    const cycleWords = ['Placements', 'Study Materials', 'Reminders', 'Attendance'];
    const mockupData = [
        { title: 'Placement Drives', detail: 'Google - SWE Intern', status: 'Applied', color: '#6366f1', icon: <BusinessCenterIcon /> },
        { title: 'Study Material', detail: 'DBMS_Unit3_Notes.pdf', status: 'Downloaded', color: '#a855f7', icon: <AutoStoriesIcon /> },
        { title: 'Task Tracker', detail: 'Fix Resume Header', status: 'Completed', color: '#10b981', icon: <CheckCircleIcon /> },
    ];

    const t = {
        bg: isDarkMode ? '#020617' : '#f8fafc',
        tx: isDarkMode ? '#ffffff' : '#0f172a',
        tx2: isDarkMode ? '#94a3b8' : '#475569',
        card: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.85)',
        border: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)',
        glass: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
        btnBg: isDarkMode ? '#fff' : '#020617',
        btnTx: isDarkMode ? '#020617' : '#fff',
        barTrack: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
        alt: isDarkMode ? 'rgba(255,255,255,0.015)' : 'rgba(99,102,241,0.025)',
        footBg: isDarkMode ? '#0a0f1e' : '#f1f5f9',
        footBd: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    };
    // alias for sub-components
    const theme = { textMain: t.tx, textSub: t.tx2, cardBg: t.card, cardBorder: t.border, barTrack: t.barTrack };

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((p) => (p + 1) % mockupData.length);
            setCycleIndex((p) => (p + 1) % cycleWords.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [cycleWords.length, mockupData.length]);

    const features = [
        { icon: <BusinessCenterIcon />, title: 'Placement Drives', desc: 'Browse, apply, and track campus placement opportunities. Auto-eligibility checks on CGPA, backlogs, and department.', color: '#6366f1', tag: 'Core' },
        { icon: <AssignmentIcon />, title: 'Assignments', desc: 'Faculty-created assignments with Google Drive submission, real-time deadline countdown, and late detection.', color: '#ec4899', tag: 'New' },
        { icon: <MenuBookIcon />, title: 'Study Materials', desc: '230+ study resources across R20 & R23 regulations organized by semester and subject with direct drive links.', color: '#f59e0b', tag: 'Library' },
        { icon: <ChecklistIcon />, title: 'To-Do Tracker', desc: 'Personal task manager with deadlines, completion tracking, and productivity stats to stay on top of your goals.', color: '#10b981', tag: 'Productivity' },
        { icon: <EventNoteIcon />, title: 'Attendance Portal', desc: 'Quick access to semester-wise attendance tracking and percentage monitoring. Never fall below minimum.', color: '#8b5cf6', tag: 'Tracking' },
        { icon: <NotificationsActiveIcon />, title: 'Smart Notifications', desc: 'Instant email alerts for new drives, assignment deadlines, and submission confirmations. Never miss out.', color: '#ef4444', tag: 'Alerts' },
    ];

    const stats = [
        { end: 50, suffix: '+', label: 'Study Subjects', icon: <SchoolIcon />, color: '#6366f1' },
        { end: 230, suffix: '+', label: 'Unit Resources', icon: <MenuBookIcon />, color: '#ec4899' },
        { end: 8, suffix: '', label: 'Semesters Covered', icon: <TimerIcon />, color: '#f59e0b' },
        { end: 2, suffix: '', label: 'Regulations', icon: <AutoStoriesIcon />, color: '#10b981' },
    ];

    const studentBenefits = [
        { label: 'Finding Placement Drives', withoutPct: 20, withPct: 95 },
        { label: 'Study Material Access', withoutPct: 30, withPct: 92 },
        { label: 'Assignment Deadline Tracking', withoutPct: 15, withPct: 98 },
        { label: 'Academic Task Organization', withoutPct: 25, withPct: 100 },
    ];
    const facultyBenefits = [
        { label: 'Drive Creation & Management', withoutPct: 25, withPct: 90 },
        { label: 'Assignment Distribution', withoutPct: 20, withPct: 95 },
        { label: 'Submission Monitoring', withoutPct: 15, withPct: 88 },
        { label: 'Student Communication', withoutPct: 30, withPct: 92 },
    ];
    const overallMetrics = [
        { percentage: 96, label: 'Student Satisfaction', color: '#6366f1' },
        { percentage: 92, label: 'Faculty Efficiency', color: '#ec4899' },
        { percentage: 88, label: 'Resource Coverage', color: '#10b981' },
        { percentage: 95, label: 'Time Saved', color: '#f59e0b' },
    ];

    const Heading = ({ chip, chipColor, title, highlight, sub }) => (
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
                <Chip label={chip} size="small" sx={{ mb: 2.5, fontWeight: 800, letterSpacing: 2, fontSize: '0.7rem', bgcolor: `${chipColor}18`, color: chipColor, border: `1px solid ${chipColor}30` }} />
                <Typography sx={{ fontWeight: 900, color: t.tx, mb: sub ? 2 : 0, fontSize: { xs: '1.5rem', sm: '2rem', md: '3.2rem' }, letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                    {title}{' '}<Box component="span" sx={{ color: chipColor }}>{highlight}</Box>
                </Typography>
                {sub && <Typography sx={{ color: t.tx2, fontWeight: 400, maxWidth: 560, mx: 'auto', fontSize: { xs: '0.95rem', md: '1.15rem' }, mt: 1 }}>{sub}</Typography>}
            </Box>
        </motion.div>
    );

    return (
        <Box sx={{ background: t.bg, transition: 'background 0.5s ease', overflowX: 'hidden' }}>

            {/* Fixed top nav bar */}
            <Box sx={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                px: { xs: 1.5, md: 4 }, py: { xs: 1, md: 1.5 },
                background: isDarkMode ? 'rgba(2,6,23,0.85)' : 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(20px)',
                borderBottom: `1px solid ${t.border}`,
            }}>
                <Box
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    sx={{
                        display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer',
                        userSelect: 'none',
                        '&:active': { opacity: 0.7 },
                    }}
                >
                    <Box sx={{
                        width: 32, height: 32, borderRadius: '10px',
                        background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.3s',
                    }}>
                        {isDarkMode
                            ? <DarkModeIcon sx={{ color: '#818cf8', fontSize: 18 }} />
                            : <LightModeIcon sx={{ color: '#6366f1', fontSize: 18 }} />
                        }
                    </Box>
                    <Typography sx={{ fontWeight: 900, color: t.tx, fontSize: { xs: '0.9rem', md: '1.1rem' }, letterSpacing: '-0.01em' }}>
                        Student Companion
                    </Typography>
                </Box>
                <Stack direction="row" spacing={{ xs: 0.5, md: 1 }} alignItems="center">
                    <Button onClick={() => navigate('/login')} size="small" sx={{
                        color: t.tx, fontWeight: 700, textTransform: 'none', fontSize: '0.85rem',
                        borderRadius: '10px', px: { xs: 1.5, md: 2 }, minWidth: 'auto',
                    }}>Login</Button>
                    <Button onClick={() => navigate('/register')} size="small" variant="contained" sx={{
                        fontWeight: 800, textTransform: 'none', fontSize: '0.85rem',
                        borderRadius: '10px', px: { xs: 1.5, md: 2 },
                        background: '#4f46e5', '&:hover': { background: '#4338ca' },
                    }}>Register</Button>
                </Stack>
            </Box>

            {/* ═══════ HERO ═══════ */}
            <Box sx={{ minHeight: '100dvh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', pt: { xs: 7, md: 8 } }}>
                <motion.div animate={{ scale: [1, 1.3, 1], opacity: isDarkMode ? 0.15 : 0.08 }} transition={{ duration: 15, repeat: Infinity }}
                    style={{ position: 'absolute', top: '10%', left: '0%', width: 700, height: 700, background: 'radial-gradient(circle, #6366f1 0%, transparent 75%)', filter: 'blur(100px)', zIndex: 0 }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={{ xs: 3, md: 6 }} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 2, py: 1, mb: { xs: 1.5, md: 3 }, borderRadius: '12px', background: 'rgba(99,102,241,0.1)', border: `1px solid ${isDarkMode ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.2)'}` }}>
                                    <BoltIcon sx={{ color: '#818cf8', fontSize: 18, mr: 1 }} />
                                    <Typography variant="caption" sx={{ color: isDarkMode ? '#fff' : '#6366f1', fontWeight: 800, letterSpacing: 2 }}>V 2.0 - AI-DRIVEN PLATFORM</Typography>
                                </Box>
                            </motion.div>
                            <Typography variant="h1" sx={{ fontWeight: 900, color: t.tx, fontSize: { xs: '2.2rem', sm: '3rem', md: '5.2rem' }, lineHeight: 1, mb: 2, letterSpacing: '-0.04em' }}>
                                Student <br />
                                <Box component="span" sx={{ display: 'inline-block', background: isDarkMode ? 'linear-gradient(90deg,#fff 30%,#94a3b8 100%)' : 'linear-gradient(90deg,#0f172a 30%,#64748b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: 'transparent' }}>Companion.</Box>
                            </Typography>
                            <Box sx={{ height: { xs: 40, sm: 50 }, mb: 4, display: 'flex', alignItems: 'center' }}>
                                <Typography variant="h4" sx={{ color: t.tx2, fontWeight: 500, mr: 2, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' } }}>Master your</Typography>
                                <AnimatePresence mode="wait">
                                    <motion.div key={cycleIndex} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.4 }}>
                                        <Typography variant="h4" sx={{ fontWeight: 800, color: cycleIndex % 2 === 0 ? '#6366f1' : '#ec4899', fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' } }}>{cycleWords[cycleIndex]}</Typography>
                                    </motion.div>
                                </AnimatePresence>
                            </Box>
                            <Grid container spacing={2} sx={{ mb: { xs: 3, md: 6 } }}>
                                <Grid item xs={6}>
                                    <Paper sx={{ p: 2, background: t.card, border: `1px solid ${t.border}`, borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
                                        <InsightsIcon sx={{ color: '#6366f1', mb: 1 }} />
                                        <Typography variant="subtitle2" sx={{ color: t.tx, fontWeight: 700 }}>Smart Sync</Typography>
                                        <Typography variant="caption" sx={{ color: t.tx2 }}>Automatic drive updates.</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper sx={{ p: 2, background: t.card, border: `1px solid ${t.border}`, borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
                                        <VerifiedUserIcon sx={{ color: '#10b981', mb: 1 }} />
                                        <Typography variant="subtitle2" sx={{ color: t.tx, fontWeight: 700 }}>Safe Access</Typography>
                                        <Typography variant="caption" sx={{ color: t.tx2 }}>Cloud-secured materials.</Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Button variant="contained" onClick={() => navigate('/register')} sx={{ borderRadius: '14px', px: { xs: 3, sm: 5 }, py: { xs: 1.5, sm: 2 }, fontSize: '1rem', fontWeight: 800, background: t.btnBg, color: t.btnTx, textTransform: 'none', '&:hover': { background: isDarkMode ? '#f1f5f9' : '#1e293b' } }}>Get Started</Button>
                                <Button variant="outlined" onClick={() => navigate('/login')} sx={{ borderRadius: '14px', px: { xs: 3, sm: 5 }, py: { xs: 1.5, sm: 2 }, color: t.tx, borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', fontWeight: 700, textTransform: 'none' }}>Sign In</Button>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ position: 'relative', height: { xs: 280, sm: 400, md: 550 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
                                    <Paper sx={{ width: { xs: '90vw', sm: 360, md: 420 }, maxWidth: 420, height: { xs: 200, sm: 240, md: 260 }, borderRadius: { xs: '28px', md: '48px' }, background: t.glass, backdropFilter: 'blur(25px)', border: `1px solid ${t.border}`, p: { xs: 2.5, sm: 3.5, md: 5 }, boxShadow: isDarkMode ? '0 50px 100px rgba(0,0,0,0.7)' : '0 30px 60px rgba(0,0,0,0.1)' }}>
                                        <AnimatePresence mode="wait">
                                            <motion.div key={activeFeature} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.6 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                                    <Avatar sx={{ bgcolor: mockupData[activeFeature].color, width: 56, height: 56 }}>{mockupData[activeFeature].icon}</Avatar>
                                                    <Box>
                                                        <Typography variant="h6" sx={{ color: t.tx, fontWeight: 800 }}>{mockupData[activeFeature].title}</Typography>
                                                        <Typography variant="caption" sx={{ color: t.tx2 }}>Real-time Sync</Typography>
                                                    </Box>
                                                </Box>
                                                <Typography variant="h5" sx={{ color: t.tx, mb: 2, fontWeight: 500 }}>{mockupData[activeFeature].detail}</Typography>
                                                <Chip label={mockupData[activeFeature].status} size="small" sx={{ bgcolor: `${mockupData[activeFeature].color}20`, color: mockupData[activeFeature].color, fontWeight: 900 }} />
                                            </motion.div>
                                        </AnimatePresence>
                                    </Paper>
                                </motion.div>
                                <Box sx={{ display: { xs: 'none', sm: 'block' }, position: 'absolute', top: '5%', right: '0%' }}><motion.div animate={{ y: [-15, 15, -15] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                                    <Paper sx={{ p: 2.5, borderRadius: '24px', background: 'linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)', color: '#fff', textAlign: 'center', boxShadow: '0 20px 40px rgba(99,102,241,0.4)' }}>
                                        <TrendingUpIcon />
                                        <Typography variant="h5" sx={{ fontWeight: 900 }}>92%</Typography>
                                        <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.9 }}>SUCCESS RATE</Typography>
                                    </Paper>
                                </motion.div></Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
                <Box sx={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
                    <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                        <KeyboardArrowDownIcon sx={{ fontSize: 36, color: t.tx2, opacity: 0.5 }} />
                    </motion.div>
                </Box>
            </Box>

            {/* ═══════ SERVICES — Zigzag layout ═══════ */}
            <Box sx={{ py: { xs: 5, sm: 8, md: 16 } }}>
                <Container maxWidth="lg">
                    <Heading chip="SERVICES" chipColor="#6366f1" title="Everything You Need," highlight="One Platform." sub="From placement drives to study materials — your complete academic companion." />
                    <Stack spacing={5}>
                        {features.map((f, i) => {
                            const isEven = i % 2 === 0;
                            return (
                                <motion.div key={i} initial={{ opacity: 0, x: isEven ? -60 : 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6, type: 'spring', stiffness: 80 }}>
                                    <Paper sx={{
                                        p: { xs: 3.5, md: 5 }, borderRadius: '28px',
                                        display: 'flex', gap: { xs: 3, md: 5 }, alignItems: 'center',
                                        flexDirection: { xs: 'column', md: isEven ? 'row' : 'row-reverse' },
                                        background: t.card, backdropFilter: 'blur(10px)',
                                        border: `1px solid ${t.border}`,
                                        transition: 'all 0.3s',
                                        '&:hover': { transform: 'translateY(-6px)', boxShadow: `0 20px 50px ${f.color}15`, borderColor: f.color }
                                    }}>
                                        <Box sx={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                            width: { xs: 80, md: 110 }, height: { xs: 80, md: 110 },
                                            borderRadius: '28px',
                                            background: `linear-gradient(135deg, ${f.color}18, ${f.color}08)`,
                                            border: `2px solid ${f.color}25`,
                                        }}>
                                            {React.cloneElement(f.icon, { sx: { color: f.color, fontSize: { xs: 36, md: 48 } } })}
                                        </Box>
                                        <Box sx={{ flex: 1, minWidth: 0, textAlign: { xs: 'center', md: isEven ? 'left' : 'right' } }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap', justifyContent: { xs: 'center', md: isEven ? 'flex-start' : 'flex-end' } }}>
                                                <Typography variant="h5" sx={{ fontWeight: 800, color: t.tx, fontSize: { xs: '1.15rem', md: '1.4rem' } }}>{f.title}</Typography>
                                                <Chip label={f.tag} size="small" sx={{ bgcolor: `${f.color}15`, color: f.color, fontWeight: 800, fontSize: '0.7rem', height: 24 }} />
                                            </Box>
                                            <Typography variant="body1" sx={{ color: t.tx2, lineHeight: 1.8, fontSize: { xs: '0.9rem', md: '1rem' } }}>{f.desc}</Typography>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            );
                        })}
                    </Stack>
                </Container>
            </Box>

            {/* ═══════ HOW IT WORKS — 3 steps in one row ═══════ */}
            <Box sx={{ py: { xs: 5, sm: 8, md: 14 }, background: t.alt }}>
                <Container maxWidth="lg">
                    <Heading chip="HOW IT WORKS" chipColor="#10b981" title="Get Started in" highlight="3 Steps" />
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-start' }, justifyContent: 'center', gap: { xs: 5, sm: 0 } }}>
                        {[
                            { icon: <PersonIcon />, num: '01', title: 'Register', desc: 'Create your student or faculty account in seconds with your college credentials.' },
                            { icon: <SearchIcon />, num: '02', title: 'Explore', desc: 'Browse placement drives, study materials, assignments, and manage your tasks.' },
                            { icon: <EmojiEventsIcon />, num: '03', title: 'Succeed', desc: 'Apply to drives, submit assignments on time, and track your academic progress.' },
                        ].map((s, i) => (
                            <React.Fragment key={i}>
                                {/* Arrow connector between steps (desktop only) */}
                                {i > 0 && (
                                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', px: { sm: 1, md: 3 }, pt: 4 }}>
                                        <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.2 }}>
                                            <ArrowRightAltIcon sx={{ fontSize: 36, color: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)' }} />
                                        </motion.div>
                                    </Box>
                                )}
                                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2, duration: 0.5 }} style={{ flex: 1, maxWidth: 280 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                                            <Avatar sx={{ width: 80, height: 80, bgcolor: isDarkMode ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.08)', border: `2px solid ${isDarkMode ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.15)'}` }}>
                                                {React.cloneElement(s.icon, { sx: { color: '#6366f1', fontSize: 36 } })}
                                            </Avatar>
                                            <Box sx={{ position: 'absolute', top: -8, right: -8, width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 900, fontSize: '0.7rem' }}>{s.num}</Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="h5" sx={{ fontWeight: 800, color: t.tx, mb: 1 }}>{s.title}</Typography>
                                        <Typography variant="body2" sx={{ color: t.tx2, lineHeight: 1.8 }}>{s.desc}</Typography>
                                    </Box>
                                </motion.div>
                            </React.Fragment>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* ═══════ BY THE NUMBERS — full-width stat strip ═══════ */}
            <Box sx={{ py: { xs: 5, sm: 8, md: 16 }, position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', opacity: isDarkMode ? 0.06 : 0.03, background: 'radial-gradient(circle,#ec4899 0%,transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                    <Heading chip="BY THE NUMBERS" chipColor="#ec4899" title="Platform at a" highlight="Glance" />
                    <Paper sx={{ borderRadius: '32px', background: t.card, border: `1px solid ${t.border}`, backdropFilter: 'blur(10px)', px: { xs: 2, md: 8 }, py: { xs: 3, md: 4 } }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: { xs: 2, sm: 0 } }}>
                            {stats.map((s, i) => (
                                <React.Fragment key={i}>
                                    <Box sx={{ flex: { xs: '0 0 45%', sm: '1 1 0' }, maxWidth: { sm: 260 } }}>
                                        <StatCounter {...s} theme={theme} />
                                    </Box>
                                    {i < stats.length - 1 && (
                                        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' }, height: 90, borderColor: t.border, mx: { sm: 3, md: 5 } }} />
                                    )}
                                </React.Fragment>
                            ))}
                        </Box>
                    </Paper>
                </Container>
            </Box>

            {/* ═══════ IMPACT GRAPHS — Students & Faculty ═══════ */}
            <Box sx={{ py: { xs: 5, sm: 8, md: 16 }, pb: { xs: 8, sm: 12, md: 20 }, background: t.alt }}>
                <Container maxWidth="lg">
                    <Heading chip="IMPACT ANALYSIS" chipColor="#f59e0b" title="How It Helps" highlight="Everyone" sub="Clear before-and-after improvements for students and faculty." />

                    <Grid container spacing={4} sx={{ mb: { xs: 10, md: 14 } }} alignItems="stretch" justifyContent="center">
                        {/* Student Benefits — Left */}
                        <Grid item xs={12} md={5}>
                            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ height: '100%' }}>
                                <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: '28px', height: '100%', background: t.card, border: `1px solid ${t.border}`, backdropFilter: 'blur(10px)', transition: 'border-color 0.3s', '&:hover': { borderColor: '#6366f1' } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                                        <Avatar sx={{ bgcolor: 'rgba(99,102,241,0.12)', width: 50, height: 50 }}><SchoolIcon sx={{ color: '#6366f1', fontSize: 26 }} /></Avatar>
                                        <Typography variant="h6" sx={{ fontWeight: 800, color: t.tx, fontSize: '1.15rem' }}>Student Benefits</Typography>
                                    </Box>
                                    {studentBenefits.map((b, i) => <ComparisonBar key={i} {...b} delay={i * 0.12} theme={theme} />)}
                                </Paper>
                            </motion.div>
                        </Grid>

                        {/* Center decorative visual */}
                        <Grid item md={2} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
                            <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, type: 'spring' }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <svg width="80" height="200" viewBox="0 0 80 200" fill="none">
                                        <motion.circle cx="40" cy="24" r="8" fill="#6366f1" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, type: 'spring' }} />
                                        <motion.line x1="40" y1="34" x2="40" y2="82" stroke={isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'} strokeWidth="2" strokeDasharray="6 4"
                                            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 1 }} />
                                        <motion.rect x="20" y="82" width="40" height="30" rx="8" fill={isDarkMode ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)'} stroke="#6366f1" strokeWidth="1.5"
                                            initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.8, type: 'spring' }} />
                                        <motion.text x="40" y="101" textAnchor="middle" fill="#6366f1" fontSize="11" fontWeight="800"
                                            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.1 }}>VS</motion.text>
                                        <motion.line x1="40" y1="115" x2="40" y2="164" stroke={isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'} strokeWidth="2" strokeDasharray="6 4"
                                            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 1.2, duration: 1 }} />
                                        <motion.circle cx="40" cy="176" r="8" fill="#ec4899" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.5, type: 'spring' }} />
                                        <motion.circle cx="12" cy="60" r="3.5" fill={isDarkMode ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.2)'} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }} />
                                        <motion.circle cx="68" cy="140" r="3.5" fill={isDarkMode ? 'rgba(236,72,153,0.3)' : 'rgba(236,72,153,0.2)'} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.3 }} />
                                    </svg>
                                </Box>
                            </motion.div>
                        </Grid>

                        {/* Faculty Benefits — Right */}
                        <Grid item xs={12} md={5}>
                            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ height: '100%' }}>
                                <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: '28px', height: '100%', background: t.card, border: `1px solid ${t.border}`, backdropFilter: 'blur(10px)', transition: 'border-color 0.3s', '&:hover': { borderColor: '#ec4899' } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                                        <Avatar sx={{ bgcolor: 'rgba(236,72,153,0.12)', width: 50, height: 50 }}><PersonIcon sx={{ color: '#ec4899', fontSize: 26 }} /></Avatar>
                                        <Typography variant="h6" sx={{ fontWeight: 800, color: t.tx, fontSize: '1.15rem' }}>Faculty Benefits</Typography>
                                    </Box>
                                    {facultyBenefits.map((b, i) => <ComparisonBar key={i} {...b} delay={i * 0.12} theme={theme} />)}
                                </Paper>
                            </motion.div>
                        </Grid>
                    </Grid>

                    {/* Overall impact circles */}
                    <Box sx={{ mt: { xs: 4, md: 6 } }}>
                    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                        <Paper sx={{ p: { xs: 4, md: 6 }, borderRadius: '32px', background: t.card, border: `1px solid ${t.border}`, backdropFilter: 'blur(10px)' }}>
                            <Typography sx={{ fontWeight: 800, color: t.tx, textAlign: 'center', mb: 6, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>Overall Platform Impact</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 4, sm: 6, md: 10 } }}>
                                {overallMetrics.map((c, i) => (
                                    <Box key={i} sx={{ minWidth: { xs: 120, sm: 140 } }}>
                                        <CircularStat {...c} delay={i * 0.15} theme={theme} />
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </motion.div>
                    </Box>
                </Container>
            </Box>

            {/* ═══════ ROLE FEATURES ═══════ */}
            <Box sx={{ py: { xs: 5, sm: 8, md: 16 } }}>
                <Container maxWidth="lg">
                    <Heading chip="BUILT FOR EVERYONE" chipColor="#8b5cf6" title="Tailored for" highlight="Every Role" />
                    <Grid container spacing={4} alignItems="stretch" justifyContent="center">
                        {/* For Students — Left */}
                        <Grid item xs={12} md={5}>
                            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ height: '100%' }}>
                                <Paper sx={{
                                    p: { xs: 4, md: 5 }, borderRadius: '28px', height: '100%',
                                    background: isDarkMode ? 'linear-gradient(160deg,rgba(99,102,241,0.06) 0%,rgba(99,102,241,0) 60%)' : 'linear-gradient(160deg,rgba(99,102,241,0.04) 0%,#fff 60%)',
                                    border: `1px solid ${t.border}`, backdropFilter: 'blur(10px)',
                                    transition: 'border-color 0.3s, box-shadow 0.3s',
                                    '&:hover': { borderColor: '#6366f1', boxShadow: '0 20px 50px rgba(99,102,241,0.1)' }
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                                        <Avatar sx={{ bgcolor: 'rgba(99,102,241,0.12)', width: 52, height: 52 }}><SchoolIcon sx={{ color: '#6366f1', fontSize: 28 }} /></Avatar>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 800, color: t.tx }}>For Students</Typography>
                                            <Typography variant="caption" sx={{ color: t.tx2, fontWeight: 600 }}>Your academic command center</Typography>
                                        </Box>
                                    </Box>
                                    <Stack spacing={2.5}>
                                        {['Browse & apply to placement drives', 'Submit assignments via Google Drive', 'Access 230+ study resources (R20 & R23)', 'Track attendance and manage to-dos', 'Real-time deadline countdown timers', 'Email notifications for new drives'].map((feat, i) => (
                                            <motion.div key={i} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <CheckCircleIcon sx={{ color: '#6366f1', fontSize: 22, flexShrink: 0 }} />
                                                    <Typography variant="body2" sx={{ color: t.tx2, fontWeight: 600, lineHeight: 1.6 }}>{feat}</Typography>
                                                </Box>
                                            </motion.div>
                                        ))}
                                    </Stack>
                                </Paper>
                            </motion.div>
                        </Grid>

                        {/* Center decorative visual — Bridge illustration */}
                        <Grid item xs={12} md={2} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
                            <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, type: 'spring' }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <svg width="90" height="260" viewBox="0 0 90 260" fill="none">
                                        {/* Top person icon */}
                                        <motion.circle cx="45" cy="22" r="12" fill={isDarkMode ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.12)'} stroke="#6366f1" strokeWidth="1.5"
                                            initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, type: 'spring' }} />
                                        <motion.circle cx="45" cy="20" r="4" fill="#6366f1" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, type: 'spring' }} />
                                        <motion.path d="M37 30 Q45 38 53 30" stroke="#6366f1" strokeWidth="2" fill="none"
                                            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.6 }} />

                                        {/* Connection line top */}
                                        <motion.line x1="45" y1="40" x2="45" y2="90" stroke={isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'} strokeWidth="2" strokeDasharray="5 5"
                                            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.8 }} />

                                        {/* Handshake / link icon center */}
                                        <motion.rect x="22" y="100" width="46" height="46" rx="14" fill={isDarkMode ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.08)'} stroke="#8b5cf6" strokeWidth="1.5"
                                            initial={{ scale: 0, rotate: 45 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ delay: 0.9, type: 'spring' }} />
                                        <motion.path d="M35 123 L42 116 L50 123 L42 130Z" fill="#8b5cf6"
                                            initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.1, type: 'spring' }} />

                                        {/* Connection line bottom */}
                                        <motion.line x1="45" y1="152" x2="45" y2="210" stroke={isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'} strokeWidth="2" strokeDasharray="5 5"
                                            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 1.2, duration: 0.8 }} />

                                        {/* Bottom faculty icon */}
                                        <motion.circle cx="45" cy="232" r="12" fill={isDarkMode ? 'rgba(236,72,153,0.2)' : 'rgba(236,72,153,0.12)'} stroke="#ec4899" strokeWidth="1.5"
                                            initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.4, type: 'spring' }} />
                                        <motion.circle cx="45" cy="230" r="4" fill="#ec4899" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.5, type: 'spring' }} />
                                        <motion.path d="M37 240 Q45 248 53 240" stroke="#ec4899" strokeWidth="2" fill="none"
                                            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: 1.6, duration: 0.6 }} />

                                        {/* Floating decorative dots */}
                                        <motion.circle cx="12" cy="80" r="3" fill={isDarkMode ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.15)'}
                                            initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.7 }} />
                                        <motion.circle cx="78" cy="170" r="3" fill={isDarkMode ? 'rgba(236,72,153,0.25)' : 'rgba(236,72,153,0.15)'}
                                            initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.3 }} />
                                        <motion.circle cx="75" cy="70" r="2.5" fill={isDarkMode ? 'rgba(245,158,11,0.25)' : 'rgba(245,158,11,0.15)'}
                                            initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 }} />
                                        <motion.circle cx="15" cy="180" r="2.5" fill={isDarkMode ? 'rgba(16,185,129,0.25)' : 'rgba(16,185,129,0.15)'}
                                            initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.4 }} />
                                    </svg>
                                    <Typography variant="caption" sx={{ color: t.tx2, fontWeight: 700, fontSize: '0.7rem', opacity: 0.6, display: 'block', mt: -1 }}>CONNECTED</Typography>
                                </Box>
                            </motion.div>
                        </Grid>

                        {/* For Faculty — Right */}
                        <Grid item xs={12} md={5}>
                            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} style={{ height: '100%' }}>
                                <Paper sx={{
                                    p: { xs: 4, md: 5 }, borderRadius: '28px', height: '100%',
                                    background: isDarkMode ? 'linear-gradient(160deg,rgba(236,72,153,0.06) 0%,rgba(236,72,153,0) 60%)' : 'linear-gradient(160deg,rgba(236,72,153,0.04) 0%,#fff 60%)',
                                    border: `1px solid ${t.border}`, backdropFilter: 'blur(10px)',
                                    transition: 'border-color 0.3s, box-shadow 0.3s',
                                    '&:hover': { borderColor: '#ec4899', boxShadow: '0 20px 50px rgba(236,72,153,0.1)' }
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                                        <Avatar sx={{ bgcolor: 'rgba(236,72,153,0.12)', width: 52, height: 52 }}><PersonIcon sx={{ color: '#ec4899', fontSize: 28 }} /></Avatar>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 800, color: t.tx }}>For Faculty</Typography>
                                            <Typography variant="caption" sx={{ color: t.tx2, fontWeight: 600 }}>Manage drives & assignments effortlessly</Typography>
                                        </Box>
                                    </Box>
                                    <Stack spacing={2.5}>
                                        {['Create & manage placement drives', 'Create assignments for students', 'Track submissions & deadlines', 'Search students by roll number', 'Get notified on submissions', 'View submitted vs pending analytics'].map((feat, i) => (
                                            <motion.div key={i} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <CheckCircleIcon sx={{ color: '#ec4899', fontSize: 22, flexShrink: 0 }} />
                                                    <Typography variant="body2" sx={{ color: t.tx2, fontWeight: 600, lineHeight: 1.6 }}>{feat}</Typography>
                                                </Box>
                                            </motion.div>
                                        ))}
                                    </Stack>
                                </Paper>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* ═══════ CTA ═══════ */}
            <Box sx={{ py: { xs: 5, sm: 8, md: 16 }, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', inset: 0, opacity: isDarkMode ? 0.12 : 0.06, background: 'radial-gradient(ellipse at center,#6366f1 0%,transparent 70%)', pointerEvents: 'none' }} />
                <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography sx={{ fontWeight: 900, color: t.tx, mb: 3, fontSize: { xs: '2rem', md: '3rem' }, letterSpacing: '-0.03em' }}>Ready to Transform Your Campus Experience?</Typography>
                            <Typography sx={{ color: t.tx2, fontWeight: 400, mb: 5, fontSize: { xs: '1rem', md: '1.2rem' } }}>Join now and take control of your placements, academics, and goals.</Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                                <Button variant="contained" size="large" onClick={() => navigate('/register')} endIcon={<ArrowForwardIcon />}
                                    sx={{ borderRadius: '16px', px: 5, py: 2, fontWeight: 800, textTransform: 'none', fontSize: '1.05rem', background: 'linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)', boxShadow: '0 15px 30px rgba(99,102,241,0.35)', '&:hover': { boxShadow: '0 20px 40px rgba(99,102,241,0.45)' } }}>
                                    Get Started Free
                                </Button>
                                <Button variant="outlined" size="large" onClick={() => navigate('/login')}
                                    sx={{ borderRadius: '16px', px: 5, py: 2, fontWeight: 700, textTransform: 'none', fontSize: '1.05rem', color: t.tx, borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }}>
                                    Sign In
                                </Button>
                            </Stack>
                        </Box>
                    </motion.div>
                </Container>
            </Box>

            {/* ═══════ FOOTER ═══════ */}
            <Box sx={{ pt: { xs: 6, md: 8 }, pb: { xs: 4, md: 5 }, background: t.footBg, borderTop: `1px solid ${t.footBd}` }}>
                <Container maxWidth="lg">
                    <Grid container spacing={{ xs: 4, md: 6 }} sx={{ mb: { xs: 5, md: 6 } }}>
                        {/* Brand */}
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                                <Avatar sx={{ bgcolor: '#6366f1', width: 42, height: 42 }}><WorkIcon sx={{ fontSize: 22 }} /></Avatar>
                                <Typography sx={{ fontWeight: 800, color: t.tx, fontSize: '1.1rem' }}>Campus Placement Portal</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: t.tx2, lineHeight: 1.9, maxWidth: 320 }}>
                                Your complete academic companion for placement drives, study materials, assignments, and more. Built for students and faculty.
                            </Typography>
                        </Grid>

                        {/* Student */}
                        <Grid item xs={6} sm={4} md={2}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: t.tx, mb: 2.5, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>For Students</Typography>
                            <Stack spacing={1.8}>
                                {['Placement Drives', 'Study Materials', 'Assignments', 'To-Do Tracker', 'Attendance', 'Profile'].map(i => (
                                    <Typography key={i} variant="body2" sx={{ color: t.tx2, fontWeight: 500 }}>{i}</Typography>
                                ))}
                            </Stack>
                        </Grid>

                        {/* Faculty */}
                        <Grid item xs={6} sm={4} md={2}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: t.tx, mb: 2.5, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>For Faculty</Typography>
                            <Stack spacing={1.8}>
                                {['Manage Drives', 'Create Assignments', 'Track Submissions', 'Student Search', 'Notifications'].map(i => (
                                    <Typography key={i} variant="body2" sx={{ color: t.tx2, fontWeight: 500 }}>{i}</Typography>
                                ))}
                            </Stack>
                        </Grid>

                        {/* Quick Links */}
                        <Grid item xs={6} sm={4} md={2}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: t.tx, mb: 2.5, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>Quick Links</Typography>
                            <Stack spacing={1.8}>
                                {[{ l: 'Home', p: '/' }, { l: 'Login', p: '/login' }, { l: 'Register', p: '/register' }].map(x => (
                                    <Typography key={x.l} variant="body2" onClick={() => navigate(x.p)} sx={{ color: t.tx2, fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s', '&:hover': { color: '#6366f1' } }}>{x.l}</Typography>
                                ))}
                            </Stack>
                        </Grid>

                        {/* Tech */}
                        <Grid item xs={6} sm={4} md={2}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: t.tx, mb: 2.5, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>Built With</Typography>
                            <Stack spacing={1.8}>
                                {['React.js', 'Node.js', 'SQL Server', 'Material UI', 'Sequelize'].map(i => (
                                    <Typography key={i} variant="body2" sx={{ color: t.tx2, fontWeight: 500 }}>{i}</Typography>
                                ))}
                            </Stack>
                        </Grid>
                    </Grid>

                    <Divider sx={{ borderColor: t.footBd }} />

                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 1.5, pt: { xs: 3, md: 4 } }}>
                        <Typography variant="caption" sx={{ color: t.tx2, fontWeight: 500 }}>2026 Campus Placement Portal. All rights reserved.</Typography>
                        <Typography variant="caption" sx={{ color: t.tx2, fontWeight: 600 }}>Designed & Developed by <Box component="span" sx={{ color: '#6366f1', fontWeight: 800 }}>Narendra Kosireddy, Ajay, Tanisha, Kalyan</Box></Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default Home;
