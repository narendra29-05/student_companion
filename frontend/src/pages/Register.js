import React, { useState, useMemo } from 'react';
import { 
  Box, Typography, TextField, Button, Stack, Paper, 
  ToggleButton, ToggleButtonGroup, MenuItem, IconButton, 
  InputAdornment, Grid, ThemeProvider, createTheme, CssBaseline 
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Icons
import { 
  Brightness4, Brightness7, Visibility, VisibilityOff,
  MenuBook, LaptopMac, Psychology, Analytics, 
  EmojiEvents, TipsAndUpdates, Security, VerifiedUser,
  AutoGraph, School, Terminal, Engineering, WorkspacePremium,
  Calculate, Language, Biotech, Science, Architecture, Code,
  Hub, Memory, Storage, Speed, BugReport
} from '@mui/icons-material';

const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'AIML'];

// Boosted Symbols for high visibility
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
      // INCREASED OPACITY FROM 0.4 TO 0.8
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
      // ADDED GLOW EFFECT
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
  const [mode, setMode] = useState('dark');
  const isDark = mode === 'dark';

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
    name: '', identifier: '', collegeEmail: '', department: '', year: '1', password: '', confirmPassword: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        
        {/* HIGH VISIBILITY BACKGROUND */}
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {symbols.map((s, i) => <FloatingSymbol key={i} {...s} isDark={isDark} />)}
          
          {/* Subtle Grid for depth */}
          <Box sx={{ 
            position: 'absolute', inset: 0, 
            backgroundImage: `radial-gradient(${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 1.5px, transparent 1.5px)`,
            backgroundSize: '40px 40px' 
          }} />
        </Box>

        {/* THEME TOGGLE */}
        <IconButton 
          onClick={() => setMode(isDark ? 'light' : 'dark')}
          sx={{ 
            position: 'absolute', top: 30, right: 30, zIndex: 10, 
            bgcolor: 'primary.main', color: 'white',
            '&:hover': { bgcolor: 'primary.dark' }
          }}
        >
          {isDark ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        {/* REGISTRATION FORM */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ zIndex: 5, width: '100%', maxWidth: '600px', padding: '20px' }}>
          <Paper elevation={24} sx={{ 
            p: { xs: 4, md: 6 }, borderRadius: '50px', 
            bgcolor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)', border: `2px solid ${theme.palette.primary.main}`
          }}>
            <Stack spacing={4}>
              <Box textAlign="center">
                <Typography variant="h3" fontWeight={950} sx={{ letterSpacing: '-1.5px' }}>Identity Portal</Typography>
                <Typography color="text.secondary">Securely join the academic network</Typography>
              </Box>

              <ToggleButtonGroup 
                value={role} exclusive onChange={(e, v) => v && setRole(v)} 
                fullWidth sx={{ borderRadius: '15px', bgcolor: isDark ? '#000' : '#f1f5f9', p: 0.5 }}
              >
                <ToggleButton value="student" sx={{ border: 'none', borderRadius: '12px !important', fontWeight: 900 }}>STUDENT</ToggleButton>
                <ToggleButton value="faculty" sx={{ border: 'none', borderRadius: '12px !important', fontWeight: 900 }}>FACULTY</ToggleButton>
              </ToggleButtonGroup>

              <Stack spacing={2}>
                <TextField fullWidth label="Full Name" name="name" onChange={handleChange} variant="outlined" />
                
                <Grid container spacing={2}>
                  <Grid item xs={7}>
                    <TextField fullWidth label={role === 'student' ? "Roll Number" : "Faculty ID"} name="identifier" onChange={handleChange} />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField select fullWidth label="Dept" name="department" onChange={handleChange}>
                      {DEPARTMENTS.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                    </TextField>
                  </Grid>
                </Grid>

                <TextField fullWidth label="College Email" name="collegeEmail" onChange={handleChange} />

                {role === 'student' && (
                  <TextField select fullWidth label="Academic Year" name="year" value={formData.year} onChange={handleChange}>
                    {[1,2,3,4].map(y => <MenuItem key={y} value={y}>Year {y}</MenuItem>)}
                  </TextField>
                )}

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField 
                      fullWidth label="Password" name="password" type={showPwd ? 'text' : 'password'} onChange={handleChange}
                      InputProps={{ endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPwd(!showPwd)}>{showPwd ? <VisibilityOff /> : <Visibility />}</IconButton>
                        </InputAdornment>
                      )}} 
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField 
                      fullWidth label="Confirm Password" name="confirmPassword" type={showPwd ? 'text' : 'password'} onChange={handleChange}
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
                  variant="contained" fullWidth size="large" 
                  sx={{ 
                    py: 2, borderRadius: '18px', fontWeight: 900, 
                    background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)'
                  }}
                >
                  AUTHORIZE REGISTRATION
                </Button>

                {/* SIGN IN LINK */}
                <Typography variant="body2" textAlign="center">
                  Existing Member? 
                  <Button 
                    variant="text" 
                    onClick={() => navigate('/login')} 
                    sx={{ fontWeight: 900, ml: 1, textDecoration: 'underline' }}
                  >
                    Sign In Here
                  </Button>
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </motion.div>
      </Box>
    </ThemeProvider>
  );
};

export default Register;