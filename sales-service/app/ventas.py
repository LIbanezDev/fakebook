import datetime
import os
import typing

import app
import dto

ENC_VTA_PATH = os.path.join(os.path.dirname(__file__), '../db/ENC_VTA.dat')
DET_VTA_PATH = os.path.join(os.path.dirname(__file__), '../db/DET_VTA.dat')


def validar_fecha(fecha: str) -> [bool, str or None]:  # => [es_valida, error or None]
    try:
        day, month, year = fecha.strip().split('/')
        datetime.datetime(int(year), int(month), int(day))  # Si fecha no es valida, datetime() lanza un ValueError
        if int(year) < 2010 or int(year) > 2020:
            raise ValueError('Anio debe estar entre 2010 y 2020', 'year')
        return [True, None]
    except ValueError as error:
        return [False, error]


def existe_vendedor_en_ventas(codigo_vendedor: str) -> bool:
    """
    Retorna si un vendedor realizado ventas.
    """
    FILE = open(ENC_VTA_PATH)
    existe = False
    registro = FILE.readline()
    while registro != '' and not existe:
        enc_vta = dto.EncabezadoVenta(registro)
        if enc_vta.cod_vendedor == int(codigo_vendedor):
            existe = True
        registro = FILE.read()
    return existe


def existe_producto_en_ventas(codigo_producto: str) -> bool:
    """
    Retorna si un producto ha sido vendido.
    """
    FILE = open(DET_VTA_PATH)
    existe = False
    registro = FILE.readline()
    while registro != '' and not existe:
        enc_vta = dto.DetalleVenta(registro)
        if enc_vta.cod_producto == int(codigo_producto):
            existe = True
        registro = FILE.read()
    return existe


def obtener_ultimo_enc_vta() -> dto.EncabezadoVenta or None:
    ENC_VTA_FILE = open(ENC_VTA_PATH)
    ultimo = ""
    for linea in ENC_VTA_FILE:
        ultimo = linea
    ENC_VTA_FILE.close()
    if ultimo == "":
        return None
    return dto.EncabezadoVenta(ultimo)  # 1;18/01/2013;12345;V


def obtener_encabezado(num_boleta: int):
    ENC_FILE = open(ENC_VTA_PATH)
    registro_enc = ENC_FILE.readline()
    while registro_enc != '':
        encabezado = dto.EncabezadoVenta(registro_enc)
        if encabezado.num_boleta == num_boleta:
            ENC_FILE.close()
            return encabezado
        registro_enc = ENC_FILE.readline()
    ENC_FILE.close()
    return None


def obtener_total_venta(encabezado: dto.EncabezadoVenta) -> int:
    """
    Retorna el total de una venta especifica del estilo num_boleta:cod_producto:cantidad
    """
    DET_VTA_FILE = open(DET_VTA_PATH)
    total = 0
    for linea_det in DET_VTA_FILE:
        detalle = dto.DetalleVenta(linea_det)
        if encabezado.num_boleta == detalle.num_boleta:
            registro_producto = app.compartidos.obtener_uno(str(detalle.cod_producto), 'productos')[
                1]  # Retorna [posicion, registro] => Obteniendo solo registro
            producto = dto.Producto(registro_producto)
            total += producto.precio * detalle.cantidad
    DET_VTA_FILE.close()
    return total


