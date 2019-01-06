from flask import Flask, request
from flask_restful import Resource, Api
from json import dumps
from flask_jsonpify import jsonify
import os
import pickle

app = Flask(__name__)
api = Api(app)

table = {}
path = os.path.join(os.path.dirname(__file__), 'resources/table5.txt')
# with open(path) as f:
#     serial_data = f.read()
#     table = pickle.loads(serial_data)

class Employees_Name(Resource):
    def get(self, employee_id):
        result = "hello"
        return jsonify(result)
        

api.add_resource(Employees_Name, '/employees/<employee_id>') # Route_3


if __name__ == '__main__':
     app.run(port='5002')