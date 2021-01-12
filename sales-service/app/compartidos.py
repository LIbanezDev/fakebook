# Metodos que seran compartidos entre los diferentes modulos de la aplicacion.

import app


def obtener_hashing(codigo: str, tipo: str) -> int:
    posicion = 0
    for digito in codigo:
        posicion += int(digito)
    return 64 if tipo == 'productos' else 35 * (posicion - 1)


def encontrar_espacio(codigo: str, tipo: str) -> int or None:
    """
    Busca la posicion para ubicar un proximo registro.
    """
    LONGITUD_REGISTRO = 64 if tipo == 'productos' else 35
    PATH = app.productos.PRODUCTOS_PATH if tipo == 'productos' else app.vendedores.VENDEDORES_PATH
    FILE = open(PATH)
    posicion = obtener_hashing(codigo, tipo)
    FILE.seek(posicion)
    registro = FILE.read(LONGITUD_REGISTRO)
    if registro[0:5] == '00000':  # Ubicacion libre en el area de datos
        return posicion
    elif int(registro[0:5]) == int(codigo):
        return -1
    else:  # Buscando en el area de overflow
        posicion = 45 * LONGITUD_REGISTRO
        FILE.seek(posicion)
        registro = FILE.read(LONGITUD_REGISTRO)
        while registro != '' and int(registro[0:5]) != int(codigo):
            registro = FILE.read(LONGITUD_REGISTRO)
            posicion += + LONGITUD_REGISTRO
        FILE.close()
        if registro != '':
            return -1
        return posicion


def obtener_uno(codigo: str, tipo: str) -> [int, str or None]:
    """
    Retorna la posicion y el contenido de un registro.
    [posicion:int -> -1 si no existe, registro:str or None si no existe]
    """
    LONGITUD_REGISTRO = 64 if tipo == 'productos' else 35
    PATH = app.productos.PRODUCTOS_PATH if tipo == 'productos' else app.vendedores.VENDEDORES_PATH
    FILE = open(PATH)
    posicion = obtener_hashing(codigo, tipo)
    FILE.seek(posicion)
    registro = FILE.read(LONGITUD_REGISTRO)
    if int(codigo) == int(registro[0:5]):  # Revisa si el registro se encuentra ya registrado en el area de datos.
        FILE.close()
        return [posicion, registro]
    else:  # Buscando en el area de overflow
        posicion = 45 * LONGITUD_REGISTRO
        FILE.seek(posicion)
        registro = FILE.read(LONGITUD_REGISTRO)
        while registro != "" and int(codigo) != int(registro[0:5]):
            registro = FILE.read(LONGITUD_REGISTRO)
        posicion = FILE.tell() - LONGITUD_REGISTRO
        FILE.close()
        if registro == "":
            return [-1, None]
        else:
            return [posicion, registro]
