import React from 'react';
import { Alert, AlertTitle } from '@mui/material';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
    error: string;
    onClose: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onClose }) => {
    return (
        <Alert severity="error" onClose={onClose} className={styles.errorAlert}>
            <AlertTitle>Error</AlertTitle>
            {error}
        </Alert>
    );
};

export default ErrorMessage;
