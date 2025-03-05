import React from 'react';
import { LinearProgress, TableCell } from '@mui/material';

const ProgressColumn = ({ progress }) => {
    return (
        <TableCell>
            <LinearProgress variant="determinate" value={progress} />
            <span>{progress}%</span>
        </TableCell>
    );
};

export default ProgressColumn;