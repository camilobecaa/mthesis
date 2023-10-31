// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('ifcViewer').appendChild(renderer.domElement);

const ifcLoader = new IfcLoader();
ifcLoader.setWasmPath('https://unpkg.com/ifcjs@0.0.30/');

// On file upload
document.querySelector('form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    let formData = new FormData();
    const file = document.querySelector('input[type="file"]').files[0];
    formData.append('file', file);
    
    // Fetch the table data as before
    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });
    const data = await response.json();

    let table = document.getElementById('dataTable');
    table.innerHTML = ''; // Clear previous data
    
    // Add headers
let headerRow = document.createElement('tr');
headerRow.innerHTML = '<th>Type</th><th>GlobalId</th>';
table.appendChild(headerRow);
    
// Add data
data.forEach(item => {
    let row = document.createElement('tr');
    row.innerHTML = `<td>${item.Type}</td><td>${item.GlobalId}</td>`;
    table.appendChild(row);
});


    // Display the IFC geometry
    const ifcURL = URL.createObjectURL(file);
    const ifcModel = await ifcLoader.loadAsync(ifcURL);
    scene.add(ifcModel.mesh);

    // Adjust camera
    const box = new THREE.Box3().setFromObject(ifcModel.mesh);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const cameraZ = Math.abs(maxDim / 2 * Math.tan(fov * 2));
    camera.position.set(center.x, center.y, cameraZ * 1.5);
    camera.lookAt(center);

    animate();
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
