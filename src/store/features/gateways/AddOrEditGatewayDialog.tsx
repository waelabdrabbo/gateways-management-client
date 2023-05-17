import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { useUpdateGatewayMutation, useAddGatewayMutation, useGetAllDevicesQuery } from '../api/apiSlice';
import SendIcon from '@mui/icons-material/Send'
import Button from '@mui/material/Button';
import StatusMessage from '../StatusMessage';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

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
    gateway: {
        _id?: string
        name?: string;
        serialNumber?: string;
        ipAddress?: string;
        devices?: [];
    }
    isEditing: boolean;
    setIsEditing: (arg0: boolean) => void
}

const devicesNames = []
function AddOrEeditGatewayDialog({ open, gateway, isEditing, setIsEditing, onClose }: EditGatewayDialogProps) {
    const { data: allDevicesData, isLoading, isSuccess, isError, error } = useGetAllDevicesQuery();
    const [deviceName, setDeviceName] = useState<string[]>([]);
    const [devicesNames, setDevicesNames] = useState()
    const handleChange = (event: SelectChangeEvent<typeof deviceName>) => {
        const { target: { value } } = event;
        console.log('value', value)
        setSelectedDevices(
            typeof value === 'string' ? value.split(',') : value
        )
    };
    const [name, setName] = useState(gateway?.name);
    const [serialNumber, setSerialNumber] = useState(gateway?.serialNumber);
    const [ipAddress, setIpAddress] = useState(gateway?.ipAddress);
    const [devices, setDevices] = useState(gateway.devices);
    console.log(devices)
    const [statusMessage, setStatusMessage] = useState('')
    const [openStatusMessage, setOpenStatusMessage] = useState(false)
    const [updateGateway] = useUpdateGatewayMutation();
    const [addGateway] = useAddGatewayMutation();
    const [selectedDevices, setSelectedDevices] = useState()
    const updatedGateway = { _id: gateway._id, name, serialNumber, ipAddress, devices: selectedDevices }
    // Validation
    const [nameValidationMessage, setNameValidationMessage] = useState('')
    const [nameValidation, setNameValidation] = useState(false)
    const [iPAddressValidationMessage, setiPAddressValidationMessage] = useState('')
    const [iPAddressValidation, setIpAddressValidation] = useState(false)
    const [serialNumberValidationMessage, setSerialNumberValidationMessage] = useState('')
    const [serialNumberValidation, setSerialNumberValidation] = useState(false)

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
    }
    const handleNameChange = (event: any) => {
        setName(event.target.value);
    };
    const handleSerialNumberChange = (event: any) => {
        setSerialNumber(event.target.value);
    };
    const handleIpAddressChange = (event: any) => {
        setIpAddress(event.target.value);
    };

    const compareArrays = (array1: any[], array2: any[]): any[] => {
        if (!array1 || !array2) {
            return []; // or handle the error condition in a way that makes sense for your use case
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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            resetForm();
            if (isEditing) {
                await updateGateway(updatedGateway).unwrap();
                setStatusMessage('Gateway updated successfully');
            } else {
                await addGateway(updatedGateway).unwrap();
                setStatusMessage('Gateway added successfully');
                setIsEditing(false);
            }
            setOpenStatusMessage(true);
            onClose();
            resetForm();
        } catch (error: any) {
            resetForm();
            if (error.status === 400 || error.status) {
                const errors = error.data.error.errors;
                if (errors.name) {
                    setNameValidation(true);
                    setNameValidationMessage(errors.name.message);
                }
                if (errors.serialNumber) {
                    setSerialNumberValidation(true);
                    setSerialNumberValidationMessage(errors.serialNumber.message);
                }
                if (errors.ipAddress) {
                    setIpAddressValidation(true);
                    setiPAddressValidationMessage(errors.ipAddress.message);
                }
            } else {
                setStatusMessage('An unexpected error occurred');
            }
        }
    };

    const handleClose = () => {
        onClose()
        resetForm()
        setIsEditing(false)
    };
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
                            <FormControl sx={{ m: 1, width: 300 }}>

                                <InputLabel id="demo-multiple-chip-label">Devices</InputLabel>
                                <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
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