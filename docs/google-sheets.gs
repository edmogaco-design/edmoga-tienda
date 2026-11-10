// EDMOGA — registro de ventas en Google Sheets.
// Cómo instalarlo (5 minutos):
// 1. Crea una hoja de cálculo nueva en Google Sheets (ej. "EDMOGA ventas").
// 2. Menú Extensiones → Apps Script. Borra lo que haya y pega TODO este archivo.
// 3. Engranaje (Configuración del proyecto) → Propiedades de la secuencia de comandos →
//    agrega la propiedad CLAVE con una frase secreta larga (la misma irá en Vercel como
//    SHEETS_WEBHOOK_SECRET).
// 4. Implementar → Nueva implementación → tipo "Aplicación web".
//    Ejecutar como: Yo. Quién tiene acceso: Cualquier usuario. → Implementar → autorizar.
// 5. Copia la URL que termina en /exec y ponla en Vercel como SHEETS_WEBHOOK_URL.

var COLUMNAS = [
  'fecha', 'codigo', 'metodo', 'estado', 'producto', 'cantidad', 'subtotal', 'envio', 'total',
  'nombre', 'telefono', 'departamento', 'ciudad', 'direccion', 'notas',
  'orden_bold', 'transaccion_bold', 'dropi', 'dropi_pedido',
];

function doPost(e) {
  var salida = function (obj) {
    return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
  };
  try {
    var datos = JSON.parse(e.postData.contents);
    var clave = PropertiesService.getScriptProperties().getProperty('CLAVE');
    if (!clave || datos.clave !== clave) return salida({ ok: false, error: 'clave' });

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ventas');
      if (!hoja) {
        hoja = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Ventas');
        hoja.appendRow(COLUMNAS);
        hoja.setFrozenRows(1);
      }
      hoja.appendRow(COLUMNAS.map(function (c) {
        var v = datos[c];
        if (v === null || v === undefined) return '';
        // Evita que Sheets interprete textos como fórmulas.
        if (typeof v === 'string' && /^[=+\-@]/.test(v)) return "'" + v;
        return v;
      }));
    } finally {
      lock.releaseLock();
    }
    return salida({ ok: true });
  } catch (err) {
    return salida({ ok: false, error: String(err) });
  }
}
