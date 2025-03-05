import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Counter from './counter';
import ProgressColumn from './progressColumn';

const DataGridComponent = ({ rows, columns, totalRecords, completedRecords, pendingRecords }) => {
    return (
        <div className="data-grid-container">
            <Counter total={totalRecords} completed={completedRecords} pending={pendingRecords} />
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    checkboxSelection
                />
            </div>
        </div>
    );
};

export default DataGridComponent;