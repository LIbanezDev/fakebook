import os

import app
import dto

LONGITUD_REGISTRO = 35

VENDEDORES_PATH = os.path.join(os.path.dirname(__file__), '../db/VENDEDORES.dat')


def agregar():
    codigo = input('Ingrese codigo de vendedor: ')
    posicion = app.compartidos.encontrar_espacio(codigo, 'vendedores')
    if posicion == -1:
        print('Vendedor ya ha sido agregado.')
    else:
        FILE = open(VENDEDORES_PATH, 'r+')
        nombre = input('Ingrese nombre de vendedor: ')[0:30]
        FILE.seek(posicion)
        FILE.write(codigo.zfill(5) + nombre.ljust(30))
        FILE.close()


def modificar():
    codigo = input('Ingrese codigo de vendedor a modificar: ')
    [posicion, registro] = app.compartidos.obtener_uno(codigo, 'vendedores')
    if registro is None:
        print('Vendedor no existe, no se puede modificar.')
    else:
        vendedor = dto.Vendedor(registro)
        print('Codigo:', vendedor.codigo, '- Nombre:', vendedor.nombre)
        print('-- Nuevos datos --')
        nombre = input('Nombre: ')
        FILE = open(VENDEDORES_PATH, 'r+')
        FILE.seek(posicion)
        FILE.write(codigo.zfill(5) + nombre.ljust(30))
        FILE.close()


def consultar():
    codigo = input('Ingrese codigo de vendedor a buscar: ')
    registro = app.compartidos.obtener_uno(codigo, 'vendedores')[1]  # Retorna [posicion, registro] => [1] = Obteniendo registro
    if registro is None:
        print('Vendedor no existe.')
    else:
        vendedor = dto.Vendedor(registro)
        print('Nombre de vendedor: ' + vendedor.nombre)


def eliminar():
    codigo = input('Ingrese codigo de vendedor: ')
    [posicion, registro] = app.compartidos.obtener_uno(codigo, 'vendedores')
    if registro is None:
        print('Vendedor no existe.')
    else:
        if app.ventas.existe_vendedor_en_ventas(codigo):
            print('El vendedor ha hecho ventas, asi que no se puede eliminar.')
        else:
            vendedor = dto.Vendedor(registro)
            print('Nombre:', vendedor.nombre)
            FILE = open(VENDEDORES_PATH, 'r+')
            FILE.seek(posicion)
            FILE.write('00000' + " " * (LONGITUD_REGISTRO - 5))
            FILE.close()
            print(vendedor.nombre, 'eliminado satisfactoriamente.')


def listar():
    file = open(VENDEDORES_PATH, 'r')
    archivo_vacio = True
    while file.tell() < os.path.getsize(VENDEDORES_PATH):
        registro_actual = file.read(LONGITUD_REGISTRO)
        codigo = registro_actual[0:5].strip()
        if codigo != '00000':  # Registro no vacio
            nombre = registro_actual[5:30].strip()
            archivo_vacio = False
            print('Codigo:', int(codigo), '- Nombre:', nombre)
    if archivo_vacio:
        input('El archivo no tiene vendedores aun.')
    else:
        print('Fin del listado.')
    file.close()
    input('\nEnter para continuar...')
