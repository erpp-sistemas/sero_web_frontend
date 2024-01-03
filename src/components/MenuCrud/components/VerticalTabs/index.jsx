import { Box, Tab, Tabs, Typography } from '@mui/material';
import React from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import DataGridMenuCrud from '../DataGridMenuCrud';


function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div style={{height:"auto"}}
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ width:"850px",p:3 }}>
          {/*   <Typography>{children}</Typography> */}
     
    {children}

    
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }

function VerticalTabs() {

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  return (
    <Box
      sx={{ flexGrow: 1, display: 'flex', height: "auto" }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab  label="Menus" {...a11yProps(0)} icon={<MenuIcon/>} indicatorColor={"secondary"} textColor='secondary'/>
        <Tab label="SubMenus" {...a11yProps(1)} icon={<DragHandleIcon/>} indicatorColor={"secondary"} textColor='secondary'/>
       {/*  <Tab label="Item Three" {...a11yProps(2)} />
        <Tab label="Item Four" {...a11yProps(3)} />
        <Tab label="Item Five" {...a11yProps(4)} />
        <Tab label="Item Six" {...a11yProps(5)} />
        <Tab label="Item Seven" {...a11yProps(6)} /> */}
      </Tabs>
      <TabPanel value={value} index={0}>
  
       
   <Typography variant='button' gutterBottom sx={{color:"#9298E3"}}>
   Administraciòn de Menus
   </Typography>
   
   <DataGridMenuCrud/>
        
      </TabPanel>
      <TabPanel value={value} index={1}>
        Administraciòn de SubMenus
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      {/* <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Five
      </TabPanel>
      <TabPanel value={value} index={5}>
        Item Six
      </TabPanel>
      <TabPanel value={value} index={6}>
        Item Seven
      </TabPanel> */}
    </Box>
  )
}

export default VerticalTabs