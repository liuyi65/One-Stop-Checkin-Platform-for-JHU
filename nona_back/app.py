from flask import Flask
from flask_cors import CORS
import mysql.connector
import time
from packages.apis.BusAPI import bus_api_register
from packages.utils.GlobalSettings import GlobalSettings
from packages.apis.UserAPI import user_api_register
import firebase_admin as firebase
from packages.deamon_app import NonaScheduler, register_deamon

firebase_app = firebase.initialize_app(firebase.credentials.Certificate(GlobalSettings.cred_path))

connected = False
# host = 'nona_db_1'
host = GlobalSettings.host
while not connected:
    try:
        connection = mysql.connector.connect(
            user='nona', password='nona', host=host, port='3306', database='nona_db'
        )
        connected = True
    except:
        print("db connection error")
        print('trying again... after 5 seconds')
        time.sleep(5)

print("db connected")
cursor = connection.cursor()
cursor.execute('show tables;')
res = cursor.fetchall()
connection.close()
print(res)

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = GlobalSettings.upload_folder
app.config['MAX_CONTENT_LENGTH'] = GlobalSettings.max_image_size
bus_api_register(app)
user_api_register(app)




if __name__ == '__main__':
    scheduler = NonaScheduler()
    register_deamon(scheduler)
    scheduler.start()
        
    app.run(debug=True, host='0.0.0.0')
