import { useState } from 'react';


// CONMPONENTS
import { getIcon } from '../../data/Icons';
import Chart from './Chart';

// DATA
import { questions } from './data';


const Test = ({ infoUser }) => {

    const [startTest, setStartTest] = useState(false);

    const [responses, setResponses] = useState({});
    const [results, setResults] = useState({});
    const [error, setError] = useState("");

    const handleInputChange = (questionId, optionKey, value) => {
        if (value < 1 || value > 4) {
            setError("Los valores deben estar entre 1 y 4.");
            return;
        }

        // Copiar las respuestas actuales para la pregunta
        const currentQuestionResponses = { ...responses[questionId], [optionKey]: Number(value) };

        // Validar que los valores sean únicos
        const values = Object.values(currentQuestionResponses);
        if (new Set(values).size !== values.length) {
            setError("No se permiten números repetidos en las respuestas de una misma pregunta.");
            return;
        }

        setError(""); // Limpiar errores si todo es válido
        setResponses((prev) => ({
            ...prev,
            [questionId]: currentQuestionResponses
        }));
    };

    const calculateResults = () => {
        const categorySums = {};

        // Sumar por categoría
        questions.forEach((question) => {
            const questionResponses = responses[question.id] || {};
            Object.keys(question.options).forEach((optionKey) => {
                const value = questionResponses[optionKey] || 0;
                const category = question.options[optionKey].category;
                categorySums[category] = (categorySums[category] || 0) + value;
            });
        });

        setResults(categorySums);
    };

    const dataForChart = Object.entries(results).map(([category, value]) => ({
        category,
        score: value
    }));


    return (
        <div className="mx-auto mb-4 text-lg">
            {!startTest && (
                <>
                    <h1>A continuacion usted encontrará una serie de situaciones que le van a sugerir 4 respuestas. Lea cada una de ellas cuidadosamente y registre en el cuadro de texto de la derecha  un numero de la siguiente manera </h1>
                    <div className="text-base mt-4 font-semibold mb-2 bg-gray-100 py-2 px-6 rounded-md text-gray-900">
                        <h3>El numero 4 cuando la respuesta sea mas importante</h3>
                        <h3>El numero 3 cuando le sea importante pero no tanto como la anterior</h3>
                        <h3>El numero 2 cuando la prefiera menos que las anteriores</h3>
                        <h3>El numero 1 cuando tenga menos importancia</h3>
                    </div>
                    <button className="bg-emerald-600 py-1 rounded-md mt-2 px-10 flex justify-center items-center gap-2 hover:bg-emerald-500 text-white"
                        onClick={e => setStartTest(true)}
                    >
                        Inicar
                        {getIcon('LineWeightIcon', { color: 'white' })}
                    </button>
                </>
            )}
            {startTest && (
                <>
                    <p className='font-semibold px-4 text-2xl mb-2'>{infoUser.name}</p>
                    <form className="w-full mx-auto shadow p-6 bg-gray-100 text-gray-900 rounded-md">
                        {questions.map((question) => (
                            <div key={question.id} className='mb-6'>
                                <h2 className='font-semibold'>{question.question}</h2>
                                {Object.entries(question.options).map(([key, option]) => (
                                    <div key={key} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                        <label className="mr-3"> <span className='font-semibold'> {key}) </span> {option.description}</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="4"
                                            value={(responses[question.id]?.[key] || "")}
                                            onChange={(e) => handleInputChange(question.id, key, e.target.value)}
                                            className='text-blue-700 rounded text-center px-2 font-semibold'
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                        <button type="button" onClick={calculateResults} className='mt-5 py-2.5 rounded-md bg-emerald-600 text-white px-10'>
                            Enviar Resultados
                        </button>
                    </form>
                    {Object.keys(results).length > 0 && (
                        // <div>
                        //     <h2>Resultados</h2>
                        //     <ul>
                        //         {Object.entries(results).map(([category, total]) => (
                        //             <li key={category}>
                        //                 {category}: {total}
                        //             </li>
                        //         ))}
                        //     </ul>
                        // </div>
                        <Chart  dataForChart={dataForChart} />
                    )}
                </>
            )}




        </div>

    )
}

export default Test