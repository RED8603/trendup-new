import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    Typography,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

/**
 * Delete Message Dialog
 * Confirmation dialog for deleting messages
 */
export default function DeleteMessageDialog({
    open,
    onClose,
    onConfirm,
    messageContent,
}) {
    const [deleteType, setDeleteType] = useState('forMe');

    const handleConfirm = () => {
        onConfirm?.(deleteType);
        setDeleteType('forMe'); // Reset
        onClose();
    };

    const handleClose = () => {
        setDeleteType('forMe'); // Reset
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                },
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DeleteIcon color="error" />
                <Typography variant="h6" component="span">
                    Delete Message?
                </Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    Are you sure you want to delete this message?
                </DialogContentText>
                
                {messageContent && (
                    <Typography
                        variant="body2"
                        sx={{
                            p: 2,
                            bgcolor: 'background.default',
                            borderRadius: 1,
                            mb: 2,
                            fontStyle: 'italic',
                            color: 'text.secondary',
                        }}
                    >
                        "{messageContent.length > 100 
                            ? messageContent.substring(0, 100) + '...' 
                            : messageContent}"
                    </Typography>
                )}

                <RadioGroup
                    value={deleteType}
                    onChange={(e) => setDeleteType(e.target.value)}
                >
                    <FormControlLabel
                        value="forMe"
                        control={<Radio />}
                        label="Delete for me"
                    />
                    <FormControlLabel
                        value="forEveryone"
                        control={<Radio />}
                        label="Delete for everyone"
                    />
                </RadioGroup>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}

