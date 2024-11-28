import { useState } from 'react';

// COMPONENTS
import ModalQuestion from '../modals/ModalQuestion';


const PersonalData = ( { data } ) => {

    const { setShowPersonalDataForm, setShowTest, setInfoUser } = data;

    const [showModalQuestion, setShowModalQuestion] = useState(false);
    const [name, setName] = useState('');
    const [schooling, setSchooling] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [checkTerms, setCheckTerms] = useState();


    const handleCancel = () => {
        setShowPersonalDataForm(false);
        setShowTest(false);
    }
    
    const handleResp = (res) => {
        setShowModalQuestion(false);
        if(res) handleCancel();
    }

    const handleContinue = (e) => {
        e.preventDefault();
        if([name, schooling, birthdate].includes('')) {
            return alert("Todos los campos son obligatorios")
        }
        if(checkTerms !== 'on') {
            return alert("Acepta los terminos y condiciones")
        }
        setInfoUser({ name, schooling, birthdate })
        setShowTest(true);
    }

    return (
        <>
        {showModalQuestion && <ModalQuestion title={'¿ Cancelar test ?, no se guardarán los cambios'} handleRespuesta={handleResp} />}
        <form className="max-w-sm mx-auto" onSubmit={handleContinue}>

            <div className="mb-5">

                <label for="name" className="block mb-2 text-sm font-medium ">* Nombre completo:</label>
                <input type="text" id="name" className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-white  dark:shadow-sm-light" placeholder="Ingrese su nombre completo" required onChange={e => setName(e.target.value)} />

                <label className="block mb-2 text-sm font-medium mt-3" htmlFor="escolaridad">* Escolaridad:</label>
                <select className='w-full p-2.5 rounded mb-2 bg-gray-700' name="escolaridad" id="escolaridad"
                onChange={ e => setSchooling(e.target.value)}>
                    <option value="none">Seleccione su escolaridad</option>
                    <option value="Primaria">Primaria</option>
                    <option value="Secundaria">Secundaria</option>
                    <option value="Preparatoria">Preparatoria</option>
                    <option value="Licenciatura">Licenciatura</option>
                    <option value="Postgrado">Postgrado</option>
                </select>

                <label for="fecha" className="block mb-2 text-sm font-medium">* Fecha nacimiento:</label>
                <input type="date" id="fecha" className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-white  dark:shadow-sm-light" required onChange={ e => setBirthdate(e.target.value)}/>

            </div>

            <div className="flex items-start mb-5">
                <div className="flex items-center h-5">
                    <input id="terms" type="checkbox" className="w-4 h-4 border rounded focus:ring-3 focus:ring-emerald-300 bg-gray-700 border-gray-600" required onChange={ e => setCheckTerms(e.target.value)} />
                </div>
                <label for="terms" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Acepto <a href="#" className="hover:underline ">terminos y condiciones</a></label>
            </div>

            <button type="button" className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 mr-4"
                onClick={() => setShowModalQuestion(true)}
            >
                Cancelar
            </button>
            <button type="submit" className="text-white bg-emerald-700 hover:bg-emerald-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800" >
                Continuar
            </button>
        </form>
        </>
    )
}

export default PersonalData