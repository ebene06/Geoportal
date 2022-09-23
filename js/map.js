// Initialize Map
var map = L.map('map').setView([7.0, -1.09], 7);

// Add basemap - OSM Tile Layer
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);


var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});


var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
})
// .addTo(map)


var googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});


// var marker = L.marker([7.0, -1.09]).addTo(map);

// Region Layer Style
var regionStyle = {
    color : "red",
    opacity: 0.3,
    weight: 1,
}

// Health Facility Style
var healthFacilitystyle = {
    radius: 8,
    fillColor: "green",
    color: "red",
    weight: 1,
}

var railwayStyle = {
    color: "black",
    dashArray: "10, 4, 10",
    weight: 2,
    lineCap: 'flat',
}


// Add GeoJSON layers
var regionlayer = L.geoJSON(region, {
    style:regionStyle,
    onEachFeature:function (feature, layer) {


        area = (turf.area(feature)/1000000).toFixed(3)
        center_lng = turf.center(feature).geometry.coordinates[0].toFixed(4)
        center_lat = turf.center(feature).geometry.coordinates[1].toFixed(4)



        label=`Name: ${feature.properties.region}<br>`
        label+=`Reg_Code: ${feature.properties.reg_code}<br>`
        label+=`Area: ${area}<br>`
        label+=`Center:Long: ${center_lng}, Lat: ${center_lat}<br>`
        
        layer.bindPopup(label)
    } 

}).addTo(map);

var healthlayer = L.geoJSON(healthfacilities,{
    pointToLayer:function(feature, latlng) {
    return L.circleMarker(latlng, healthFacilitystyle);
}
})
// addTo(map);

var railwaylayer = L.geoJSON(railway,{
    style:railwayStyle
})
// .addTo(map);


// Adding WMS lAYERS
var riverWMS = L.tileLayer.wms("http://localhost:8080/geoserver/geospatial/wms", {
    layers: 'geospatial:Rivers',
    format: 'image/png',
    transparent: true,
    attribution: ""
}).addTo(map)

var poisWMS = L.tileLayer.wms("http://localhost:8080/geoserver/geospatial/wms", {
    layers: 'geospatial:PointOfInterest',
    format: 'image/png',
    transparent: true,
    attribution: ""
})
// .addTo(map)

var railwayWMS = L.tileLayer.wms("http://localhost:8080/geoserver/geospatial/wms", {
    layers: 'geospatial:Railway',
    format: 'image/png',
    transparent: true,
    attribution: ""
})
// .addTo(map)

var treecover = L.tileLayer.wms("http://localhost:8080/geoserver/geospatial/wms", {
    layers: 'geospatial:Savannah_tree_cover',
    format: 'image/png',
    transparent: true,
    attribution: ""
})

// Basemaps
var baseLayers = {
    "OpenStreetMap": osm,
    "Google Streets": googleStreets,
    "Hybrid": googleHybrid,
    "Satellite": googleSat,
    "Terrain": googleTerrain,
};


// Layers
var overlays = {
    "Savannah Tree Cover": treecover,
    "WMS River": riverWMS,
    "WMS Points of Interest": poisWMS,
    "WMS Railway": railwayWMS,
    "Region": regionlayer,
    "Health Facilities": healthlayer,
    "Railway": railwaylayer,
    // "Marker": marker,
    // "Roads": roadsLayer
};

// Add layer control to map
L.control.layers(baseLayers, overlays).addTo(map);

// Add leaflet print control to map
L.control.browserPrint({position: 'topleft'}).addTo(map);

// Mouse move coordinate
map.on("mousemove",function(e){
   		$("#coordinate").html(`Lat:${e.latlng.lat.toFixed(3)}, Lng:${e.latlng.lng.toFixed(3)}`)
})


// Add scale to map
L.control.scale().addTo(map);