import { useState, useEffect, useRef } from 'react';
import {
    Box,
    TextField,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Check as CheckIcon,
    Close as CloseIcon,
} from '@mui/icons-material';

/**
 * Inline Message Editor
 * Allows editing messages directly in the chat
 */
export default function EditMessageInput({
    initialContent,
    onSave,
    onCancel,
    placeholder = 'Edit message...',
}) {
    const [content, setContent] = useState(initialContent || '');
    const inputRef = useRef(null);

    useEffect(() => {
        // Focus and select all text when component mounts
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, []);

    const handleSave = () => {
        if (content.trim() && content.trim() !== initialContent) {
            onSave?.(content.trim());
        } else {
            onCancel?.();
        }
    };

    const handleCancel = () => {
        setContent(initialContent || '');
        onCancel?.();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                p: 1,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '2px solid',
                borderColor: 'primary.main',
            }}
        >
            <TextField
                inputRef={inputRef}
                fullWidth
                multiline
                maxRows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                variant="outlined"
                size="small"
                sx={{
                    '& .MuiOutlinedInput-root': {
                        fontSize: '0.875rem',
                    },
                }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Tooltip title="Save (Enter)">
                    <IconButton
                        size="small"
                        onClick={handleSave}
                        color="primary"
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                                bgcolor: 'primary.dark',
                            },
                        }}
                    >
                        <CheckIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Cancel (Esc)">
                    <IconButton
                        size="small"
                        onClick={handleCancel}
                        color="inherit"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
}

