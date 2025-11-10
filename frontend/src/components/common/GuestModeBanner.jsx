import { Alert, AlertTitle, Box, Button, IconButton, Slide, alpha, useTheme } from '@mui/material';
import { Close as CloseIcon, AccountCircle as AccountIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { exitGuestMode } from '@/store/slices/userSlices';

const GuestModeBanner = () => {
    const [show, setShow] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const { isGuestMode } = useSelector((state) => state.user);
    
    if (!isGuestMode || !show) return null;
    
    const handleSignUp = () => {
        dispatch(exitGuestMode());
        navigate('/register');
    };
    
    return (
        <Slide direction="down" in={show} mountOnEnter unmountOnExit>
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 9999,
                    p: 1,
                }}
            >
                <Alert
                    severity="info"
                    icon={<AccountIcon />}
                    sx={{
                        backgroundColor: alpha(theme.palette.info.main, 0.15),
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
                        boxShadow: theme.shadows[3],
                    }}
                    action={
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Button
                                color="info"
                                size="small"
                                variant="contained"
                                onClick={handleSignUp}
                                sx={{ whiteSpace: 'nowrap' }}
                            >
                                Sign Up Now
                            </Button>
                            <IconButton
                                size="small"
                                onClick={() => setShow(false)}
                                sx={{ color: 'info.main' }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    }
                >
                    <AlertTitle sx={{ fontWeight: 600 }}>
                        You're browsing as a guest
                    </AlertTitle>
                    Sign up to unlock voting, chatting, and posting features!
                </Alert>
            </Box>
        </Slide>
    );
};

export default GuestModeBanner;

