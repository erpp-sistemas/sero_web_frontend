# Pruebas de administración de fotos de pagos válidos

## Alcance y datos conocidos

Cambios exclusivamente en frontend. Duplicar fotos de otros días queda pendiente.
Las operaciones usan las APIs existentes de insertar, editar y eliminar fotos;
no vuelven a consultar PaymentValidationResults después de cada operación.

La muestra compartida por el usuario tenía 236 registros, de los cuales 178
cumplían Gestión válida + PERIODO_VALIDO, con 178 combinaciones cuenta/fecha.
La muestra está truncada: no contamos con los 236 objetos completos ni un total
monetario de referencia. Los tests automatizados usan datos ficticios con esa
estructura, no una copia completa de datos reales ni una conexión a SQL Server.

## Reglas verificadas localmente

- Asociación de fotos por cuenta y día de la gestión, conservando la hora SQL.
- Fachada y evidencia se identifican explícitamente por su tipo.
- La más reciente de cada tipo es la representativa; nombreFoto no nulo activa
  la bandera correspondiente. Los otros tipos no se convierten en evidencia.
- Al editar se conservan fecha, ID, nombre de archivo, usuario de la foto y tarea.
- Al agregar, la fecha es posterior a las fotos existentes y a la gestión en un
  segundo. Si cruza medianoche se bloquea, en vez de pasar a otro día.
- Detalle y resumen se actualizan en una sola transición de estado, sin depender
  del orden de las filas. Todas las filas cargadas de la cuenta/día se actualizan.
- Solo se modifican fotos, banderas, nombres y URLs representativas. Se conservan
  montos, recibos, períodos, evaluación, estatus, fechas de pago/gestión y gestor.
- La suma de las cuatro categorías fotográficas coincide con Todas.

Ejecutar desde la raíz del proyecto:

```powershell
node --test tests/payment-validation-photos.test.mjs
```

Repetir también con TZ=UTC y TZ=America/Mexico_City para comprobar que las reglas
de fechas no dependen de la zona del equipo. La aritmética usa los valores SQL,
sin interpretar una fecha SQL como hora local y convertirla a UTC.

## Línea base antes de probar integración

En un entorno de prueba y con cuentas destinadas a pruebas:

1. Usar exactamente los mismos filtros de plaza, servicio, proceso y fechas.
2. Conservar una copia del detalle y resumen antes de operar, sin publicarla en
   el repositorio. Registrar el total de filas, pagos válidos/no válidos, montos
   total/válido/no válido, conteos y porcentajes de fotos y las cuatro categorías.
3. Comprobar que Todas equivale al número de pagos válidos, no al total evaluado.
   Si la base y los filtros no cambiaron desde la muestra, los valores esperados
   son 236 evaluados y 178 válidos. No fijar esos valores para otras consultas.
4. Confirmar que las fotos de cada cuenta/día coinciden en detalle y resumen.

## Matriz de integración pendiente

| Caso | Acción | Resultado esperado |
|---|---|---|
| Sin fotos | Agregar primera fachada | Sin fotos -1, Solo fachada +1; indicadores de falta de fachada se ajustan |
| Solo fachada | Agregar evidencia | Solo fachada -1, Con ambas +1 |
| Solo evidencia | Agregar fachada | Solo evidencia -1, Con ambas +1 |
| Con ambas | Agregar otra fachada | Misma categoría; cambia la representativa y aumenta el número de fotos |
| Varias fotos | Abrir Administrar fotos | Galería con todas las fotos recibidas de ese día; selecciona otra para editar |
| Corregir tipo | Cambiar fachada a evidencia sin subir imagen | Mismo ID, fecha y archivo; recalcular ambos tipos según las fotos restantes |
| Reemplazar imagen | Subir imagen en una foto existente | Misma fecha/ID; nueva imagen visible, tipo elegido y conteos correctos |
| Eliminar representativa | Borrar la más reciente con otra anterior | La anterior aparece; bandera permanece en 1 |
| Eliminar última | Borrar la única de un tipo | Bandera 0, URL/nombre nulos; cambia categoría e indicadores |
| Filtro activo | Guardar una foto que saca la fila del filtro | Desaparece de ese filtro; paginación válida y conteos coherentes |
| Cuenta/día compartidos | Modificar foto en una fila | Todas las filas cargadas de esa cuenta/día se sincronizan; otras intactas |
| Cancelar | Cambiar tipo/imagen y cancelar | Sin petición de escritura y sin cambios en los datos |
| Error API | Simular rechazo antes de guardar | Sin actualización local, mensaje de error y editor disponible para corregir |
| Doble clic | Guardar repetidamente durante envío | Una única operación en curso |
| Medianoche | Agregar sin espacio posterior en el día | Mensaje explicativo; sin petición de escritura ni cambio de día |
| Respuesta incompleta | API confirma sin ID o URL necesarios | Aviso de sincronización; no inventar un ID ni repetir la inserción |
| URL vencida | Abrir una imagen cuya firma expiró | No cambiar banderas, montos ni descartar la foto por un fallo de imagen |

Para cada caso, comparar todos los campos ajenos a fotos con la línea base.
Los montos asociados a grupos de fotos pueden cambiar al cambiar su composición;
los importes del pago, su validez y los totales generales deben permanecer iguales.

## Concordancia con servidor

Al finalizar un lote controlado, volver a consultar una vez los mismos filtros.
Comparar el estado local anterior a la recarga con el resultado del servidor:
IDs, fechas, tipos, cantidad de fotos, banderas, nombres representativos y todos
los indicadores. Comparar las URLs por clave de archivo, no por su firma temporal.
Esto verifica especialmente que las APIs existentes conservan fechas/archivos y
que no convierten la fecha SQL a otra hora o día al persistir.

El SP no especifica desempate cuando dos fotos del mismo tipo tienen exactamente
la misma fecha/hora. El frontend conserva la selección recibida si está disponible;
no es posible garantizar otro desempate de SQL sin modificar ese contrato.

No considerar concluida la validación de nómina hasta completar esta concordancia
y la matriz de integración. No se realizaron escrituras de prueba en la BD desde
la implementación ni desde los tests automatizados.
