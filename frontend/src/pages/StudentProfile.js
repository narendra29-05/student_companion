import React, { useState, useEffect, useMemo } from 'react';
import {
    Container, Typography, Box, TextField, Button, Grid, Card, CardContent,
    CircularProgress, Alert, Chip, IconButton, LinearProgress, Paper, Avatar,
    Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment, Stack,
    Divider, Tooltip
} from '@mui/material';
import {
    Save, Upload, Delete, Description, CheckCircle, Cancel,
    Person, School, Email, Badge, CameraAlt, Warning, Visibility, VisibilityOff,
    TrendingUp, Assignment, ChecklistRtl, WorkOutline, CalendarMonth,
    ContentCopy, Edit, BarChart
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001';

const resolveUrl = (path) => {
    if (!path) return undefined;
    return path.startsWith('http') ? path : `${API_BASE}/${path}`;
};

/* ─── Animated stat card ─── */
const StatCard = ({ icon, label, value, color, delay = 0 }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}>
        <Paper sx={{
            p: 2, borderRadius: '16px', border: '1px solid #e2e8f0',
            display: 'flex', alignItems: 'center', gap: 1.5,
            transition: 'all 0.25s',
            '&:hover': { borderColor: color, boxShadow: `0 4px 20px ${color}15`, transform: 'translateY(-2px)' },
        }}>
            <Avatar sx={{ width: 42, height: 42, bgcolor: `${color}12` }}>
                {React.cloneElement(icon, { sx: { color, fontSize: 22 } })}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</Typography>
                <Typography sx={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', lineHeight: 1.2 }}>{value}</Typography>
            </Box>
        </Paper>
    </motion.div>
);

/* ─── Quick action button ─── */
const QuickAction = ({ icon, label, onClick, color }) => (
    <Tooltip title={label} arrow>
        <Paper
            onClick={onClick}
            sx={{
                p: 1.5, borderRadius: '14px', border: '1px solid #e2e8f0',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.8,
                cursor: 'pointer', transition: 'all 0.25s', textAlign: 'center',
                '&:hover': { borderColor: color, background: `${color}06`, transform: 'translateY(-3px)', boxShadow: `0 6px 20px ${color}12` },
            }}
        >
            <Avatar sx={{ width: 38, height: 38, bgcolor: `${color}10` }}>
                {React.cloneElement(icon, { sx: { color, fontSize: 20 } })}
            </Avatar>
            <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', lineHeight: 1.2 }}>{label}</Typography>
        </Paper>
    </Tooltip>
);

const StudentProfile = () => {
    const navigate = useNavigate();
    const { updateUser, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingPic, setUploadingPic] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [showDeletePwd, setShowDeletePwd] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // Activity data
    const [activityData, setActivityData] = useState({
        drives: [], assignments: [], todos: [],
    });

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', cgpa: '', backlogs: 0, section: '',
    });

    useEffect(() => {
        fetchProfile();
        fetchActivityData();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await API.get('/student/profile');
            const p = response.data.profile;
            setProfile(p);
            setFormData({
                firstName: p.firstName || '',
                lastName: p.lastName || '',
                cgpa: p.cgpa !== null ? p.cgpa : '',
                backlogs: p.backlogs || 0,
                section: p.section || '',
            });
        } catch (err) {
            toast.error('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchActivityData = async () => {
        const results = await Promise.allSettled([
            API.get('/drives/student'),
            API.get('/assignments/student'),
            API.get('/todos'),
        ]);
        setActivityData({
            drives: results[0].status === 'fulfilled' ? results[0].value.data.drives || results[0].value.data || [] : [],
            assignments: results[1].status === 'fulfilled' ? results[1].value.data.assignments || results[1].value.data || [] : [],
            todos: results[2].status === 'fulfilled' ? results[2].value.data.todos || results[2].value.data || [] : [],
        });
    };

    // Computed stats
    const stats = useMemo(() => {
        const d = activityData.drives;
        const a = activityData.assignments;
        const t = activityData.todos;
        return {
            appliedDrives: Array.isArray(d) ? d.filter(x => x.applicationStatus === 'applied').length : 0,
            eligibleDrives: Array.isArray(d) ? d.filter(x => x.isEligible).length : 0,
            totalDrives: Array.isArray(d) ? d.length : 0,
            submittedAssignments: Array.isArray(a) ? a.filter(x => x.submission).length : 0,
            totalAssignments: Array.isArray(a) ? a.length : 0,
            pendingAssignments: Array.isArray(a) ? a.filter(x => !x.submission && !x.isPastDeadline).length : 0,
            completedTodos: Array.isArray(t) ? t.filter(x => x.isCompleted).length : 0,
            totalTodos: Array.isArray(t) ? t.length : 0,
        };
    }, [activityData]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await API.put('/student/profile', formData);
            const p = response.data.profile;
            setProfile(p);
            updateUser({
                firstName: p.firstName, lastName: p.lastName,
                cgpa: p.cgpa, backlogs: p.backlogs, profileCompleted: p.profileCompleted,
                name: p.firstName && p.lastName ? `${p.firstName} ${p.lastName}` : p.name,
            });
            toast.success('Profile updated!');
            setEditMode(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formPayload = new FormData();
        formPayload.append('resume', file);
        setUploading(true);
        try {
            const response = await API.post('/student/profile/resume', formPayload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setProfile((prev) => ({ ...prev, resumePath: response.data.resumePath }));
            toast.success('Resume uploaded!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to upload resume');
        } finally {
            setUploading(false);
        }
    };

    const handleResumeDelete = async () => {
        try {
            await API.delete('/student/profile/resume');
            setProfile((prev) => ({ ...prev, resumePath: null }));
            toast.success('Resume deleted');
        } catch (err) {
            toast.error('Failed to delete resume');
        }
    };

    const handleProfilePicUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formPayload = new FormData();
        formPayload.append('profilePic', file);
        setUploadingPic(true);
        try {
            const response = await API.post('/student/profile/picture', formPayload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setProfile((prev) => ({ ...prev, profilePicPath: response.data.profilePicPath }));
            updateUser({ profilePicPath: response.data.profilePicPath });
            toast.success('Profile picture updated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to upload picture');
        } finally {
            setUploadingPic(false);
        }
    };

    const handleProfilePicDelete = async () => {
        try {
            await API.delete('/student/profile/picture');
            setProfile((prev) => ({ ...prev, profilePicPath: null }));
            updateUser({ profilePicPath: null });
            toast.success('Profile picture removed');
        } catch (err) {
            toast.error('Failed to delete picture');
        }
    };

    const getCompletionPercentage = () => {
        if (!profile) return 0;
        const fields = [profile.firstName, profile.lastName, profile.cgpa !== null ? 'yes' : null, profile.resumePath, profile.section];
        return Math.round((fields.filter(Boolean).length / fields.length) * 100);
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) { toast.error('Please enter your password'); return; }
        setDeleting(true);
        try {
            await API.delete('/student/account', { data: { password: deletePassword } });
            toast.success('Account deleted');
            logout();
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete account');
        } finally { setDeleting(false); }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied!');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <CircularProgress thickness={5} size={50} sx={{ color: '#6366f1' }} />
                <Typography sx={{ mt: 2, color: '#94a3b8', fontWeight: 500, fontSize: '0.9rem' }}>Loading Profile...</Typography>
            </Box>
        );
    }

    const completionPct = getCompletionPercentage();
    const displayName = profile?.firstName && profile?.lastName
        ? `${profile.firstName} ${profile.lastName}`
        : profile?.name || 'Student';

    return (
        <Box sx={{ background: '#f8fafc', minHeight: '100vh', pb: 6 }}>
            {/* ═══ Hero Banner ═══ */}
            <Box sx={{
                background: 'linear-gradient(135deg, #312e81 0%, #4f46e5 40%, #6366f1 80%, #818cf8 100%)',
                pt: { xs: 4, sm: 5, md: 6 }, pb: { xs: 10, sm: 12 },
                px: 2, position: 'relative', overflow: 'hidden',
            }}>
                {/* Decorative elements */}
                <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    style={{ position: 'absolute', top: '-20%', right: '-10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', filter: 'blur(40px)' }}
                />
                <Container maxWidth="md">
                    <Box sx={{ display: 'flex', alignItems: { xs: 'center', sm: 'flex-end' }, gap: { xs: 2, sm: 3 }, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
                        {/* Avatar */}
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: 'spring' }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={resolveUrl(profile?.profilePicPath)}
                                    sx={{
                                        width: { xs: 90, sm: 110 }, height: { xs: 90, sm: 110 },
                                        bgcolor: '#818cf8', fontSize: '2.5rem', fontWeight: 800,
                                        border: '4px solid rgba(255,255,255,0.25)',
                                        boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                                    }}
                                >
                                    {!profile?.profilePicPath && (displayName.charAt(0)?.toUpperCase() || 'S')}
                                </Avatar>
                                <IconButton
                                    component="label" disabled={uploadingPic}
                                    sx={{
                                        position: 'absolute', bottom: 0, right: 0,
                                        bgcolor: '#fff', color: '#6366f1', width: 34, height: 34,
                                        border: '2px solid #6366f1',
                                        '&:hover': { bgcolor: '#f0f0ff' },
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    }}
                                >
                                    {uploadingPic ? <CircularProgress size={16} sx={{ color: '#6366f1' }} /> : <CameraAlt sx={{ fontSize: 16 }} />}
                                    <input type="file" hidden accept=".jpg,.jpeg,.png,.webp" onChange={handleProfilePicUpload} />
                                </IconButton>
                            </Box>
                        </motion.div>

                        {/* Name & Info */}
                        <motion.div initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                            <Box sx={{ mb: { xs: 0, sm: 1 } }}>
                                <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: { xs: '1.5rem', sm: '2rem' }, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                                    {displayName}
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: { xs: 'center', sm: 'flex-start' }, flexWrap: 'wrap', gap: 0.5 }}>
                                    <Chip label={profile?.rollNumber} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, fontSize: '0.72rem', backdropFilter: 'blur(4px)' }} />
                                    <Chip label={profile?.department} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, fontSize: '0.72rem' }} />
                                    <Chip label={`Year ${profile?.year}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, fontSize: '0.72rem' }} />
                                    {profile?.cgpa && (
                                        <Chip label={`CGPA: ${profile.cgpa}`} size="small" sx={{ bgcolor: 'rgba(16,185,129,0.25)', color: '#a7f3d0', fontWeight: 700, fontSize: '0.72rem' }} />
                                    )}
                                </Stack>
                                {profile?.profilePicPath && (
                                    <Button size="small" onClick={handleProfilePicDelete}
                                        sx={{ mt: 0.5, color: 'rgba(255,255,255,0.6)', textTransform: 'none', fontWeight: 600, fontSize: '0.7rem', '&:hover': { color: '#fca5a5' } }}>
                                        Remove photo
                                    </Button>
                                )}
                            </Box>
                        </motion.div>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="md" sx={{ mt: { xs: -7, sm: -8 }, position: 'relative', zIndex: 1 }}>
                {/* ═══ Profile Completion ═══ */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: '18px', border: '1px solid #e2e8f0', mb: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.95rem' }}>
                                Profile Completion
                            </Typography>
                            <Chip
                                icon={completionPct === 100 ? <CheckCircle sx={{ fontSize: 16 }} /> : undefined}
                                label={completionPct === 100 ? 'Complete' : `${completionPct}%`}
                                size="small"
                                sx={{
                                    fontWeight: 700, fontSize: '0.75rem',
                                    bgcolor: completionPct === 100 ? '#ecfdf5' : '#fff7ed',
                                    color: completionPct === 100 ? '#059669' : '#d97706',
                                    border: `1px solid ${completionPct === 100 ? '#10b981' : '#f59e0b'}`,
                                }}
                            />
                        </Box>
                        <LinearProgress variant="determinate" value={completionPct} sx={{
                            height: 8, borderRadius: 4, bgcolor: '#f1f5f9',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                background: completionPct === 100 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #6366f1, #818cf8)',
                            },
                        }} />
                        <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                            {[
                                { label: 'First Name', done: !!profile?.firstName },
                                { label: 'Last Name', done: !!profile?.lastName },
                                { label: 'CGPA', done: profile?.cgpa != null },
                                { label: 'Resume', done: !!profile?.resumePath },
                                { label: 'Section', done: !!profile?.section },
                            ].map((item) => (
                                <Chip key={item.label} size="small" variant="outlined"
                                    icon={item.done ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
                                    label={item.label}
                                    sx={{
                                        fontSize: '0.7rem', fontWeight: 600,
                                        color: item.done ? '#059669' : '#94a3b8',
                                        borderColor: item.done ? '#10b981' : '#e2e8f0',
                                    }}
                                />
                            ))}
                        </Box>
                    </Paper>
                </motion.div>

                {/* ═══ Activity Stats ═══ */}
                <Grid container spacing={1.5} sx={{ mb: 3 }}>
                    {[
                        { icon: <WorkOutline />, label: 'Applied Drives', value: stats.appliedDrives, color: '#6366f1', delay: 0.3 },
                        { icon: <Assignment />, label: 'Submitted', value: `${stats.submittedAssignments}/${stats.totalAssignments}`, color: '#ec4899', delay: 0.35 },
                        { icon: <ChecklistRtl />, label: 'Todos Done', value: `${stats.completedTodos}/${stats.totalTodos}`, color: '#10b981', delay: 0.4 },
                        { icon: <TrendingUp />, label: 'Eligible Drives', value: stats.eligibleDrives, color: '#f59e0b', delay: 0.45 },
                    ].map((s, i) => (
                        <Grid item xs={6} sm={3} key={i}>
                            <StatCard {...s} />
                        </Grid>
                    ))}
                </Grid>

                {/* ═══ Quick Actions ═══ */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: '18px', border: '1px solid #e2e8f0', mb: 3 }}>
                        <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.9rem', mb: 1.5 }}>Quick Actions</Typography>
                        <Grid container spacing={1.5}>
                            {[
                                { icon: <WorkOutline />, label: 'Placement Drives', onClick: () => navigate('/student/dashboard'), color: '#6366f1' },
                                { icon: <Assignment />, label: 'Assignments', onClick: () => navigate('/student/assignments'), color: '#ec4899' },
                                { icon: <ChecklistRtl />, label: 'To-Do List', onClick: () => navigate('/student/todos'), color: '#10b981' },
                                { icon: <CalendarMonth />, label: 'Attendance', onClick: () => navigate('/student/attendance'), color: '#f59e0b' },
                                { icon: <Description />, label: 'Study Materials', onClick: () => navigate('/student/materials'), color: '#8b5cf6' },
                                { icon: <BarChart />, label: 'Dashboard', onClick: () => navigate('/student/dashboard'), color: '#0ea5e9' },
                            ].map((a, i) => (
                                <Grid item xs={4} sm={2} key={i}>
                                    <QuickAction {...a} />
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </motion.div>

                {/* ═══ Registration Info ═══ */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
                    <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: '18px', border: '1px solid #e2e8f0', mb: 3 }}>
                        <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.95rem', mb: 2 }}>Registration Info</Typography>
                        <Grid container spacing={1.5}>
                            {[
                                { icon: <Badge fontSize="small" />, label: 'Roll Number', value: profile?.rollNumber, copyable: true },
                                { icon: <Email fontSize="small" />, label: 'College Email', value: profile?.collegeEmail || profile?.email, copyable: true },
                                { icon: <School fontSize="small" />, label: 'Department', value: profile?.department },
                                { icon: <Person fontSize="small" />, label: 'Year', value: `Year ${profile?.year}` },
                            ].map((item) => (
                                <Grid item xs={12} sm={6} key={item.label}>
                                    <Box sx={{
                                        display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5,
                                        bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9',
                                    }}>
                                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#eff6ff' }}>
                                            <Box sx={{ color: '#6366f1' }}>{item.icon}</Box>
                                        </Avatar>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</Typography>
                                            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</Typography>
                                        </Box>
                                        {item.copyable && (
                                            <Tooltip title="Copy" arrow>
                                                <IconButton size="small" onClick={() => copyToClipboard(item.value)} sx={{ color: '#94a3b8' }}>
                                                    <ContentCopy sx={{ fontSize: 16 }} />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </motion.div>

                {/* ═══ Editable Fields ═══ */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: '18px', border: '1px solid #e2e8f0', mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.95rem' }}>
                                Personal & Academic Info
                            </Typography>
                            {!editMode && (
                                <Button size="small" startIcon={<Edit sx={{ fontSize: 16 }} />} onClick={() => setEditMode(true)}
                                    sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', color: '#6366f1', borderRadius: '10px' }}>
                                    Edit
                                </Button>
                            )}
                        </Box>

                        {editMode ? (
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="First Name" value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Last Name" value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField fullWidth label="CGPA" type="number" inputProps={{ step: 0.01, min: 0, max: 10 }}
                                            value={formData.cgpa}
                                            onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField fullWidth label="Active Backlogs" type="number" inputProps={{ min: 0 }}
                                            value={formData.backlogs}
                                            onChange={(e) => setFormData({ ...formData, backlogs: parseInt(e.target.value, 10) || 0 })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField fullWidth label="Section" value={formData.section}
                                            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                                    </Grid>
                                </Grid>
                                <Stack direction="row" spacing={1.5} sx={{ mt: 2.5, justifyContent: 'flex-end' }}>
                                    <Button variant="outlined" onClick={() => setEditMode(false)}
                                        sx={{ borderRadius: '12px', px: 3, fontWeight: 700, textTransform: 'none', borderColor: '#e2e8f0', color: '#64748b' }}>
                                        Cancel
                                    </Button>
                                    <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={saving}
                                        sx={{
                                            borderRadius: '12px', px: 3, py: 1.1, fontWeight: 700, textTransform: 'none',
                                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                            boxShadow: '0 6px 16px rgba(99,102,241,0.3)',
                                        }}>
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </Stack>
                            </>
                        ) : (
                            <Grid container spacing={1.5}>
                                {[
                                    { label: 'First Name', value: profile?.firstName || '—' },
                                    { label: 'Last Name', value: profile?.lastName || '—' },
                                    { label: 'CGPA', value: profile?.cgpa != null ? profile.cgpa : '—' },
                                    { label: 'Active Backlogs', value: profile?.backlogs ?? '—' },
                                    { label: 'Section', value: profile?.section || '—' },
                                ].map((item) => (
                                    <Grid item xs={6} sm={4} key={item.label}>
                                        <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: '10px' }}>
                                            <Typography sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</Typography>
                                            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b', mt: 0.3 }}>{item.value}</Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Paper>
                </motion.div>

                {/* ═══ Resume Section ═══ */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
                    <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: '18px', border: '1px solid #e2e8f0', mb: 3 }}>
                        <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.95rem', mb: 2 }}>Resume</Typography>
                        {profile?.resumePath ? (
                            <Box sx={{
                                display: 'flex', alignItems: 'center', gap: 2, p: 2,
                                bgcolor: '#f0fdf4', borderRadius: '14px', border: '1px solid #bbf7d0',
                                flexWrap: 'wrap',
                            }}>
                                <Avatar sx={{ bgcolor: '#dcfce7', width: 44, height: 44 }}>
                                    <Description sx={{ color: '#16a34a', fontSize: 24 }} />
                                </Avatar>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#166534' }}>Resume uploaded</Typography>
                                    <Typography sx={{ color: '#4ade80', fontSize: '0.72rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {profile.resumePath.split('/').pop()}
                                    </Typography>
                                </Box>
                                <Stack direction="row" spacing={1}>
                                    <Button size="small" variant="contained"
                                        href={resolveUrl(profile.resumePath)} target="_blank"
                                        sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', background: '#16a34a', '&:hover': { background: '#15803d' } }}>
                                        View
                                    </Button>
                                    <IconButton color="error" onClick={handleResumeDelete} size="small" sx={{ border: '1px solid #fecaca' }}>
                                        <Delete sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </Stack>
                            </Box>
                        ) : (
                            <Box sx={{
                                p: 3, borderRadius: '14px', border: '2px dashed #cbd5e1',
                                textAlign: 'center', bgcolor: '#f8fafc',
                            }}>
                                <Upload sx={{ fontSize: 36, color: '#94a3b8', mb: 1 }} />
                                <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#475569', mb: 0.5 }}>No resume uploaded</Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mb: 2 }}>PDF, DOC or DOCX (max 5MB)</Typography>
                                <Button variant="contained" component="label"
                                    startIcon={uploading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <Upload />}
                                    disabled={uploading}
                                    sx={{
                                        borderRadius: '12px', textTransform: 'none', fontWeight: 700, fontSize: '0.85rem',
                                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                        boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                                    }}>
                                    {uploading ? 'Uploading...' : 'Upload Resume'}
                                    <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                                </Button>
                            </Box>
                        )}
                        {profile?.resumePath && (
                            <Box sx={{ mt: 2 }}>
                                <Button variant="outlined" component="label"
                                    startIcon={uploading ? <CircularProgress size={14} /> : <Upload />}
                                    disabled={uploading}
                                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}>
                                    {uploading ? 'Uploading...' : 'Replace Resume'}
                                    <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                                </Button>
                            </Box>
                        )}
                    </Paper>
                </motion.div>

                {/* ═══ Danger Zone ═══ */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                    <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: '18px', border: '1px solid #fecaca' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Warning sx={{ color: '#ef4444', fontSize: 20 }} />
                            <Typography sx={{ fontWeight: 800, color: '#dc2626', fontSize: '0.95rem' }}>Danger Zone</Typography>
                        </Box>
                        <Typography sx={{ color: '#64748b', mb: 2, fontSize: '0.82rem' }}>
                            Permanently delete your account and all associated data. This cannot be undone.
                        </Typography>
                        <Button variant="outlined" color="error" onClick={() => setDeleteOpen(true)}
                            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, fontSize: '0.85rem' }}>
                            Delete Account
                        </Button>
                    </Paper>
                </motion.div>
            </Container>

            {/* ═══ Delete Dialog ═══ */}
            <Dialog open={deleteOpen} onClose={() => !deleting && setDeleteOpen(false)} maxWidth="xs" fullWidth
                PaperProps={{ sx: { borderRadius: '18px' } }}>
                <DialogTitle sx={{ fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Warning /> Delete Account
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: '#64748b', mb: 2, fontSize: '0.85rem' }}>
                        This will permanently delete your account, profile, resume, assignments, submissions, drive applications, and all other data. Enter your password to confirm.
                    </Typography>
                    <TextField fullWidth label="Confirm Password"
                        type={showDeletePwd ? 'text' : 'password'}
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowDeletePwd(!showDeletePwd)} size="small" edge="end">
                                        {showDeletePwd ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => { setDeleteOpen(false); setDeletePassword(''); }} disabled={deleting}
                        sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleDeleteAccount} disabled={deleting || !deletePassword}
                        sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}>
                        {deleting ? 'Deleting...' : 'Delete My Account'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StudentProfile;
