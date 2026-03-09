import React, { useState, useEffect, useMemo } from 'react';
import {
    Container, Typography, Grid, Card, CardContent,
    Button, TextField, Dialog, DialogTitle, DialogContent,
    DialogActions, Box, CircularProgress, Alert, Chip, MenuItem,
    IconButton, useTheme, useMediaQuery, Avatar, Paper, InputAdornment,
    ToggleButton, ToggleButtonGroup
} from '@mui/material';
import {
    Add, Edit, Delete, Business, Search, AccessTime,
    WorkOutline, CheckCircle, EventBusy, OpenInNew, FilterList
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML', 'ALL'];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const FacultyDashboard = () => {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentDrive, setCurrentDrive] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [formData, setFormData] = useState({
        companyName: '', role: '', driveLink: '', description: '',
        eligibleDepartments: [], minCGPA: '', maxBacklogs: 0,
        package: '', expiryDate: ''
    });
    const { user } = useAuth();
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

    useEffect(() => { fetchDrives(); }, []);

    const fetchDrives = async () => {
        try {
            const response = await API.get('/drives/faculty');
            setDrives(response.data.drives);
        } catch (err) {
            toast.error('Failed to fetch drives');
        } finally {
            setLoading(false);
        }
    };

    // Stats
    const stats = useMemo(() => {
        const now = new Date();
        const active = drives.filter(d => new Date(d.expiryDate) >= now && d.isActive !== false).length;
        const expired = drives.filter(d => new Date(d.expiryDate) < now).length;
        const expiringSoon = drives.filter(d => {
            const days = Math.ceil((new Date(d.expiryDate) - now) / (1000 * 60 * 60 * 24));
            return days <= 3 && days > 0;
        }).length;
        return { total: drives.length, active, expired, expiringSoon };
    }, [drives]);

    // Filtered drives
    const filteredDrives = useMemo(() => {
        let result = drives;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(d =>
                d.companyName.toLowerCase().includes(q) ||
                d.role.toLowerCase().includes(q)
            );
        }

        const now = new Date();
        switch (filterStatus) {
            case 'active':
                result = result.filter(d => new Date(d.expiryDate) >= now);
                break;
            case 'expired':
                result = result.filter(d => new Date(d.expiryDate) < now);
                break;
            default:
                break;
        }

        return result;
    }, [drives, searchQuery, filterStatus]);

    const handleOpenDialog = (drive = null) => {
        if (drive) {
            setEditMode(true);
            setCurrentDrive(drive);
            setFormData({
                companyName: drive.companyName, role: drive.role,
                driveLink: drive.driveLink, description: drive.description || '',
                eligibleDepartments: (drive.eligibleDepartments || []).map(d => d.department || d),
                minCGPA: drive.minCGPA || '', maxBacklogs: drive.maxBacklogs || 0,
                package: drive.package || '', expiryDate: drive.expiryDate.split('T')[0]
            });
        } else {
            setEditMode(false);
            setCurrentDrive(null);
            setFormData({
                companyName: '', role: '', driveLink: '', description: '',
                eligibleDepartments: [], minCGPA: '', maxBacklogs: 0,
                package: '', expiryDate: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditMode(false);
        setCurrentDrive(null);
        setSubmitting(false);
    };

    const handleSubmit = async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
            if (editMode) {
                await API.put(`/drives/${currentDrive.id}`, formData);
                toast.success('Drive updated successfully!');
            } else {
                await API.post('/drives', formData);
                toast.success('Drive created successfully!');
            }
            handleCloseDialog();
            fetchDrives();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this drive?')) {
            try {
                await API.delete(`/drives/${id}`);
                toast.success('Drive deleted successfully!');
                fetchDrives();
            } catch (err) {
                toast.error('Failed to delete drive');
            }
        }
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const getDaysRemaining = (expiryDate) => Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <CircularProgress thickness={5} size={60} sx={{ color: '#6366f1' }} />
                <Typography sx={{ mt: 2, color: '#94a3b8', fontWeight: 500 }}>Loading drives...</Typography>
            </Box>
        );
    }

    const statCards = [
        { label: 'Total Drives', value: stats.total, icon: <WorkOutline />, color: '#6366f1', bg: '#eef2ff' },
        { label: 'Active', value: stats.active, icon: <CheckCircle />, color: '#10b981', bg: '#ecfdf5' },
        { label: 'Expiring Soon', value: stats.expiringSoon, icon: <AccessTime />, color: '#f59e0b', bg: '#fffbeb' },
        { label: 'Expired', value: stats.expired, icon: <EventBusy />, color: '#ef4444', bg: '#fef2f2' },
    ];

    const inputSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '& fieldset': { borderColor: '#e2e8f0' },
            '&:hover fieldset': { borderColor: '#cbd5e1' },
            '&.Mui-focused fieldset': { borderColor: '#6366f1' },
        }
    };

    return (
        <Box sx={{ background: '#f8fafc', minHeight: '100vh', py: { xs: 2, sm: 3, md: 5 } }}>
            <Container maxWidth="lg">
                {/* Header */}
                <motion.div initial={{ y: -15, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <Box sx={{
                        mb: { xs: 2.5, md: 4 },
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'flex-end' },
                        flexDirection: { xs: 'column', sm: 'row' }, gap: 2,
                    }}>
                        <Box>
                            <Typography sx={{
                                fontWeight: 900, color: '#1e293b', mb: 0.5,
                                fontSize: { xs: '1.6rem', sm: '2rem', md: '2.5rem' },
                                letterSpacing: '-0.03em',
                            }}>
                                Manage <span style={{ color: '#6366f1' }}>Drives</span>
                            </Typography>
                            <Typography sx={{ color: '#64748b', fontWeight: 500, fontSize: { xs: '0.85rem', md: '1rem' } }}>
                                Welcome, {user?.name}. Create and manage placement drives.
                            </Typography>
                        </Box>
                        <Button
                            variant="contained" startIcon={<Add />}
                            fullWidth={isMobile}
                            onClick={() => handleOpenDialog()}
                            sx={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                borderRadius: '14px', py: 1.3, px: 3,
                                fontWeight: 800, textTransform: 'none', fontSize: '0.9rem',
                                boxShadow: '0 6px 12px rgba(99,102,241,0.25)',
                                '&:hover': { background: '#4338ca' },
                            }}
                        >
                            Add New Drive
                        </Button>
                    </Box>
                </motion.div>

                {/* Stats */}
                <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 2.5, md: 4 } }}>
                    {statCards.map((stat, i) => (
                        <Grid item xs={6} sm={3} key={i}>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 + i * 0.05 }}
                            >
                                <Paper elevation={0} sx={{
                                    p: { xs: 2, md: 2.5 }, borderRadius: '16px',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 },
                                }}>
                                    <Avatar sx={{
                                        bgcolor: stat.bg, color: stat.color,
                                        width: { xs: 40, md: 48 }, height: { xs: 40, md: 48 },
                                        borderRadius: '12px',
                                    }}>
                                        {stat.icon}
                                    </Avatar>
                                    <Box>
                                        <Typography sx={{
                                            fontWeight: 800, fontSize: { xs: '1.25rem', md: '1.5rem' },
                                            color: '#1e293b', lineHeight: 1,
                                        }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography sx={{
                                            color: '#94a3b8', fontWeight: 600,
                                            fontSize: { xs: '0.65rem', md: '0.75rem' },
                                            textTransform: 'uppercase', letterSpacing: '0.03em',
                                        }}>
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                {/* Search & Filters */}
                <motion.div initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                    <Paper elevation={0} sx={{
                        p: { xs: 1.5, md: 2 }, borderRadius: '16px',
                        border: '1px solid #e2e8f0', mb: { xs: 2.5, md: 4 },
                        display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 1.5, sm: 2 }, alignItems: { sm: 'center' },
                    }}>
                        <TextField
                            placeholder="Search by company or role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            size="small"
                            sx={{
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px', background: '#f8fafc',
                                    '& fieldset': { borderColor: '#e2e8f0' },
                                    '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: '#94a3b8', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FilterList sx={{ color: '#94a3b8', fontSize: 20, display: { xs: 'none', sm: 'block' } }} />
                            <ToggleButtonGroup
                                value={filterStatus} exclusive size="small"
                                onChange={(e, val) => val !== null && setFilterStatus(val)}
                                sx={{
                                    '& .MuiToggleButton-root': {
                                        border: '1px solid #e2e8f0', borderRadius: '10px !important',
                                        textTransform: 'none', fontWeight: 700, fontSize: '0.75rem',
                                        px: { xs: 1.5, sm: 2 }, color: '#64748b',
                                        '&.Mui-selected': {
                                            background: '#eef2ff', color: '#4f46e5',
                                            borderColor: '#c7d2fe',
                                        }
                                    }
                                }}
                            >
                                <ToggleButton value="all">All</ToggleButton>
                                <ToggleButton value="active">Active</ToggleButton>
                                <ToggleButton value="expired">Expired</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Paper>
                </motion.div>

                {/* Results count */}
                {(searchQuery || filterStatus !== 'all') && (
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                            {filteredDrives.length} drive{filteredDrives.length !== 1 ? 's' : ''} found
                        </Typography>
                        <Chip
                            label="Clear" size="small"
                            onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}
                            sx={{ fontWeight: 600, fontSize: '0.7rem', cursor: 'pointer' }}
                        />
                    </Box>
                )}

                {/* Drives Grid */}
                {filteredDrives.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 3, bgcolor: '#f1f5f9', color: '#94a3b8' }}>
                            <WorkOutline sx={{ fontSize: 36 }} />
                        </Avatar>
                        <Typography sx={{ fontWeight: 700, color: '#475569', mb: 1, fontSize: '1.1rem' }}>
                            {searchQuery || filterStatus !== 'all' ? 'No matching drives' : 'No drives yet'}
                        </Typography>
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem', mb: 3 }}>
                            {searchQuery || filterStatus !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Create your first placement drive to get started'}
                        </Typography>
                        {!searchQuery && filterStatus === 'all' && (
                            <Button
                                variant="contained" startIcon={<Add />}
                                onClick={() => handleOpenDialog()}
                                sx={{
                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                    borderRadius: '12px', fontWeight: 700, textTransform: 'none',
                                }}
                            >
                                Create Drive
                            </Button>
                        )}
                    </Box>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                            <AnimatePresence>
                                {filteredDrives.map((drive) => {
                                    const daysRemaining = getDaysRemaining(drive.expiryDate);
                                    const isExpired = daysRemaining <= 0;
                                    const deptList = (drive.eligibleDepartments || []).map(d => d.department || d);

                                    return (
                                        <Grid item xs={12} sm={6} lg={4} key={drive.id}>
                                            <motion.div variants={cardVariants} whileHover={{ y: -6 }}>
                                                <Card sx={{
                                                    borderRadius: '20px', border: '1px solid #e2e8f0',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                                    overflow: 'hidden', background: '#fff',
                                                    opacity: isExpired ? 0.75 : 1,
                                                    transition: 'box-shadow 0.3s',
                                                    '&:hover': { boxShadow: '0 8px 25px rgba(0,0,0,0.08)' },
                                                }}>
                                                    {/* Status bar */}
                                                    <Box sx={{
                                                        height: '5px',
                                                        background: isExpired
                                                            ? 'linear-gradient(90deg, #ef4444, #f87171)'
                                                            : daysRemaining <= 3
                                                                ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                                                : 'linear-gradient(90deg, #10b981, #34d399)',
                                                    }} />

                                                    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                                        {/* Header */}
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                <Avatar sx={{
                                                                    bgcolor: '#eef2ff', color: '#6366f1',
                                                                    width: 48, height: 48, borderRadius: '14px',
                                                                }}>
                                                                    <Business />
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1.05rem', lineHeight: 1.2 }}>
                                                                        {drive.companyName}
                                                                    </Typography>
                                                                    <Typography sx={{ color: '#6366f1', fontWeight: 700, fontSize: '0.8rem' }}>
                                                                        {drive.role}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleOpenDialog(drive)}
                                                                    sx={{
                                                                        bgcolor: '#eef2ff', color: '#6366f1',
                                                                        width: 34, height: 34,
                                                                        '&:hover': { bgcolor: '#c7d2fe' },
                                                                    }}
                                                                >
                                                                    <Edit sx={{ fontSize: 16 }} />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleDelete(drive.id)}
                                                                    sx={{
                                                                        bgcolor: '#fef2f2', color: '#ef4444',
                                                                        width: 34, height: 34,
                                                                        '&:hover': { bgcolor: '#fecaca' },
                                                                    }}
                                                                >
                                                                    <Delete sx={{ fontSize: 16 }} />
                                                                </IconButton>
                                                            </Box>
                                                        </Box>

                                                        {/* Status chips */}
                                                        <Box sx={{ display: 'flex', gap: 0.5, mb: 2.5, flexWrap: 'wrap' }}>
                                                            {isExpired ? (
                                                                <Chip label="Expired" size="small" sx={{
                                                                    fontWeight: 700, height: 24, bgcolor: '#fef2f2',
                                                                    color: '#dc2626', border: '1px solid #fecaca',
                                                                }} />
                                                            ) : (
                                                                <Chip label="Active" size="small" sx={{
                                                                    fontWeight: 700, height: 24, bgcolor: '#ecfdf5',
                                                                    color: '#059669', border: '1px solid #a7f3d0',
                                                                }} />
                                                            )}
                                                            {daysRemaining > 0 && daysRemaining <= 3 && (
                                                                <Chip label="Expiring Soon" size="small" sx={{
                                                                    fontWeight: 700, height: 24, bgcolor: '#fffbeb',
                                                                    color: '#d97706', border: '1px solid #fed7aa',
                                                                }} />
                                                            )}
                                                        </Box>

                                                        {/* Info grid */}
                                                        <Box sx={{ display: 'flex', gap: 1, mb: 2.5, flexWrap: 'wrap' }}>
                                                            <Box sx={{ flex: 1, minWidth: 80, p: 1.5, borderRadius: '10px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                                                <Typography sx={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Package</Typography>
                                                                <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: '#1e293b' }}>{drive.package || 'N/A'}</Typography>
                                                            </Box>
                                                            <Box sx={{ flex: 1, minWidth: 80, p: 1.5, borderRadius: '10px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                                                <Typography sx={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Min CGPA</Typography>
                                                                <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: '#1e293b' }}>{drive.minCGPA || '0.0'}</Typography>
                                                            </Box>
                                                            <Box sx={{ flex: 1, minWidth: 80, p: 1.5, borderRadius: '10px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                                                <Typography sx={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Expires</Typography>
                                                                <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: isExpired ? '#ef4444' : '#1e293b' }}>
                                                                    {isExpired ? 'Expired' : `${daysRemaining}d left`}
                                                                </Typography>
                                                            </Box>
                                                        </Box>

                                                        {/* Departments */}
                                                        {deptList.length > 0 && (
                                                            <Box sx={{ mb: 2.5 }}>
                                                                <Typography sx={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', mb: 0.8, letterSpacing: '0.05em' }}>
                                                                    Eligible Departments
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                    {deptList.map((dept, idx) => (
                                                                        <Chip key={idx} label={dept} size="small"
                                                                            sx={{ borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700, height: 22 }} />
                                                                    ))}
                                                                </Box>
                                                            </Box>
                                                        )}

                                                        {/* Footer */}
                                                        <Box sx={{
                                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                            pt: 2, borderTop: '1px solid #f1f5f9',
                                                        }}>
                                                            <Typography sx={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 600 }}>
                                                                {formatDate(drive.expiryDate)}
                                                            </Typography>
                                                            <Button
                                                                size="small"
                                                                endIcon={<OpenInNew sx={{ fontSize: '14px !important' }} />}
                                                                onClick={() => window.open(drive.driveLink, '_blank')}
                                                                sx={{
                                                                    fontWeight: 700, fontSize: '0.75rem',
                                                                    textTransform: 'none', color: '#6366f1',
                                                                    minWidth: 'auto', px: 1,
                                                                }}
                                                            >
                                                                Open Link
                                                            </Button>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        </Grid>
                                    );
                                })}
                            </AnimatePresence>
                        </Grid>
                    </motion.div>
                )}

                {/* Add/Edit Dialog */}
                <Dialog
                    open={openDialog} onClose={handleCloseDialog}
                    maxWidth="sm" fullWidth fullScreen={isMobile}
                    PaperProps={{
                        sx: { borderRadius: isMobile ? 0 : '20px' }
                    }}
                >
                    <DialogTitle sx={{
                        fontWeight: 800, fontSize: '1.25rem', color: '#1e293b',
                        borderBottom: '1px solid #f1f5f9', pb: 2,
                    }}>
                        {editMode ? 'Edit Drive' : 'Create New Drive'}
                    </DialogTitle>
                    <DialogContent sx={{ pt: '24px !important' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Company Name" value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    required sx={inputSx} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Role" value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    required sx={inputSx} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Drive Link" value={formData.driveLink}
                                    onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
                                    required sx={inputSx} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Description" multiline rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    sx={inputSx} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth select label="Eligible Departments"
                                    SelectProps={{ multiple: true }}
                                    value={formData.eligibleDepartments}
                                    onChange={(e) => setFormData({ ...formData, eligibleDepartments: e.target.value })}
                                    sx={inputSx}
                                >
                                    {departments.map((dept) => (
                                        <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <TextField fullWidth label="Min CGPA" type="number"
                                    inputProps={{ step: 0.1, min: 0, max: 10 }}
                                    value={formData.minCGPA}
                                    onChange={(e) => setFormData({ ...formData, minCGPA: e.target.value })}
                                    sx={inputSx} />
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <TextField fullWidth label="Max Backlogs" type="number"
                                    inputProps={{ min: 0 }}
                                    value={formData.maxBacklogs}
                                    onChange={(e) => setFormData({ ...formData, maxBacklogs: parseInt(e.target.value, 10) || 0 })}
                                    sx={inputSx} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField fullWidth label="Package (e.g., 6 LPA)"
                                    value={formData.package}
                                    onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                                    sx={inputSx} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Expiry Date" type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    required sx={inputSx} />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3, borderTop: '1px solid #f1f5f9', pt: 2 }}>
                        <Button onClick={handleCloseDialog} disabled={submitting}
                            sx={{ borderRadius: '12px', fontWeight: 700, textTransform: 'none', color: '#64748b' }}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} variant="contained" disabled={submitting}
                            sx={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                borderRadius: '12px', fontWeight: 800, textTransform: 'none', px: 3,
                                boxShadow: '0 4px 12px rgba(99,102,241,0.25)',
                                '&:hover': { background: '#4338ca' },
                            }}
                        >
                            {submitting ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update Drive' : 'Create Drive')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default FacultyDashboard;
