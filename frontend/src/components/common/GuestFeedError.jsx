import { Box, Button, Card, Stack, Typography, useTheme, alpha } from '@mui/material';
import { Login as LoginIcon, PersonAdd as PersonAddIcon, Explore as ExploreIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { exitGuestMode } from '@/store/slices/userSlices';
import { motion } from 'framer-motion';

const GuestFeedError = ({ featureName = 'this feature' }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();

    const handleLogin = () => {
        dispatch(exitGuestMode());
        // Small delay to ensure state is updated before navigation
        setTimeout(() => {
            navigate('/login');
        }, 50);
    };

    const handleSignUp = () => {
        dispatch(exitGuestMode());
        // Small delay to ensure state is updated before navigation
        setTimeout(() => {
            navigate('/register');
        }, 50);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <Card
                sx={{
                    maxWidth: 500,
                    mx: 'auto',
                    my: 4,
                    p: 4,
                    textAlign: 'center',
                    background: theme.palette.mode === 'dark'
                        ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`
                        : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${theme.palette.background.paper} 100%)`,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
                    borderRadius: 3,
                }}
            >
                <Box
                    sx={{
                        mb: 3,
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.primary.main, 0.1)})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <ExploreIcon sx={{ color: theme.palette.primary.main, fontSize: 48 }} />
                    </Box>
                </Box>

                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        mb: 1.5,
                    }}
                >
                    You're browsing as a guest
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        color: theme.palette.text.secondary,
                        mb: 3,
                        lineHeight: 1.7,
                    }}
                >
                    To explore {featureName}, create an account or login to unlock all features and start engaging with the community.
                </Typography>

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    justifyContent="center"
                >
                    <Button
                        variant="outlined"
                        onClick={handleSignUp}
                        startIcon={<PersonAddIcon />}
                        sx={{
                            px: 3,
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
                        Create Account
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleLogin}
                        startIcon={<LoginIcon />}
                        sx={{
                            px: 4,
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
            </Card>
        </motion.div>
    );
};

export default GuestFeedError;

