
import { useState } from "react"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Box from "@mui/material/Box";
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
// import AddOrEeditGatewayDialog  ;
import AddOrEditDeviceDialog from "./store/features/gateways/AddOrEditDeviceDialog copy";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useGetAllDevicesQuery, useDeleteDeviceMutation } from "./store/features/api/apiSlice";
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
const initialGatewayValue = {
    name: '',
    serialNumber: '',
    ipAddress: ''
}

const Devices = () => {

    const { data: allDevicessData, isLoading, isSuccess, isError, error } = useGetAllDevicesQuery();
    const [deleteDevice] = useDeleteDeviceMutation();
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false)
    const [selectedDevice, setSelectedDevice] = useState({});

    const handleEditClick = (device: any) => {
        setSelectedDevice(device);
        setOpen(true);
        setIsEditing(true)
    };
    const handleAddClick = () => {
        setOpen(true);
        setSelectedDevice(initialGatewayValue)
        setIsEditing(false);
    };
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
        console.log(allDevicessData)
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
