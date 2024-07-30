import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import { useTheme } from '@mui/material/styles';
import { getIcon } from '../../data/Icons';
import { useSelector } from 'react-redux';
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';


const Apps = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigation = useNavigate()
    const user = useSelector((state) => state.user);

    const [anchorElApps, setAnchorElApps] = useState(null);

    const handleOpenAppsMenu = (event) => {
        setAnchorElApps(event.currentTarget);
    };

    const handleCloseAppsMenu = () => {
        setAnchorElApps(null);
    };

    const handleApps = (ruta) => {
        handleCloseAppsMenu()
        navigation(ruta)
    }


    return (
        <>
            <IconButton onClick={handleOpenAppsMenu} sx={{ width: '50px', height: '50px' }} >
                {getIcon('AppsIcon', {})}
            </IconButton>
            <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorElApps} anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElApps)}
                onClose={handleCloseAppsMenu}
            >
                <div className="w-[250px] flex justify-evenly items-center flex-wrap gap-[10px] p-[10px]" >

                    <div className='p-[5px] rounded-xl'>
                        <IconButton sx={{ backgroundColor: colors.blueAccent[600] }} onClick={() => handleApps('/')} >
                            {getIcon('HomeIcon', { fontSize: '30px' })}
                        </IconButton>
                    </div>

                    <div className='p-[5px] rounded-xl'>
                        <IconButton sx={{ backgroundColor: colors.blueAccent[600] }} onClick={() => handleApps('/map-list')} >
                            {getIcon('MapIcon', { fontSize: '30px' })}
                        </IconButton>
                    </div>


                    {/* <div className='p-[5px] rounded-xl'>
                        <IconButton sx={{ backgroundColor: colors.blueAccent[700] }} onClick={() => handleApps('/calendar')}>
                            {getIcon('CalendarMonthIcon', { fontSize: '30px' })}
                        </IconButton>
                    </div> */}
                    {/* <div className='p-[5px] rounded-xl'>
                        <IconButton sx={{ backgroundColor: colors.blueAccent[700] }}>
                            {getIcon('ContactsIcon', { fontSize: '30px' })}
                        </IconButton>
                    </div> */}


                    <div className='p-[5px] rounded-xl'>
                        <IconButton onClick={() => handleApps('/whatsapp')} sx={{ backgroundColor: colors.blueAccent[600] }}>
                            {getIcon('WhatsAppIcon', { fontSize: '30px' })}
                        </IconButton>
                    </div>

                </div>
            </Menu>
        </>
    )
}

export default Apps