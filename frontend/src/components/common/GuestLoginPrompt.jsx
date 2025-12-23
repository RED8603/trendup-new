import { Box, Button, Card, Stack, Typography, useTheme, alpha } from '@mui/material';
import { Login as LoginIcon, PersonAdd as PersonAddIcon, Star as StarIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { exitGuestMode } from '@/store/slices/userSlices';
import { motion } from 'framer-motion';

const GuestLoginPrompt = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const { isGuestMode } = useSelector((state) => state.user);
    
    if (!isGuestMode) return null;
    
    const handleLogin = () => {
        dispatch(exitGuestMode());
        navigate('/login');
    };
    
    const handleSignUp = () => {
        dispatch(exitGuestMode());
        navigate('/register');
    };
    
    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <Card
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    maxWidth: { xs: 'calc(100% - 32px)', sm: '600px', md: '700px' },
                    width: '100%',
                    zIndex: 1000,
                    background: theme.palette.mode === 'dark'
                        ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`
                        : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${theme.palette.background.paper} 100%)`,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.15)}`,
                    borderRadius: 3,
                    p: { xs: 2, sm: 3 },
                }}
            >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                    justifyContent="space-between"
                >
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                        <Box
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.primary.main, 0.1)})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <StarIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: theme.palette.text.primary,
                                    mb: 0.5,
                                    fontSize: { xs: '1rem', sm: '1.125rem' },
                                }}
                            >
                                Sign In to Continue
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    fontSize: { xs: '0.813rem', sm: '0.875rem' },
                                }}
                            >
                                Create an account or login to unlock all features and start engaging
                            </Typography>
                        </Box>
                    </Stack>
                    
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1.5}
                        sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
                    >
                        <Button
                            variant="outlined"
                            onClick={handleSignUp}
                            startIcon={<PersonAddIcon />}
                            sx={{
                                px: { xs: 2, sm: 3 },
                                py: 1.25,
                                borderColor: alpha(theme.palette.primary.main, 0.5),
                                color: theme.palette.text.primary,
                                fontWeight: 600,
                                '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                },
                            }}
                        >
                            Sign Up
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleLogin}
                            startIcon={<LoginIcon />}
                            sx={{
                                px: { xs: 2, sm: 4 },
                                py: 1.25,
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                fontWeight: 600,
                                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                                '&:hover': {
                                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                    boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                                },
                            }}
                        >
                            Login
                        </Button>
                    </Stack>
                </Stack>
            </Card>
        </motion.div>
    );
};

export default GuestLoginPrompt;

