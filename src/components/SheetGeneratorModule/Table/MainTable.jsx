import { Table } from '@mui/material'
import React from 'react'
import BodyTable from './Components/BodyTable'
import FooterTable from './Components/FooterTable'
import HeadTable from './Components/HeadTable'

function MainTable() {
  return (
    <Table>
        <HeadTable/>
        <BodyTable/>
        <FooterTable/>
        

    </Table>
  )
}

export default MainTable