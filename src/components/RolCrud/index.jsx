
import React from 'react'
import Container from '../Container'
import DataGridRolCrud from './components/DataGridRolCrud'
/**
 * Componente que representa la funcionalidad CRUD para roles.
 * Este componente utiliza un contenedor para organizar su contenido.
 * 
 * @returns {JSX.Element} Elemento JSX que contiene la interfaz de usuario para la funcionalidad CRUD de roles.
 */
function RolCrud() {
  return (
    <Container>
        <DataGridRolCrud/>
    </Container>
  )
}

export default RolCrud