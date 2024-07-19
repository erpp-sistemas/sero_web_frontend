import React from "react";
import Calendar from "../../components/ausencias-personal/Calendar";
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Checkbox, Divider, FormControl, Grid, InputAdornment, InputLabel, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";

import { Search } from "@mui/icons-material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import TodayIcon from '@mui/icons-material/Today';

const index = () => {
   return (
      <Box>
         <Grid container spacing={3} alignItems="center" mb={4} px={3}>
            <FormControl sx={{ margin: "auto 0 0 0", minWidth: 120, height: "100%" }} size="medium">
               <InputLabel id="demo-select-small-label">AREAS</InputLabel>
               <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  label="Age"
                  // onChange={(e)=>setAreaSelect(e.target.value)}
               >
                  <MenuItem value="all">
                     <div>Todas</div>
                  </MenuItem>
                  {/* {
         area.map(a=>(
            <MenuItem key={a.id} value={a.id}>{a.area}</MenuItem>
         ))
        } */}
               </Select>
            </FormControl>

            <Grid item xs={6}>
               <TextField
                  label="Buscar"
                  variant="outlined"
                  fullWidth
                  //   onChange={handleSearchChange}
                  placeholder="Ingresa lo que quieres buscar"
                  InputProps={{
                     startAdornment: (
                        <InputAdornment position="start">
                           <Search color="secondary" />
                        </InputAdornment>
                     ),
                  }}
                  sx={{
                     "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                           borderColor: "grey",
                        },
                        "&:hover fieldset": {
                           borderColor: "secondary.main",
                        },
                        "&.Mui-focused fieldset": {
                           borderColor: "secondary.main",
                        },
                     },
                  }}
               />
               {/* {filteredUsers.length === 0 && (
                  <Typography variant="body2" color="textSecondary">
                     No se encontraron resultados.
                  </Typography>
               )} */}
            </Grid>
         </Grid>
       
         <Grid container spacing={2}>
    
        {/*//------------------------------------START BodyPanel----------------------------------------- */}
            <Grid item xs={3} sx={{ backgroundColor: "background.paper" }}>
               <Accordion>
                  <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel2-content" id="panel2-header">
                     <Typography>Tipo Ausenscia</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                     <List dense sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
                        {[0, 1, 2, 3].map((value) => {
                           const labelId = `checkbox-list-secondary-label-${value}`;
                           return (
                              <ListItem
                                 key={value}
                                 secondaryAction={
                                    <Checkbox
                                       edge="start"
                                       // onChange={handleToggle(value)}
                                       // checked={checked.indexOf(value) !== -1}
                                       inputProps={{ "aria-labelledby": labelId }}
                                    />
                                 }
                                 disablePadding
                              >
                                 <ListItemButton>
                                   
                                    <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
                                 </ListItemButton>
                              </ListItem>
                           );
                        })}
                     </List>
                  </AccordionDetails>
               </Accordion>

               <Box mt={3} >
               <Divider textAlign="left" sx={{color:"#00ff00"}}  >Empleados</Divider>
                  <List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
                     {[0, 1, 2, 3].map((value) => {
                        const labelId = `checkbox-list-secondary-label-${value}`;
                        return (
                           <ListItem
                              key={value}
                              secondaryAction={
                               <>
                                 <Checkbox
                                    edge="end"
                                    // onChange={handleToggle(value)}
                                    // checked={checked.indexOf(value) !== -1}
                                    inputProps={{ "aria-labelledby": labelId }}
                                    defaultChecked
                                    color="secondary"
                                 />
                                    <Tooltip  title="Nuevo registro de ausencia">
                                    <Button color="info"  variant="contained" size="small" sx={{padding:"5px ",minWidth:"2px",margin:"0px 0px 0px 20px"}}>
                                        <TodayIcon/>
                                    </Button>
                                    </Tooltip>
                               </>
                              }
                              disablePadding
                           >
                              <ListItemButton>
                                 <ListItemAvatar>
                                    <Avatar alt={`Avatar n°${value + 1}`} src={`/static/images/avatar/${value + 1}.jpg`} />
                                 </ListItemAvatar>
                                 <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
                              </ListItemButton>
                           </ListItem>
                        );
                     })}
                  </List>
               </Box>
            </Grid>
        {/*//------------------------------------END BodyPanel----------------------------------------- */}
            <Grid item xs={9} sx={{}}>
               <Calendar />
            </Grid>
         </Grid>
      </Box>
   );
};

export default index;
