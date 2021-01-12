"""
 Data Transfer Objects
 Mapean cada substring de un registro a un atributo de clase para facilitar su manejo y prevenir errores.
"""


class DetalleVenta:
    def __init__(self, registro: str):  # num_boleta;codigo_producto;cantidad
        registro_arr = registro.strip().split(';')
        self.num_boleta = int(registro_arr[0])
        self.cod_producto = int(registro_arr[1])
        self.cantidad = int(registro_arr[2])


class EncabezadoVenta:
    def __init__(self, registro: str):  # num_boleta;fecha;codigo_vendedor;estado
        registro_arr = registro.strip().split(';')
        self.num_boleta = int(registro_arr[0])
        self.fecha = registro_arr[1]
        self.cod_vendedor = int(registro_arr[2])
        self.estado = registro_arr[3]


class Vendedor:
    def __init__(self, registro: str):
        self.codigo = int(registro[0:5])
        self.nombre = registro[5:30].strip()


class Producto:
    def __init__(self, registro: str):
        self.codigo = int(registro[0:5])
        self.nombre = registro[5:55].strip()
        self.precio = int(registro[55:61])
        self.stock = int(registro[61:64])
