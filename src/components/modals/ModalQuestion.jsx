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
                        <div className="w-5/12 bg-neutral-100 p-10 rounded-md shadow-2x">
                            {getIcon('HelpIcon', {fontSize: '36px', color: 'green', marginBottom: '10px'})}
                            <h1 className="text-lg text-black-500 font-serif" > {title} </h1>
                            <div className='flex justify-center gap-3'>
                                <button className='w-20 bg-green-600 p-2 rounded-md mt-3 ' onClick={() => handleRespuesta(true)}>Si</button>
                                <button className='w-20 bg-red-600 p-2 rounded-md mt-3' onClick={() => handleRespuesta(false)}>No</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}