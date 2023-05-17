import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { useUpdateGatewayMutation, useAddGatewayMutation } from '../api/gatewaysApiSlice';
import SendIcon from '@mui/icons-material/Send'
import Button from '@mui/material/Button';

export interface EditGatewayDialogProps {
    open: boolean;
    onClose: () => void;
    gateway: {
        _id?: string
        name?: string;
        serialNumber?: string;
        ipAddress?: string;
    }
    isEditing: boolean;
    setIsEditing: (arg0: boolean) => void
}

function GatewayEditDialog({ open, gateway, isEditing, setIsEditing, onClose }: EditGatewayDialogProps) {
    const [name, setName] = useState(gateway.name);
    const [serialNumber, setSerialNumber] = useState(gateway?.serialNumber);
    const [ipAddress, setIpAddress] = useState(gateway?.ipAddress);
    const [updateGateway] = useUpdateGatewayMutation();
    const [addGateway] = useAddGatewayMutation();
    const updatedGateway = { _id: gateway._id, name, serialNumber, ipAddress }
    const handleNameChange = (event: any) => {
        setName(event.target.value);
    };
    const handleSerialNumberChange = (event: any) => {
        setSerialNumber(event.target.value);
    };
    const handleIpAddressChange = (event: any) => {
        setIpAddress(event.target.value);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault()
        if (isEditing) {
            updateGateway(updatedGateway);
        } else {
            addGateway(updatedGateway);
            setIsEditing(false);
        }
        onClose()

    };
    const handleClose = () => {
        onClose()
        setIsEditing(false)
    };
    useEffect(() => {
        if (gateway != null) {
            setName(gateway.name || "");
            setSerialNumber(gateway.serialNumber || "");
            setIpAddress(gateway.ipAddress || "");
        }
    }, [gateway])


    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Gateway Form</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <TextField margin="normal" label="Name" value={name} onChange={handleNameChange} fullWidth />
                            <TextField label="Serial Number" value={serialNumber} onChange={handleSerialNumberChange} fullWidth />
                            <TextField label="IP Address" value={ipAddress} onChange={handleIpAddressChange} fullWidth />
                            <Button type='submit' variant="contained" endIcon={<SendIcon />}>
                                Submit
                            </Button>
                        </Stack>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
export default GatewayEditDialog;