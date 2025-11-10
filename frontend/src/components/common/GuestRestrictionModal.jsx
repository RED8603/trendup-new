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
} from '@mui/material';
import { Close as CloseIcon, Lock as LockIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const GuestRestrictionModal = ({ open, onClose, action, feature, route = '/register' }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const handleSignUp = () => {
        onClose();
        navigate(route);
    };

    const displayText = action 
        ? `Sign up to ${action}`
        : feature 
        ? `Sign up to get access to ${feature}`
        : 'Sign up to continue';

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pb: 1,
                    background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 100%)`,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            p: 1,
                            borderRadius: 2,
                            background: alpha(theme.palette.primary.main, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <LockIcon color="primary" />
                    </Box>
                    <Typography variant="h6" fontWeight={700}>
                        Sign Up Required
                    </Typography>
                </Box>
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ py: 3 }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                    {displayText}
                </Typography>
                <Box
                    sx={{
                        mt: 3,
                        p: 2,
                        borderRadius: 2,
                        background: alpha(theme.palette.primary.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        <strong>Benefits of signing up:</strong>
                    </Typography>
                    <Box component="ul" sx={{ mt: 1, pl: 2, mb: 0 }}>
                        <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Create and share posts
                        </Typography>
                        <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Engage with the community
                        </Typography>
                        <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Access chat and live features
                        </Typography>
                        <Typography component="li" variant="body2" color="text.secondary">
                            Build your karma and earn badges
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        borderColor: alpha(theme.palette.divider, 0.5),
                        '&:hover': {
                            borderColor: theme.palette.divider,
                        },
                    }}
                >
                    Maybe Later
                </Button>
                <Button
                    onClick={handleSignUp}
                    variant="contained"
                    color="primary"
                    sx={{
                        px: 3,
                        fontWeight: 600,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        '&:hover': {
                            background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                        },
                    }}
                >
                    Sign Up Now
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GuestRestrictionModal;

