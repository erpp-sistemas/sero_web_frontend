import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React, { useState } from 'react'

const SelectHook = ({defaultValue,register,items,itemRender,labele,disabled}) => {
    const [valueState,setDefaultValue]=useState(defaultValue)
    
    const handelerChangeValue=(value)=>{
        console.log(value)
        setDefaultValue(value)
    }


  return (
    <FormControl fullWidth sx={{margin:"10px 0 0 0"}}>
         <InputLabel id="demo-simple-select-label">{labele}</InputLabel>
            <Select
                disabled={disabled}
                {...register(itemRender!="nombre"?itemRender:"plaza")}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
                value={valueState}
            label="Age"
            defaultChecked={1}
            onChange={(e)=>handelerChangeValue(e.target.value)}
            >
            {
                items.map(a=>(
                    <MenuItem key={a.id||a.id_plaza} value={a.id||a.id_plaza} >{a[itemRender]}</MenuItem>
                ))
            }
            </Select>
    </FormControl>
  )
}

export default SelectHook
