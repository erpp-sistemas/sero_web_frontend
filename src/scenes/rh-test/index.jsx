import { useState } from 'react';
import { getIcon } from '../../data/Icons';

// COMPONENTS
import PersonalDataForm from '../../components/test-zavic/PersonalData';
import TestZavic from '../../components/test-zavic/Test';
import ModalQuestion from '../../components/modals/ModalQuestion'


const RhTest = () => {

  const [showModalQuestion, setShowModalQuestion] = useState(false);
  const [showPersonalDataForm, setShowPersonalDataForm] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [infoUser, setInfoUser] = useState({});


  const handleRespInitTest = (res) => {
    setShowModalQuestion(false);
    if (res) {
      setShowPersonalDataForm(true);
    }
  }




  return (
    <div className="w-9/12 min-h-screen mx-auto p-4 font-sans">

      {showModalQuestion && <ModalQuestion title={'¿ Desea iniciar con el test ?'} handleRespuesta={handleRespInitTest} />}

      {/* <Modal data={data} /> */}
      <h1 className="text-3xl font-bold text-center mb-6">Test Zavic</h1>

      {!showPersonalDataForm && !showTest && (
        <div className='text-base'>
          <h2 className='text-lg'>
            El test Zavic es un instrumento psicométrico que se enfoca en determinar, evaluar y valorar intereses y valores de un individuo. Su finalidad es conocer el pensamiento, la relación y reacción del individuo a diferentes situaciones del ámbito laboral.
          </h2>

          <button className="bg-emerald-600 py-1 rounded-md mt-2 px-10 flex justify-center items-center gap-2 hover:bg-emerald-500 text-white" onClick={() => setShowModalQuestion(true)} >
            Crear test
            {getIcon('BackupTableIcon', { color: 'white' })}
          </button>
        </div>
      )}

      {showPersonalDataForm && !showTest && <PersonalDataForm data={{ setShowPersonalDataForm, setShowTest, setInfoUser }} />}

      {showTest && <TestZavic infoUser={infoUser} />}

    </div>
  );
}

export default RhTest