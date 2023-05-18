
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
import AddOrEeditGatewayDialog from "./AddOrEditGatewayDialog";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useDeleteGatewayMutation, useGetAllGatewaysQuery } from "../api/apiSlice";
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

const initialGatewayValue = {
    name: '',
    serialNumber: '',
    ipAddress: ''
}

const GatewaysRedux = () => {

    const { data: allGatewaysData, isLoading, isSuccess } = useGetAllGatewaysQuery();
    const [deleteGateway] = useDeleteGatewayMutation();
    const [open, setOpen] = useState(false);
    // const [addOrEdit, setAddOrEdit] = useState(false);
    const [isEditing, setIsEditing] = useState(false)
    const [selectedGateway, setSelectedGateway] = useState({});

    const handleEditClick = (gateway: any) => {
        setSelectedGateway(gateway);
        setOpen(true);
        setIsEditing(true)
    };
    const handleAddClick = () => {
        setOpen(true);
        setSelectedGateway(initialGatewayValue)
        setIsEditing(false);
    };
    const handleClose = () => {
        setOpen(false);
        // setAddOrEdit(false)
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
        content = allGatewaysData.map((gateway: any) => (
            < TableRow
                key={gateway._id} >
                <TableCell component="th" scope="row">
                    {gateway.name}
                </TableCell>
                <TableCell align="right">{gateway.serialNumber}</TableCell>
                <TableCell align="right">{gateway.ipAddress}</TableCell>
                <TableCell align="right">
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: "flex-end", gap: 0.5 }}>

                        {gateway.devices.map((device: any) => (
                            <Chip key={device.uid} label={device.uid} />
                        ))}
                    </Box>
                </TableCell>
                <TableCell>
                    <Stack direction="row" justifyContent="flex-end">
                        <IconButton aria-label="delete" onClick={() => deleteGateway({ id: gateway._id })}>
                            <DeleteIcon />
                        </IconButton>
                        <IconButton aria-label="edit" onClick={() => handleEditClick(gateway)}>
                            <EditIcon />
                        </IconButton>
                    </Stack>
                </TableCell>
            </TableRow >
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
                                <TableCell>Gateway Name</TableCell>
                                <TableCell align="right">Serial Number</TableCell>
                                <TableCell align="right">IP Address</TableCell>
                                <TableCell align="right">Devices</TableCell>
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
                    Add Gateway
                </Button>
            </Stack >
            <AddOrEeditGatewayDialog
                open={open}
                onClose={handleClose}
                gateway={selectedGateway}
                setIsEditing={setIsEditing}
                isEditing={isEditing}
            />
        </>
    )
}
export default GatewaysRedux
