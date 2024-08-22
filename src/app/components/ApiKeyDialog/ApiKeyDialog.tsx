import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Box,
    Avatar,
    Typography
} from '@mui/material';
import styles from './ApiKeyDialog.module.css';
import { validateApiKey } from '@/app/actions/actions';

interface ApiKeyDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (apiKey: string) => void;
    canClose: boolean;
}

export default function ApiKeyDialog({ open, onClose, onSave, canClose }: ApiKeyDialogProps) {
    const [apiKey, setApiKey] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            const storedApiKey = localStorage.getItem('openaiApiKey');
            if (storedApiKey) {
                setApiKey(storedApiKey);
                validateApiKey(storedApiKey).then(isValid => {
                    if (isValid) {
                        setError(null);
                    } else {
                        setError('Invalid API key');
                    }
                });
            }
        }
    }, [open]);

    const handleApiKeyChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newApiKey = event.target.value;
        setApiKey(newApiKey);

        const isValid = await validateApiKey(newApiKey);
        if (!isValid) {
            setError('Invalid API key');
        } else {
            setError(null);
        }
    };

    const handleSave = () => {
        if (apiKey.trim() && !error) {
            localStorage.setItem('openaiApiKey', apiKey);
            onSave(apiKey);
        }
    };

    const handleCancel = () => {
        const storedApiKey = localStorage.getItem('openaiApiKey');
        if (storedApiKey) {
            setApiKey(storedApiKey);
            setError(null);
        }
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={canClose ? handleCancel : undefined}
            classes={{ paper: styles.dialogPaper }}
        >
            <DialogTitle className={styles.dialogTitle}>
                <Typography variant="h6" component="div">
                    {canClose ? 'Update OpenAI API key' : 'Add OpenAI API key'}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box className={styles.contentBox}>
                    <Avatar src="/openai-logo.svg" alt="OpenAI" className={styles.avatar} />
                    <TextField
                        autoFocus
                        fullWidth
                        label="OpenAI API Key"
                        type="password"
                        variant="outlined"
                        value={apiKey}
                        onChange={handleApiKeyChange}
                        className={styles.textField}
                        error={!!error}
                        helperText={error}
                    />
                </Box>
            </DialogContent>
            <DialogActions className={styles.dialogActions}>
                {canClose && (
                    <Button
                        onClick={handleCancel}
                        className={styles.cancelButton}
                    >
                        CANCEL
                    </Button>
                )}
                <Button
                    onClick={handleSave}
                    variant="contained"
                    className={styles.saveButton}
                    disabled={!!error}
                >
                    SAVE
                </Button>
            </DialogActions>
        </Dialog>
    );
}
