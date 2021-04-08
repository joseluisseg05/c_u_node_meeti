const lat = 20.056117;
const lng = -98.761509;

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
    console.log(searchControl);
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

        mover();
    }
});



function mover () {
    marker.on("moveend", function (e) {
        results.clearLayers();
        marker = e.target;
        const posicion = marker.getLatLng();
        console.log(posicion);
        geocoder
            .reverse()
            .latlng(posicion)
            .run(function (error, result) {
                if(error) return;
                marker = L.marker(posicion, {
                    draggable: true,
                    autoPan: true,
                });
                console.log(result);
                marker.bindPopup(`<b>${result.address.PlaceName}</b><p>${result.address.LongLabel}</p>`);
                results.addLayer(marker);
                marker.openPopup();
                mover ()
            });
    });
} 