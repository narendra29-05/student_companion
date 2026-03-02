import React from 'react';
import { Container, Typography, Button, Card, CardContent, Box } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const ResourcePage = ({ title, description, link }) => {
    return (
        <Container sx={{ mt: { xs: 4, sm: 6, md: 8 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Card sx={{ maxWidth: 600, width: '100%', textAlign: 'center', boxShadow: 5, borderRadius: 3 }}>
                <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                    <Typography variant="h3" color="primary" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}>
                        {title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem' }}>
                        {description}
                    </Typography>
                    <Box>
                        <Button
                            variant="contained"
                            size="large"
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            endIcon={<OpenInNewIcon />}
                            sx={{
                                px: { xs: 3, sm: 4 },
                                py: 1.5,
                                fontSize: '1rem',
                                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                '&:hover': {
                                    opacity: 0.9
                                }
                            }}
                        >
                            Open Official Portal
                        </Button>
                    </Box>
                </CardContent>
            </Card>
            <Button
                sx={{ mt: 3 }}
                variant="text"
                onClick={() => window.history.back()}
            >
                ← Back to Dashboard
            </Button>
        </Container>
    );
};

export default ResourcePage;
