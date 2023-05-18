import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { useUpdateDeviceMutation, useAddDeviceMutation } from '../api/apiSlice';
import SendIcon from '@mui/icons-material/Send'
import Button from '@mui/material/Button';
import StatusMessage from '../StatusMessage';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export interface EditDeviceDialogProps {
    open: boolean;
    onClose: () => void;
    device: {
        _id?: string
        uid?: string;
        vendor?: string;
        status?: string;
        gateway?: {};
    }
    isEditing: boolean;
    setIsEditing: (arg0: boolean) => void
}

function AddOrEditDeviceDialog({ open, device, isEditing, setIsEditing, onClose }: EditDeviceDialogProps) {
    const [uid, setUid] = useState(device?.uid);
    const [vendor, setVendor] = useState(device?.vendor);
    const [status, setStatus] = useState(device?.status);
    const [gateway, setGateway] = useState(device.gateway);
    const [statusMessage, setStatusMessage] = useState('')
    const [openStatusMessage, setOpenStatusMessage] = useState(false)
    const [updateDevice] = useUpdateDeviceMutation();
    const [addDevice] = useAddDeviceMutation();
    const updatedDevice = { _id: device._id, uid, vendor, status }
    // Validation
    const [uidValidationMessage, setUidValidationMessage] = useState('')
    const [uidValidation, setUidValidation] = useState(false)
    const [vendorValidationMessage, setVendorValidationMessage] = useState('')
    const [vendorValidation, setVendorValidation] = useState(false)
    const [statusValidationMessage, setStatusValidationMessage] = useState('')
    const [statusValidation, setStatusValidation] = useState(false)

    const resetForm = () => {
        setTimeout(() => {
            setUid(device.uid);
            setVendor(device.vendor)
            setStatus(device.status)
            setStatusValidation(false)
            setStatusValidationMessage('')
            setUidValidation(false)
            setUidValidationMessage('')
            setVendorValidation(false)
            setVendorValidationMessage('')
        }, 300);
    }
    const handleUidChange = (event: any) => {
        setUid(event.target.value);
    };
    const handleVendorChange = (event: any) => {
        setVendor(event.target.value);
    };
    const handleStatusChange = (event: any) => {
        setStatus(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            if (isEditing) {
                await updateDevice(updatedDevice).unwrap();
                setStatusMessage('Device updated successfully');
            } else {
                await addDevice(updatedDevice).unwrap();
                setStatusMessage('Device added successfully');
                setIsEditing(false);
            }
            setOpenStatusMessage(true);
            onClose();
            resetForm();
        } catch (error: any) {
            if (error.status === 400 || error.status) {
                const errors = error.data.error.errors;
                const handleValidation = (field: string, validationState: (arg0: any) => void, validationMessage: (arg0: any) => void) => {
                    if (errors[field]) {
                        validationState(true);
                        validationMessage(errors[field].message);
                    } else {
                        validationState(false);
                        validationMessage('');
                    }
                };
                handleValidation('uid', setUidValidation, setUidValidationMessage);
                handleValidation('vendor', setVendorValidation, setVendorValidationMessage);
            } else {
                setStatusMessage('An unexpected error occurred');
            }
        }
    };

    const handleClose = () => {
        onClose()
        setIsEditing(false)
        resetForm()
    };
    const handelStatusMessageOnClose = () => {
        setOpenStatusMessage(false)
    }
    useEffect(() => {
        if (device != null) {
            setUid(device.uid || "");
            setVendor(device.vendor || "");
            setStatus(device.status || "");
            setGateway(device.gateway || [])
        }

    }, [device])

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Gateway Form</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <TextField error={uidValidation} helperText={uidValidationMessage} margin="normal" label="UID" value={uid} onChange={handleUidChange} fullWidth />
                            <TextField error={vendorValidation} helperText={vendorValidationMessage} label="Vendor" value={vendor} onChange={handleVendorChange} fullWidth />
                            <FormControl fullWidth>
                                <InputLabel id="Status">Status</InputLabel>
                                <Select
                                    labelId="status"
                                    id="status"
                                    value={status}
                                    label="Status"
                                    onChange={handleStatusChange}
                                >
                                    <MenuItem value="online">Online</MenuItem>
                                    <MenuItem value="offline">Offline</MenuItem>
                                </Select>
                            </FormControl>
                            <Button type='submit' variant="contained" endIcon={<SendIcon />}>
                                Submit
                            </Button>
                        </Stack>
                    </form>
                </DialogContent>
            </Dialog>
            <StatusMessage open={openStatusMessage} message={statusMessage} onClose={handelStatusMessageOnClose} ></StatusMessage>
        </>
    );
}
export default AddOrEditDeviceDialog;