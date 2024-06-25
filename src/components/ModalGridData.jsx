import { useState, useEffect } from 'react'
import { Box, Button, useTheme, Modal, Typography, IconButton } from '@mui/material';
import { tokens } from "../theme";
import { DataGrid } from "@mui/x-data-grid";



import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import EditIcon from '@mui/icons-material/Edit';
import FaceIcon from '@mui/icons-material/Face';
import QrCodeIcon from '@mui/icons-material/QrCode';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import BlurLinearIcon from '@mui/icons-material/BlurLinear';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '84%',
    height: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 4,
    px: 4,
    pb: 4,
    borderRadius: '10px'
};


const ModalGridData = ({ setShowModal }) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [usuarios, setUsuarios] = useState([])

    const [open, setOpen] = useState(true);


    // useEffect(() => {
    //     getAllUsers()
    // }, [])

    const handleClose = () => {
        setOpen(false);
        setShowModal(false)
    };



    const getAllUsers = async () => {

        getData('users', '').then(data => {
            setUsuarios(data)
        })

    }


    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >

            </Modal>
        </div>
    )
}

export default ModalGridData