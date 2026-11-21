import test from "node:test";
import assert from "node:assert/strict";
import {
  aplicarCambioFoto, recalcularFotos, fotoRepresentativa, fechaNuevaFoto,
  nombreFoto, parseFotos,
} from "../src/components/PaymentValidation/Shared/fotoRules.js";
import { obtenerEstadoFotos } from "../src/components/PaymentValidation/IndicadoresGestion/estadoFotos.js";

// Datos ficticios con los nombres de campos de la respuesta real; sin nombres ni URLs privadas.
const dia = "2026-08-21";
const gestion = `${dia}T09:38:08`;
const foto = (id, tipo, hora = "09:37:29") => ({
  idRegistroFoto: id, cuenta: "CUENTA-PRUEBA", idAspUser: "318", idTarea: 2,
  tipo, fechaCaptura: `${dia}T${hora}`,
  urlImagen: `https://example.test/archivo-${id}?firma=prueba`,
});
const registro = (fotos = [], extra = {}) => recalcularFotos({
  id: 1, cuenta: "CUENTA-PRUEBA", recibo: "RECIBO-PRUEBA", total_pagado: 20817,
  periodo: "2021 - 2026", periodo_inicial: "", periodo_final: "",
  "fecha de pago": "2026-09-21T10:11:43.563", fecha_de_gestion: gestion,
  "estatus de gestion valida": "Gestión válida", evaluacion_periodos: "PERIODO_VALIDO",
  gestor: "Gestor de prueba", estatus_predio: "Predio localizado", latitud: 19.7,
  fotos: JSON.stringify(fotos), ...extra,
});
const guardar = (nuevaFoto) => ({ cuenta: "CUENTA-PRUEBA", fechaGestion: gestion, foto: nuevaFoto });
const eliminar = (id) => ({ cuenta: "CUENTA-PRUEBA", fechaGestion: gestion, idRegistroFoto: id });
const camposFotos = new Set([
  "fotos", "foto fachada predio", "foto evidencia predio", "nombreFotoFachada",
  "nombreFotoEvidencia", "urlImagenFachada", "urlImagenEvidencia",
]);
const sinFotos = (r) => Object.fromEntries(Object.entries(r).filter(([key]) => !camposFotos.has(key)));
const congelar = (r) => Object.freeze(structuredClone(r));

test("las cuatro combinaciones de banderas son excluyentes, con números y texto", () => {
  for (const convertir of [Number, String]) {
    for (const [fachada, evidencia, esperado] of [
      [0, 0, "sin_fotos"], [1, 0, "solo_fachada"],
      [0, 1, "solo_evidencia"], [1, 1, "con_ambas"],
    ]) {
      assert.equal(obtenerEstadoFotos({
        "foto fachada predio": convertir(fachada), "foto evidencia predio": convertir(evidencia),
      }), esperado);
    }
  }
});

test("reconoce tipos SQL y selecciona la última fotografía de cada tipo", () => {
  const r = registro([foto(1, "Fachada predio"), foto(2, "Evidencia"), foto(3, "FACHADA", "10:00:00")]);
  assert.equal(r.urlImagenFachada, foto(3, "FACHADA").urlImagen);
  assert.equal(r.urlImagenEvidencia, foto(2, "Evidencia").urlImagen);
  assert.equal(obtenerEstadoFotos(r), "con_ambas");
});

test("otros tipos y fotografías de otro día no se contabilizan como evidencia", () => {
  const otraFecha = { ...foto(2, "Evidencia"), fechaCaptura: "2026-08-20T10:00:00" };
  const r = registro([foto(1, "Documento"), otraFecha]);
  assert.equal(obtenerEstadoFotos(r), "sin_fotos");
});

test("la última foto con nombre nulo deja la bandera en cero, como el SP", () => {
  const r = registro([foto(1, "FACHADA"), { ...foto(2, "FACHADA", "10:00:00"), nombreFoto: null }]);
  assert.equal(r["foto fachada predio"], 0);
  assert.equal(r.urlImagenFachada, null);
});

test("recupera el nombre real de la URL sin usar su fecha ni la firma", () => {
  assert.equal(nombreFoto({ urlImagen: "https://example.test/cuenta2026-04-22T13%3A45%3A19.000Z?firma=1" }),
    "cuenta2026-04-22T13:45:19.000Z");
  assert.equal(nombreFoto({ nombreFoto: "original", urlImagen: "https://example.test/otro" }), "original");
});

test("agregar la primera foto cambia únicamente los campos de fotografías", () => {
  const anterior = congelar(registro());
  const [nuevo] = aplicarCambioFoto([anterior], guardar(foto(1, "FACHADA")));
  assert.equal(obtenerEstadoFotos(nuevo), "solo_fachada");
  assert.deepEqual(sinFotos(nuevo), sinFotos(anterior));
  assert.equal(anterior.fotos, "[]");
});

test("editar solo el tipo conserva identidad, fecha, archivo, gestor y tarea", () => {
  const original = foto(1, "Fachada predio");
  const [nuevo] = aplicarCambioFoto([registro([original])], guardar({ ...original, tipo: "EVIDENCIA" }));
  assert.equal(obtenerEstadoFotos(nuevo), "solo_evidencia");
  assert.deepEqual(parseFotos(nuevo.fotos)[0], { ...original, tipo: "EVIDENCIA" });
});

test("reemplazar imagen de una foto actualiza la URL conservando los importes", () => {
  const anterior = registro([foto(1, "FACHADA")]);
  const [nuevo] = aplicarCambioFoto([anterior], guardar({ ...foto(1, "FACHADA"), urlImagen: "https://example.test/nueva" }));
  assert.equal(nuevo.urlImagenFachada, "https://example.test/nueva");
  assert.deepEqual(sinFotos(nuevo), sinFotos(anterior));
});

