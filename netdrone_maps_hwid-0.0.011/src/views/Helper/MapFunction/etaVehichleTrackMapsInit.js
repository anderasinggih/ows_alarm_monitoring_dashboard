import { IndexData } from "../../Data/IndexData.js";

export function etaVehichleTrackMapsInit(originData, destinationData) {
	var mapOptions = {};

	const isOriginValid = originData.lat !== null && originData.lon !== null;
	const isDestinationValid = destinationData.lat !== null && destinationData.lon !== null;

	console.log("is origin valid :", isOriginValid);
	console.log("is Destination valid :", isDestinationValid);

	if (isOriginValid) {
		mapOptions.center = { lat: parseFloat(originData.lat), lng: parseFloat(originData.lon) };
		mapOptions.zoom = 13;
	} else {
		mapOptions.center = { lat: parseFloat(-0.490259), lng: parseFloat(118.557039) };
		mapOptions.zoom = 4;
	}
	mapOptions.language = "ENG";
	mapOptions.sourceType = "raster";

	let mapContainer = document.getElementById("petal-obd-vehicle-info");

	if (mapContainer) {
		mapContainer.parentNode.removeChild(mapContainer);
	}

	// Create a new map container
	mapContainer = document.createElement("div");
	mapContainer.id = "petal-obd-vehicle-info";
	mapContainer.classList.add("petal-obd-vehicle-info");
	mapContainer.style.width = "100%";
	mapContainer.style.height = "400px";
	mapContainer.style.cursor = "pointer";
	mapContainer.style.backgroundColor = "whitesmoke";
	document.getElementById("vehicle-info-map-card").appendChild(mapContainer);

	let mapFme = new HWMapJsSDK.HWMap(mapContainer, mapOptions);
	let direction = new HWMapJsSDK.HWDirectionsService(mapFme);

	const originLat = parseFloat(originData.lat);
	const originLon = parseFloat(originData.lon);
	const destinationLat = parseFloat(destinationData.lat);
	const destinationLon = parseFloat(destinationData.lon);

	const request = {
		origin: { lat: originLat, lng: originLon },
		destination: { lat: destinationLat, lng: destinationLon }
	};

	if (isOriginValid && isDestinationValid) {
		direction.routeDriving(request, (DirectionsResult, StatusCode) => {
			if (DirectionsResult.routes != undefined) {
				var result = DirectionsResult.routes[0].paths[0];
				
				IndexData.obd.store.vehicleTracking.travelDistance = null;
				IndexData.obd.store.vehicleTracking.travelDistance = result.distanceText;
				IndexData.obd.store.vehicleTracking.estimatedTime = result.durationInTrafficText;
				IndexData.obd.store.vehicleTracking.timeInTraffic = result.durationText;

				new HWMapJsSDK.HWMarker({
					map: mapFme,
					position: { lat: parseFloat(originData.lat), lng: parseFloat(originData.lon) },
					zIndex: 999,
					icon: {
						scale: 0.5,
						url: "https://1057-sg.teleows.com/adc-static/imagemgt/images/1057/netdrone_maps_v3/netdrone_maps_v3/sitedown_marker/fme.png"
					}
				});

				new HWMapJsSDK.HWMarker({
					map: mapFme,
					position: { lat: parseFloat(destinationData.lat), lng: parseFloat(destinationData.lon) },
					zIndex: 999,
					icon: {
						scale: 0.3,
						url: "http://1057-sg.teleows.com/adc-static/imagemgt/images/1057/netdrone_maps_v3/netdrone_maps_v4/obd_car_marker/fme-car-detail.png"
					}
				});

				//draw direction
				var directionRenderer = new HWMapJsSDK.HWDirectionsRenderer();
				directionRenderer.options.strokeColor = "#4FA700";
				directionRenderer.options.weight = 5;
				directionRenderer.setMap(mapFme);
				directionRenderer.setDirections(DirectionsResult, { visible: true });
			}
		});
	}

	if (isOriginValid && !isDestinationValid) {
		IndexData.obd.store.vehicleTracking.travelDistance = null;
		new HWMapJsSDK.HWMarker({
			map: mapFme,
			position: { lat: parseFloat(originData.lat), lng: parseFloat(originData.lon) },
			zIndex: 999,
			icon: {
				scale: 0.5,
				url: "https://1057-sg.teleows.com/adc-static/imagemgt/images/1057/netdrone_maps_v3/netdrone_maps_v3/sitedown_marker/fme.png"
			}
		});
		IndexData.obd.store.vehicleTracking.travelDistance = "Vehicle Latitude Longitude Not Found"
	}

	if (!isOriginValid && isDestinationValid) {
		IndexData.obd.store.vehicleTracking.travelDistance = null;
		new HWMapJsSDK.HWMarker({
			map: mapFme,
			position: { lat: parseFloat(destinationData.lat), lng: parseFloat(destinationData.lon) },
			zIndex: 999,
			icon: {
				scale: 0.3,
				url: "http://1057-sg.teleows.com/adc-static/imagemgt/images/1057/netdrone_maps_v3/netdrone_maps_v4/obd_car_marker/fme-car-detail.png"
			}
		});
		IndexData.obd.store.vehicleTracking.travelDistance = "FME Latitude Longitude Not Found"
	}
}
