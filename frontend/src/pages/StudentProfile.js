import React, { useState, useEffect, useMemo } from 'react';
import {
    Typography, Box, TextField, Button, Grid, MenuItem,
    CircularProgress, Chip, IconButton, LinearProgress, Paper, Avatar,
    Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment, Stack,
    Tooltip, Divider, Tab, Tabs
} from '@mui/material';
import {
    Save, Upload, Delete, CheckCircle, Cancel,
    Person, School, Email, Badge, CameraAlt, Warning, Visibility, VisibilityOff,
    TrendingUp, Assignment, ChecklistRtl, WorkOutline,
    ContentCopy, Edit, Verified, FilePresent,
    CloudUpload, SwapHoriz, LocationOn
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const CAMPUSES = ['ACET', 'AUS'];

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001';

const resolveUrl = (path) => {
    if (!path) return undefined;
    return path.startsWith('http') ? path : `${API_BASE}/${path}`;
};

/* ─── Circular Progress Ring ─── */
const ProgressRing = ({ value, size = 80, thickness = 5, color }) => (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
            variant="determinate" value={100}
            size={size} thickness={thickness}
            sx={{ color: 'rgba(255,255,255,0.15)', position: 'absolute' }}
        />
        <CircularProgress
            variant="determinate" value={value}
            size={size} thickness={thickness}
            sx={{ color: color || '#fff', '& circle': { strokeLinecap: 'round' } }}
        />
        <Box sx={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
        }}>
            <Typography sx={{ fontWeight: 900, fontSize: size * 0.25, color: '#fff', lineHeight: 1 }}>
                {value}%
            </Typography>
        </Box>
    </Box>
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
    const [activeTab, setActiveTab] = useState(0);

    const [activityData, setActivityData] = useState({
        drives: [], assignments: [], todos: [],
    });

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', cgpa: '', backlogs: 0, section: '', campus: '',
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
                campus: p.campus || '',
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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
                <Box sx={{ position: 'relative' }}>
                    <CircularProgress size={48} thickness={3} sx={{ color: '#6366f1' }} />
                    <CircularProgress size={48} thickness={3} sx={{ color: '#e0e7ff', position: 'absolute', left: 0 }} variant="determinate" value={100} />
                </Box>
                <Typography sx={{ mt: 2, color: '#94a3b8', fontWeight: 600, fontSize: '0.85rem' }}>Loading profile...</Typography>
            </Box>
        );
    }

    const completionPct = getCompletionPercentage();
    const displayName = profile?.firstName && profile?.lastName
        ? `${profile.firstName} ${profile.lastName}`
        : profile?.name || 'Student';

    const completionFields = [
        { label: 'First Name', done: !!profile?.firstName },
        { label: 'Last Name', done: !!profile?.lastName },
        { label: 'CGPA', done: profile?.cgpa != null },
        { label: 'Resume', done: !!profile?.resumePath },
        { label: 'Section', done: !!profile?.section },
    ];

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', pb: 4 }}>
            {/* ═══ Profile Hero Card ═══ */}
            <motion.div initial={{ y: -15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                <Paper sx={{
                    borderRadius: '24px', overflow: 'hidden', mb: 3,
                    boxShadow: '0 8px 32px rgba(99,102,241,0.15)',
                    border: '1px solid #e0e7ff',
                }}>
                    {/* Gradient Banner */}
                    <Box sx={{
                        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4338ca 55%, #6366f1 85%, #818cf8 100%)',
                        px: { xs: 2.5, sm: 4 }, pt: { xs: 3, sm: 4 }, pb: { xs: 8, sm: 9 },
                        position: 'relative', overflow: 'hidden',
                    }}>
                        {/* Decorative elements */}
                        <Box sx={{ position: 'absolute', top: -50, right: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(139,92,246,0.12)', filter: 'blur(50px)' }} />
                        <Box sx={{ position: 'absolute', bottom: -20, left: '20%', width: 150, height: 150, borderRadius: '50%', background: 'rgba(14,165,233,0.1)', filter: 'blur(40px)' }} />
                        <Box sx={{ position: 'absolute', top: 20, left: '60%', width: 80, height: 80, borderRadius: '50%', background: 'rgba(236,72,153,0.08)', filter: 'blur(25px)' }} />

                        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.5 }}>
                                    Student Profile
                                </Typography>
                                <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: { xs: '1.3rem', sm: '1.6rem' }, letterSpacing: '-0.02em' }}>
                                    {displayName}
                                </Typography>
                            </Box>
                            {completionPct < 100 && (
                                <ProgressRing value={completionPct} size={60} thickness={4} />
                            )}
                            {completionPct === 100 && (
                                <Chip
                                    icon={<Verified sx={{ fontSize: 16, color: '#a7f3d0 !important' }} />}
                                    label="Complete"
                                    size="small"
                                    sx={{ bgcolor: 'rgba(16,185,129,0.2)', color: '#a7f3d0', fontWeight: 700, fontSize: '0.75rem', border: '1px solid rgba(16,185,129,0.25)' }}
                                />
                            )}
                        </Box>
                    </Box>

                    {/* Profile card body overlapping banner */}
                    <Box sx={{ px: { xs: 2.5, sm: 4 }, mt: { xs: -5, sm: -6 }, pb: 3, position: 'relative', zIndex: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: { xs: 'center', sm: 'flex-end' }, gap: { xs: 2, sm: 3 }, flexDirection: { xs: 'column', sm: 'row' } }}>
                            {/* Avatar */}
                            <motion.div whileHover={{ scale: 1.03 }}>
                                <Box sx={{ position: 'relative' }}>
                                    <Avatar
                                        src={resolveUrl(profile?.profilePicPath)}
                                        sx={{
                                            width: { xs: 90, sm: 105 }, height: { xs: 90, sm: 105 },
                                            bgcolor: '#6366f1', fontSize: '2.2rem', fontWeight: 800,
                                            border: '4px solid #fff',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                        }}
                                    >
                                        {!profile?.profilePicPath && (displayName.charAt(0)?.toUpperCase() || 'S')}
                                    </Avatar>
                                    <IconButton
                                        component="label" disabled={uploadingPic}
                                        sx={{
                                            position: 'absolute', bottom: 2, right: 2,
                                            bgcolor: '#6366f1', color: '#fff', width: 30, height: 30,
                                            boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
                                            '&:hover': { bgcolor: '#4f46e5' },
                                        }}
                                    >
                                        {uploadingPic ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <CameraAlt sx={{ fontSize: 14 }} />}
                                        <input type="file" hidden accept=".jpg,.jpeg,.png,.webp" onChange={handleProfilePicUpload} />
                                    </IconButton>
                                </Box>
                            </motion.div>

                            {/* Info chips */}
                            <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' }, mb: { xs: 0, sm: 1 } }}>
                                <Stack direction="row" spacing={0.8} sx={{ flexWrap: 'wrap', gap: 0.5, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                                    <Chip label={profile?.rollNumber} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 700, fontSize: '0.74rem' }} />
                                    <Chip label={profile?.department} size="small" sx={{ bgcolor: '#ede9fe', color: '#6366f1', fontWeight: 700, fontSize: '0.74rem' }} />
                                    <Chip label={`Year ${profile?.year}`} size="small" sx={{ bgcolor: '#e0f2fe', color: '#0284c7', fontWeight: 700, fontSize: '0.74rem' }} />
                                    {profile?.cgpa && (
                                        <Chip label={`CGPA ${profile.cgpa}`} size="small" sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 700, fontSize: '0.74rem' }} />
                                    )}
                                </Stack>
                                {profile?.profilePicPath && (
                                    <Button size="small" onClick={handleProfilePicDelete}
                                        sx={{ mt: 0.5, color: '#94a3b8', textTransform: 'none', fontWeight: 600, fontSize: '0.68rem', '&:hover': { color: '#ef4444' } }}>
                                        Remove photo
                                    </Button>
                                )}
                            </Box>
                        </Box>

                        {/* Activity stats bar */}
                        <Grid container spacing={1.5} sx={{ mt: 2.5 }}>
                            {[
                                { label: 'Applied', value: stats.appliedDrives, icon: <WorkOutline />, color: '#6366f1', bg: '#eef2ff' },
                                { label: 'Submitted', value: `${stats.submittedAssignments}/${stats.totalAssignments}`, icon: <Assignment />, color: '#ec4899', bg: '#fdf2f8' },
                                { label: 'Todos', value: `${stats.completedTodos}/${stats.totalTodos}`, icon: <ChecklistRtl />, color: '#10b981', bg: '#ecfdf5' },
                                { label: 'Eligible', value: stats.eligibleDrives, icon: <TrendingUp />, color: '#f59e0b', bg: '#fffbeb' },
                            ].map((s, i) => (
                                <Grid item xs={6} sm={3} key={i}>
                                    <motion.div initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.05 }}>
                                        <Box sx={{
                                            p: 1.5, borderRadius: '14px', bgcolor: s.bg,
                                            display: 'flex', alignItems: 'center', gap: 1.2,
                                            border: '1px solid transparent',
                                            transition: 'all 0.2s',
                                            '&:hover': { borderColor: `${s.color}25` },
                                        }}>
                                            <Avatar sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: `${s.color}18` }}>
                                                {React.cloneElement(s.icon, { sx: { color: s.color, fontSize: 18 } })}
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#1e293b', lineHeight: 1 }}>{s.value}</Typography>
                                                <Typography sx={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</Typography>
                                            </Box>
                                        </Box>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Paper>
            </motion.div>

            {/* ═══ Profile Completion (if not 100%) ═══ */}
            {completionPct < 100 && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <Paper sx={{
                        p: 2.5, borderRadius: '18px', mb: 3,
                        background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                        border: '1px solid #fde68a',
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                            <Typography sx={{ fontWeight: 800, color: '#92400e', fontSize: '0.9rem' }}>
                                Complete your profile
                            </Typography>
                            <Typography sx={{ fontWeight: 800, color: '#d97706', fontSize: '0.85rem' }}>
                                {completionPct}%
                            </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={completionPct} sx={{
                            height: 6, borderRadius: 3, bgcolor: 'rgba(245,158,11,0.15)',
                            mb: 1.5,
                            '& .MuiLinearProgress-bar': { borderRadius: 3, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' },
                        }} />
                        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                            {completionFields.map((item) => (
                                <Chip key={item.label} size="small"
                                    icon={item.done ? <CheckCircle sx={{ fontSize: 14 }} /> : <Cancel sx={{ fontSize: 14 }} />}
                                    label={item.label}
                                    sx={{
                                        fontSize: '0.68rem', fontWeight: 600, height: 26,
                                        color: item.done ? '#059669' : '#d97706',
                                        bgcolor: item.done ? '#ecfdf5' : '#fff7ed',
                                        border: `1px solid ${item.done ? '#a7f3d0' : '#fed7aa'}`,
                                    }}
                                />
                            ))}
                        </Stack>
                    </Paper>
                </motion.div>
            )}

            {/* ═══ Tabbed Sections ═══ */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Paper sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', mb: 3 }}>
                    <Tabs
                        value={activeTab} onChange={(_, v) => setActiveTab(v)}
                        sx={{
                            px: 2, pt: 1, borderBottom: '1px solid #f1f5f9',
                            '& .MuiTab-root': {
                                textTransform: 'none', fontWeight: 700, fontSize: '0.85rem',
                                color: '#94a3b8', minHeight: 48, borderRadius: '10px 10px 0 0',
                            },
                            '& .Mui-selected': { color: '#6366f1' },
                            '& .MuiTabs-indicator': { bgcolor: '#6366f1', height: 3, borderRadius: '3px 3px 0 0' },
                        }}
                    >
                        <Tab label="Personal Info" />
                        <Tab label="Academic" />
                        <Tab label="Resume" />
                    </Tabs>

                    <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
                        {/* TAB 0: Personal Info + Registration */}
                        {activeTab === 0 && (
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
                                {/* Registration Info */}
                                <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.92rem', mb: 2 }}>
                                    Registration Details
                                </Typography>
                                <Grid container spacing={1.5} sx={{ mb: 3 }}>
                                    {[
                                        { icon: <Badge />, label: 'Roll Number', value: profile?.rollNumber, copyable: true },
                                        { icon: <Email />, label: 'College Email', value: profile?.collegeEmail || profile?.email, copyable: true },
                                        { icon: <School />, label: 'Department', value: profile?.department },
                                        { icon: <Person />, label: 'Year', value: `Year ${profile?.year}` },
                                    ].map((item) => (
                                        <Grid item xs={12} sm={6} key={item.label}>
                                            <Box sx={{
                                                display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5,
                                                bgcolor: '#f8fafc', borderRadius: '14px', border: '1px solid #f1f5f9',
                                                transition: 'all 0.2s',
                                                '&:hover': { borderColor: '#e2e8f0', bgcolor: '#fff' },
                                            }}>
                                                <Avatar sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: '#eef2ff' }}>
                                                    {React.cloneElement(item.icon, { sx: { color: '#6366f1', fontSize: 18 } })}
                                                </Avatar>
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                                        {item.label}
                                                    </Typography>
                                                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b' }} noWrap>
                                                        {item.value}
                                                    </Typography>
                                                </Box>
                                                {item.copyable && (
                                                    <Tooltip title="Copy" arrow>
                                                        <IconButton size="small" onClick={() => copyToClipboard(item.value)}
                                                            sx={{ color: '#cbd5e1', '&:hover': { color: '#6366f1', bgcolor: '#eef2ff' } }}>
                                                            <ContentCopy sx={{ fontSize: 15 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Divider sx={{ my: 2.5, borderColor: '#f1f5f9' }} />

                                {/* Editable Name Fields */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.92rem' }}>
                                        Personal Details
                                    </Typography>
                                    {!editMode && (
                                        <Button size="small" startIcon={<Edit sx={{ fontSize: 15 }} />} onClick={() => setEditMode(true)}
                                            sx={{
                                                textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', color: '#6366f1',
                                                borderRadius: '10px', border: '1px solid #e0e7ff',
                                                '&:hover': { bgcolor: '#eef2ff' },
                                            }}>
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
                                        </Grid>
                                        <Stack direction="row" spacing={1.5} sx={{ mt: 2.5, justifyContent: 'flex-end' }}>
                                            <Button variant="outlined" onClick={() => setEditMode(false)}
                                                sx={{ borderRadius: '12px', px: 2.5, fontWeight: 700, textTransform: 'none', borderColor: '#e2e8f0', color: '#64748b' }}>
                                                Cancel
                                            </Button>
                                            <Button variant="contained" startIcon={<Save sx={{ fontSize: 18 }} />} onClick={handleSave} disabled={saving}
                                                sx={{
                                                    borderRadius: '12px', px: 2.5, fontWeight: 700, textTransform: 'none',
                                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                                    boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                                                    '&:hover': { boxShadow: '0 6px 20px rgba(99,102,241,0.4)' },
                                                }}>
                                                {saving ? 'Saving...' : 'Save'}
                                            </Button>
                                        </Stack>
                                    </>
                                ) : (
                                    <Grid container spacing={1.5}>
                                        {[
                                            { label: 'First Name', value: profile?.firstName || '—' },
                                            { label: 'Last Name', value: profile?.lastName || '—' },
                                        ].map((item) => (
                                            <Grid item xs={6} key={item.label}>
                                                <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: '12px' }}>
                                                    <Typography sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                                        {item.label}
                                                    </Typography>
                                                    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b', mt: 0.3 }}>
                                                        {item.value}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </motion.div>
                        )}

                        {/* TAB 1: Academic Info */}
                        {activeTab === 1 && (
                            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.92rem' }}>
                                        Academic Information
                                    </Typography>
                                    {!editMode && (
                                        <Button size="small" startIcon={<Edit sx={{ fontSize: 15 }} />} onClick={() => setEditMode(true)}
                                            sx={{
                                                textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', color: '#6366f1',
                                                borderRadius: '10px', border: '1px solid #e0e7ff',
                                                '&:hover': { bgcolor: '#eef2ff' },
                                            }}>
                                            Edit
                                        </Button>
                                    )}
                                </Box>

                                {editMode ? (
                                    <>
                                        <Grid container spacing={2}>
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
                                            <Grid item xs={12} sm={4}>
                                                <TextField select fullWidth label="Campus" value={formData.campus}
                                                    onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}>
                                                    <MenuItem value="">Not Set</MenuItem>
                                                    {CAMPUSES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                                </TextField>
                                            </Grid>
                                        </Grid>
                                        <Stack direction="row" spacing={1.5} sx={{ mt: 2.5, justifyContent: 'flex-end' }}>
                                            <Button variant="outlined" onClick={() => setEditMode(false)}
                                                sx={{ borderRadius: '12px', px: 2.5, fontWeight: 700, textTransform: 'none', borderColor: '#e2e8f0', color: '#64748b' }}>
                                                Cancel
                                            </Button>
                                            <Button variant="contained" startIcon={<Save sx={{ fontSize: 18 }} />} onClick={handleSave} disabled={saving}
                                                sx={{
                                                    borderRadius: '12px', px: 2.5, fontWeight: 700, textTransform: 'none',
                                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                                    boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                                                }}>
                                                {saving ? 'Saving...' : 'Save'}
                                            </Button>
                                        </Stack>
                                    </>
                                ) : (
                                    <Grid container spacing={2}>
                                        {[
                                            {
                                                label: 'CGPA', value: profile?.cgpa != null ? profile.cgpa : '—',
                                                color: '#10b981', bg: '#ecfdf5', icon: <TrendingUp />,
                                                subtitle: profile?.cgpa != null ? (profile.cgpa >= 8 ? 'Excellent' : profile.cgpa >= 6.5 ? 'Good' : 'Average') : null,
                                            },
                                            {
                                                label: 'Active Backlogs', value: profile?.backlogs ?? '—',
                                                color: profile?.backlogs > 0 ? '#ef4444' : '#10b981',
                                                bg: profile?.backlogs > 0 ? '#fef2f2' : '#ecfdf5',
                                                icon: <Assignment />,
                                                subtitle: profile?.backlogs === 0 ? 'Clear' : null,
                                            },
                                            {
                                                label: 'Section', value: profile?.section || '—',
                                                color: '#6366f1', bg: '#eef2ff', icon: <School />,
                                            },
                                            {
                                                label: 'Campus', value: profile?.campus || '—',
                                                color: '#8b5cf6', bg: '#f5f3ff', icon: <LocationOn />,
                                                subtitle: profile?.campus === 'ACET' ? 'Aditya College' : profile?.campus === 'AUS' ? 'Aditya University' : null,
                                            },
                                        ].map((item) => (
                                            <Grid item xs={12} sm={3} key={item.label}>
                                                <Paper sx={{
                                                    p: 2.5, borderRadius: '16px', bgcolor: item.bg,
                                                    border: '1px solid transparent', textAlign: 'center',
                                                    transition: 'all 0.2s',
                                                    '&:hover': { borderColor: `${item.color}20`, transform: 'translateY(-2px)' },
                                                }}>
                                                    <Avatar sx={{ width: 44, height: 44, mx: 'auto', mb: 1.5, borderRadius: '12px', bgcolor: `${item.color}18` }}>
                                                        {React.cloneElement(item.icon, { sx: { color: item.color, fontSize: 22 } })}
                                                    </Avatar>
                                                    <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#1e293b', lineHeight: 1 }}>
                                                        {item.value}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', mt: 0.5 }}>
                                                        {item.label}
                                                    </Typography>
                                                    {item.subtitle && (
                                                        <Chip label={item.subtitle} size="small" sx={{
                                                            mt: 1, height: 22, fontSize: '0.65rem', fontWeight: 700,
                                                            bgcolor: `${item.color}15`, color: item.color,
                                                        }} />
                                                    )}
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </motion.div>
                        )}

                        {/* TAB 2: Resume */}
                        {activeTab === 2 && (
                            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
                                <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.92rem', mb: 2 }}>
                                    Resume
                                </Typography>

                                {profile?.resumePath ? (
                                    <Box>
                                        <Paper sx={{
                                            p: 3, borderRadius: '18px',
                                            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                                            border: '1px solid #a7f3d0',
                                            textAlign: 'center',
                                        }}>
                                            <Avatar sx={{
                                                width: 56, height: 56, mx: 'auto', mb: 2,
                                                borderRadius: '16px',
                                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                                boxShadow: '0 6px 16px rgba(16,185,129,0.3)',
                                            }}>
                                                <FilePresent sx={{ fontSize: 28, color: '#fff' }} />
                                            </Avatar>
                                            <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#065f46' }}>
                                                Resume Uploaded
                                            </Typography>
                                            <Typography sx={{ color: '#6ee7b7', fontSize: '0.75rem', fontWeight: 600, mt: 0.3, mb: 2 }}>
                                                {profile.resumePath.split('/').pop()}
                                            </Typography>
                                            <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'center' }}>
                                                <Button size="small" variant="contained"
                                                    href={resolveUrl(profile.resumePath)} target="_blank"
                                                    sx={{
                                                        borderRadius: '12px', textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', px: 2.5,
                                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                                        boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                                                    }}>
                                                    View Resume
                                                </Button>
                                                <Button size="small" variant="outlined" component="label"
                                                    startIcon={uploading ? <CircularProgress size={14} /> : <SwapHoriz sx={{ fontSize: 18 }} />}
                                                    disabled={uploading}
                                                    sx={{
                                                        borderRadius: '12px', textTransform: 'none', fontWeight: 700, fontSize: '0.8rem',
                                                        borderColor: '#10b981', color: '#059669',
                                                        '&:hover': { borderColor: '#059669', bgcolor: 'rgba(16,185,129,0.05)' },
                                                    }}>
                                                    {uploading ? 'Uploading...' : 'Replace'}
                                                    <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                                                </Button>
                                                <IconButton onClick={handleResumeDelete} size="small"
                                                    sx={{ border: '1px solid #fecaca', color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' } }}>
                                                    <Delete sx={{ fontSize: 18 }} />
                                                </IconButton>
                                            </Stack>
                                        </Paper>
                                    </Box>
                                ) : (
                                    <Paper sx={{
                                        p: 4, borderRadius: '18px',
                                        border: '2px dashed #cbd5e1',
                                        textAlign: 'center', bgcolor: '#fafafa',
                                        transition: 'all 0.3s',
                                        '&:hover': { borderColor: '#6366f1', bgcolor: '#f8f7ff' },
                                    }}>
                                        <Avatar sx={{
                                            width: 56, height: 56, mx: 'auto', mb: 2,
                                            borderRadius: '16px',
                                            bgcolor: '#eef2ff',
                                        }}>
                                            <CloudUpload sx={{ fontSize: 28, color: '#6366f1' }} />
                                        </Avatar>
                                        <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#475569', mb: 0.5 }}>
                                            No resume yet
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8', mb: 2.5 }}>
                                            Upload your resume to apply for placement drives. PDF, DOC or DOCX (max 5MB)
                                        </Typography>
                                        <Button variant="contained" component="label"
                                            startIcon={uploading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <Upload />}
                                            disabled={uploading}
                                            sx={{
                                                borderRadius: '14px', textTransform: 'none', fontWeight: 700, fontSize: '0.88rem', px: 3, py: 1.2,
                                                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                                boxShadow: '0 6px 18px rgba(99,102,241,0.3)',
                                                '&:hover': { boxShadow: '0 8px 24px rgba(99,102,241,0.4)' },
                                            }}>
                                            {uploading ? 'Uploading...' : 'Upload Resume'}
                                            <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                                        </Button>
                                    </Paper>
                                )}
                            </motion.div>
                        )}
                    </Box>
                </Paper>
            </motion.div>

            {/* ═══ Danger Zone ═══ */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Paper sx={{
                    p: { xs: 2, sm: 2.5 }, borderRadius: '18px',
                    border: '1px solid #fecaca',
                    background: 'linear-gradient(135deg, #fff 0%, #fef2f2 100%)',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#fef2f2', border: '1px solid #fecaca' }}>
                                <Warning sx={{ color: '#ef4444', fontSize: 18 }} />
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontWeight: 800, color: '#dc2626', fontSize: '0.88rem' }}>Danger Zone</Typography>
                                <Typography sx={{ color: '#94a3b8', fontSize: '0.72rem' }}>Permanently delete your account and all data</Typography>
                            </Box>
                        </Box>
                        <Button variant="outlined" color="error" size="small" onClick={() => setDeleteOpen(true)}
                            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, fontSize: '0.8rem' }}>
                            Delete Account
                        </Button>
                    </Box>
                </Paper>
            </motion.div>

            {/* ═══ Delete Dialog ═══ */}
            <Dialog open={deleteOpen} onClose={() => !deleting && setDeleteOpen(false)} maxWidth="xs" fullWidth
                PaperProps={{ sx: { borderRadius: '20px' } }}>
                <DialogTitle sx={{ fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 1, pt: 3 }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: '#fef2f2' }}>
                        <Warning sx={{ color: '#ef4444', fontSize: 20 }} />
                    </Avatar>
                    Delete Account
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
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
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
