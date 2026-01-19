import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, Button, Stack, Chip, Avatar, Paper, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Icons
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BoltIcon from '@mui/icons-material/Bolt';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import InsightsIcon from '@mui/icons-material/Insights';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const Home = () => {
    const navigate = useNavigate();
    const [activeFeature, setActiveFeature] = useState(0);
    const [cycleIndex, setCycleIndex] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(true);

    const cycleWords = ["Placements", "Study Materials", "Reminders", "Attendance"];

    const mockupData = [
        { id: 1, title: "Placement Drives", detail: "Google • SWE Intern", status: "Applied", color: "#6366f1", icon: <BusinessCenterIcon /> },
        { id: 2, title: "Study Material", detail: "DBMS_Unit3_Notes.pdf", status: "Downloaded", color: "#a855f7", icon: <AutoStoriesIcon /> },
        { id: 3, title: "Task Tracker", detail: "Fix Resume Header", status: "Completed", color: "#10b981", icon: <CheckCircleIcon /> }
    ];

    const theme = {
        bg: isDarkMode ? '#020617' : '#f8fafc',
        textMain: isDarkMode ? '#ffffff' : '#0f172a',
        textSub: isDarkMode ? '#94a3b8' : '#475569',
        cardBg: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
        cardBorder: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
        glass: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.7)',
        buttonBg: isDarkMode ? '#fff' : '#020617',
        buttonText: isDarkMode ? '#020617' : '#fff',
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % mockupData.length);
            setCycleIndex((prev) => (prev + 1) % cycleWords.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            background: theme.bg, 
            transition: 'background 0.5s ease',
            position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' 
        }}>
            {/* --- THEME TOGGLE --- */}
            <Box sx={{ position: 'absolute', top: 30, right: 30, zIndex: 10 }}>
                <IconButton 
                    onClick={() => setIsDarkMode(!isDarkMode)} 
                    sx={{ 
                        bgcolor: theme.cardBg, 
                        border: `1px solid ${theme.cardBorder}`,
                        color: isDarkMode ? '#fbbf24' : '#6366f1',
                        '&:hover': { bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
                    }}
                >
                    {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
            </Box>

            {/* --- BACKGROUND AMBIENCE --- */}
            <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: isDarkMode ? 0.15 : 0.08 }}
                transition={{ duration: 15, repeat: Infinity }}
                style={{
                    position: 'absolute', top: '10%', left: '0%', width: '700px', height: '700px',
                    background: 'radial-gradient(circle, #6366f1 0%, transparent 75%)', 
                    filter: 'blur(100px)', zIndex: 0
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={6} alignItems="center">
                    
                    {/* --- LEFT SIDE: CONTENT --- */}
                    <Grid item xs={12} md={6}>
                        <Box>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <Box sx={{ 
                                    display: 'inline-flex', alignItems: 'center', px: 2, py: 1, mb: 3, borderRadius: '12px', 
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    border: `1px solid ${isDarkMode ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.2)'}`,
                                }}>
                                    <BoltIcon sx={{ color: '#818cf8', fontSize: 18, mr: 1 }} />
                                    <Typography variant="caption" sx={{ color: isDarkMode ? '#fff' : '#6366f1', fontWeight: 800, letterSpacing: 2 }}>
                                        V 2.0 • AI-DRIVEN PLATFORM
                                    </Typography>
                                </Box>
                            </motion.div>

                            <Typography variant="h1" sx={{ 
                                fontWeight: 900, color: theme.textMain, fontSize: { xs: '3.5rem', md: '5.2rem' },
                                lineHeight: 1, mb: 2, letterSpacing: '-0.04em'
                            }}>
                                Student <br />
                                {/* FIXED GRADIENT SPAN BELOW */}
                                <Box component="span" sx={{ 
                                    display: 'inline-block', // Crucial for background clip
                                    background: isDarkMode 
                                        ? 'linear-gradient(90deg, #fff 30%, #94a3b8 100%)' 
                                        : 'linear-gradient(90deg, #0f172a 30%, #64748b 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    color: 'transparent'
                                }}>
                                    Companion.
                                </Box>
                            </Typography>

                            <Box sx={{ height: '50px', mb: 4, display: 'flex', alignItems: 'center' }}>
                                <Typography variant="h4" sx={{ color: theme.textSub, fontWeight: 500, mr: 2 }}>
                                    Master your
                                </Typography>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={cycleIndex}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <Typography variant="h4" sx={{ 
                                            fontWeight: 800, 
                                            color: cycleIndex % 2 === 0 ? '#6366f1' : '#ec4899' 
                                        }}>
                                            {cycleWords[cycleIndex]}
                                        </Typography>
                                    </motion.div>
                                </AnimatePresence>
                            </Box>
                            
                            <Grid container spacing={2} sx={{ mb: 6 }}>
                                <Grid item xs={6}>
                                    <Paper sx={{ p: 2, background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
                                        <InsightsIcon sx={{ color: '#6366f1', mb: 1 }} />
                                        <Typography variant="subtitle2" sx={{ color: theme.textMain, fontWeight: 700 }}>Smart Sync</Typography>
                                        <Typography variant="caption" sx={{ color: theme.textSub }}>Automatic drive updates.</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper sx={{ p: 2, background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
                                        <VerifiedUserIcon sx={{ color: '#10b981', mb: 1 }} />
                                        <Typography variant="subtitle2" sx={{ color: theme.textMain, fontWeight: 700 }}>Safe Access</Typography>
                                        <Typography variant="caption" sx={{ color: theme.textSub }}>Cloud-secured materials.</Typography>
                                    </Paper>
                                </Grid>
                            </Grid>

                            <Stack direction="row" spacing={2}>
                                <Button 
                                    variant="contained" onClick={() => navigate('/register')}
                                    sx={{ 
                                        borderRadius: '14px', px: 5, py: 2, fontSize: '1rem', fontWeight: 800,
                                        background: theme.buttonBg, color: theme.buttonText, textTransform: 'none',
                                        '&:hover': { background: isDarkMode ? '#f1f5f9' : '#1e293b' }
                                    }}
                                >
                                    Get Started
                                </Button>
                                <Button 
                                    variant="outlined" onClick={() => navigate('/login')}
                                    sx={{ 
                                        borderRadius: '14px', px: 5, py: 2, color: theme.textMain, 
                                        borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', 
                                        fontWeight: 700, textTransform: 'none'
                                    }}
                                >
                                    Sign In
                                </Button>
                            </Stack>
                        </Box>
                    </Grid>

                    {/* --- RIGHT: ORBITAL UI --- */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ position: 'relative', height: '550px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                                <Paper sx={{ 
                                    width: { xs: '320px', md: '420px' }, height: '260px', borderRadius: '48px',
                                    background: theme.glass, backdropFilter: 'blur(25px)',
                                    border: `1px solid ${theme.cardBorder}`, p: 5,
                                    boxShadow: isDarkMode ? '0 50px 100px rgba(0,0,0,0.7)' : '0 30px 60px rgba(0,0,0,0.1)'
                                }}>
                                    <AnimatePresence mode="wait">
                                        <motion.div key={activeFeature} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.6 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                                <Avatar sx={{ bgcolor: mockupData[activeFeature].color, width: 56, height: 56 }}>
                                                    {mockupData[activeFeature].icon}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6" sx={{ color: theme.textMain, fontWeight: 800 }}>{mockupData[activeFeature].title}</Typography>
                                                    <Typography variant="caption" sx={{ color: theme.textSub }}>Real-time Sync</Typography>
                                                </Box>
                                            </Box>
                                            <Typography variant="h5" sx={{ color: theme.textMain, mb: 2, fontWeight: 500 }}>{mockupData[activeFeature].detail}</Typography>
                                            <Chip label={mockupData[activeFeature].status} size="small" sx={{ bgcolor: `${mockupData[activeFeature].color}20`, color: mockupData[activeFeature].color, fontWeight: 900 }} />
                                        </motion.div>
                                    </AnimatePresence>
                                </Paper>
                            </motion.div>

                            <motion.div animate={{ y: [-15, 15, -15] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ position: 'absolute', top: '5%', right: '0%' }}>
                                <Paper sx={{ p: 2.5, borderRadius: '24px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', textAlign: 'center', boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)' }}>
                                    <TrendingUpIcon />
                                    <Typography variant="h5" sx={{ fontWeight: 900 }}>92%</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.9 }}>SUCCESS RATE</Typography>
                                </Paper>
                            </motion.div>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Home;