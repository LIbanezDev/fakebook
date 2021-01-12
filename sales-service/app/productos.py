import os

import app
import dto

LONGITUD_REGISTRO = 64

PRODUCTOS_PATH = os.path.join(os.path.dirname(__file__), '../db/PRODUCTOS.dat')


def modificar_stock(codigo: str, cantidad: int, operacion: str = '-'):
    [posicion, registro] = app.compartidos.obtener_uno(codigo, 'productos')
    stock_actual = int(registro[61:64])
    nuevo_stock = stock_actual - cantidad if operacion == '-' else stock_actual + cantidad
    registro_editado = registro[0:61] + str(nuevo_stock).zfill(3)
    FILE = open(PRODUCTOS_PATH, 'r+')
    FILE.seek(posicion)
    FILE.write(registro_editado)
    FILE.close()


def agregar():
    codigo = input('Ingrese codigo de producto: ')
    posicion = app.compartidos.encontrar_espacio(codigo, 'productos')
    if posicion == -1:
        print('Producto ya ha sido agregado.')
    else:
        print('Ingrese los datos restantes del producto.')
        nombre = input('Nombre: ')[0:50]
        precio = input('Precio: ')[0:6]
        stock = input('Stock: ')[0:3]
        FILE = open(PRODUCTOS_PATH, 'r+')
        FILE.seek(posicion)
        FILE.write(codigo.zfill(5) + nombre.ljust(50) + precio.zfill(6) + stock.zfill(3))
        FILE.close()


def modificar():
    codigo = input('Ingrese codigo de producto a modificar: ')
    [posicion, registro] = app.compartidos.obtener_uno(codigo, 'productos')
    if registro is None:
        print('Producto no existe, no se puede modificar.')
    else:
        print('Modificando en la posicion', posicion)
        producto = dto.Producto(registro)
        print('Nombre:', producto.nombre, '- Precio:', producto.precio, '- Stock:', producto.stock)
        print('-- Nuevos datos --')
        nombre = input('Nombre: ')
        precio = input('Precio: ')
        stock = input('Stock: ')
        FILE = open(PRODUCTOS_PATH, 'r+')
        FILE.seek(posicion)
        FILE.write(str(codigo).zfill(5) + nombre.ljust(50) + precio.zfill(6) + stock.zfill(3))
        FILE.close()


def consultar():
    codigo = input('Ingrese codigo de producto: ')
    registro = app.compartidos.obtener_uno(codigo, 'productos')[1]  # Retorna [posicion, registro] => Obteniendo registro
    if registro is None:
        print('Producto no existe.')
    else:
        producto = dto.Producto(registro)
        print('Nombre:', producto.nombre, '- Precio:', producto.precio, '- Stock:', producto.stock)


def eliminar():
    codigo = input('Ingrese codigo de producto: ')
    [posicion, registro] = app.compartidos.obtener_uno(codigo, 'productos')
    if registro is None:
        print('Producto no existe.')
    else:
        producto = dto.Producto(registro)
        print('Nombre:', producto.nombre, '- Precio:', producto.precio, ' - Stock:', producto.stock)
        if app.ventas.existe_producto_en_ventas(codigo):
            print('El producto ha sido vendido alguna vez, asi que no se puede eliminar.')
        else:
            FILE = open(PRODUCTOS_PATH, 'r+')
            FILE.seek(posicion)
            FILE.write('00000' + " " * (LONGITUD_REGISTRO - 5))
            FILE.close()
            print(producto.nombre, 'eliminado satisfactoriamente.')


def listar():
    file = open(PRODUCTOS_PATH, 'r')
    archivo_vacio = True
    while file.tell() < os.path.getsize(PRODUCTOS_PATH):
        registro_actual = file.read(LONGITUD_REGISTRO)
        codigo = registro_actual[0:5].strip()
        if codigo != '00000':  # Registro no vacio
            producto = dto.Producto(registro_actual)
            archivo_vacio = False
            print('Codigo:', producto.codigo, '- Nombre:', producto.nombre, '- Precio:', producto.precio, '- Stock: ', producto.stock)
    if archivo_vacio:
        input('El archivo no tiene productos aun.\nEnter para continuar...')
    else:
        input('Fin del listado.\nEnter para continuar...')
    file.close()
