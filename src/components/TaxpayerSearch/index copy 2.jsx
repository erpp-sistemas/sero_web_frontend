import { FormControlLabel, Switch, textFieldClasses } from "@mui/material";
import adeudosPrueba from "./components/Custom/adeudos";
import { contribuyente as contribuyentePrueba } from "./components/Custom/contribuyente";
import { domicilio } from "./components/Custom/domicilios";
import fotosTomadasPrueba from "./components/Custom/fotos.tomadas";
import pagosPrueba from "./components/Custom/pagos";
import FormularioBuscarContribuyente from "./components/FormularioBuscarContribuyente";
import Navegacion from "./components/Navegacion.jsx";
import { useEffect, useState } from "react";
import FormularioDatosFaltantes from "./components/FormularioDatosFaltantes";
import { ROL_VISIBILIDAD_FORMULARIO } from "./components/Custom/roles";
import FormularioSubirImagen from "./components/FormularioSubirImagen";
import datosPrueba from "./components/Custom/datosPrueba";
import useStore from "./components/store/useStore.";
import DialogOpenButton from "./components/FormularioSubirImagen/DialogOpenButton";
import axios from "axios";

const coordenadas = [-71.098326, 42.345573];

const formFields = [
  { name: "nombre", label: "Nombre", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "mensaje", label: "Mensaje", type: "textarea" },
];
const columnNames = [
  "cuenta",
  "clave_catastral",
  "propietario",
  "calle",
  "colonia",
  "latitud",
  "longitud",
  "tipo_de_servicio",
  "tipo_tarifa",
  "giro",
  "serie_medidor",
  "servicio",
  "recibo",
  "descripcion",
  "tipo_pago",
  "periodo",
  "año_inicio",
  "bimestre_inicio",
  "año_fin",
  "bimestre_fin",
  "promocion",
  "deuda",
  "fecha de pago",
  "total_pagado",
  "% pagado",
  "% descuento",
  "$ descuento",
  "gestor",
  "tarea_gestionada",
  "fecha_de_gestion",
  "tipo de gestion",
  "tabla_gestion",
  "estatus_predio",
  "estatus de gestion valida",
  "estatus en nuestra cartera",
  "estatus de la cuenta",
  "bimestre_valido",
  "foto fachada predio",
  "urlImagenFachada",
  "foto evidencia predio",
  "urlImagenEvidencia",
];
const index = ({ params, setNuevosDatos }) => {
  const store = useStore();

  console.log(store.specificAccount);

  // const [plaza, setPlaza] = useState("Naucalpan" /* "Cuatitlan"*/)
  // const [servicio, setServicio] = useState("");
  // const [rol, setRol] = useState('Gestor' /*|| 'Coordinador'*/)
  // const [cuenta, setcuenta] = useState();
  // const [sevicio, setSevicio] = useState()
  // const [esRolSuperior, setEsRolSuperior] = useState(false);
  // const [datosFaltantes, setDatosFaltantes] = useState([]);
  // const [coordenadas, setCoordenadas] = useState(datosPrueba.coordenadas)
  // const [contribuyente, setContribuyente] = useState(datosPrueba.contribuyente)
  // const [domicilio, setDomicilio] = useState(datosPrueba.domicilio)
  // const [adeudo, setAdeudo] = useState(datosPrueba.adeudo);
  // const [pagos, setPagos] = useState(datosPrueba.pagos)
  // const [fotosTomadas, setFotosTomadas] = useState(datosPrueba.fotosTomadas)
  // const [data, setData] = useState();

  // const store = useStore();

  const handleProcessData = (data) => {
    const {} = data;
    // data.map();
    Object.keys((key) => {
      console.log({ key });
    });
  };
  useEffect(() => {
    const newData = params?.slice(-1).pop();
    // if (params?.[0] === newData) return;
    const row = newData?.row;

    let specificAccountIndexes = {
      userProfileContributor: { index: [] },
      debtInfoContributor: { index: [] },
      paymentInfoContributor: { index: [] },
      dateCaptureInfoContributor: { index: [] },
      imageUrlInfoContributor: { index: [] },
    };

    const keyMapping = {
      account: "userProfileContributor",
      debt_amount: "debtInfoContributor",
      reference: "paymentInfoContributor",
      date_capture: "dateCaptureInfoContributor",
      image_url: "imageUrlInfoContributor",
    };

    if (store.specificAccount) {
      store.specificAccount.forEach((el, i) => {
        for (const key in el) {
          const prop = keyMapping[key];
          if (prop !== undefined) {
            specificAccountIndexes[prop].index.push(i);
          }
        }
      });
    }
    console.log(specificAccountIndexes);
    const userProfileContributor = store.specificAccount[0];
    /* console.log(store.specificAccount[specificAccountIndexes.paymentInfoContributor.index]); */

    if (!userProfileContributor) return;

    let data = {
      /* Datos Anteriores */
      /* cuenta: userProfileContributor?.["account"],
      clave_catastral: row?.["clave_catastral"],
      propietario: userProfileContributor?.["owner_name"],
      calle: userProfileContributor?.["street"],
      colonia: userProfileContributor?.["cologne"],
      latitud: row?.["latitud"],
      longitud: row?.["longitud"],
      tipo_de_servicio: userProfileContributor?.["type_service"],
      tipo_tarifa: row?.["tipo_tarifa"],
      giro: row?.["giro"],
      serie_medidor: row?.["serie_medidor"],
      servicio: row?.["servicio"],
      recibo: row?.["recibo"],
      descripcion: row?.["descripcion"],
      tipo_pago: row?.["tipo_pago"],
      periodo: row?.["periodo"],
      año_inicio: row?.["año_inicio"],
      bimestre_inicio: row?.["bimestre_inicio"],
      año_fin: row?.["año_fin"],
      bimestre_fin: row?.["bimestre_fin"],
      promocion: row?.["promocion"],
      deuda: row?.["deuda"],
      "fecha de pago": row?.["fecha de pago"],
      total_pagado: row?.["total_pagado"],
      "% pagado": row?.["% pagado"],
      "% descuento": row?.["% descuento"],
      "$ descuento": row?.["$ descuento"],
      gestor: row?.["gestor"],
      tarea_gestionada: row?.["tarea_gestionada"],
      fecha_de_gestion: row?.["fecha_de_gestion"],
      "tipo de gestion": row?.["tipo de gestion"],
      tabla_gestion: row?.["tabla_gestion"],
      estatus_predio: row?.["estatus_predio"],
      "estatus de gestion valida": row?.["estatus de gestion valida"],
      "estatus en nuestra cartera": row?.["estatus en nuestra cartera"],
      "estatus de la cuenta": row?.["estatus de la cuenta"],
      bimestre_valido: row?.["bimestre_valido"],
      "foto fachada predio": row?.["foto fachada predio"],
      urlImagenFachada: row?.["urlImagenFachada"],
      "foto evidencia predio": row?.["foto evidencia predio"],
      urlImagenEvidencia: row?.["urlImagenEvidencia"], */
      /* Datos nuevos  */

      accountNumber: userProfileContributor?.["account"],
      ownerName: userProfileContributor?.["owner_name"],
      typeService: userProfileContributor?.["type_service"],
      rateType: userProfileContributor?.["rate_type"],
      turn: userProfileContributor?.["turn"],
      meterSeries: userProfileContributor?.["meter_series"],
      street: userProfileContributor?.["street"],
      outdoorNumber: userProfileContributor?.["outdoor_number"],
      interiorNumber: userProfileContributor?.["interior_number"],
      cologne: userProfileContributor?.["cologne"],
      square: userProfileContributor?.["square"],
      allotment: userProfileContributor?.["allotment"],
      betweenStreet1: userProfileContributor?.["between_street_1"],
      betweenStreet2: userProfileContributor?.["between_street_2"],
      reference: userProfileContributor?.["reference"],
      town: userProfileContributor?.["town"],
      postalCode: userProfileContributor?.["poastal_code"],
      /* Datos de pagos  */

      /* reference: "",
      description: "DERECHOS DE AGUA POTABLE REZAGO",
      amount_paid: 2137.88,
      payment_date: "2023-10-26T10:28:50.000Z",
      payment_period: "02-2023-02-2023", */
    };

    if (specificAccountIndexes.paymentInfoContributor.index.length > 1) {
      specificAccountIndexes.paymentInfoContributor.index
        .slice(1)
        .forEach((iteration) => {
          console.log(store.specificAccount[iteration]);
          for (const key in store.specificAccount[iteration]) {
            data = {
              ...data,
              [`${key}_${iteration}`]: store.specificAccount?.[iteration][key],
            };
          }
        });
    }
     if(specificAccountIndexes.debtInfoContributor.index.length > 1){
      specificAccountIndexes.debtInfoContributor.index.forEach((iteration,index)=>{
       
        for (const key in store.specificAccount[iteration]) {
          data = {
            ...data,
            [`${key}_${index+1}`]: store.specificAccount?.[iteration][key],
          };
        }

      })

    }

    if(specificAccountIndexes.debtInfoContributor.index.length > 1){
      specificAccountIndexes.debtInfoContributor.index.forEach((iteration,index)=>{
       
        for (const key in store.specificAccount[iteration]) {
          data = {
            ...data,
            [`${key}_${index+1}`]: store.specificAccount?.[iteration][key],
          };
        }

      })

    }
    if(specificAccountIndexes.dateCaptureInfoContributor.index.length > 1){
      specificAccountIndexes.dateCaptureInfoContributor.index.forEach((iteration,index)=>{
       
        for (const key in store.specificAccount[iteration]) {
          data = {
            ...data,
            [`${key}_${index+1}`]: store.specificAccount?.[iteration][key],
          };
        }

      })

    }else {

    }
     if(specificAccountIndexes.imageUrlInfoContributor.index.length > 1){
      specificAccountIndexes.imageUrlInfoContributor.index.forEach((iteration,index)=>{
       
        for (const key in store.specificAccount[iteration]) {
          data = {
            ...data,
            [`${key}_${index+1}`]: store.specificAccount?.[iteration][key],
          };
        }

      })

    }

    console.log(data);
    store.setData(row);
    store.setServicio(data?.servicio);
    console.log({ newData });
    console.log({ data });
    // console.log({ params, asd: newData });
    //* Longitud, Latitud
    console.log(store.specificAccount[0].longitude);
    console.log(store.specificAccount[0].latitude);
    const nuevasCoordenadas = [
      store.specificAccount[0].longitude,
      store.specificAccount[0].latitude,
    ];

    console.log({ nuevasCoordenadas });
    store.setCoordenadas(nuevasCoordenadas);
    //* Cuenta
    store.setContribuyente({
      /* Datos anteriores */
      /* Cuenta: data?.cuenta,
      "Clave Catastral": "",
      Propietario: data?.propietario,
      "Tipo de Servicio": data?.tipo_de_servicio,
      "Tipo de Tarifa": "",
      Giro: "",
      "Serie del medidor": data?.serie_medidor,
      Servicio: data?.servicio,
      Domicilio: "", */
      //?Datos nuevos del contribuyente

      Cuenta: data?.accountNumber,
      Propietario: data?.ownerName,
      TipoServicio: data?.typeService,
      TipoTarifa: data?.rateType,
      Turno: data?.turn,
      SerieMedidor: data?.meterSeries,
    });

    store.setDomicilio({
      /* Datos anteriores */
      /* Calle: data?.cuenta,
      "Numero Exterior": 222,
      "Numero Interior": 10,
      Colonia: "Colonia E",
      Poblacion: "Ciudad E",
      "Codigo Postal": "54321",
      Manzana: "M5",
      Lote: "L5",
      "Entre Calle 1": "Entre Calle Z",
      "Entre Calle 2": "Entre Calle V",
      Referencia: data?.calle, */
      //?Datos nuevos
      Calle: data?.street,
      NumeroExterior: data?.outdoorNumber,
      NumeroInterior: data?.interiorNumber,
      Colonia: data?.cologne,
      Manzana: data?.square,
      Lote: data?.allotment,
      EntreCalle1: data?.betweenStreet1,
      EntreCalle2: data?.betweenStreet2,
      Referencia: data?.reference,
      Poblacion: data?.town,
      CodigoPostal: data?.postalCode,
    });
    const arrayDebts = []
    
    for (
      let i = 1;
      i <= specificAccountIndexes.debtInfoContributor.index.length;
      i++
    ) {
      console.log(i);
      const debt = {
        debtAmount: data?.[`debt_amount_${i}`],
        lastPaymentDate: data?.[`last_payment_date_${i}`],
        updateDate: data?.[`update_date_${i}`],
        cutoffDate: data?.[`cutoff_date_${i}`],
        lasTwoMonthPayment: data?.[`last_two_month_payment_${i}`],
      };

      console.log(debt);

      arrayDebts.push(debt);
    }

    store.setAdeudos(arrayDebts);
 
    const arrayPayments = [];

    for (
      let i = 1;
      i <= specificAccountIndexes.paymentInfoContributor.index.length;
      i++
    ) {
      const payment = {
        referencia: data?.[`reference_${i}`],
        fechaDePago: data?.[`payment_date_${i}`],
        descripcion: data?.[`description_${i}`],
        montoPagado: data?.[`amount_paid_${i}`],
      };

      arrayPayments.push(payment);
    }

    store.setPagos(arrayPayments);


    const arrayAccions = []

    for (
      let i = 1;
      i <= specificAccountIndexes.dateCaptureInfoContributor.index.length;
      i++
    ) {
      const accions = {
        dateCapture: data?.[`date_capture_${i}`],
        taskDone: data?.[`task_done_${i}`],
        personWhoCapture: data?.[`person_who_capture_${i}`]
      };

      arrayAccions.push(accions);
    }

    store.setAccions(arrayAccions)

    const arrayPhotos = []

    for (
      let i = 1;
      i <= specificAccountIndexes.dateCaptureInfoContributor.index.length;
      i++
    ) {
      const photo = {
        imageUrl: data?.[`image_url_${i}`],
        imageType: data?.[`image_type_${i}`],
        dateCapture: data?.[`date_capture_${i}`],
        taskDone: data?.[`task_done_${i}`],
        personWhoCapture: data?.[`person_who_capture_${i}`],
        synchronizationDate: data?.[`syncronization_date_${i}`],
      };

      arrayPhotos.push(photo);
    }

    store.setFotos(arrayPhotos)

    







  
    /* store.setPagos([
      { referencia:data?.reference_1,
        fechaDePago: data?.payment_date_1,
        descripcion: data?.description_1,
        montoPagado: data?.amount_paid_1,
      },{ referencia:data?.reference_2,
        fechaDePago: data?.payment_date_2,
        descripcion: data?.description_2,
        montoPagado: data?.amount_paid_2,
      }
    ]); */
    const getIsValidValue = (value) => value || value != "NULL";

    const clavesInvalidas = [];

    /*  for (const [clave, valor] of Object.entries(params)) {
      const isValid = getIsValidValue(valor);
      if (isValid) continue;
      clavesInvalidas.push(clave);
    };
    for (const columnName of columnNames) {
      const valor = data?.[columnName];
      const clave = columnName;

      if (valor && getIsValidValue(valor)) continue;

      clavesInvalidas.push(clave);
    } */

    console.log({ datosFaltantes: clavesInvalidas });
    store.setDatosFaltantes(clavesInvalidas);
  }, [params?.[0], store.specificAccount]);

  if (
    !(
      store.contribuyente &&
      store.domicilio &&
      store.adeudos &&
      store.datosFaltantes
    )
  )
    return;

  return (
    <div
      className="contenedor-busqueda-contribuyente"
      style={{ position: "initial" }}
    >
      {JSON.stringify(store.data?.row)}
      {/* <FormularioDatosFaltantes formFields={
        datosFaltantes?.map(dato => ({
          name: dato,
          label: dato.replace(/[-_]/g, ' '),
          type: "text"
        }))} /> */}
      {/* <FormControlLabel
        control={
          <Switch
            checked={store.esRolSuperior}
            onChange={() => {
              const { esRolSuperior } = store;
              const esSuperior = !esRolSuperior;
              store.setEsRolSuperior(esSuperior);
              const nuevoRol = esSuperior
                ? ROL_VISIBILIDAD_FORMULARIO
                : "Gestor";
              store.setRol(nuevoRol);
            }}
            name="gilad"
          />
        }
        label="Es coordinador"
      /> */}
      <FormularioBuscarContribuyente
        plaza={store.plaza}
        setPlaza={({ index, text }) => store.setPlaza(text)}
        cuenta={store.cuenta}
        setCuenta={({ index, text }) => store.setCuenta(text)}
        servicio={store.servicio}
        setServicio={({ index, text }) => {
          // setContribuyente((state) => ({ ...state, Servicio: text }));
          store.setServicio(text);
        }}
      />
      <Navegacion
        coordenadas={store.coordenadas}
        contribuyente={store.contribuyente}
        domicilio={store.domicilio}
        adeudos={store.adeudos}
        acciones={store.accions}
        pagos={store.pagos}
        plaza={store.plaza}
        fotos={store.fotos}
        rol={store.rol}
        datosFaltantes={{
          campos: store.datosFaltantes,
          setNuevosCampos: (newPartialData) => {
            const newData = { ...data, ...newPartialData };
            console.log({ row: data.row });
            store.setData(newData);
            if (setNuevosDatos) setNuevosDatos(newData);
          },
        }}
      ></Navegacion>
      <FormularioSubirImagen
        onOpenDialog={(onOpenDialog) => (
          <DialogOpenButton openDialog={onOpenDialog} />
        )}
      />
    </div>
  );
};

const TaxPayerSearch = index;
export default TaxPayerSearch;
