
import { useState } from "react"
import { Table, TableBody, Box, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddOrEditDeviceDialog from "../gateways/AddOrEditDeviceDialog copy";
import { useGetAllDevicesQuery, useDeleteDeviceMutation } from "../api/apiSlice";

const initialDeviceValue = {
    uid: '',
    vendor: '',
    status: 'online'
}

const Devices = () => {
    const { data: allDevicessData, isLoading, isSuccess } = useGetAllDevicesQuery();
    const [deleteDevice] = useDeleteDeviceMutation();
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false)
    const [selectedDevice, setSelectedDevice] = useState({});
    const handleEditClick = (device: any) => {
        setSelectedDevice(device);
        setOpen(true);
        setIsEditing(true)
    };
    // Open Dialog on add Device
    const handleAddClick = () => {
        setOpen(true);
        setSelectedDevice(initialDeviceValue)
        setIsEditing(false);
    };
    // Close Dialog
    const handleClose = () => {
        setOpen(false);
    };
    let content
    if (isLoading) {
        content = < TableRow >
            <TableCell component="th" scope="row">
                <span>Loading</span>
            </TableCell>
        </TableRow>
    }
    else if (isSuccess) {
        content = allDevicessData.map((device: any) => (
            < TableRow
                key={device.uid} >
                <TableCell component="th" scope="row">
                    {device.uid}
                </TableCell>
                <TableCell align="right">{device.status}</TableCell>
                <TableCell align="right">{device.vendor}</TableCell>
                <TableCell align="right">
                    {device.gateway?.name}
                </TableCell>
                <TableCell>
                    <Stack direction="row" justifyContent="flex-end">
                        <IconButton aria-label="delete" onClick={() => deleteDevice({ id: device._id })}>
                            <DeleteIcon />
                        </IconButton>
                        <IconButton aria-label="edit" onClick={() => handleEditClick(device)}>
                            <EditIcon />
                        </IconButton>
                    </Stack>
                </TableCell>
            </TableRow>
        )
        )
    }
    return (
        <>
            <Box mb={2} >
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Device UID</TableCell>
                                <TableCell align="right">Status</TableCell>
                                <TableCell align="right">Vendor</TableCell>
                                <TableCell align="right">Assigned Gateway</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {content}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button onClick={() => handleAddClick()} variant="contained" endIcon={<AddIcon />}>
                    Add Device
                </Button>
            </Stack >
            <AddOrEditDeviceDialog
                open={open}
                onClose={handleClose}
                device={selectedDevice}
                setIsEditing={setIsEditing}
                isEditing={isEditing}
            />
        </>
    )
}
export default Devices
