import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Typography, Grid, Card, CardContent, CardActions,
    Button, TextField, Dialog, DialogTitle, DialogContent,
    DialogActions, Box, CircularProgress, Alert, Chip, IconButton,
    useTheme, useMediaQuery, Autocomplete, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper, Divider
} from '@mui/material';
import { Add, Delete, Visibility, Assignment } from '@mui/icons-material';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const FacultyAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openSubmissionsDialog, setOpenSubmissionsDialog] = useState(false);
    const [submissionsData, setSubmissionsData] = useState(null);
    const [submissionsLoading, setSubmissionsLoading] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', deadline: '' });
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const { user } = useAuth();
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const response = await API.get('/assignments/faculty');
            setAssignments(response.data.assignments);
        } catch (err) {
            toast.error('Failed to fetch assignments');
        } finally {
            setLoading(false);
        }
    };

    const handleStudentSearch = useCallback(async (query) => {
        if (!query || query.length < 2) {
            setSearchResults([]);
            return;
        }
        setSearchLoading(true);
        try {
            const response = await API.get(`/assignments/students/search?q=${query}`);
            // Filter out already-selected students
            const selectedIds = selectedStudents.map((s) => s.id);
            setSearchResults(response.data.students.filter((s) => !selectedIds.includes(s.id)));
        } catch (err) {
            // silent
        } finally {
            setSearchLoading(false);
        }
    }, [selectedStudents]);

    const handleCreate = async () => {
        if (!formData.title || !formData.deadline || selectedStudents.length === 0) {
            toast.error('Title, deadline, and at least one student are required');
            return;
        }

        try {
            await API.post('/assignments', {
                ...formData,
                rollNumbers: selectedStudents.map((s) => s.rollNumber),
            });
            toast.success('Assignment created successfully!');
            setOpenCreateDialog(false);
            setFormData({ title: '', description: '', deadline: '' });
            setSelectedStudents([]);
            fetchAssignments();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create assignment');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await API.delete(`/assignments/${id}`);
                toast.success('Assignment deleted!');
                fetchAssignments();
            } catch (err) {
                toast.error('Failed to delete assignment');
            }
        }
    };

    const handleViewSubmissions = async (id) => {
        setSubmissionsLoading(true);
        setOpenSubmissionsDialog(true);
        try {
            const response = await API.get(`/assignments/${id}/submissions`);
            setSubmissionsData(response.data);
        } catch (err) {
            toast.error('Failed to fetch submissions');
            setOpenSubmissionsDialog(false);
        } finally {
            setSubmissionsLoading(false);
        }
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const formatDateTime = (date) =>
        new Date(date).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const isPastDeadline = (deadline) => new Date() > new Date(deadline);

    const getDaysLeft = (deadline) => {
        const diff = new Date(deadline) - new Date();
        if (diff <= 0) return null;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                        Manage Assignments
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Welcome, {user?.name}! Create and track assignments here.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    fullWidth={isMobile}
                    onClick={() => setOpenCreateDialog(true)}
                    sx={{ background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)' }}
                >
                    Create Assignment
                </Button>
            </Box>

            {assignments.length === 0 ? (
                <Alert severity="info">No assignments created yet. Create your first assignment!</Alert>
            ) : (
                <Grid container spacing={3}>
                    {assignments.map((a) => {
                        const totalAssigned = a.assignedStudents?.length || 0;
                        const totalSubmitted = a.submissions?.length || 0;
                        const expired = isPastDeadline(a.deadline);
                        const daysLeft = getDaysLeft(a.deadline);

                        return (
                            <Grid item xs={12} md={6} lg={4} key={a.id}>
                                <Card
                                    elevation={4}
                                    sx={{
                                        height: '100%',
                                        borderRadius: 3,
                                        borderTop: `4px solid ${expired ? '#ef4444' : totalSubmitted === totalAssigned && totalAssigned > 0 ? '#10b981' : '#6366f1'}`,
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <CardContent sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
                                            <Assignment sx={{ color: '#6366f1' }} />
                                            <Typography variant="h6" sx={{ fontWeight: 800, flex: 1, lineHeight: 1.3 }}>
                                                {a.title}
                                            </Typography>
                                        </Box>

                                        {a.description && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {a.description}
                                            </Typography>
                                        )}

                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
                                            <Chip
                                                label={`${totalSubmitted}/${totalAssigned} Submitted`}
                                                size="small"
                                                sx={{
                                                    bgcolor: totalSubmitted === totalAssigned && totalAssigned > 0 ? '#dcfce7' : '#f0f0ff',
                                                    color: totalSubmitted === totalAssigned && totalAssigned > 0 ? '#166534' : '#4338ca',
                                                    fontWeight: 700,
                                                }}
                                            />
                                            {expired ? (
                                                <Chip label="Expired" size="small" color="error" />
                                            ) : (
                                                <Chip
                                                    label={`${daysLeft}d left`}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: daysLeft <= 1 ? '#fef2f2' : daysLeft <= 3 ? '#fffbeb' : '#f0fdf4',
                                                        color: daysLeft <= 1 ? '#dc2626' : daysLeft <= 3 ? '#d97706' : '#16a34a',
                                                        fontWeight: 700,
                                                    }}
                                                />
                                            )}
                                        </Box>

                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Deadline:</strong> {formatDate(a.deadline)}
                                        </Typography>
                                    </CardContent>

                                    <Divider />

                                    <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                                        <Button
                                            size="small"
                                            startIcon={<Visibility />}
                                            onClick={() => handleViewSubmissions(a.id)}
                                            sx={{ textTransform: 'none', fontWeight: 600 }}
                                        >
                                            View Submissions
                                        </Button>
                                        <IconButton color="error" size="small" onClick={() => handleDelete(a.id)}>
                                            <Delete />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {/* Create Assignment Dialog */}
            <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth fullScreen={isMobile}>
                <DialogTitle sx={{ fontWeight: 700 }}>Create Assignment</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Title"
                        margin="normal"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        margin="normal"
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Deadline"
                        type="datetime-local"
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        required
                    />

                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 700 }}>
                        Assign to Students
                    </Typography>

                    <Autocomplete
                        multiple
                        options={searchResults}
                        value={selectedStudents}
                        getOptionLabel={(opt) => `${opt.rollNumber} — ${opt.name}`}
                        isOptionEqualToValue={(opt, val) => opt.id === val.id}
                        loading={searchLoading}
                        filterOptions={(x) => x}
                        onInputChange={(_, val) => handleStudentSearch(val)}
                        onChange={(_, val) => setSelectedStudents(val)}
                        renderTags={(value, getTagProps) =>
                            value.map((opt, idx) => (
                                <Chip
                                    {...getTagProps({ index: idx })}
                                    key={opt.id}
                                    label={`${opt.rollNumber} — ${opt.name}`}
                                    size="small"
                                    sx={{ fontWeight: 600 }}
                                />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Search by roll number..."
                                variant="outlined"
                                helperText="Type at least 2 characters to search"
                            />
                        )}
                        noOptionsText="No students found"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenCreateDialog(false); setFormData({ title: '', description: '', deadline: '' }); setSelectedStudents([]); }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreate}
                        variant="contained"
                        sx={{ background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)' }}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Submissions Dialog */}
            <Dialog open={openSubmissionsDialog} onClose={() => { setOpenSubmissionsDialog(false); setSubmissionsData(null); }} maxWidth="md" fullWidth fullScreen={isMobile}>
                <DialogTitle sx={{ fontWeight: 700 }}>
                    {submissionsData ? `Submissions — ${submissionsData.assignment.title}` : 'Submissions'}
                </DialogTitle>
                <DialogContent>
                    {submissionsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : submissionsData ? (
                        <>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                                <Chip label={`Total: ${submissionsData.totalAssigned}`} sx={{ fontWeight: 700 }} />
                                <Chip label={`Submitted: ${submissionsData.totalSubmitted}`} color="success" sx={{ fontWeight: 700 }} />
                                <Chip label={`Pending: ${submissionsData.totalAssigned - submissionsData.totalSubmitted}`} color="warning" sx={{ fontWeight: 700 }} />
                            </Box>

                            {submissionsData.submissions.length > 0 && (
                                <>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                                        Submitted
                                    </Typography>
                                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                                    <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>Roll No</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>Drive Link</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>Time</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {submissionsData.submissions.map((sub) => (
                                                    <TableRow key={sub.id}>
                                                        <TableCell>{sub.student?.name}</TableCell>
                                                        <TableCell sx={{ fontWeight: 600 }}>{sub.student?.rollNumber}</TableCell>
                                                        <TableCell>
                                                            <a href={sub.driveLink} target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5', wordBreak: 'break-all' }}>
                                                                Open Link
                                                            </a>
                                                            {sub.comments && (
                                                                <Typography variant="caption" display="block" color="text.secondary">
                                                                    {sub.comments}
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDateTime(sub.submittedAt)}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={sub.status === 'late' ? 'Late' : 'On Time'}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: sub.status === 'late' ? '#fef2f2' : '#dcfce7',
                                                                    color: sub.status === 'late' ? '#dc2626' : '#166534',
                                                                    fontWeight: 700,
                                                                }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>
                            )}

                            {submissionsData.notSubmitted.length > 0 && (
                                <>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                                        Not Submitted
                                    </Typography>
                                    <TableContainer component={Paper} variant="outlined">
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: '#fff7ed' }}>
                                                    <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>Roll No</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {submissionsData.notSubmitted.map((s) => (
                                                    <TableRow key={s.id}>
                                                        <TableCell>{s.name}</TableCell>
                                                        <TableCell sx={{ fontWeight: 600 }}>{s.rollNumber}</TableCell>
                                                        <TableCell>{s.department}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>
                            )}
                        </>
                    ) : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenSubmissionsDialog(false); setSubmissionsData(null); }}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default FacultyAssignments;
