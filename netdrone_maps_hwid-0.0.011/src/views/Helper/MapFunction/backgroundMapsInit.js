export function backgroundMapsInit(id) {
    var mapOptions = {};
    mapOptions.center = { lat: -6.50127, lng: 111.46372 };

    mapOptions.zoom = 7.7;
    mapOptions.language = "en";
    mapOptions.sourceType = "RASTER";
    mapOptions.mapType = "ROADMAP";
    mapOptions.zoomControl = false;

   
    
    return new HWMapJsSDK.HWMap(document.getElementById(id), mapOptions);
}
