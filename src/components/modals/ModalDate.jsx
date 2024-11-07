import { useState } from 'react';
import { Modal } from "@mui/material";
import { getIcon } from '../../data/Icons';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100vh',
    bgcolor: '#FFFFFF',
    color: '#000000',
    textAlign: 'center',
    p: 25,
};


export default function BasicModal({ title, handleRespuesta }) {

    const [open, setOpen] = useState(true);
    const handleClose = () => setOpen(false);

    const date = new Date().toISOString();
    const date_current = date.split('T')[0]


    const [periodoInicial, setPeriodoInicial] = useState('');
    const [periodoFinal, setPeriodoFinal] = useState('');

    const handleAccept = () => {
        if ([periodoInicial, periodoFinal].includes('')) return alert('Las fechas son obligatorias')
        const data = {
            periodoInicial, periodoFinal
        }
        handleRespuesta(data);
    }

    const handleCancel = () => {
        setPeriodoInicial('');
        setPeriodoFinal('');
        handleRespuesta(null);
    }

    const handleWithoutFilter = () => {
        setPeriodoInicial('');
        setPeriodoFinal('');
        handleRespuesta({ withoutFilter: true })
    }

    return (
        <div className='border-0'>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div style={style}>
                    <div className='h-full items-center flex justify-center'>
                        <div className="w-6/12 bg-gray-300 py-6 px-10 rounded-md shadow-md shadow-slate-700">
                            {getIcon('InfoIcon', { fontSize: '60px', color: 'blue', marginBottom: '10px' })}
                            <div className="w-full h-1 opacity-75 mb-4 border-2 border-green-700 border-dashed"></div>
                            <h1 className="text-lg text-black-500 font-serif mb-2" > {title} </h1>
                            <div className='mt-4 flex flex-col justify-center gap-3'>
                                <div className='flex flex-col items-center justify-center gap-1'>
                                    <p className="text-base font-semibold">Periodo Inicial</p>
                                    <input max={date_current} type="date" className="py-1 rounded-md px-10"
                                        onChange={e => setPeriodoInicial(e.target.value)}
                                    />
                                </div>
                                <div className='flex flex-col items-center justify-center gap-1'>
                                    <p className="text-base font-semibold">Periodo Final</p>
                                    <input max={date_current} type="date" className="py-1 rounded-md px-10"
                                        onChange={e => setPeriodoFinal(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-center gap-4 items-center mt-6">
                                    <button className="bg-red-600 py-1 px-4 mt-1 rounded-md flex items-center justify-center gap-2 hover:bg-red-500 font-semibold" onClick={handleCancel}>
                                        {getIcon('CloseIcon', { color: 'white' })}
                                        Cancelar
                                    </button>
                                    <button className="bg-yellow-600 py-1 px-4 mt-1 rounded-md flex items-center justify-center gap-2 hover:bg-yellow-500 font-semibold" onClick={handleWithoutFilter}>
                                        {getIcon('CloseIcon', { color: 'white' })}
                                        Seguir sin filtro
                                    </button>
                                    <button className="bg-green-600 py-1 px-4 mt-1 rounded-md flex items-center justify-center gap-2 hover:bg-green-500 font-semibold" onClick={handleAccept}>
                                        {getIcon('CheckCircleIcon', { color: 'white' })}
                                        Aceptar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}