test("eliminar la representativa recupera la anterior; eliminar la última baja la bandera", () => {
  const base = [registro([foto(1, "FACHADA"), foto(2, "FACHADA", "10:00:00"), foto(3, "EVIDENCIA")])];
  const paso1 = aplicarCambioFoto(base, eliminar(2));
  assert.equal(paso1[0].urlImagenFachada, foto(1, "FACHADA").urlImagen);
  const paso2 = aplicarCambioFoto(paso1, eliminar(1));
  assert.equal(obtenerEstadoFotos(paso2[0]), "solo_evidencia");
  assert.equal(paso2[0].urlImagenFachada, null);
  assert.deepEqual(sinFotos(paso2[0]), sinFotos(base[0]));
});

test("actualiza todas las filas de cuenta y día, incluido el resumen con otro orden", () => {
  const a = registro();
  const b = registro([], { id: 2, fecha_de_gestion: `${dia}T18:00:00` });
  const otroDia = registro([], { id: 3, fecha_de_gestion: "2026-08-20T09:38:08" });
  const otraCuenta = registro([], { id: 4, cuenta: "OTRA" });
  const sinGestion = registro([], { id: 5, fecha_de_gestion: undefined });
  const detalles = [a, b, otroDia, otraCuenta, sinGestion];
  const resumen = detalles.toReversed().map(({ fecha_de_gestion, ...r }) => ({ ...r, fecha_gestion: fecha_de_gestion, total_valido: r.total_pagado }));
  for (const conjunto of [detalles, resumen]) {
    const salida = aplicarCambioFoto(conjunto, guardar(foto(1, "EVIDENCIA")));
    for (let i = 0; i < conjunto.length; i++) {
      assert.deepEqual(sinFotos(salida[i]), sinFotos(conjunto[i]));
      assert.equal(salida[i]["foto evidencia predio"], [1, 2].includes(salida[i].id) ? 1 : 0);
      if (![1, 2].includes(salida[i].id)) assert.equal(salida[i], conjunto[i]);
    }
  }
});

test("guardar o eliminar dos veces es idempotente, aun con ID de texto", () => {
  const cambio = guardar(foto(1, "FACHADA"));
  const primera = aplicarCambioFoto([registro()], cambio);
  const segunda = aplicarCambioFoto(primera, { ...cambio, foto: { ...cambio.foto, idRegistroFoto: "1" } });
  assert.equal(parseFotos(segunda[0].fotos).length, 1);
  const borrada = aplicarCambioFoto(segunda, eliminar(1));
  assert.deepEqual(aplicarCambioFoto(borrada, eliminar("1")), borrada);
});

test("fecha automática: posterior a todas, mismo día, sin conversión de zona", () => {
  assert.equal(fechaNuevaFoto(gestion, []), `${dia}T09:38:09`);
  assert.equal(fechaNuevaFoto(gestion, [foto(1, "FACHADA", "22:59:59")]), `${dia}T23:00:00`);
  assert.throws(() => fechaNuevaFoto(gestion, [foto(1, "FACHADA", "23:59:59")]), /No queda/);
  assert.throws(() => fechaNuevaFoto("fecha inválida", []), /fecha válida/);
});

test("rechaza datos incompletos sin modificarlos", () => {
  const original = congelar(registro());
  assert.throws(() => aplicarCambioFoto([original], guardar({ ...foto(1, "FACHADA"), fechaCaptura: "2026-08-22T10:00:00" })), /conservar el día/);
  assert.throws(() => aplicarCambioFoto([original], guardar({ ...foto(1, "FACHADA"), idRegistroFoto: undefined })), /identificador/);
  assert.throws(() => aplicarCambioFoto([{ ...original, fotos: "JSON roto" }], eliminar(1)));
  assert.equal(original.fotos, "[]");
});

test("30 con fachada y 30 sin fachada pasan a 31 y 29, sin cambiar montos ni validez", () => {
  const base = Array.from({ length: 60 }, (_, i) => registro(i < 30 ? [foto(i + 1, "FACHADA")] : [], { id: i + 1, cuenta: `PRUEBA-${i}` }));
  const actualizado = aplicarCambioFoto(base, { cuenta: "PRUEBA-30", fechaGestion: gestion, foto: { ...foto(100, "FACHADA"), cuenta: "PRUEBA-30" } });
  assert.equal(actualizado.filter((r) => r["foto fachada predio"] === 1).length, 31);
  assert.equal(actualizado.filter((r) => r["foto fachada predio"] === 0).length, 29);
  assert.deepEqual(actualizado.map(sinFotos), base.map(sinFotos));
  const categorias = actualizado.map(obtenerEstadoFotos);
  assert.equal(["sin_fotos", "solo_fachada", "solo_evidencia", "con_ambas"].reduce((n, tipo) => n + categorias.filter((t) => t === tipo).length, 0), 60);
});

test("secuencia agregar, cambiar tipo y eliminar restaura el estado fotográfico inicial", () => {
  const inicial = [registro()];
  const nueva = foto(1, "FACHADA");
  const paso1 = aplicarCambioFoto(inicial, guardar(nueva));
  const paso2 = aplicarCambioFoto(paso1, guardar({ ...nueva, tipo: "EVIDENCIA" }));
  const final = aplicarCambioFoto(paso2, eliminar(1));
  assert.deepEqual(final, inicial);
});

test("empates conservan la URL representativa elegida por el servidor", () => {
  const a = foto(1, "FACHADA");
  const b = foto(2, "FACHADA");
  assert.equal(fotoRepresentativa(registro([a, b], { urlImagenFachada: b.urlImagen }), "fachada").idRegistroFoto, 2);
});
