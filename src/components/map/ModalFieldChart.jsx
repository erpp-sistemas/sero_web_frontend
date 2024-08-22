import { useState, useEffect } from 'react'
import { Modal } from '@mui/material';

import { getIcon } from '../../data/Icons';




const ModalFieldChart = ({ setShowModal, fields, responseField }) => {


    //console.log(fields)
    const [open, setOpen] = useState(true);
    const [showFieldPlus, setShowFieldPlus] = useState(false);
    const [field, setField] = useState(fields[0]);
    const [option, setOption] = useState('1');
    const [fieldPlus, setFieldPlus] = useState('')


    const handleClose = () => {
        setOpen(false);
        setShowModal(false)
    };


    const handleOption = e => {
        const res = e.target.value;
        setOption(res)
        if (res === '2') {
            setShowFieldPlus(true)
        } else {
            setShowFieldPlus(false);
        }
    }

    const handleRes = (type) => {

        if(option === '2' && fieldPlus === '') {
            return alert("El campo de suma es obligatorio")
        }

        responseField(type, field, option, fieldPlus);
    }


    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <div className='w-[30%] p-4 bg-blue-50 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md shadow-lg shadow-slate-700'>
                    <h1 className='text-sm uppercase text-gray-900 font-bold mb-4'>Ingresa los datos para generar la gráfica</h1>
                    <label htmlFor="field" className="text-blue-900"> Selecciona el campo base </label>
                    <select className='py-1 w-full rounded-md text-gray-900 mb-3' name="field" id="field" onChange={e => setField(e.target.value)}>
                        <option value="---">---</option>
                        {fields.map(field => (
                            <option key={field} value={field}> {field} </option>
                        ))}
                    </select>
                    <label htmlFor="option" className="text-blue-900"> Selecciona el tipo </label>
                    <select className='py-1 w-full rounded-md text-gray-900' name="option" id="option" onChange={handleOption}>
                        <option value="---">---</option>
                        <option value="1">Conteo</option>
                        <option value="2">Suma</option>
                    </select>
                    {showFieldPlus && (
                        <div className='mt-3'>
                            <label htmlFor="field-plus" className="text-blue-900"> Selecciona el campo para sumar </label>
                            <select className='py-1 w-full rounded-md text-gray-900 mb-3' name="field-plus" id="field-plus" onChange={e => setFieldPlus(e.target.value)}>
                                <option value="---">---</option>
                                {fields.map(field => (
                                    <option key={field} value={field}> {field} </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <button className='py-1 px-3 bg-red-500 mt-3 rounded-md' onClick={() => handleRes(false)}>
                        Cancelar
                    </button>
                    <button className='py-1 px-3 bg-blue-500 mt-3 rounded-md ml-2' onClick={() => handleRes(true)}>
                        Aceptar
                    </button>
                </div>

            </Modal>
        </div>
    )
}

export default ModalFieldChart