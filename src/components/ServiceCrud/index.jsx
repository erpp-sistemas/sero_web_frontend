import React from 'react'
import Container from '../Container'
import DataGridServiceCrud from './components/DataGridServiceCrud'

/**
 * componente para administrar servicios .
 *
 * @component
 * @return {JSX.Element} componente ServiceCrud
 */

function ServiceCrud() {
  
  return (
    <Container>
        <DataGridServiceCrud/>
    </Container>
  )
}

export default ServiceCrud