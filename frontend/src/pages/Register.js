import React, { useState, useMemo } from 'react';
import {
  Box, Typography, TextField, Button, Stack, Paper, Alert,
  ToggleButton, ToggleButtonGroup, MenuItem, IconButton,
  InputAdornment, Grid, ThemeProvider, createTheme, CssBaseline
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Icons
import {
  Brightness4, Brightness7, Visibility, VisibilityOff,
  MenuBook, Psychology,
  EmojiEvents, School, Terminal, Engineering, WorkspacePremium,
  Biotech, Science, Code,
  Hub, Speed
} from '@mui/icons-material';

const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML'];

// Boosted Symbols for high visibility — hidden on mobile for cleaner look
const symbols = [
  { icon: Psychology, label: "AI", x: "5%", y: "10%", size: 50, delay: 0 },
  { icon: Terminal, label: "DEV", x: "18%", y: "45%", size: 35, delay: 2 },
  { icon: Engineering, label: "BUILD", x: "10%", y: "75%", size: 55, delay: 4 },
  { icon: Science, label: "PHYSICS", x: "28%", y: "18%", size: 30, delay: 1 },
  { icon: Biotech, label: "BIO", x: "5%", y: "35%", size: 40, delay: 3 },
  { icon: Code, label: "SOURCE", x: "38%", y: "65%", size: 60, delay: 1.5 },
  { icon: MenuBook, label: "STUDY", x: "82%", y: "12%", size: 50, delay: 0.5 },
  { icon: School, label: "ACADEMIA", x: "72%", y: "35%", size: 65, delay: 2.5 },
  { icon: WorkspacePremium, label: "EXCEL", x: "90%", y: "55%", size: 45, delay: 1.2 },
  { icon: EmojiEvents, label: "VICTORY", x: "78%", y: "85%", size: 55, delay: 3.5 },
  { icon: Hub, label: "NETWORK", x: "45%", y: "15%", size: 40, delay: 2.2 },
  { icon: Speed, label: "PERFORM", x: "60%", y: "82%", size: 50, delay: 0.2 },
];

const FloatingSymbol = ({ icon: Icon, delay, x, y, label, size, isDark }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0.3, 0.8, 0.3],
      y: [0, -50, 0],
      rotate: [0, 15, -15, 0],
      scale: 1
    }}
    transition={{ duration: 8, repeat: Infinity, delay, ease: "easeInOut" }}
    style={{
      position: 'absolute', left: x, top: y,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      pointerEvents: 'none', zIndex: 0
    }}
  >
    <Icon sx={{
      fontSize: size,
      color: 'primary.main',
      filter: isDark
        ? 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.8))'
        : 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.4))',
      mb: 1
    }} />
    <Typography variant="caption" sx={{
      fontWeight: 900,
      color: isDark ? 'white' : 'black',
      opacity: 0.7,
      fontSize: '0.7rem',
      textShadow: isDark ? '0 0 10px rgba(0,0,0,1)' : 'none'
    }}>
      {label}
    </Typography>
  </motion.div>
);

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [mode, setMode] = useState('dark');
  const isDark = mode === 'dark';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#6366f1' },
      background: {
        default: isDark ? '#020617' : '#f8fafc',
        paper: isDark ? '#0f172a' : '#ffffff',
      },
    },
    shape: { borderRadius: 32 }
  }), [mode, isDark]);

  const [role, setRole] = useState('student');
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState({
    name: '', identifier: '', collegeEmail: '', department: '', year: 1, password: '', confirmPassword: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.identifier || !formData.collegeEmail || !formData.department || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const userData = role === 'student'
        ? {
            rollNumber: formData.identifier.toUpperCase(),
            collegeEmail: formData.collegeEmail,
            password: formData.password,
            name: formData.name,
            department: formData.department,
            year: Number(formData.year),
          }
        : {
            facultyId: formData.identifier.toUpperCase(),
            collegeEmail: formData.collegeEmail,
            password: formData.password,
            name: formData.name,
            department: formData.department,
          };

      await register(userData, role);
      toast.success('Registration successful!');
      navigate(role === 'student' ? '/student/dashboard' : '/faculty/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        py: { xs: 2, sm: 3, md: 0 }
      }}>

        {/* HIGH VISIBILITY BACKGROUND — hidden on mobile */}
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, display: { xs: 'none', md: 'block' } }}>
          {symbols.map((s, i) => <FloatingSymbol key={i} {...s} isDark={isDark} />)}
        </Box>

        {/* Subtle Grid for depth */}
        <Box sx={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `radial-gradient(${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 1.5px, transparent 1.5px)`,
          backgroundSize: '40px 40px'
        }} />

        {/* THEME TOGGLE */}
        <IconButton
          onClick={() => setMode(isDark ? 'light' : 'dark')}
          sx={{
            position: 'absolute', top: { xs: 12, md: 30 }, right: { xs: 12, md: 30 }, zIndex: 10,
            bgcolor: 'primary.main', color: 'white',
            '&:hover': { bgcolor: 'primary.dark' }
          }}
        >
          {isDark ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        {/* REGISTRATION FORM */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ zIndex: 5, width: '100%', maxWidth: '560px', padding: '12px' }}>
          <Paper elevation={24} sx={{
            p: { xs: 2.5, sm: 3.5, md: 5 },
            borderRadius: { xs: '24px', sm: '36px', md: '50px' },
            bgcolor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)', border: `2px solid ${theme.palette.primary.main}`
          }}>
            <Stack spacing={{ xs: 2, sm: 2.5, md: 4 }}>
              <Box textAlign="center">
                <Typography fontWeight={950} sx={{
                  letterSpacing: '-1.5px',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                }}>
                  Identity Portal
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                  Securely join the academic network
                </Typography>
              </Box>

              <ToggleButtonGroup
                value={role} exclusive onChange={(e, v) => v && setRole(v)}
                fullWidth sx={{ borderRadius: '15px', bgcolor: isDark ? '#000' : '#f1f5f9', p: 0.5 }}
              >
                <ToggleButton value="student" sx={{ border: 'none', borderRadius: '12px !important', fontWeight: 900, py: { xs: 0.7, md: 1 }, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>STUDENT</ToggleButton>
                <ToggleButton value="faculty" sx={{ border: 'none', borderRadius: '12px !important', fontWeight: 900, py: { xs: 0.7, md: 1 }, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>FACULTY</ToggleButton>
              </ToggleButtonGroup>

              {error && <Alert severity="error" sx={{ borderRadius: '16px' }}>{error}</Alert>}

              <form onSubmit={handleSubmit}>
              <Stack spacing={{ xs: 1.5, md: 2 }}>
                <TextField fullWidth label="Full Name" name="name" onChange={handleChange} variant="outlined" size="small" />

                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={7}>
                    <TextField fullWidth label={role === 'student' ? "Roll Number" : "Faculty ID"} name="identifier" onChange={handleChange} size="small" />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      select fullWidth label="Department" name="department"
                      value={formData.department} onChange={handleChange} size="small"
                    >
                      {DEPARTMENTS.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                    </TextField>
                  </Grid>
                </Grid>

                <TextField fullWidth label="College Email" name="collegeEmail" onChange={handleChange} size="small" />

                {role === 'student' && (
                  <TextField select fullWidth label="Academic Year" name="year" value={formData.year} onChange={handleChange} size="small">
                    {[1,2,3,4].map(y => <MenuItem key={y} value={y}>Year {y}</MenuItem>)}
                  </TextField>
                )}

                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth label="Password" name="password" type={showPwd ? 'text' : 'password'} onChange={handleChange} size="small"
                      InputProps={{ endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPwd(!showPwd)} size="small">{showPwd ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton>
                        </InputAdornment>
                      )}}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth label="Confirm" name="confirmPassword" type={showPwd ? 'text' : 'password'} onChange={handleChange} size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: passwordsMatch ? '#10b981' : '' },
                          '&.Mui-focused fieldset': { borderColor: passwordsMatch ? '#10b981' : '' }
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit" variant="contained" fullWidth size="large" disabled={loading}
                  sx={{
                    py: { xs: 1.2, md: 1.8 }, borderRadius: '14px', fontWeight: 900,
                    fontSize: { xs: '0.85rem', md: '1rem' },
                    background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)'
                  }}
                >
                  {loading ? 'Processing...' : 'AUTHORIZE REGISTRATION'}
                </Button>

                {/* SIGN IN LINK */}
                <Typography variant="body2" textAlign="center" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                  Existing Member?
                  <Button
                    variant="text"
                    onClick={() => navigate('/login')}
                    sx={{ fontWeight: 900, ml: 0.5, textDecoration: 'underline', fontSize: 'inherit' }}
                  >
                    Sign In Here
                  </Button>
                </Typography>
              </Stack>
              </form>
            </Stack>
          </Paper>
        </motion.div>
      </Box>
    </ThemeProvider>
  );
};

export default Register;
