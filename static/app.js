async function uploadFiles() {
    let formData = new FormData();
    const ifcFile = document.getElementById('ifcFile').files[0];
    const csvFile = document.getElementById('csvFile').files[0];
    formData.append('ifcFile', ifcFile);
    formData.append('csvFile', csvFile);
    
    // Fetch the data from the backend
    const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData
    });
    const result = await response.json();

    const ifcData = result.ifcData;
    const csvData = result.csvData;

    // Populate IFC Data Table
    let ifcTable = document.getElementById('ifcDataTable');
    ifcTable.innerHTML = '<tr><th>Name</th><th>GlobalId</th></tr>'; // Add headers
    if (Array.isArray(ifcData)) {
        ifcData.forEach(item => {
            let row = document.createElement('tr');
            row.innerHTML = `<td>${item.Name}</td><td>${item.GlobalId}</td>`;
            ifcTable.appendChild(row);
        });
    }

    // Populate CSV Data Table
    let csvTable = document.getElementById('csvDataTable');
    csvTable.innerHTML = '<tr><th>Object Name</th><th>IFC/GAMMA Object ID</th></tr>'; // Add headers
    if (Array.isArray(csvData)) {
        csvData.forEach(item => {
            let row = document.createElement('tr');
            row.innerHTML = `<td>${item.ObjectName}</td><td>${item.IFCGammaObjectID}</td>`;
            csvTable.appendChild(row);
        });
    }
}

// Event listener for the upload button
document.getElementById('uploadBtn').addEventListener('click', uploadFiles);
