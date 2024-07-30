import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { getIcon } from '../../data/Icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar'

const Profile = () => {

    const navigation = useNavigate();
    const user = useSelector((state) => state.user);

    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleGoPerfil = () => {
        handleCloseUserMenu()
        navigation('/profile')
    }

    const handleCerrarSesion = () => {
        sessionStorage.removeItem('user_session')
        dispatch(setUser({ id: 0, nombre: '', apellido_paterno: '', apellido_materno: '', correo: '', usuario: '', sexo: '', id_rol: [], url_foto: '' }))
        navigation('/')
        window.location.reload()
    }


    return (
        <>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Foto usuario" src={user.photo} sx={{ width: '50px', height: '50px' }} />
            </IconButton>

            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                <MenuItem sx={{ width: '175px' }} key={1} onClick={handleGoPerfil}>
                    {getIcon('PersonIcon', { marginRight: '10px', color: '#00ff00' })}
                    <p>Perfil</p>
                </MenuItem>

                <MenuItem key={1} onClick={handleCerrarSesion}>
                    {getIcon('LogoutIcon', { marginRight: '10px', color: '#ff0000' })}
                    <p>Logout</p>
                </MenuItem>
            </Menu>
        </>
    )
}

export default Profile