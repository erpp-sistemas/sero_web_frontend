import React from 'react'
import Container from '../Container'
import DataGridProcess from './components/DataGridProcessCrud'

/**
 * Componente que representa la sección de CRUD (Crear, Leer, Actualizar, Eliminar) de la gestión de procesos.
 *
 * @component
 * @returns {JSX.Element} Componente ProcessCrud.
 */
function ProcessCrud() {
  return (
    <Container>
      <DataGridProcess/>
    </Container>
  )
}

export default ProcessCrud