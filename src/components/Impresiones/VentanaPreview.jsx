import {React, useMemo, useState}  from 'react';

import { Drawer,Button, Tooltip, Box } from '@mui/material';

import tool from '../../toolkit/toolkitFicha'


export default function VentanaPreview({ficha,plantilla}) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const htmlFormateado=useMemo(()=>{
    const apt=tool.formatearHtml(plantilla.plantilla_html,ficha)
    return apt
  },[ficha])
  

  return (
    <div>
      <Tooltip title="VISTA PREVIA DE FICHA" arrow>
         <Button onClick={toggleDrawer(true)} variant='contained' color='primary' disabled={!ficha&&true} sx={{height:"100%"}} >PREVIEW</Button>
      </Tooltip>

      <Drawer open={open} onClose={toggleDrawer(false)} anchor={"right"} sx={{width:"80%"}}>

        <Box  backgroundColor={"#fff"}>

          {  <Box sx={{backgroundColor:""}} dangerouslySetInnerHTML={{ __html: htmlFormateado }} />}

        </Box>

      </Drawer>
    </div>
  );
}
