import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Grid, Card, CardContent,
    Button, Chip, Box, CircularProgress, Alert, Collapse,
    IconButton, TextField, Dialog, DialogTitle, DialogContent,
    DialogActions, useTheme, useMediaQuery
} from '@mui/material';
import {
    Assignment as AssignmentIcon, AccessTime, ExpandMore as ExpandMoreIcon,
    CheckCircle, Send, Edit as EditIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import API from '../services/api';
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

// Deadline countdown component
const DeadlineCountdown = ({ deadline }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [urgency, setUrgency] = useState('normal'); // normal, warning, critical, expired

    useEffect(() => {
        const update = () => {
            const diff = new Date(deadline) - new Date();
            if (diff <= 0) {
                setTimeLeft('Deadline passed');
                setUrgency('expired');
                return;
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            setUrgency(days < 1 ? 'critical' : days <= 3 ? 'warning' : 'normal');
        };

        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, [deadline]);

    const colors = {
        normal: '#16a34a',
        warning: '#d97706',
        critical: '#dc2626',
        expired: '#9ca3af',
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime sx={{ fontSize: 16, color: colors[urgency] }} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: colors[urgency], fontFamily: 'monospace' }}>
                {timeLeft}
            </Typography>
        </Box>
    );
};

const StudentAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [submitDialog, setSubmitDialog] = useState({ open: false, assignment: null, existingSubmission: null });
    const [formData, setFormData] = useState({ driveLink: '', comments: '' });
    const [linkError, setLinkError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const response = await API.get('/assignments/student');
            setAssignments(response.data.assignments);
        } catch (err) {
            toast.error('Failed to fetch assignments');
        } finally {
            setLoading(false);
        }
    };

    const validateDriveLink = (url) => {
        if (!url || !url.trim()) return 'Drive link is required';
        if (!url.includes('drive.google.com')) return 'Must be a valid Google Drive URL (drive.google.com)';
        return '';
    };

    const handleOpenSubmit = (assignment) => {
        const existing = assignment.submission;
        setFormData({
            driveLink: existing?.driveLink || '',
            comments: existing?.comments || '',
        });
        setLinkError('');
        setSubmitSuccess(false);
        setSubmitDialog({ open: true, assignment, existingSubmission: existing });
    };

    const handleSubmit = async () => {
        const error = validateDriveLink(formData.driveLink);
        if (error) {
            setLinkError(error);
            return;
        }

        setSubmitting(true);
        try {
            const id = submitDialog.assignment.id;
            if (submitDialog.existingSubmission) {
                await API.put(`/assignments/${id}/submit`, formData);
            } else {
                await API.post(`/assignments/${id}/submit`, formData);
            }
            setSubmitSuccess(true);
            toast.success(submitDialog.existingSubmission ? 'Submission updated!' : 'Assignment submitted!');
            fetchAssignments();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseDialog = () => {
        setSubmitDialog({ open: false, assignment: null, existingSubmission: null });
        setFormData({ driveLink: '', comments: '' });
        setLinkError('');
        setSubmitSuccess(false);
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const getStatusColor = (status) => {
        switch (status) {
            case 'submitted': return { bg: '#dcfce7', color: '#166534', label: 'Submitted' };
            case 'late': return { bg: '#fef2f2', color: '#dc2626', label: 'Late' };
            default: return { bg: '#f1f5f9', color: '#64748b', label: 'Not Submitted' };
        }
    };

    const getCardBorderColor = (status, isPastDeadline) => {
        if (status === 'submitted') return '#10b981';
        if (status === 'late') return '#ef4444';
        if (isPastDeadline) return '#ef4444';
        return '#f59e0b';
    };

    // Count stats
    const totalCount = assignments.length;
    const submittedCount = assignments.filter((a) => a.submissionStatus === 'submitted' || a.submissionStatus === 'late').length;
    const pendingCount = totalCount - submittedCount;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 } }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', fontSize: { xs: '1.5rem', sm: '2.125rem' }, mb: 1 }}>
                    My Assignments
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <Chip label={`Total: ${totalCount}`} sx={{ fontWeight: 700 }} />
                    <Chip label={`Submitted: ${submittedCount}`} sx={{ fontWeight: 700, bgcolor: '#dcfce7', color: '#166534' }} />
                    <Chip label={`Pending: ${pendingCount}`} sx={{ fontWeight: 700, bgcolor: '#fffbeb', color: '#d97706' }} />
                </Box>
            </Box>

            {assignments.length === 0 ? (
                <Alert severity="info">No assignments assigned to you yet.</Alert>
            ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <Grid container spacing={3}>
                        {assignments.map((a) => {
                            const statusInfo = getStatusColor(a.submissionStatus);
                            const borderColor = getCardBorderColor(a.submissionStatus, a.isPastDeadline);
                            const canEdit = a.submission && !a.isPastDeadline;

                            return (
                                <Grid item xs={12} md={6} lg={4} key={a.id}>
                                    <motion.div variants={cardVariants}>
                                        <Card
                                            elevation={4}
                                            sx={{
                                                height: '100%',
                                                borderRadius: 3,
                                                borderTop: `4px solid ${borderColor}`,
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <CardContent sx={{ flex: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1, gap: 1 }}>
                                                    <AssignmentIcon sx={{ color: '#6366f1', mt: 0.3 }} />
                                                    <Typography variant="h6" sx={{ fontWeight: 800, flex: 1, lineHeight: 1.3 }}>
                                                        {a.title}
                                                    </Typography>
                                                </Box>

                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    By <strong>{a.faculty?.name}</strong> — {a.faculty?.department}
                                                </Typography>

                                                {a.description && (
                                                    <>
                                                        <Collapse in={expandedId === a.id} collapsedSize={0}>
                                                            <Typography variant="body2" sx={{ mb: 1, color: '#475569' }}>
                                                                {a.description}
                                                            </Typography>
                                                        </Collapse>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                                                            sx={{
                                                                transform: expandedId === a.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                                                transition: '0.3s',
                                                                p: 0.25,
                                                            }}
                                                        >
                                                            <ExpandMoreIcon fontSize="small" />
                                                        </IconButton>
                                                    </>
                                                )}

                                                <Box sx={{ mt: 1.5, mb: 1 }}>
                                                    <DeadlineCountdown deadline={a.deadline} />
                                                    <Typography variant="caption" color="text.secondary">
                                                        Due: {formatDate(a.deadline)}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1.5 }}>
                                                    <Chip
                                                        label={statusInfo.label}
                                                        size="small"
                                                        sx={{ bgcolor: statusInfo.bg, color: statusInfo.color, fontWeight: 700 }}
                                                    />
                                                </Box>

                                                {a.submission && (
                                                    <Box sx={{ mt: 1.5, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                                                        <Typography variant="caption" color="text.secondary" display="block">
                                                            Submitted: {formatDate(a.submission.submittedAt)}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#4f46e5', wordBreak: 'break-all' }}>
                                                            {a.submission.driveLink}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </CardContent>

                                            <Box sx={{ px: 2, pb: 2 }}>
                                                {!a.submission && !a.isPastDeadline && (
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        startIcon={<Send />}
                                                        onClick={() => handleOpenSubmit(a)}
                                                        sx={{
                                                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                                            textTransform: 'none',
                                                            fontWeight: 700,
                                                            borderRadius: 2,
                                                        }}
                                                    >
                                                        Submit Assignment
                                                    </Button>
                                                )}
                                                {canEdit && (
                                                    <Button
                                                        fullWidth
                                                        variant="outlined"
                                                        startIcon={<EditIcon />}
                                                        onClick={() => handleOpenSubmit(a)}
                                                        sx={{
                                                            textTransform: 'none',
                                                            fontWeight: 700,
                                                            borderRadius: 2,
                                                            borderColor: '#6366f1',
                                                            color: '#6366f1',
                                                        }}
                                                    >
                                                        Edit Submission
                                                    </Button>
                                                )}
                                                {a.isPastDeadline && !a.submission && (
                                                    <Button fullWidth disabled sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}>
                                                        Deadline Passed
                                                    </Button>
                                                )}
                                            </Box>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            );
                        })}
                    </Grid>
                </motion.div>
            )}

            {/* Submit/Edit Dialog */}
            <Dialog open={submitDialog.open} onClose={handleCloseDialog} maxWidth="sm" fullWidth fullScreen={isMobile}>
                <DialogTitle sx={{ fontWeight: 700 }}>
                    {submitDialog.existingSubmission ? 'Edit Submission' : 'Submit Assignment'}
                    {submitDialog.assignment && (
                        <Typography variant="body2" color="text.secondary">
                            {submitDialog.assignment.title}
                        </Typography>
                    )}
                </DialogTitle>
                <DialogContent>
                    {submitSuccess ? (
                        <Alert icon={<CheckCircle />} severity="success" sx={{ mt: 1, fontWeight: 600 }}>
                            Your assignment has been {submitDialog.existingSubmission ? 'updated' : 'submitted'} successfully!
                        </Alert>
                    ) : (
                        <>
                            <TextField
                                fullWidth
                                label="Google Drive Link"
                                margin="normal"
                                placeholder="https://drive.google.com/..."
                                value={formData.driveLink}
                                onChange={(e) => {
                                    setFormData({ ...formData, driveLink: e.target.value });
                                    if (linkError) setLinkError(validateDriveLink(e.target.value));
                                }}
                                onBlur={() => setLinkError(validateDriveLink(formData.driveLink))}
                                error={!!linkError}
                                helperText={linkError || 'Paste a shareable Google Drive link'}
                                required
                            />
                            {formData.driveLink && !formData.driveLink.includes('drive.google.com') && !linkError && (
                                <Alert severity="warning" sx={{ mt: 1 }}>
                                    This doesn't look like a Google Drive link. Make sure it contains drive.google.com
                                </Alert>
                            )}
                            <TextField
                                fullWidth
                                label="Comments (optional)"
                                margin="normal"
                                multiline
                                rows={2}
                                value={formData.comments}
                                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                                placeholder="Add any notes for your faculty..."
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>{submitSuccess ? 'Close' : 'Cancel'}</Button>
                    {!submitSuccess && (
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={submitting}
                            sx={{ background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)' }}
                        >
                            {submitting ? <CircularProgress size={24} /> : submitDialog.existingSubmission ? 'Update' : 'Submit'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default StudentAssignments;
