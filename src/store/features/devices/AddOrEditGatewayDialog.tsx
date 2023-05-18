import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, TextField, Stack, Button, Box, OutlinedInput, InputLabel, MenuItem, FormControl, FormHelperText, Select, Chip } from '@mui/material';
import { useUpdateGatewayMutation, useAddGatewayMutation, useGetAllDevicesQuery } from '../api/apiSlice';
import SendIcon from '@mui/icons-material/Send'
import StatusMessage from '../StatusMessage';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export interface EditGatewayDialogProps {
    open: boolean;
    onClose: () => void;
    isEditing: boolean;
    gateway: {
        _id?: string
        name?: string;
        serialNumber?: string;
        ipAddress?: string;
        devices?: any
        isEditing: boolean;
    }
    setIsEditing: (arg0: boolean) => void
}

const devicesNames = []
function AddOrEeditGatewayDialog({ open, gateway, isEditing, setIsEditing, onClose }: EditGatewayDialogProps) {
    const { data: allDevicesData, isLoading, isSuccess, isError, error } = useGetAllDevicesQuery();
    const [deviceName, setDeviceName] = useState<undefined | string[]>(undefined);
    const [devicesNames, setDevicesNames] = useState()
    const handleChange = (event: SelectChangeEvent<typeof deviceName>) => {
        const { target: { value } } = event;
        setSelectedDevices(
            Array.isArray(value) ? value : value?.split(',')
        )
    };
    const [name, setName] = useState(gateway?.name);
    const [serialNumber, setSerialNumber] = useState(gateway?.serialNumber);
    const [ipAddress, setIpAddress] = useState(gateway?.ipAddress);
    const [devices, setDevices] = useState(gateway?.devices);
    const [statusMessage, setStatusMessage] = useState('')
    const [openStatusMessage, setOpenStatusMessage] = useState(false)
    const [updateGateway] = useUpdateGatewayMutation();
    const [addGateway] = useAddGatewayMutation();
    const [selectedDevices, setSelectedDevices] = useState<undefined | string[]>(undefined)
    const updatedGateway = { _id: gateway._id, name, serialNumber, ipAddress, devices: selectedDevices }
    // Validation States
    const [nameValidationMessage, setNameValidationMessage] = useState('')
    const [nameValidation, setNameValidation] = useState(false)
    const [iPAddressValidationMessage, setiPAddressValidationMessage] = useState('')
    const [iPAddressValidation, setIpAddressValidation] = useState(false)
    const [serialNumberValidationMessage, setSerialNumberValidationMessage] = useState('')
    const [serialNumberValidation, setSerialNumberValidation] = useState(false)
    const [devicesValidationMessage, setDevicesValidationMessage] = useState('')
    const [devicesValidation, setDevicesValidation] = useState(false)

    // Reset Form Values
    const resetForm = () => {
        setName(gateway.name);
        setSerialNumber(gateway.serialNumber)
        setIpAddress(gateway.ipAddress)
        setSerialNumberValidation(false)
        setSerialNumberValidationMessage('')
        setNameValidation(false)
        setNameValidationMessage('')
        setIpAddressValidation(false)
        setiPAddressValidationMessage('')
        setSelectedDevices(selectedDevices)
    }

    // Handle Form Changes
    const handleNameChange = (event: any) => {
        setName(event.target.value);
    };
    const handleSerialNumberChange = (event: any) => {
        setSerialNumber(event.target.value);
    };
    const handleIpAddressChange = (event: any) => {
        setIpAddress(event.target.value);
    };

    // Compare Array Function used in devices drop down
    const compareArrays = (array1: any[], array2: any[]): any[] => {
        if (!array1 || !array2) {
            return [];
        }
        const selectedItems: any[] = [];
        array1.forEach(item1 => {
            array2.forEach(item2 => {
                if (item1 && item2 && item1._id === item2._id) {
                    selectedItems.push(item1);
                }
            });
        });

        return selectedItems;
    }
    
    // Sumbit Form Logic
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            if (isEditing) {
                await updateGateway(updatedGateway).unwrap()
                setStatusMessage('Gateway updated successfully');
            } else {
                await addGateway(updatedGateway).unwrap()
                setStatusMessage('Gateway added successfully');
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
                handleValidation('name', setNameValidation, setNameValidationMessage);
                handleValidation('serialNumber', setSerialNumberValidation, setSerialNumberValidationMessage);
                handleValidation('ipAddress', setIpAddressValidation, setiPAddressValidationMessage);
                handleValidation('devices', setDevicesValidation, setDevicesValidationMessage);
            } else {
                setStatusMessage('An unexpected error occurred');
            }
        };
    }
    // Close Dialog
    const handleClose = () => {
        onClose()
        resetForm()
        setIsEditing(false)
    };
    // Close Toaster
    const handelStatusMessageOnClose = () => {
        setOpenStatusMessage(false)
    }
    
    useEffect(() => {
        if (gateway != null) {
            setName(gateway.name || "");
            setSerialNumber(gateway.serialNumber || "");
            setIpAddress(gateway.ipAddress || "");
            setDevices(gateway.devices || [])
            const selectedItems = compareArrays(allDevicesData, gateway?.devices);
            setSelectedDevices(selectedItems)
            setDevicesNames(allDevicesData)
        }

    }, [gateway])

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Gateway Form</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <TextField error={nameValidation} helperText={nameValidationMessage} margin="normal" label="Name" value={name} onChange={handleNameChange} fullWidth />
                            <TextField error={serialNumberValidation} helperText={serialNumberValidationMessage} label="Serial Number" value={serialNumber} onChange={handleSerialNumberChange} fullWidth />
                            <TextField error={iPAddressValidation} helperText={iPAddressValidationMessage} label="IP Address" value={ipAddress} onChange={handleIpAddressChange} fullWidth />
                            <FormControl error={devicesValidation} sx={{ m: 1, width: 300 }}>
                                <InputLabel id="devices">Devices</InputLabel>
                                <Select
                                    labelId="devices"
                                    id="devices"
                                    multiple
                                    value={selectedDevices}
                                    onChange={handleChange}
                                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (

                                                <Chip key={value.uid} label={value.uid} />
                                            ))}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                >
                                    {devicesNames?.map((device: any) => (
                                        <MenuItem
                                            key={device.uid}
                                            value={device}
                                        >
                                            {device.uid}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{devicesValidationMessage}</FormHelperText>
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

export default AddOrEeditGatewayDialog;