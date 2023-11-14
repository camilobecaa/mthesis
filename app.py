from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import ifcopenshell
import os
import csv

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

@app.route('/')
def home():
    return "IFC and CSV File Uploader App is running!"

@app.route('/frontend')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/upload', methods=['POST'])
def upload_files():
    ifc_file = request.files.get('ifcFile')
    csv_file = request.files.get('csvFile')

    response_data = {}

    # Process IFC File
    if ifc_file:
        temp_ifc_filename = "temp.ifc"
        ifc_file.save(temp_ifc_filename)

        response_data['ifcData'] = process_ifc_file(temp_ifc_filename)
        os.remove(temp_ifc_filename)

    # Process CSV File
    if csv_file:
        temp_csv_filename = "temp.csv"
        csv_file.save(temp_csv_filename)

        response_data['csvData'] = process_csv_file(temp_csv_filename)
        os.remove(temp_csv_filename)

    return jsonify(response_data)

def process_ifc_file(filename):
    ifc_data = []
    ifc_file = ifcopenshell.open(filename)
    for element in ifc_file.by_type("IfcBuildingElement"):
        data = {
            "Name": element.Name if element.Name else "No Name",
            "GlobalId": element.GlobalId
        }
        ifc_data.append(data)
    return ifc_data

def process_csv_file(filename):
    csv_data = []
    with open(filename, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=';')
        for row in reader:
            csv_data.append({
                "ObjectName": row.get("Object Name", "No Name"),
                "IFCGammaObjectID": row.get("IFC/GAMMA Object ID", "No ID")
            })
    return csv_data

if __name__ == '__main__':
    app.run(debug=True)
