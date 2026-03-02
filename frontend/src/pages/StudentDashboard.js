import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Grid, Card, CardContent,
    Button, Chip, Box, CircularProgress, Alert, Select, MenuItem,
    FormControl, InputLabel, Collapse, IconButton, Avatar,
    Paper, Tooltip
} from '@mui/material';
import {
    Business, AccessTime, ExpandMore as ExpandMoreIcon,
    CheckCircle, Cancel, Warning
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import ApplyDialog from '../components/ApplyDialog';
import { toast } from 'react-toastify';

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
    const [applyDialog, setApplyDialog] = useState({ open: false, drive: null, profile: null });
    const { user } = useAuth();
    const navigate = useNavigate();

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
            await API.patch(`/drives/apply/${driveId}`, { status: newStatus });
            setDrives(prevDrives =>
                prevDrives.map(d => d.id === driveId ? { ...d, applicationStatus: newStatus } : d)
            );
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handleApplyClick = async (drive) => {
        if (!user?.profileCompleted) {
            toast.error('Please complete your profile before applying');
            navigate('/student/profile');
            return;
        }
        if (!drive.isEligible) {
            toast.error('You are not eligible for this drive');
            return;
        }
        try {
            const response = await API.post(`/drives/apply/${drive.id}`);
            setApplyDialog({
                open: true,
                drive,
                profile: response.data.studentProfile,
            });
            // Update local state with application status
            setDrives(prevDrives =>
                prevDrives.map(d => d.id === drive.id ? { ...d, applicationStatus: d.applicationStatus || 'interested' } : d)
            );
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to apply');
        }
    };

    const handleApplied = () => {
        // Update status to applied after user opens form
        if (applyDialog.drive) {
            handleStatusChange(applyDialog.drive.id, 'applied');
        }
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
                {/* Profile Completion Banner */}
                {user?.profileCompleted === false && (
                    <Alert
                        severity="warning"
                        sx={{ mb: 4, borderRadius: '12px', fontWeight: 600 }}
                        action={
                            <Button color="inherit" size="small" onClick={() => navigate('/student/profile')} sx={{ fontWeight: 700 }}>
                                Complete Profile
                            </Button>
                        }
                    >
                        Complete your profile to apply for drives. Add your name, CGPA, and resume.
                    </Alert>
                )}

                {/* Header Section */}
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b', mb: 1 }}>
                            Explore <span style={{ color: '#6366f1' }}>Drives</span>
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                            Welcome back, {user?.name}. Ready for your next big step?
                        </Typography>
                    </motion.div>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                        <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Active</Typography>
                            <Typography variant="h6" sx={{ color: '#6366f1', fontWeight: 800 }}>{drives.length}</Typography>
                        </Paper>
                        <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Eligible</Typography>
                            <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 800 }}>{drives.filter(d => d.isEligible).length}</Typography>
                        </Paper>
                    </Box>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 4, borderRadius: '12px' }}>{error}</Alert>}

                {/* Drives Grid */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <Grid container spacing={4}>
                        <AnimatePresence>
                            {drives.map((drive) => {
                                const daysRemaining = getDaysRemaining(drive.expiryDate);
                                const appStatus = drive.applicationStatus;
                                const isApplied = appStatus === 'applied';

                                return (
                                    <Grid item xs={12} md={6} lg={4} key={drive.id}>
                                        <motion.div variants={cardVariants} whileHover={{ y: -10 }}>
                                            <Card sx={{
                                                borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                                position: 'relative', overflow: 'hidden', background: '#fff',
                                                opacity: drive.isEligible ? 1 : 0.85,
                                            }}>
                                                {/* Top Status Bar */}
                                                <Box sx={{
                                                    height: '6px',
                                                    background: !drive.isEligible
                                                        ? 'linear-gradient(90deg, #ef4444, #f87171)'
                                                        : isApplied
                                                            ? 'linear-gradient(90deg, #10b981, #34d399)'
                                                            : 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                                }} />

                                                <CardContent sx={{ p: 4 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                                        <Avatar sx={{ bgcolor: '#f1f5f9', color: '#6366f1', width: 56, height: 56, borderRadius: '16px' }}>
                                                            <Business fontSize="large" />
                                                        </Avatar>
                                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                                            {/* Eligibility Chip */}
                                                            {drive.isEligible ? (
                                                                <Chip
                                                                    icon={<CheckCircle sx={{ fontSize: 14 }} />}
                                                                    label="Eligible"
                                                                    size="small"
                                                                    sx={{
                                                                        fontWeight: 800, px: 0.5,
                                                                        bgcolor: '#ecfdf5', color: '#059669',
                                                                        border: '1px solid #10b981',
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Tooltip title={drive.eligibilityReasons?.join(', ') || 'Not eligible'} arrow>
                                                                    <Chip
                                                                        icon={<Cancel sx={{ fontSize: 14 }} />}
                                                                        label="Not Eligible"
                                                                        size="small"
                                                                        sx={{
                                                                            fontWeight: 800, px: 0.5,
                                                                            bgcolor: '#fef2f2', color: '#dc2626',
                                                                            border: '1px solid #ef4444',
                                                                        }}
                                                                    />
                                                                </Tooltip>
                                                            )}
                                                            {/* Application Status Chip */}
                                                            {appStatus && (
                                                                <Chip
                                                                    label={appStatus === 'applied' ? 'Applied' : 'Interested'}
                                                                    size="small"
                                                                    sx={{
                                                                        fontWeight: 800, px: 0.5,
                                                                        bgcolor: isApplied ? '#ecfdf5' : '#fff7ed',
                                                                        color: isApplied ? '#059669' : '#d97706',
                                                                        border: `1px solid ${isApplied ? '#10b981' : '#f59e0b'}`,
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Box>

                                                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>{drive.companyName}</Typography>
                                                    <Typography variant="subtitle2" sx={{ color: '#6366f1', fontWeight: 700, mb: 3 }}>{drive.role}</Typography>

                                                    {/* Bento Info Badges */}
                                                    <Grid container spacing={1} sx={{ mb: 3 }}>
                                                        <Grid item xs={4}>
                                                            <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                                                <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', fontWeight: 600 }}>Package</Typography>
                                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{drive.package || 'TBD'}</Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={4}>
                                                            <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                                                <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', fontWeight: 600 }}>Min CGPA</Typography>
                                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{drive.minCGPA || '0.0'}</Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={4}>
                                                            <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                                                <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', fontWeight: 600 }}>Max Backlogs</Typography>
                                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{drive.maxBacklogs || 0}</Typography>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>

                                                    {/* Eligible Branches */}
                                                    <Box sx={{ mb: 3 }}>
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, display: 'block', mb: 1 }}>ELIGIBLE BRANCHES</Typography>
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                            {drive.eligibleDepartments?.map((dept, idx) => (
                                                                <Chip key={idx} label={dept.department || dept} size="small" sx={{ borderRadius: '6px', fontSize: '10px', fontWeight: 700 }} />
                                                            ))}
                                                        </Box>
                                                    </Box>

                                                    {/* Self-Track Status */}
                                                    {drive.isEligible && (
                                                        <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                                                            <InputLabel>Self-Track Status</InputLabel>
                                                            <Select
                                                                value={appStatus || 'none'}
                                                                label="Self-Track Status"
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    if (val === 'none') return;
                                                                    handleStatusChange(drive.id, val);
                                                                }}
                                                                sx={{ borderRadius: '12px' }}
                                                            >
                                                                <MenuItem value="none" disabled>Select Status</MenuItem>
                                                                <MenuItem value="interested">Mark as Interested</MenuItem>
                                                                <MenuItem value="applied">Mark as Applied</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    )}

                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, borderTop: '1px solid #f1f5f9' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <AccessTime sx={{ fontSize: 16, color: daysRemaining <= 3 ? '#ef4444' : '#64748b' }} />
                                                            <Typography variant="caption" sx={{ fontWeight: 700, color: daysRemaining <= 3 ? '#ef4444' : '#64748b' }}>
                                                                {daysRemaining} Days Left
                                                            </Typography>
                                                        </Box>
                                                        <IconButton size="small" onClick={() => handleExpandClick(drive.id)}>
                                                            <Typography variant="caption" sx={{ fontWeight: 700, mr: 0.5 }}>Details</Typography>
                                                            <ExpandMoreIcon sx={{ transform: expandedId === drive.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
                                                        </IconButton>
                                                    </Box>

                                                    <Collapse in={expandedId === drive.id} timeout="auto" unmountOnExit>
                                                        <Typography variant="body2" sx={{ mt: 2, color: '#475569', lineHeight: 1.6, background: '#f8fafc', p: 2, borderRadius: '12px' }}>
                                                            {drive.description || "No specific details shared."}
                                                        </Typography>
                                                    </Collapse>
                                                </CardContent>

                                                <Box sx={{ p: 4, pt: 0 }}>
                                                    <Button
                                                        variant="contained"
                                                        fullWidth
                                                        onClick={() => handleApplyClick(drive)}
                                                        disabled={!drive.isEligible || (!user?.profileCompleted && !appStatus)}
                                                        sx={{
                                                            py: 1.5, borderRadius: '14px', fontWeight: 800, textTransform: 'none', fontSize: '1rem',
                                                            background: !drive.isEligible
                                                                ? '#f1f5f9'
                                                                : isApplied
                                                                    ? '#f1f5f9'
                                                                    : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                                            color: !drive.isEligible ? '#94a3b8' : isApplied ? '#64748b' : '#fff',
                                                            boxShadow: !drive.isEligible || isApplied ? 'none' : '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                                                            '&:hover': {
                                                                background: !drive.isEligible ? '#f1f5f9' : isApplied ? '#e2e8f0' : '#4338ca',
                                                            },
                                                            '&.Mui-disabled': {
                                                                background: '#f1f5f9',
                                                                color: '#94a3b8',
                                                            },
                                                        }}
                                                    >
                                                        {!drive.isEligible ? 'Not Eligible' : isApplied ? 'View Details & Apply Again' : 'Apply Now'}
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

                {/* Apply Dialog */}
                <ApplyDialog
                    open={applyDialog.open}
                    onClose={() => setApplyDialog({ open: false, drive: null, profile: null })}
                    drive={applyDialog.drive}
                    studentProfile={applyDialog.profile}
                    onApplied={handleApplied}
                />
            </Container>
        </Box>
    );
};

export default StudentDashboard;
