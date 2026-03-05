import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, TextField, Button, Grid, Card, CardContent,
    CircularProgress, Alert, Chip, IconButton, LinearProgress, Paper, Avatar,
    Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment
} from '@mui/material';
import {
    Save, Upload, Delete, Description, CheckCircle, Cancel,
    Person, School, Email, Badge, CameraAlt, Warning, Visibility, VisibilityOff
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001';

// If the path is already a full URL (Cloudinary), use it directly; otherwise prepend API_BASE
const resolveUrl = (path) => {
    if (!path) return undefined;
    return path.startsWith('http') ? path : `${API_BASE}/${path}`;
};

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
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        cgpa: '',
        backlogs: 0,
        section: '',
    });

    useEffect(() => { fetchProfile(); }, []);

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

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await API.put('/student/profile', formData);
            const p = response.data.profile;
            setProfile(p);
            updateUser({
                firstName: p.firstName,
                lastName: p.lastName,
                cgpa: p.cgpa,
                backlogs: p.backlogs,
                profileCompleted: p.profileCompleted,
                name: p.firstName && p.lastName ? `${p.firstName} ${p.lastName}` : p.name,
            });
            toast.success('Profile updated successfully!');
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
            toast.success('Resume uploaded successfully!');
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
        const fields = [profile.firstName, profile.lastName, profile.cgpa !== null ? 'yes' : null, profile.resumePath];
        const filled = fields.filter(Boolean).length;
        return Math.round((filled / fields.length) * 100);
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            toast.error('Please enter your password');
            return;
        }
        setDeleting(true);
        try {
            await API.delete('/student/account', { data: { password: deletePassword } });
            toast.success('Account deleted successfully');
            logout();
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete account');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <CircularProgress thickness={5} size={60} sx={{ color: '#6366f1' }} />
                <Typography sx={{ mt: 2, color: '#94a3b8', fontWeight: 500 }}>Loading Profile...</Typography>
            </Box>
        );
    }

    const completionPct = getCompletionPercentage();

    return (
        <Box sx={{ background: '#f8fafc', minHeight: '100vh', py: { xs: 3, sm: 4, md: 6 } }}>
            <Container maxWidth="md">
                {/* Profile Header with Avatar */}
                <Box sx={{ display: 'flex', alignItems: { xs: 'center', sm: 'center' }, gap: { xs: 2, sm: 3 }, mb: 4, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar
                            src={resolveUrl(profile?.profilePicPath)}
                            sx={{
                                width: { xs: 80, sm: 100 }, height: { xs: 80, sm: 100 },
                                bgcolor: '#6366f1',
                                fontSize: '2.5rem',
                                fontWeight: 800,
                                border: '4px solid #e2e8f0',
                                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.2)',
                            }}
                        >
                            {!profile?.profilePicPath && (profile?.name?.charAt(0)?.toUpperCase() || 'U')}
                        </Avatar>
                        {/* Camera overlay */}
                        <IconButton
                            component="label"
                            disabled={uploadingPic}
                            sx={{
                                position: 'absolute', bottom: -4, right: -4,
                                bgcolor: '#6366f1', color: '#fff',
                                width: 32, height: 32,
                                border: '2px solid #fff',
                                '&:hover': { bgcolor: '#4f46e5' },
                            }}
                        >
                            {uploadingPic ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <CameraAlt sx={{ fontSize: 16 }} />}
                            <input type="file" hidden accept=".jpg,.jpeg,.png,.webp" onChange={handleProfilePicUpload} />
                        </IconButton>
                    </Box>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b', lineHeight: 1.1, fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' } }}>
                            My <span style={{ color: '#6366f1' }}>Profile</span>
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748b', mt: 0.5 }}>
                            Complete your profile to apply for placement drives.
                        </Typography>
                        {profile?.profilePicPath && (
                            <Button
                                size="small"
                                color="error"
                                onClick={handleProfilePicDelete}
                                sx={{ mt: 0.5, textTransform: 'none', fontWeight: 600, fontSize: '0.75rem' }}
                            >
                                Remove photo
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Profile Completion Indicator */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                            Profile Completion
                        </Typography>
                        <Chip
                            icon={completionPct === 100 ? <CheckCircle /> : <Cancel />}
                            label={completionPct === 100 ? 'Complete' : `${completionPct}%`}
                            size="small"
                            sx={{
                                fontWeight: 700,
                                bgcolor: completionPct === 100 ? '#ecfdf5' : '#fff7ed',
                                color: completionPct === 100 ? '#059669' : '#d97706',
                                border: `1px solid ${completionPct === 100 ? '#10b981' : '#f59e0b'}`,
                            }}
                        />
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={completionPct}
                        sx={{
                            height: 8, borderRadius: 4, bgcolor: '#f1f5f9',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                background: completionPct === 100
                                    ? 'linear-gradient(90deg, #10b981, #34d399)'
                                    : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                            },
                        }}
                    />
                    <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                        {[
                            { label: 'First Name', done: !!profile?.firstName },
                            { label: 'Last Name', done: !!profile?.lastName },
                            { label: 'CGPA', done: profile?.cgpa !== null && profile?.cgpa !== undefined },
                            { label: 'Resume', done: !!profile?.resumePath },
                        ].map((item) => (
                            <Chip
                                key={item.label}
                                icon={item.done ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
                                label={item.label}
                                size="small"
                                variant="outlined"
                                sx={{
                                    color: item.done ? '#059669' : '#94a3b8',
                                    borderColor: item.done ? '#10b981' : '#e2e8f0',
                                }}
                            />
                        ))}
                    </Box>
                </Paper>

                {/* Read-Only Info */}
                <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', mb: 3, boxShadow: 'none' }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>
                            Registration Info
                        </Typography>
                        <Grid container spacing={2}>
                            {[
                                { icon: <Badge fontSize="small" />, label: 'Roll Number', value: profile?.rollNumber },
                                { icon: <Email fontSize="small" />, label: 'Email', value: profile?.email },
                                { icon: <School fontSize="small" />, label: 'Department', value: profile?.department },
                                { icon: <Person fontSize="small" />, label: 'Year', value: `Year ${profile?.year}` },
                            ].map((item) => (
                                <Grid item xs={12} sm={6} key={item.label}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, bgcolor: '#f8fafc', borderRadius: '12px' }}>
                                        <Box sx={{ color: '#6366f1' }}>{item.icon}</Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>{item.label}</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.value}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>

                {/* Editable Fields */}
                <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', mb: 3, boxShadow: 'none' }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>
                            Personal & Academic Info
                        </Typography>
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
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={saving}
                                sx={{
                                    borderRadius: '12px', px: 4, py: 1.2, fontWeight: 700, textTransform: 'none',
                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                    boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                                }}>
                                {saving ? 'Saving...' : 'Save Profile'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* Resume Section */}
                <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>
                            Resume
                        </Typography>
                        {profile?.resumePath ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#f8fafc', borderRadius: '12px', flexWrap: 'wrap' }}>
                                <Description sx={{ color: '#6366f1', fontSize: 40 }} />
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Resume uploaded</Typography>
                                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                        {profile.resumePath.split('/').pop()}
                                    </Typography>
                                </Box>
                                <Button size="small" variant="outlined"
                                    href={resolveUrl(profile.resumePath)} target="_blank"
                                    sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, mr: 1 }}>
                                    View
                                </Button>
                                <IconButton color="error" onClick={handleResumeDelete} size="small">
                                    <Delete />
                                </IconButton>
                            </Box>
                        ) : (
                            <Alert severity="info" sx={{ borderRadius: '12px', mb: 2 }}>
                                No resume uploaded yet. Upload a PDF, DOC, or DOCX file (max 5MB).
                            </Alert>
                        )}
                        <Box sx={{ mt: 2 }}>
                            <Button variant="outlined" component="label"
                                startIcon={uploading ? <CircularProgress size={16} /> : <Upload />}
                                disabled={uploading}
                                sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}>
                                {uploading ? 'Uploading...' : 'Upload Resume'}
                                <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
                {/* Delete Account Section */}
                <Card sx={{ borderRadius: '16px', border: '1px solid #fecaca', boxShadow: 'none', mt: 3 }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Warning sx={{ color: '#ef4444', fontSize: 20 }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#dc2626' }}>
                                Danger Zone
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                            Permanently delete your account and all associated data. This action cannot be undone.
                        </Typography>
                        <Button
                            variant="outlined" color="error"
                            onClick={() => setDeleteOpen(true)}
                            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
                        >
                            Delete Account
                        </Button>
                    </CardContent>
                </Card>

                {/* Delete Account Confirmation Dialog */}
                <Dialog open={deleteOpen} onClose={() => !deleting && setDeleteOpen(false)} maxWidth="xs" fullWidth>
                    <DialogTitle sx={{ fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Warning /> Delete Account
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                            This will permanently delete your account, profile, resume, assignments, submissions, drive applications, and all other data. Enter your password to confirm.
                        </Typography>
                        <TextField
                            fullWidth
                            label="Confirm Password"
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
                            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained" color="error" onClick={handleDeleteAccount} disabled={deleting || !deletePassword}
                            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
                        >
                            {deleting ? 'Deleting...' : 'Delete My Account'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default StudentProfile;
