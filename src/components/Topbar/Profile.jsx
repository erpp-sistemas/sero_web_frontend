import { useState, useRef, useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { getIcon } from '../../data/Icons'
import { useSelector } from 'react-redux'
import Avatar from '@mui/material/Avatar'
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../../features/user/userSlice'
import { Box, Typography, useTheme } from '@mui/material'
import InputIcon from '@mui/icons-material/Input'

const Profile = () => {
    const user = useSelector((state) => state.user)
	const dispatch = useDispatch()
	const [profile, setProfile] = useState(false)
    const [anchorElUser, setAnchorElUser] = useState(null)
	const profileRef = useRef(null)
	const theme = useTheme()
	const isLightMode = theme.palette.mode === 'light'

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget)
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null)
    }

    const handleGoPerfil = () => {
        handleCloseUserMenu()
		setProfile(true)
    }

	const handleCerrarSesion = () => {
		localStorage.removeItem('token')
		Cookies.remove('token')
		dispatch(logoutUser())
		window.location.reload()
	}

	const handleClickOutside = (event) => {
        if (profileRef.current && !profileRef.current.contains(event.target)) {
            setProfile(false)
        }
    }

	useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])

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
                    <p>Cerrar sesión</p>
                </MenuItem>
            </Menu>

			<Box 
				ref={profileRef}
				sx={{
					width:{ xs:'85%', md:'300px' },
					height:'100%',
					position:'absolute',
					top:'0',
					right: profile ? '0%' : { xs:'-100%', md:'-50%' },
					zIndex:9999,
					background:isLightMode ? 'rgb(255, 255, 255, 0.95)' : 'rgb(23, 33, 47, 0.95)',
					padding:'20px 30px',
					display:'flex',
					justifyContent:'start',
					alignItems:'center',
					flexDirection:'column',
					transition: 'right 0.5s ease',
					border:'1px solid grey',
					borderRadius:'5px'
				}}
			>

				<Box sx={{ height:'auto', width:'100%', display:'flex', justifyContent:'start', alignItems:'center',}}>
					<InputIcon sx={{ fontSize:'30px', color:'red' }} onClick={() => setProfile(false)}/>
				</Box>

				<Box sx={{ mt:'40px', height:'auto', width:'100%', display:'flex', justifyContent:'center', alignItems:'center',}}>
					<Box sx={{ width:'180px', height:'180px', minWidth:'180px', minHeight:'180px', borderRadius:'50%', display:'flex', justifyContent:'center', alignItems:'center', overflow:'hidden', background:isLightMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', border:isLightMode ? '1px solid black' : false }}>
						<img src={user.photo} alt=""  width={'100%'} height={'100%'}/>
					</Box>
				</Box>

				<Box>
					<Typography sx={{ mt:'40px', width:'100%', textAlign:'center', fontSize:'20px' }}>{user.name}</Typography>
					<Typography sx={{ mt:'30px', width:'100%', textAlign:'center', fontSize:'20px' }}>{user.username}</Typography>
					<Typography sx={{ mt:'30px', width:'100%', textAlign:'center', fontSize:'20px' }}>{user.profile}</Typography>
					<Typography sx={{ mt:'30px', width:'100%', textAlign:'center', fontSize:'20px' }}>{user.birthdate}</Typography>
					<Typography sx={{ mt:'30px', width:'100%', textAlign:'center', fontSize:'20px' }}>{user.active ? 'Activo' : 'Desactivado'}</Typography>
				</Box>
			
			</Box>

        </>

    )

}

export default Profile