from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import ifcopenshell
import os

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

@app.route('/')
def home():
    return "IFC File Uploader App is running!"

@app.route('/frontend')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    if file:
        # Save the uploaded file temporarily
        temp_filename = "temp.ifc"
        file.save(temp_filename)

        # Load the IFC file using IfcOpenShell
        ifc_file = ifcopenshell.open(temp_filename)

        # Extract element type and Global ID
        elements_data = []
        for element in ifc_file.by_type("IfcBuildingElement"):
            data = {
                "Name": element.Name if element.Name else "No Name",  # Element name
                "GlobalId": element.GlobalId  # Global ID
            }
            elements_data.append(data)
        
        # Delete the temporary file after processing
        os.remove(temp_filename)

        return jsonify(elements_data)
    return "No file uploaded", 400

if __name__ == '__main__':
    app.run(debug=True)
