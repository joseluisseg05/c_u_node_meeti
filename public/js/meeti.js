
const apiKey = "AAPKf94ed90ce654499d92557d52123461a4r3rEGC5hDfH50MLuTIJNqTryH4dWxATZtPcCzzkUJtS_EfUlxC90laXR_-ZLJctS";
const basemapEnum = "ArcGIS:Navigation";

document.addEventListener('DOMContentLoaded', () => {
    if(document.querySelector('#ubicacion-meeti')) {
        mostrarMapa()
    }
})

function mostrarMapa() {
    const lat = document.querySelector('#lat').value;
    const lng = document.querySelector('#lng').value;

    let marker;

    const map = L.map("ubicacion-meeti", {minZoom: 2}).setView([lat, lng], 16);

    L.esri.Vector.vectorBasemapLayer(basemapEnum, {
        apiKey: apiKey
    }).addTo(map);
    
    const results = L.layerGroup().addTo(map);
    
    if(lat && lng){
        marker = L.marker([lat, lng]);
        marker.bindPopup(`<b>Ubicación del Meeti</b>`);
        results.addLayer(marker);
        marker.openPopup();
    }
}