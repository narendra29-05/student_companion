import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Grid, Card, CardContent, CardActions,
    Button, TextField, Dialog, DialogTitle, DialogContent,
    DialogActions, Box, CircularProgress, Alert, Chip, MenuItem,
    IconButton
} from '@mui/material';
import { Add, Edit, Delete, Business } from '@mui/icons-material';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML', 'ALL'];

const FacultyDashboard = () => {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentDrive, setCurrentDrive] = useState(null);
    const [formData, setFormData] = useState({
        companyName: '',
        role: '',
        driveLink: '',
        description: '',
        eligibleDepartments: [],
        minCGPA: '',
        package: '',
        expiryDate: ''
    });
    const { user } = useAuth();

    useEffect(() => {
        fetchDrives();
    }, []);

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

    const handleOpenDialog = (drive = null) => {
        if (drive) {
            setEditMode(true);
            setCurrentDrive(drive);
            setFormData({
                companyName: drive.companyName,
                role: drive.role,
                driveLink: drive.driveLink,
                description: drive.description || '',
                eligibleDepartments: drive.eligibleDepartments || [],
                minCGPA: drive.minCGPA || '',
                package: drive.package || '',
                expiryDate: drive.expiryDate.split('T')[0]
            });
        } else {
            setEditMode(false);
            setCurrentDrive(null);
            setFormData({
                companyName: '',
                role: '',
                driveLink: '',
                description: '',
                eligibleDepartments: [],
                minCGPA: '',
                package: '',
                expiryDate: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditMode(false);
        setCurrentDrive(null);
    };

    const handleSubmit = async () => {
        try {
            if (editMode) {
                await API.put(`/drives/${currentDrive._id}`, formData);
                toast.success('Drive updated successfully!');
            } else {
                await API.post('/drives', formData);
                toast.success('Drive created successfully!');
            }
            handleCloseDialog();
            fetchDrives();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
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

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
                        📋 Manage Placement Drives
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Welcome, {user?.name}! Manage campus drives here.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{ background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)' }}
                >
                    Add New Drive
                </Button>
            </Box>

            {drives.length === 0 ? (
                <Alert severity="info">No drives created yet. Create your first drive!</Alert>
            ) : (
                <Grid container spacing={3}>
                    {drives.map((drive) => (
                        <Grid item xs={12} md={6} lg={4} key={drive._id}>
                            <Card 
                                elevation={4}
                                sx={{ 
                                    height: '100%',
                                    borderRadius: 3,
                                    border: drive.isExpired ? '2px solid #f44336' : 'none'
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Business sx={{ mr: 1, color: '#667eea' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {drive.companyName}
                                        </Typography>
                                    </Box>

                                    {drive.isExpired && (
                                        <Chip label="EXPIRED" color="error" size="small" sx={{ mb: 1 }} />
                                    )}

                                    <Chip label={drive.role} color="primary" size="small" sx={{ mb: 2 }} />

                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <strong>Package:</strong> {drive.package || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <strong>Expires:</strong> {formatDate(drive.expiryDate)}
                                    </Typography>
                                    <Typography variant="body2" noWrap>
                                        <strong>Link:</strong> {drive.driveLink}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton color="primary" onClick={() => handleOpenDialog(drive)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(drive._id)}>
                                        <Delete />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editMode ? 'Edit Drive' : 'Add New Drive'}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Company Name"
                        margin="normal"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Role"
                        margin="normal"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Drive Link"
                        margin="normal"
                        value={formData.driveLink}
                        onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
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
                        select
                        label="Eligible Departments"
                        margin="normal"
                        SelectProps={{ multiple: true }}
                        value={formData.eligibleDepartments}
                        onChange={(e) => setFormData({ ...formData, eligibleDepartments: e.target.value })}
                    >
                        {departments.map((dept) => (
                            <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        label="Minimum CGPA"
                        type="number"
                        margin="normal"
                        inputProps={{ step: 0.1, min: 0, max: 10 }}
                        value={formData.minCGPA}
                        onChange={(e) => setFormData({ ...formData, minCGPA: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Package (e.g., 6 LPA)"
                        margin="normal"
                        value={formData.package}
                        onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Expiry Date"
                        type="date"
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained"
                        sx={{ background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)' }}
                    >
                        {editMode ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default FacultyDashboard;
