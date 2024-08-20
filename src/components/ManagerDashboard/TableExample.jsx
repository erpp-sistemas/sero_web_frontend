import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const data = [
    { name: 'Item 1', amount: 100, price: 200 },
    { name: 'Item 2', amount: 150, price: 250 },
    { name: 'Item 3', amount: 200, price: 300 },
];

const TableExample = () => {
    // Calcular las sumas de las columnas
    const totalAmount = data.reduce((sum, row) => sum + row.amount, 0);
    const totalPrice = data.reduce((sum, row) => sum + row.price, 0);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Price</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.amount}</TableCell>
                            <TableCell align="right">{row.price}</TableCell>
                        </TableRow>
                    ))}
                    {/* Fila de sumas */}
                    <TableRow>
                        <TableCell component="th" scope="row">
                            <strong>Total</strong>
                        </TableCell>
                        <TableCell align="right"><strong>{totalAmount}</strong></TableCell>
                        <TableCell align="right"><strong>{totalPrice}</strong></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableExample;
