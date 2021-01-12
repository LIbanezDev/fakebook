import os

from flask import Flask

from app import productos, vendedores, informes

flask = Flask(__name__)


@flask.route('/summaries/sellers')
def summaries_sellers():
    return {'ok': True, 'message': 'Recaudacion por vendedor.', 'data': informes.obtener_ventas_por_vendedor()}


@flask.route('/summaries/sells')
def summaries_sells():
    return {'ok': True, 'msg': 'Recaudacion por fecha', 'data': informes.obtener_recaudacion_diaria()}


def create_database():
    files_names = ['ENC_VTA', 'DET_VTA', 'PRODUCTOS', 'VENDEDORES']
    if not os.path.isdir('db'):
        os.mkdir('db/')
    for file_name in files_names:
        full_name = './db/' + file_name + '.dat'
        if not os.path.isfile(full_name):
            file = open(full_name, 'w')
            if file_name == 'PRODUCTOS' or file_name == 'VENDEDORES':
                for i in range(45):
                    file.write("00000" + " " * ((vendedores.LONGITUD_REGISTRO if file_name == 'VENDEDORES' else productos.LONGITUD_REGISTRO) - 5))
            file.close()


if __name__ == '__main__':
    create_database()
    flask.run('localhost', 5000)
