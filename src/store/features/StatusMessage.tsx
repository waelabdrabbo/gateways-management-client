import { forwardRef } from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface StatusMessageProps {
    open: boolean,
    message: string,
    onClose: () => void;
}

function StatusMessage({ open, message, onClose }: StatusMessageProps) {
    const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref,
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    return (
        <Snackbar open={open} autoHideDuration={4000} onClose={onClose} >
            <Alert severity="success" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}

export default StatusMessage