import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    useTheme,
    alpha,
    IconButton,
    Stack,
} from '@mui/material';
import { Close as CloseIcon, RocketLaunch as RocketIcon, CheckCircle as CheckIcon, Login as LoginIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { exitGuestMode } from '@/store/slices/userSlices';

const GuestRestrictionModal = ({ open, onClose, action, feature, route = '/register' }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSignUp = () => {
        onClose();
        dispatch(exitGuestMode());
        // Small delay to ensure state is updated before navigation
        setTimeout(() => {
            navigate('/register');
        }, 50);
    };

    const handleLogin = () => {
        onClose();
        dispatch(exitGuestMode());
        // Small delay to ensure state is updated before navigation
        setTimeout(() => {
            navigate('/login');
        }, 50);
    };

    const getFriendlyMessage = () => {
        if (action) {
            const actionMap = {
                'react to posts': 'like and react',
                'comment on posts': 'join the conversation',
                'follow users': 'connect with creators',
                'create posts': 'share your thoughts',
                'go live': 'start streaming',
                'create votes': 'start voting',
            };
            return actionMap[action.toLowerCase()] || action;
        }
        if (feature) {
            return feature;
        }
        return 'continue';
    };

    const friendlyAction = getFriendlyMessage();

    const benefits = [
        'Create and share your thoughts',
        'Connect with the community',
        'Chat and go live',
        'Build karma and earn badges',
        'Vote on proposals and polls',
    ];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    background: theme.palette.mode === 'dark'
                        ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.98)}, ${alpha(theme.palette.background.paper, 0.95)})`
                        : `linear-gradient(145deg, ${theme.palette.background.paper}, ${alpha(theme.palette.background.paper, 0.98)})`,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pb: 2,
                    pt: 3,
                    px: 3,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.primary.main, 0.05)})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <RocketIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                    </Box>
                    <Box>
                        <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                            Join TrendUp
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Sign up to {friendlyAction}
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.action.hover, 0.5),
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ py: 2, px: 3 }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                    Create a free account to unlock all features and start engaging with the community.
                </Typography>

                <Stack spacing={1.5}>
                    {benefits.map((benefit, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                                sx={{
                                    p: 0.5,
                                    borderRadius: '50%',
                                    background: alpha(theme.palette.primary.main, 0.1),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <CheckIcon sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {benefit}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, gap: 1.5, pt: 2 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        borderColor: alpha(theme.palette.divider, 0.5),
                        color: theme.palette.text.secondary,
                        px: 3,
                        '&:hover': {
                            borderColor: theme.palette.divider,
                            backgroundColor: alpha(theme.palette.action.hover, 0.5),
                        },
                    }}
                >
                    Continue Browsing
                </Button>
                <Button
                    onClick={handleSignUp}
                    variant="outlined"
                    startIcon={<PersonAddIcon />}
                    sx={{
                        px: 3,
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
                    onClick={handleLogin}
                    variant="contained"
                    startIcon={<LoginIcon />}
                    sx={{
                        px: 4,
                        fontWeight: 600,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                        '&:hover': {
                            background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                            boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                        },
                    }}
                >
                    Login
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GuestRestrictionModal;

