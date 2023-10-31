from flask import Flask, request, jsonify
import ifcopenshell

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    if file:
        # Load the IFC file using IfcOpenShell
        ifc_file = ifcopenshell.open(file.stream)
        
        # Extract element type and Global ID
        elements_data = []
        for element in ifc_file.by_type("IfcBuildingElement"):
            data = {
                "Type": element.is_a(),  # Element type
                "GlobalId": element.GlobalId  # Global ID
            }
            elements_data.append(data)
        
        return jsonify(elements_data)
    return "No file uploaded", 400

if __name__ == '__main__':
    app.run(debug=True)
