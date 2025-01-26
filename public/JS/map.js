
mapboxgl.accessToken=mapToken;

const map=new mapboxgl.Map({
    container: 'map',  //Container ID
    // Choose from Mapbox's core styles, or make your own style
    style: 'mapbox://styles/mapbox/streets-v12', // u can change the style of your map too
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

//Create a default marker and add it to the map.
const marker=new mapboxgl.Marker({ color:"red"})
.settingLat(listing.geometry.coordinates) // Listing.geometry.coordinates
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(`<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`))
.addTo(map);

// we can also create multiple markers
// const marker2=new mapboxgl.Marker({ color:"red"})
// .settingLat(listing.geometry.coordinates) // Listing.geometry.coordinates
// .setPopup(new mapboxgl.Popup({offset: 25})
// .setHTML(`<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`))
// .addTo(map);
