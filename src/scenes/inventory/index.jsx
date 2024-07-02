import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import tool from '../../toolkit/toolkitInventario'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import RemoveIcon from '@mui/icons-material/Remove'

/**
 * @name PáginaPrincipalInventarios
 * @author Iván Sánchez
 * @component
*/
function Invetory() {
    const [tipos, setTipos] = useState([])
    const [selector, setSelector] = useState(0)
    const [filter, setFilter] = useState({ field: '', order: '' })
    const [rows	] = useState([
        ['Dato 1', 'Dato 2', 'Dato 3', 'Dato 4', 'Dato 5', 'Dato 6'],
        ['Dato 7', 'Dato 8', 'Dato 9', 'Dato 10', 'Dato 11', 'Dato 12']
    ])
    const [selectedRow, setSelectedRow] = useState(null)

    useEffect(() => {
        const getTypes = async () => {
            const data = await tool.getTiposProducto()
            setTipos(data)
        }
        getTypes()
    }, [])

    const handleFilterClick = (field) => {
        setFilter(prevFilter => {
            let newOrder = ''
            if (prevFilter.field === field) {
                newOrder = prevFilter.order === 'asc' ? 'desc' : prevFilter.order === 'desc' ? '' : 'asc'
            } else {
                newOrder = 'asc'
            }
            return { field, order: newOrder }
        })
    }

    const getSortedRows = () => {
        const { field, order } = filter
        if (!field || !order) return rows

        const fieldIndex = {
            'nombre': 0,
            'departamento': 1,
            'encargado': 2,
            'stock': 3,
            'valor': 4,
            'descripcion': 5
        }[field]

        return [...rows].sort((a, b) => {
            if (a[fieldIndex] < b[fieldIndex]) return order === 'asc' ? -1 : 1
            if (a[fieldIndex] > b[fieldIndex]) return order === 'asc' ? 1 : -1
            return 0
        })
    }

    const sortedRows = getSortedRows()

    return (
        <Box
            width={'100%'}
            padding={'10px'}
            minHeight='100vh'
            display={'flex'}
            justifyContent={'start'}
            alignItems={'center'}
            flexDirection={'column'}
        >
            <Typography width={'100%'} textAlign={'center'} fontSize={'34px'}>
                Inventario
            </Typography>

            <div className='inventory__buttons'>

				{tipos.length === 0 ? (

					<h1>No existe ningún tipo de producto</h1>

				) : (

					tipos.map((t, index) => 
						<button 
							key={index} 
							className={selector === t.id_tipo_producto ? 'inventory__buttons__individual_off' : 'inventory__buttons__individual'} 
							onClick={() => setSelector(selector === t.id_tipo_producto ? 0 : t.id_tipo_producto)}
						>
							{t.tipo}
						</button>
					)

				)}

            </div>

			<div className='inventory__utilities'>

				<div className='inventory__search'>
					<SearchIcon sx={{ fontSize: '30px', mr: '0.5rem' }} />
					<input type="text" className='inventory__search__input' />
				</div>

				<div className='inventory__new'>
					<button className='inventory__new__button'><AddIcon /> Agregar un producto</button>
				</div>

			</div>			

			<table className='inventory__table'>

				<thead>

					<tr className='inventory__table__tr'>
						<th className='inventory__table__th'>
							<button className='inventory__table__th__button' onClick={() => handleFilterClick('nombre')}>
								Nombre {filter.field === 'nombre' ? (filter.order === 'asc' ? <ArrowDropUpIcon /> : filter.order === 'desc' ? <ArrowDropDownIcon /> : <RemoveIcon sx={{ fontSize:'12px' }}/>) : <RemoveIcon sx={{ fontSize:'12px' }}/>}
							</button>
						</th>
						<th className='inventory__table__th'>
							<button className='inventory__table__th__button' onClick={() => handleFilterClick('departamento')}>
								Departamento {filter.field === 'departamento' ? (filter.order === 'asc' ? <ArrowDropUpIcon /> : filter.order === 'desc' ? <ArrowDropDownIcon /> : <RemoveIcon sx={{ fontSize:'12px' }}/>) : <RemoveIcon sx={{ fontSize:'12px' }}/>}
							</button>
						</th>
						<th className='inventory__table__th'>
							<button className='inventory__table__th__button' onClick={() => handleFilterClick('encargado')}>
								Encargado {filter.field === 'encargado' ? (filter.order === 'asc' ? <ArrowDropUpIcon /> : filter.order === 'desc' ? <ArrowDropDownIcon /> : <RemoveIcon sx={{ fontSize:'12px' }}/>) : <RemoveIcon sx={{ fontSize:'12px' }}/>}
							</button>
						</th>
						<th className='inventory__table__th'>
							<button className='inventory__table__th__button' onClick={() => handleFilterClick('stock')}>
								Stock {filter.field === 'stock' ? (filter.order === 'asc' ? <ArrowDropUpIcon /> : filter.order === 'desc' ? <ArrowDropDownIcon /> : <RemoveIcon sx={{ fontSize:'12px' }}/>) : <RemoveIcon sx={{ fontSize:'12px' }}/>}
							</button>
						</th>
						<th className='inventory__table__th'>
							<button className='inventory__table__th__button' onClick={() => handleFilterClick('valor')}>
								Valor {filter.field === 'valor' ? (filter.order === 'asc' ? <ArrowDropUpIcon /> : filter.order === 'desc' ? <ArrowDropDownIcon /> : <RemoveIcon sx={{ fontSize:'12px' }}/>) : <RemoveIcon sx={{ fontSize:'12px' }}/>}
							</button>
						</th>
						<th className='inventory__table__th'>
							<button className='inventory__table__th__button' onClick={() => handleFilterClick('descripcion')}>
								Descripción {filter.field === 'descripcion' ? (filter.order === 'asc' ? <ArrowDropUpIcon /> : filter.order === 'desc' ? <ArrowDropDownIcon /> : <RemoveIcon sx={{ fontSize:'12px' }}/>) : <RemoveIcon sx={{ fontSize:'12px' }}/>}
							</button>
						</th>
					</tr>

				</thead>

				<tbody>

					{sortedRows.map((row, rowIndex) => (
						<tr
							key={rowIndex}
							style={{ cursor: 'pointer', backgroundColor: selectedRow === rowIndex ? '#425f87' : 'transparent' }}
							onClick={() => setSelectedRow(rowIndex)}
						>
							{row.map((dato, cellIndex) => (
								<td key={cellIndex} className='inventory__table__td'>
									<p className='inventory__table__td__p'>{dato}</p>
								</td>
							))}
						</tr>
					))}

				</tbody>

			</table>
          
        </Box>
    )
}

export default Invetory