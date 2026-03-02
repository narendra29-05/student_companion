import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Container, Typography, Box, MenuItem, FormControl,
    Select, InputLabel, Grid, Paper, List, ListItem,
    ListItemText, Button, Divider, Avatar, Stack, CircularProgress
} from '@mui/material';
import API from '../services/api';

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SchoolIcon from '@mui/icons-material/School';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// --- ANIMATION VARIANTS ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const REGULATIONS = ['R20', 'R23'];
const SEMESTER_ORDER = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2'];

const Materials = () => {
    const [selection, setSelection] = useState({
        regulation: '',
        semester: '',
        subject: ''
    });
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch materials when regulation changes
    useEffect(() => {
        if (!selection.regulation) {
            setMaterials([]);
            return;
        }
        const fetchMaterials = async () => {
            setLoading(true);
            try {
                const { data } = await API.get(`/drives/materials/filter?regulation=${selection.regulation}`);
                setMaterials(data.materials || []);
            } catch (err) {
                console.error('Failed to fetch materials:', err);
                setMaterials([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMaterials();
    }, [selection.regulation]);

    // Derive semesters from fetched materials
    const availableSemesters = [...new Set(materials.map(m => m.semester))]
        .sort((a, b) => SEMESTER_ORDER.indexOf(a) - SEMESTER_ORDER.indexOf(b));

    // Derive subjects for selected semester
    const subjectsForSemester = materials
        .filter(m => m.semester === selection.semester)
        .sort((a, b) => a.subject.localeCompare(b.subject));

    // Get the selected material object
    const selectedMaterial = materials.find(
        m => m.semester === selection.semester && m.subject === selection.subject
    );

    const handleUpdate = (field, value) => {
        setSelection(prev => ({
            ...prev,
            [field]: value,
            ...(field === 'regulation' && { semester: '', subject: '' }),
            ...(field === 'semester' && { subject: '' })
        }));
    };

    return (
        <Box sx={{
            backgroundColor: '#f8fafc',
            minHeight: '100vh',
            py: 8,
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decoration */}
            <Box sx={{
                position: 'absolute', top: -100, right: -100, width: 400, height: 400,
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)'
            }} />

            <Container maxWidth="lg">
                {/* --- HEADER --- */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Avatar sx={{
                            bgcolor: '#6366f1', width: 80, height: 80, mx: 'auto', mb: 3,
                            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)'
                        }}>
                            <LibraryBooksIcon sx={{ fontSize: 40 }} />
                        </Avatar>
                        <Typography variant="h2" sx={{
                            fontWeight: 900, color: '#1e293b', letterSpacing: '-0.02em', mb: 1,
                            fontSize: { xs: '2.5rem', md: '3.75rem' }
                        }}>
                            Academic <span style={{ color: '#6366f1' }}>Repository</span>
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400 }}>
                            Curated high-quality resources for your engineering excellence
                        </Typography>
                    </Box>
                </motion.div>

                {/* --- FILTERS BENTO CARD --- */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
    <Paper elevation={0} sx={{
        p: { xs: 3, md: 5 }, mb: 6, borderRadius: '32px', border: '1px solid #e2e8f0',
        background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)'
    }}>
        <Grid container spacing={4}>
            {/* Regulation Filter */}
            <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="filled">
                    <InputLabel
                        id="reg-label"
                        sx={{ color: '#64748b', fontWeight: 600, mt: 0.5 }}
                    >
                        Regulation
                    </InputLabel>
                    <Select
                        labelId="reg-label"
                        value={selection.regulation}
                        disableUnderline
                        onChange={(e) => handleUpdate('regulation', e.target.value)}
                        sx={{
                            borderRadius: '16px',
                            background: '#f1f5f9',
                            fontWeight: 700,
                            height: '70px',
                            '& .MuiSelect-select': {
                                pt: 3,
                                pb: 1,
                                fontSize: '1.1rem'
                            }
                        }}
                    >
                        {REGULATIONS.map(reg => (
                            <MenuItem key={reg} value={reg}>{reg} Regulation</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            {/* Semester Filter */}
            <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="filled" disabled={!selection.regulation || loading}>
                    <InputLabel
                        id="sem-label"
                        sx={{ color: '#64748b', fontWeight: 600, mt: 0.5 }}
                    >
                        Semester
                    </InputLabel>
                    <Select
                        labelId="sem-label"
                        value={selection.semester}
                        disableUnderline
                        onChange={(e) => handleUpdate('semester', e.target.value)}
                        sx={{
                            borderRadius: '16px',
                            background: '#f1f5f9',
                            fontWeight: 700,
                            height: '70px',
                            minWidth: '220px',
                            '& .MuiSelect-select': {
                                pt: 3,
                                pb: 1,
                                fontSize: '1.1rem'
                            }
                        }}
                    >
                        {availableSemesters.map(sem => (
                            <MenuItem key={sem} value={sem}>Semester {sem}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            {/* Subject Filter */}
            <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="filled" disabled={!selection.semester}>
                    <InputLabel
                        id="sub-label"
                        sx={{ color: '#64748b', fontWeight: 600, mt: 0.5 }}
                    >
                        Subject
                    </InputLabel>
                    <Select
                        labelId="sub-label"
                        value={selection.subject}
                        disableUnderline
                        onChange={(e) => handleUpdate('subject', e.target.value)}
                        sx={{
                            borderRadius: '16px',
                            background: '#f1f5f9',
                            fontWeight: 700,
                            height: '70px',
                            minWidth: '220px',
                            '& .MuiSelect-select': {
                                pt: 3,
                                pb: 1,
                                fontSize: '1.1rem'
                            }
                        }}
                    >
                        {subjectsForSemester.map(mat => (
                            <MenuItem key={mat.id} value={mat.subject}>{mat.subject}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    </Paper>
</motion.div>

                {/* --- LOADING --- */}
                {loading && (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                        <CircularProgress sx={{ color: '#6366f1' }} />
                    </Box>
                )}

                {/* --- CONTENT SECTION --- */}
                <AnimatePresence mode="wait">
                    {selectedMaterial ? (
                        <motion.div
                            key={selection.subject}
                            variants={containerVariants} initial="hidden" animate="visible" exit="hidden"
                        >
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={8}>
                                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <SchoolIcon sx={{ color: '#6366f1', fontSize: 32 }} />
                                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>
                                            {selection.subject} Modules
                                        </Typography>
                                    </Box>

                                    <Paper sx={{ borderRadius: '32px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fff' }}>
                                        <List sx={{ p: 0 }}>
                                            {selectedMaterial.units.map((unit, index) => (
                                                <motion.div key={index} variants={itemVariants}>
                                                    <ListItem sx={{
                                                        py: 4, px: 5, transition: '0.3s',
                                                        flexDirection: { xs: 'column', sm: 'row' },
                                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                                        gap: 2,
                                                        '&:hover': { background: '#f8fafc' }
                                                    }}>
                                                        <Box sx={{
                                                            bgcolor: '#fee2e2', p: 2, borderRadius: '16px',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                        }}>
                                                            <PictureAsPdfIcon sx={{ color: '#ef4444', fontSize: 28 }} />
                                                        </Box>
                                                        <ListItemText
                                                            primary={unit.name}
                                                            primaryTypographyProps={{ fontWeight: 800, fontSize: '1.25rem', color: '#1e293b' }}
                                                            secondary="Official Study Material"
                                                            secondaryTypographyProps={{ color: '#64748b', fontWeight: 500 }}
                                                        />
                                                        <Button
                                                            href={unit.link} target="_blank" variant="contained" disableElevation
                                                            endIcon={<ArrowForwardIosIcon sx={{ fontSize: 12 }} />}
                                                            sx={{
                                                                borderRadius: '14px', px: 4, py: 1.5, textTransform: 'none',
                                                                fontWeight: 800, background: '#1e293b',
                                                                alignSelf: { xs: 'stretch', sm: 'center' },
                                                                '&:hover': { background: '#334155', transform: 'translateX(5px)' }
                                                            }}
                                                        >
                                                            Access
                                                        </Button>
                                                    </ListItem>
                                                    {index !== selectedMaterial.units.length - 1 && <Divider sx={{ mx: 5, opacity: 0.5 }} />}
                                                </motion.div>
                                            ))}
                                        </List>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Stack spacing={3}>
                                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#1e293b' }}>Quick View</Typography>

                                        {selectedMaterial.syllabusLink && (
                                            <motion.div whileHover={{ scale: 1.02 }}>
                                                <Paper sx={{
                                                    p: 4, borderRadius: '32px', color: '#fff',
                                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                                    boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.3)'
                                                }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Subject Syllabus</Typography>
                                                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 3, fontWeight: 500 }}>
                                                        Download the complete unit-wise breakdown and exam scheme.
                                                    </Typography>
                                                    <Button
                                                        fullWidth variant="contained" href={selectedMaterial.syllabusLink} target="_blank"
                                                        sx={{ bgcolor: '#fff', color: '#4f46e5', fontWeight: 800, borderRadius: '14px', '&:hover': { bgcolor: '#f8fafc' } }}
                                                    >
                                                        Download PDF
                                                    </Button>
                                                </Paper>
                                            </motion.div>
                                        )}

                                        <Paper sx={{ p: 4, borderRadius: '32px', border: '2px dashed #cbd5e1', bgcolor: '#f1f5f9' }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#475569', mb: 1.5 }}>
                                                Learning Tip
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, lineHeight: 1.8 }}>
                                                Use these materials alongside your lecture notes for the best preparation. Resources are updated per the latest {selection.regulation} academic standards.
                                            </Typography>
                                        </Paper>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </motion.div>
                    ) : !loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#fff', borderRadius: '32px', border: '2px dashed #e2e8f0' }}>
                                <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                                    Select your Regulation, Semester, and Subject to view materials
                                </Typography>
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Container>
        </Box>
    );
};

export default Materials;
