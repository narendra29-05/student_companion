import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Grid, Card, CardContent, CardActions,
    Button, Chip, Box, CircularProgress, Alert, Select, MenuItem, 
    FormControl, InputLabel, Collapse, IconButton, Avatar,
    Paper // <--- Add this right here
} from '@mui/material';
import { 
    Business, AccessTime, AttachMoney, School, CheckCircle, 
    Info, Groups, ExpandMore as ExpandMoreIcon, TrendingUp
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
        y: 0, 
        opacity: 1, 
        transition: { type: 'spring', stiffness: 100 } 
    }
};

const StudentDashboard = () => {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const { user } = useAuth();

    useEffect(() => { fetchDrives(); }, []);

    const fetchDrives = async () => {
        try {
            const response = await API.get('/drives/student');
            setDrives(response.data.drives);
        } catch (err) {
            setError('Failed to fetch drives');
        } finally {
            setLoading(false);
        }
    };

    const handleExpandClick = (id) => setExpandedId(expandedId === id ? null : id);

    const handleStatusChange = async (driveId, newStatus) => {
        try {
            setDrives(prevDrives => 
                prevDrives.map(d => d._id === driveId ? { ...d, isApplied: newStatus === 'applied' } : d)
            );
            await API.post(`/drives/${newStatus === 'applied' ? 'apply' : 'unapply'}/${driveId}`);
        } catch (err) { console.error("Failed to update status"); }
    };

    const handleApplyClick = async (driveId, externalLink) => {
        try {
            await API.post(`/drives/apply/${driveId}`);
            window.open(externalLink, '_blank', 'noopener,noreferrer');
            fetchDrives();
        } catch (err) { window.open(externalLink, '_blank', 'noopener,noreferrer'); }
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const getDaysRemaining = (expiryDate) => Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

    if (loading) return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <CircularProgress thickness={5} size={60} sx={{ color: '#6366f1' }} />
            <Typography sx={{ mt: 2, color: '#94a3b8', fontWeight: 500 }}>Fetching Opportunities...</Typography>
        </Box>
    );

    return (
        <Box sx={{ background: '#f8fafc', minHeight: '100vh', py: 6 }}>
            <Container maxWidth="lg">
                {/* --- HEADER SECTION --- */}
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b', mb: 1 }}>
                            Explore <span style={{ color: '#6366f1' }}>Drives</span>
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                            Welcome back, {user?.name}. Ready for your next big step?
                        </Typography>
                    </motion.div>
                    
                    {/* Quick Stats Bento Style */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                        <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Active</Typography>
                            <Typography variant="h6" sx={{ color: '#6366f1', fontWeight: 800 }}>{drives.length}</Typography>
                        </Paper>
                    </Box>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 4, borderRadius: '12px' }}>{error}</Alert>}

                {/* --- DRIVES GRID --- */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <Grid container spacing={4}>
                        <AnimatePresence>
                            {drives.map((drive) => {
                                const daysRemaining = getDaysRemaining(drive.expiryDate);
                                const isApplied = drive.isApplied || drive.appliedStudents?.includes(user?._id);

                                return (
                                    <Grid item xs={12} md={6} lg={4} key={drive._id}>
                                        <motion.div variants={cardVariants} whileHover={{ y: -10 }}>
                                            <Card sx={{ 
                                                borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                                position: 'relative', overflow: 'hidden', background: '#fff'
                                            }}>
                                                {/* Top Status Bar */}
                                                <Box sx={{ 
                                                    height: '6px', 
                                                    background: isApplied ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #f59e0b, #fbbf24)' 
                                                }} />

                                                <CardContent sx={{ p: 4 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                                        <Avatar sx={{ bgcolor: '#f1f5f9', color: '#6366f1', width: 56, height: 56, borderRadius: '16px' }}>
                                                            <Business fontSize="large" />
                                                        </Avatar>
                                                        <Chip 
                                                            label={isApplied ? "Applied" : "Pending"} 
                                                            size="small"
                                                            sx={{ 
                                                                fontWeight: 800, px: 1,
                                                                bgcolor: isApplied ? '#ecfdf5' : '#fff7ed',
                                                                color: isApplied ? '#059669' : '#d97706',
                                                                border: `1px solid ${isApplied ? '#10b981' : '#f59e0b'}`
                                                            }}
                                                        />
                                                    </Box>

                                                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>{drive.companyName}</Typography>
                                                    <Typography variant="subtitle2" sx={{ color: '#6366f1', fontWeight: 700, mb: 3 }}>{drive.role}</Typography>

                                                    {/* Bento Info Badges */}
                                                    <Grid container spacing={1} sx={{ mb: 3 }}>
                                                        <Grid item xs={6}>
                                                            <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                                                <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', fontWeight: 600 }}>Package</Typography>
                                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{drive.package || 'TBD'}</Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                                                <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', fontWeight: 600 }}>Min CGPA</Typography>
                                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{drive.minCGPA || '0.0'}</Typography>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>

                                                    {/* Eligible Branches */}
                                                    <Box sx={{ mb: 3 }}>
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, display: 'block', mb: 1 }}>ELIGIBLE BRANCHES</Typography>
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                            {drive.eligibleDepartments?.map((dept, idx) => (
                                                                <Chip key={idx} label={dept} size="small" sx={{ borderRadius: '6px', fontSize: '10px', fontWeight: 700 }} />
                                                            ))}
                                                        </Box>
                                                    </Box>

                                                    <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                                                        <InputLabel>Self-Track Status</InputLabel>
                                                        <Select
                                                            value={isApplied ? 'applied' : 'not_applied'}
                                                            label="Self-Track Status"
                                                            onChange={(e) => handleStatusChange(drive._id, e.target.value)}
                                                            sx={{ borderRadius: '12px' }}
                                                        >
                                                            <MenuItem value="not_applied">Mark as Interested</MenuItem>
                                                            <MenuItem value="applied">Mark as Applied</MenuItem>
                                                        </Select>
                                                    </FormControl>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, borderTop: '1px solid #f1f5f9' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <AccessTime sx={{ fontSize: 16, color: daysRemaining <= 3 ? '#ef4444' : '#64748b' }} />
                                                            <Typography variant="caption" sx={{ fontWeight: 700, color: daysRemaining <= 3 ? '#ef4444' : '#64748b' }}>
                                                                {daysRemaining} Days Left
                                                            </Typography>
                                                        </Box>
                                                        <IconButton size="small" onClick={() => handleExpandClick(drive._id)}>
                                                            <Typography variant="caption" sx={{ fontWeight: 700, mr: 0.5 }}>Details</Typography>
                                                            <ExpandMoreIcon sx={{ transform: expandedId === drive._id ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                                                        </IconButton>
                                                    </Box>

                                                    <Collapse in={expandedId === drive._id} timeout="auto" unmountOnExit>
                                                        <Typography variant="body2" sx={{ mt: 2, color: '#475569', lineHeight: 1.6, background: '#f8fafc', p: 2, borderRadius: '12px' }}>
                                                            {drive.description || "No specific details shared."}
                                                        </Typography>
                                                    </Collapse>
                                                </CardContent>

                                                <Box sx={{ p: 4, pt: 0 }}>
                                                    <Button
                                                        variant="contained"
                                                        fullWidth
                                                        onClick={() => handleApplyClick(drive._id, drive.driveLink)}
                                                        sx={{ 
                                                            py: 1.5, borderRadius: '14px', fontWeight: 800, textTransform: 'none', fontSize: '1rem',
                                                            background: isApplied ? '#f1f5f9' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                                            color: isApplied ? '#64748b' : '#fff',
                                                            boxShadow: isApplied ? 'none' : '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                                                            '&:hover': { background: isApplied ? '#e2e8f0' : '#4338ca' }
                                                        }}
                                                    >
                                                        {isApplied ? "Visit Drive Link" : "Apply Now"}
                                                    </Button>
                                                </Box>
                                            </Card>
                                        </motion.div>
                                    </Grid>
                                );
                            })}
                        </AnimatePresence>
                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
};

export default StudentDashboard;