def realizar_venta():
    try:
        ultimo_enc = obtener_ultimo_enc_vta()
        ultimo_codigo = 0 if ultimo_enc is None else ultimo_enc.num_boleta + 1

        # Validar fecha
        fecha = input("Fecha de venta (dd/mm/yyyy): ")
        [valida, error] = validar_fecha(fecha)
        if not valida:
            raise Exception(error)

        # Validar vendedor
        cod_vendedor = input("Codigo de vendedor: ")
        registro_vendedor = app.compartidos.obtener_uno(cod_vendedor, 'vendedores')[1]
        if registro_vendedor is None:
            raise Exception('Vendedor no existe...')

        productos_dict: typing.Dict[int, int] = {}  # {codigo: cantidad}
        while True:
            codigo = input("Ingrese codigo de producto, 0 para finalizar: ")
            if codigo == "0":
                break

            if codigo in productos_dict:
                print("Producto ya ha sido agregado, intente nuevamente")
                continue  # Reintentando la venta

            registro_producto = app.compartidos.obtener_uno(codigo, 'productos')[1]
            if registro_producto is None:
                print('Producto no existe en el registro, intente nuevamente.')
                continue

            producto = dto.Producto(registro_producto)
            print("Precio unitario de", producto.nombre, ":", producto.precio)
            cantidad_a_comprar = int(input("Cantidad a comprar: "))
            if producto.stock < cantidad_a_comprar:
                print("Solo quedan", producto.stock, "de", producto.nombre)
                continue
            productos_dict[int(producto.codigo)] = cantidad_a_comprar

        # Pasó todas las validaciones, registrando venta en
        ENC_VTA_FILE = open(ENC_VTA_PATH, 'a')
        DET_VTA_FILE = open(DET_VTA_PATH, 'a')
        for cod_producto in productos_dict:
            DET_VTA_FILE.write(str(ultimo_codigo).rjust(5) + ';' + str(cod_producto) + ';' + str(productos_dict[cod_producto]) + '\n')
            app.productos.modificar_stock(str(cod_producto), productos_dict[cod_producto])
        ENC_VTA_FILE.write(str(ultimo_codigo).rjust(5) + ';' + fecha + ';' + str(cod_vendedor) + ';' + 'V' + '\n')
        ENC_VTA_FILE.close()
        DET_VTA_FILE.close()

    except Exception as e:
        print(e)


def consultar_venta():
    num_boleta = int(input('Ingrese numero de boleta: '))
    encabezado = obtener_encabezado(num_boleta)
    if encabezado is None:
        print('Numero de boleta no existe.')
    else:
        # Listando datos de la boleta y del vendedor.
        print('Numero de boleta:', encabezado.num_boleta, '- Fecha:', encabezado.fecha)
        vendedor = dto.Vendedor(app.compartidos.obtener_uno(str(encabezado.cod_vendedor), 'vendedores')[1])
        print('Codigo Vendedor :', vendedor.codigo, '- Nombre:', vendedor.nombre)
        # -----------

        # Leyendo el detalle de venta.
        DET_FILE = open(DET_VTA_PATH)
        total_venta = 0
        for linea_detalle in DET_FILE:
            detalle = dto.DetalleVenta(linea_detalle)
            if detalle.num_boleta == num_boleta:
                producto = dto.Producto(app.compartidos.obtener_uno(str(detalle.cod_producto), 'productos')[1])
                total_producto_actual = producto.precio * detalle.cantidad
                print('Codigo Producto:', producto.codigo, '- Nombre:', producto.nombre, '- Precio:', producto.precio, '- Cantidad Vendida:', detalle.cantidad,
                      '- Total Venta:', total_producto_actual)
                total_venta += total_producto_actual
        DET_FILE.close()
        # ------------------
        print('Total de venta codigo', num_boleta, ':', total_venta)


def anular_venta():
    num_boleta = int(input('Ingrese numero de boleta: '))
    encabezado = obtener_encabezado(num_boleta)
    if encabezado is None:
        print('Numero de boleta no existe.')
    else:
        print('Codigo:', encabezado.num_boleta, '- Fecha:', encabezado.fecha)
        if encabezado.estado == 'N':
            print('Venta ya esta anulada.')
        else:
            resp = ''
            while resp != 's' and resp != 'n':
                resp = input('Esta seguro que desea anular? (s/n)')
                if resp != 's' and resp != 'n':
                    print('Debe escribir s o n')
            if resp == 's':
                DET_FILE = open(DET_VTA_PATH)
                for linea_detalle in DET_FILE:
                    detalle = dto.DetalleVenta(linea_detalle)
                    if detalle.num_boleta == encabezado.num_boleta:
                        app.productos.modificar_stock(str(detalle.cod_producto), detalle.cantidad, '+')
                DET_FILE.close()
                ENC_FILE = open(ENC_VTA_PATH)
                AUX_ENC_FILE = open('./db/ENC_VTA.tmp', 'w')
                for linea_encabezado in ENC_FILE:
                    linea_encabezado_arr = linea_encabezado.split(';')
                    if int(linea_encabezado_arr[0]) == num_boleta:
                        AUX_ENC_FILE.write(linea_encabezado_arr[0] + ';' + linea_encabezado_arr[1] + ';' + linea_encabezado_arr[2] + ';' + 'N' + '\n')
                    else:
                        AUX_ENC_FILE.write(linea_encabezado)
                ENC_FILE.close()
                AUX_ENC_FILE.close()
                os.remove(ENC_VTA_PATH)
                os.rename('./db/ENC_VTA.tmp', ENC_VTA_PATH)
                print('Venta anulada, stock reestablecido.')
