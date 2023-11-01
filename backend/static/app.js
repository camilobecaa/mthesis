async function uploadFile() {
    let formData = new FormData();
    const file = document.querySelector('input[type="file"]').files[0];
    formData.append('file', file);
    
    // Fetch the table data from the backend
    const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData
    });
    const data = await response.json();

    let table = document.getElementById('dataTable');
    table.innerHTML = ''; // Clear previous data
    
    // Add headers
    let headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Name</th><th>GlobalId</th>';
    table.appendChild(headerRow);
    
    // Add data
    data.forEach(item => {
        let row = document.createElement('tr');
        row.innerHTML = `<td>${item.Name}</td><td>${item.GlobalId}</td>`;
        table.appendChild(row);
    });
}
