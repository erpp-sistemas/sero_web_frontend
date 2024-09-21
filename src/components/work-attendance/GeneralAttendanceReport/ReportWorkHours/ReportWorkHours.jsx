ReportWorkHours
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Avatar } from '@mui/material';
import Viewer from 'react-viewer';

const AttendanceHoursDataGrid = ({ rows }) => {
    const [columns, setColumns] = useState([]);
    useEffect(() => {
      const AvatarImage = ({ data }) => {
        const [visibleAvatar, setVisibleAvatar] = React.useState(false)
    
        return (
          <>
            <Avatar
              onClick={() => {
              setVisibleAvatar(true)
              }}
              alt="Remy Sharp"
              src={data}
            />
          
            <Viewer
              visible={visibleAvatar}
              onClose={() => {
              setVisibleAvatar(false)
              }}
              images={[{ src: data, alt: 'avatar' }]}          
            />
          </>
        )
    
      }
  
      if (rows && rows.length > 0) {
        const columnSet = new Set();
    
        reportWorkHoursData.forEach(item => {
          Object.keys(item).forEach(key => columnSet.add(key));
        });
    
        const filteredColumns = Array.from(columnSet).filter(key => key !== 'id_usuario');
    
        const dynamicColumns = filteredColumns.map(key => {
          if (key === 'usuario') {
            return {
              field: key,
              headerName: "NOMBRE",
              renderHeader: () => (
                <strong style={{ color: "#5EBFFF" }}>{"NOMBRE"}</strong>
              ),
              width: 210,
              editable: false,
            };
          }
          if (key === 'imagen_url') {
            return {
              field: key,
              headerName: "FOTO",
              renderHeader: () => (
                <strong style={{ color: "#5EBFFF" }}>{"FOTO"}</strong>
              ),
              width: 70,
              renderCell: (params) => <AvatarImage data={params.row.imagen_url} />,
            };
          }
          if (key === 'plaza') {
            return {
              field: key,
              headerName: "PLAZA",
              renderHeader: () => (
                <strong style={{ color: "#5EBFFF" }}>{"PLAZA"}</strong>
              ),
              width: 120,
            };
          }
          return {
            field: key,
            headerName: key,          
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{key}</strong>
            ),
            width: 80,
          };
        });
    
        setColumns(dynamicColumns);
        setRows(reportWorkHoursData);
      }
    }, [reportWorkHoursData]);

  return (
    <div style={{ height: 560, width: '100%', marginTop: '20px' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id_usuario}
      />
    </div>
  );
};

export default AttendanceHoursDataGrid;
