import React from 'react';

const Counter = ({ total, completed, pending }) => {
    return (
        <div className="counter">
            <h3>Total Registros: {total}</h3>
            <h3>Realizados: {completed}</h3>
            <h3>Faltantes: {pending}</h3>
        </div>
    );
};

export default Counter;