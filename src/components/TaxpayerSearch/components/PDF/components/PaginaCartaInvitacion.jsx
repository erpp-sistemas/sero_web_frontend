// import './styles/PaginaCartaInvitacion.css'
import { FC, ReactNode } from "react";

const PaginaCartaInvitacion = () => {
  // const handleClick = () => {};
  return (
    <div className="PaginaCartaInvitacion">
      <div className="carta-invitacion-cabezera">
        <p>Organismo Publico Descentralizado para la Prestación de</p>
        <p>los Servicios do Agua Potable, Alcantarillado y Saneamiento do!</p>
        <p>Municipio do Naucalpan</p>
      </div>
      <img className="icon-naucalpan" src="Naucalpan.png" alt="" />

      <div>
        <h4 className="text">CARTA INVITACIÓN</h4>
        <h4 className="text">TERCERA</h4>

        <div className="Carta-invitacion-direccion">
          <p className="text">
            GUADALUPE BELTRAN ACOSTA Y/O REPRESENTANTE LEGAL Y/O; USUARIO DE LA
            TOMA; Y/O POSEEDOR DE INMUEBLE.
          </p>
          <p className="text">NUMERO DE CUENTA: 00000911-00 DERIVADA:</p>
          <p className="text">
            DOMICILIO: CALLE JUAN FERNANDEZ ALBARRAN AHUIZOTLA (SANTIAGO
            AHUIZOTLA) Naucalpan COLONIA:
          </p>
          <p className="text">
            MUNICIPIO DE NAUCALPAN DE JUAREZ, ESTADO DE MEXICO.
          </p>
          <p className="text">MEDIDOR: A15-6040071</p>
        </div>

        <div style={{ textAlign: "left" }}>
          <h3>PRESENTE:</h3>
          <p>
            El suscrito C. LUIS JONATHAN VIEYRA RAMIREZ, en mi carácter de
            Encargado de despacho de la Gerencia de Rezagos, Restricciones y
            Ejecución Fiscal del Organismo Público Descentralizado para la
            Prestación de Servicios de Agua Potable, Alcantarillado y
            Saneamiento del Municipio de Naucalpan, denominado “OAPAS
          </p>
          <p style={{ fontWeight: 700 }}>
            Se le comunica que ha hecho caso omiso a la SEGUNDA carta invitación
            que el “OAPAS”, les dejó en días pasados respecto del adeudo
            registrado por los servicios de agua potable, drenaje y
            alcantarillado que le son otorgados.
          </p>

          <p>
            Se le comunica que está obligado al pago de los servicios por los
            derechos de agua potable, drenaje y alcantarillado que presta el
            “OAPAS”, de acuerdo a su tarifa aplicable, lo cual debió de hacer
            dentro del plazo establecido conforme a los artículos 44 fracción IV
            y 79 de la Ley del Agua para el Estado de México y Municipios.
          </p>
          <p>
            En base a lo anterior, SE REQUIERE QUE DE FORMA INMEDIATA REALICE EL
            PAGO DE LOS SERVICIOS PROPORCIONADOS POR ESTE ORGANISMO PÚBLICO
            DESCENTRALIZADO, debiendo presentarse a regularizar su adeudo, en la
            Dirección de Comercialización del “OAPAS” ubicado en Av. San Luis
            Tlatilco 19, Parque Industrial Naucalpan CP.53489, o en cualquiera
            de las Subgerencias de pago, en un horario de las 09:00 a las 17:00
            horas de lunes a viernes.
          </p>
          <p>
            Su omisión de pago lo ha hecho acreedor, de conformidad con el
            articulo 159 parrafo segundo de la Ley del Agua para el Estado de
            México y Municipios, a la restricción de los servicios
            proporcionados.
          </p>
          <p>
            De conformidad con el artículo 151 de la Ley del Agua para el Estado
            de México y Municipios, podría ser sujeto de una visita de
            inspección al interior de sus instalaciones para corroborar el
            cumplimiento de sus obligaciones como usuario de los servicios que
            le otorga “OAPAS”.
          </p>
          <p>
            Aunado a lo anterior, se iniciará procedimiento administrativo para
            imponer sanciones derivado de la posible infracción que ha cometido
            por dejar de pagar los servicios recibidos de agua potable, drenaje
            y alcantarillado correspondientes, de conformidad con el artículo
            155 fracción XVIII de la Ley del Agua para el Estado de México y
            Municipios en relación con el articulo 79 del citado ordenamiento,
            que podrían concluir con el embargo de Bienes.
          </p>
          <p>
            En este sentido, con el objeto de NO continuar con las acciones
            legales correspondientes, se le reitera que cumpla con el pago del
            adeudo que a la fecha tiene, para lo cual con fundamento en el
            artículo 29 del Código de Procedimientos Administrativos del Estado
            de México se le otorga el término de setenta y dos horas para que
            acuda a las instalaciones de este Organismo Público Descentralizado
            Municipal “OAPAS”.
          </p>
        </div>

        <div className="carta-invitacion-base">
          <p>ATENTAMENTE</p>
          <div className="carta-invitacion-despedida">
            <p>C. LUIS JONATHAN VIEYRA RAMIREZ</p>
            <p>Encargado de despacho de la Gerencia de Rezagos,</p>
            <p>Restricciones y tjecucion Fiscal </p>
            <div className="carta-invitacion-despedida-contacto">
              <p>
                Av. San Luis Tlalico No. 10 Fracc Parque Industrial Naucalpan,
                Naucalpan de Juárez, Edo de Méx. C.P 53489
              </p>
              <p>537|1900/2529 5250 Fax. 2166 5921</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaCartaInvitacion;
