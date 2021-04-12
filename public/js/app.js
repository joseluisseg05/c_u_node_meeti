import asistencia from './asistencia';

//obtener los dtaos de la vista 

const lat = document.querySelector('#lat').value || 20.056117;
const lng = document.querySelector('#lng').value || -98.761509;
const direccionData = document.querySelector('#direccion').value || '';

const apiKey = "AAPKf94ed90ce654499d92557d52123461a4r3rEGC5hDfH50MLuTIJNqTryH4dWxATZtPcCzzkUJtS_EfUlxC90laXR_-ZLJctS";
const basemapEnum = "ArcGIS:Navigation";
let marker;

const map = L.map("mapa", {minZoom: 2}).setView([lat, lng], 15);

L.esri.Vector.vectorBasemapLayer(basemapEnum, {
    apiKey: apiKey
}).addTo(map);

const searchControl = L.esri.Geocoding.geosearch({
    position: "topright",
    placeholder: "Escribe el lugar en donde se lleva el meeti",
    useMapBounds: false,
    providers: [
        L.esri.Geocoding.arcgisOnlineProvider({
            apikey: apiKey,
            nearby: {
                lat: lat,
                lng: lng,
            },
        }),
    ],
}).addTo(map);

const geocoder = L.esri.Geocoding.geocodeService({
    apikey: apiKey,
});

const results = L.layerGroup().addTo(map);

searchControl.on("results", (data) => {
    results.clearLayers();
    for (let i = data.results.length - 1; i >= 0; i--) {
        marker = L.marker(data.results[i].latlng, {
            draggable: true,
            autoPan: true,
        });
        marker.bindPopup(
            `<b>${data.results[i].properties.PlaceName}</b><p>${data.results[i].properties.LongLabel}</p>`
        );
        results.addLayer(marker);
        marker.openPopup();
        //console.log(data.results[i])
        
        const dataInfo = {
            direccion: data.results[i].properties.ShortLabel + ", " +  data.results[i].properties.Nbrhd,
            ciudad: data.results[i].properties.City,
            estado: data.results[i].properties.Region,
            pais: data.results[i].properties.Country,
            lat:  data.results[i].latlng.lat,
            lng: data.results[i].latlng.lng,
        }

        llenarInputs(dataInfo);    

        mover();
    }
});

//colocar el pin en edicion 
if(lat && lng){
    marker = L.marker([lat, lng], {
        draggable: true,
        autoPan: true,
    });
    marker.bindPopup(`<b>Ubicación Actual del meeti</b><p>${direccionData}</p>`);
    results.addLayer(marker);
    marker.openPopup();

    mover()
}

function mover () {
    marker.on("moveend", function (e) {
        results.clearLayers();
        marker = e.target;
        const posicion = marker.getLatLng();
        geocoder
            .reverse()
            .latlng(posicion)
            .run(function (error, result) {
                if(error) return;
                marker = L.marker(posicion, {
                    draggable: true,
                    autoPan: true,
                });
                marker.bindPopup(`<b>${result.address.PlaceName}</b><p>${result.address.LongLabel}</p>`);
                results.addLayer(marker);
                marker.openPopup();

                //console.log(result.address)

                const dataInfo = {
                    direccion: result.address.ShortLabel + ", " +  result.address.Neighborhood,
                    ciudad: result.address.City,
                    estado: result.address.Region,
                    pais: result.address.CountryCode,
                    lat: result.latlng.lat,
                    lng: result.latlng.lng
                }
        
                llenarInputs(dataInfo);    

                mover ()
            });
    });
} 

function llenarInputs(resultado) {
    //console.log(resultado);
    document.querySelector('#direccion').value = resultado.direccion;
    document.querySelector('#ciudad').value = resultado.ciudad;
    document.querySelector('#estado').value = resultado.estado;
    document.querySelector('#pais').value = resultado.pais;
    document.querySelector('#lat').value = resultado.lat;
    document.querySelector('#lng').value = resultado.lng;
}