import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import React from "react";

import { Box } from "@mui/material";
import functionsCustom from "../../../../../helpers";
import useCombinedSlices from "../../../../../hooks/useCombinedSlices";

function DebtsSections() {
  const { debts } = useCombinedSlices();
  /* console.log("Esto es un gran comentario"); */
  console.log(debts);

  const buildColumns = ()=>{

    const columns =[
      {
        field: "debt_amount",
        renderHeader: () => (
          <strong style={{color:"#5EBFFF"}}>
            {"Deuda "}
         {/*    <span role="img" aria-label="gestor" style={{color:"#5EBFFF"}}>
              🧑
            </span> */}
          </strong>
        ),
        width: 150,
        editable: true,
        type:'string',
        valueGetter:({ value }) => {
          return value
          ? `$ ${functionsCustom.formatNumberWithCommas(value)}`
          : `$ 00.00`;
        }

      },

      {
        field: "last_payment_date",
        renderHeader: () => (
          <strong style={{color:"#5EBFFF"}}>
            {"Fecha Ultimo Pago "}
         {/*    <span role="img" aria-label="gestor" style={{color:"#5EBFFF"}}>
              🧑
            </span> */}
          </strong>
        ),
        width: 150,
        editable: true,
        type:'dateTime',
        valueGetter:({ value }) => {
          return new Date(value)
        }
     
        
      },
      {
        field: "update_date",
        renderHeader: () => (
          <strong style={{color:"#5EBFFF"}}>
            {"Fecha Actualizaciòn "}
         {/*    <span role="img" aria-label="gestor" style={{color:"#5EBFFF"}}>
              🧑
            </span> */}
          </strong>
        ),
        width: 150,
        editable: true,
        type:'dateTime',
        valueGetter:({ value }) => {
          return new Date(value)
        }
      },
     
      {
        field: "cutoff_date",
        renderHeader: () => (
          <strong style={{color:"#5EBFFF"}}>
            {"Fecha de Corte "}
         {/*    <span role="img" aria-label="gestor" style={{color:"#5EBFFF"}}>
              🧑
            </span> */}
          </strong>
        ),
        width: 150,
        editable: true,
        type:'dateTime',
        valueGetter:({ value }) => {
          return new Date(value)
        }
      },
      {
        field: "last_two_month_payment",
        renderHeader: () => (
          <strong style={{color:"#5EBFFF"}}>
            {"Pago Ultimo Bimestre"}
         {/*    <span role="img" aria-label="gestor" style={{color:"#5EBFFF"}}>
              🧑
            </span> */}
          </strong>
        ),
        width: 150,
        editable: true,
        type:'string',
        valueGetter:({ value }) => {
          return value?`$ ${value}.00`:`$ 00.00`
        }
      },

    ]

    return columns
  }


  
  /* const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
          field: 'debt_amount',
          headerName: 'Deuda',
          width: 150,
          editable: true,
        },
        {
          field: 'last_payment_date',
          headerName: 'Ultima Fecha de Pago',
          width: 150,
          editable: true,
        },
        {
          field: 'update_date',
          headerName: 'Fecha de Actualizacion',
          type: 'number',
          width: 110,
          editable: true,
        },
        {
            field: 'cutoff_date',
            headerName: 'Fecha de Corte',
            type: 'date',
            width: 110,
            editable: true,
          },
          {
            field: 'last_two_month_payment',
            headerName: 'Ultimos Pagos',
            type: 'number',
            width: 110,
            editable: true,
          },
         {
          field: 'payment_date',
          headerName: 'Fecha de Pago',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 160,
          valueGetter: (params) =>
            `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        }, 
      ]; */

   /* const rowsjkh = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35,cutoffDate:"" },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];  */
/*   const de = [];
  debts?.forEach((debtObject,index)=>{
    if (index===0) {
      for (const key in debtObject) {
      rows.push({key:debtObject[key]})
      }
      
    }
   
  })
   */
  const buildRows = ()=>{
    const rows = [];

    debts?.forEach((debtObject, index) => {
      // Verificar si todas las propiedades del objeto son undefined
      const allUndefined = Object.values(debtObject).every(value => value === undefined);
    
      if (debtObject && !allUndefined) {
       /*  console.log(debtObject); */
        debtObject = { ...debtObject, id: index + 1 };
        rows.push(debtObject);
      }
    });

    return rows
  }
  
  /* debts?.forEach((debtObject,index)=>{
    debtObject={...debtObject,id: index + 1}
    rows.push(debtObject)
   

  }) */
  

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton color="secondary" />
        <GridToolbarFilterButton color="secondary"/>
        <GridToolbarDensitySelector color="secondary"/>
        <GridToolbarExport color="secondary"/>
      </GridToolbarContainer>
    );
  }
 

  return (
    <Box  sx={{
      height: 300,
      width: "100%",
      "& .cold": {
        color: "red",
      },
      "& .payment": {
        color: "#17E85D",
      },
      "& .secondLetter": {
        color: "#ff9900",
      },
      "& .thirdLetter": {
        color: "#33cc33",
      },
      "& .fourthLetter": {
        color: "#ff0000",
      },
    }}>

    
    <DataGrid
    slots={{ toolbar: CustomToolbar }}
    localeText={{
      toolbarColumns: "Columnas",
      toolbarFilters: "Filtros",
      toolbarDensity: "Tamaño Celda",
      toolbarExport: "Exportar"
    }}
      color
      rows={buildRows()}
      columns={buildColumns()}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      pageSizeOptions={[5,10,30,50]}
      checkboxSelection
      disableRowSelectionOnClick
      getCellClassName={(params) => {
        if (
          params.value &&
          typeof params.value === "string" &&
          params.value.includes("$")
        ) {
          return "payment";
        }
      }}
    /></Box>
  );
}

export default DebtsSections;
