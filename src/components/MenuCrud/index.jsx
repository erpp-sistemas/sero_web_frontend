
import React from 'react'
import DataGridMenuCrud from './components/DataGridMenuCrud'
import Container from '../Container'
import { Tab, Tabs } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import VerticalTabs from './components/VerticalTabs';
/**
 * Componente que representa la funcionalidad CRUD para menus.
 * Este componente utiliza un contenedor para organizar su contenido.
 * 
 * @returns {JSX.Element} Elemento JSX que contiene la interfaz de usuario para la funcionalidad CRUD de menus.
 */
function MenuCrud() {
  
  return (
    <Container>
      

       <VerticalTabs/>
    </Container>
  )
}

export default MenuCrud