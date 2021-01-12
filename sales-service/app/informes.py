from datetime import datetime
from typing import Dict, List
import app
import dto


def listar_stock_critico():
    FILE = open(app.productos.PRODUCTOS_PATH)
    registro = FILE.read(app.productos.LONGITUD_REGISTRO)
    hay_stock_critico = False
    while registro != "":
        if registro[0:5] != '00000':
            producto = dto.Producto(registro)
            if producto.stock < 5:
                hay_stock_critico = True
                print(producto.nombre, 'con precio', producto.precio, 'tiene', producto.stock, 'unidades restantes.')
        registro = FILE.read(app.productos.LONGITUD_REGISTRO)
    if not hay_stock_critico:
        print('No hay productos en stock critico.')
    input('Presione enter para continuar...')
    FILE.close()


def timestamp_to_date(item):
    return {
        'fecha': datetime.fromtimestamp(item['fecha']).strftime('%d/%m/%Y'),
        'total': item['total']
    }


def obtener_recaudacion_diaria():
    recaudacion_diaria: List = []  # {timestamp => recaudacion_total}
    ENC_VTA_FILE = open(app.ventas.ENC_VTA_PATH)
    for linea_enc in ENC_VTA_FILE:
        encabezado = dto.EncabezadoVenta(linea_enc)
        dia, mes, anho = encabezado.fecha.split('/')
        timestamp = int(datetime.timestamp(datetime(int(anho), int(mes), int(dia))))  # Convirtiendo fecha a timestamp para luego listar de menor a mayor.
        if datetime.fromtimestamp(timestamp) not in recaudacion_diaria:  # Si la fecha aun no existe, inicializa su recaudacion del dia en 0
            recaudacion_diaria.append({'fecha': timestamp, 'total': 0})
        recaudacion_diaria = buscar_y_sumar_recaudacion(recaudacion_diaria, timestamp, encabezado, 'fecha')
    ENC_VTA_FILE.close()
    recaudacion_ordenada = sorted(recaudacion_diaria, key=lambda k: k['fecha'])
    recaudacion_ordenada_format = list(map(timestamp_to_date, recaudacion_ordenada))
    return recaudacion_ordenada_format


def buscar_y_sumar_recaudacion(lista: List, key, encabezado, tipo: str) -> List[Dict[str, int]]:
    for i in range(len(lista) - 1, -1, -1):
        if (lista[i]['vendedor']['nombre'] if tipo == 'vendedor' else lista[i]['fecha']) == key:
            lista[i]['total'] += app.ventas.obtener_total_venta(encabezado)
            return lista
    return lista


def obtener_ventas_por_vendedor() -> List[Dict[str, int]]:
    ventas_por_vendedor: List = []  # {nombre_vendedor: total_recaudado}
    ENC_VTA_FILE = open(app.ventas.ENC_VTA_PATH)
    for linea_enc in ENC_VTA_FILE:
        encabezado = dto.EncabezadoVenta(linea_enc)
        registro_vendedor = app.compartidos.obtener_uno(str(encabezado.cod_vendedor), 'vendedores')[
            1]  # Retorna [posicion, registro] => Obteniendo solo registro
        vendedor = dto.Vendedor(registro_vendedor)
        if not any(
                vendedor.nombre == venta['vendedor']['nombre'] for venta in
                ventas_por_vendedor):  # Si el vendedor aun no existe, inicializa su recaudacion en 0
            ventas_por_vendedor.append({'vendedor': vendedor.__dict__, 'total': 0})
        ventas_por_vendedor = buscar_y_sumar_recaudacion(ventas_por_vendedor, vendedor.nombre, encabezado, 'vendedor')
    ENC_VTA_FILE.close()
    return ventas_por_vendedor
