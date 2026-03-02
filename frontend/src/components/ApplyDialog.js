import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography,
    Chip, IconButton, Tooltip, Divider, useTheme, useMediaQuery
} from '@mui/material';
import { ContentCopy, OpenInNew, CheckCircle, Person, Email, School, Badge, TrendingUp } from '@mui/icons-material';
import { toast } from 'react-toastify';

const ApplyDialog = ({ open, onClose, drive, studentProfile, onApplied }) => {
    const [copied, setCopied] = useState(false);
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

    if (!drive || !studentProfile) return null;

    const profileFields = [
        { icon: <Person fontSize="small" />, label: 'Name', value: studentProfile.name },
        { icon: <Badge fontSize="small" />, label: 'Roll Number', value: studentProfile.rollNumber },
        { icon: <Email fontSize="small" />, label: 'Email', value: studentProfile.email },
        { icon: <School fontSize="small" />, label: 'Department', value: studentProfile.department },
        { icon: <School fontSize="small" />, label: 'Year', value: `Year ${studentProfile.year}` },
        { icon: <TrendingUp fontSize="small" />, label: 'CGPA', value: studentProfile.cgpa },
        { icon: <TrendingUp fontSize="small" />, label: 'Backlogs', value: studentProfile.backlogs },
    ];

    const handleCopyAll = () => {
        const text = profileFields
            .map((f) => `${f.label}: ${f.value}`)
            .join('\n');
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            toast.success('Details copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleOpenForm = () => {
        window.open(drive.driveLink, '_blank', 'noopener,noreferrer');
        if (onApplied) onApplied();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            fullScreen={isMobile}
            PaperProps={{ sx: { borderRadius: isMobile ? 0 : '20px' } }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
                    Apply to {drive.companyName}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                    {drive.role}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                    Your Details
                </Typography>
                <Box sx={{ bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', p: { xs: 1.5, sm: 2 } }}>
                    {profileFields.map((field, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1, borderBottom: idx < profileFields.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                            <Box sx={{ color: '#6366f1' }}>{field.icon}</Box>
                            <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600, minWidth: { xs: 70, sm: 90 } }}>{field.label}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>{field.value}</Typography>
                        </Box>
                    ))}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Button
                        variant="outlined"
                        startIcon={copied ? <CheckCircle /> : <ContentCopy />}
                        onClick={handleCopyAll}
                        sx={{
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 700,
                            flex: { sm: 1 },
                            borderColor: copied ? '#10b981' : '#e2e8f0',
                            color: copied ? '#059669' : '#64748b',
                        }}
                    >
                        {copied ? 'Copied!' : 'Copy All Details'}
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<OpenInNew />}
                        onClick={handleOpenForm}
                        sx={{
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 700,
                            flex: { sm: 1 },
                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                        }}
                    >
                        Open Drive Form
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, color: '#64748b' }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ApplyDialog;
