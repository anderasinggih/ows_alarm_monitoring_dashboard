import { IndexData } from "../../Data/IndexData.js";

export function etaDetailMapsInit(originData, destinationData) {
	var mapOptions = {};

	if (parseFloat(originData.lat) == 0 && parseFloat(originData.lng) == 0) {
		mapOptions.center = { lat: parseFloat(-0.490259), lng: parseFloat(118.557039) };
		mapOptions.zoom = 4;
		IndexData.globalProcess.state.component.isCoordZero = true;
	} else {
		mapOptions.center = { lat: parseFloat(originData.lat), lng: parseFloat(originData.lng) };
		mapOptions.zoom = 10;
		IndexData.globalProcess.state.component.isCoordZero = false;
	}

	mapOptions.language = "ENG";
	mapOptions.sourceType = "raster";

	let mapContainer = document.getElementById("site-map-petal-hw");

	if (mapContainer) {
		mapContainer.parentNode.removeChild(mapContainer);
	}

	// Create a new map container
	mapContainer = document.createElement("div");
	mapContainer.id = "site-map-petal-hw";
	mapContainer.classList.add("site-map-petal-hw");
	mapContainer.style.width = "100%";
	mapContainer.style.height = "500px";
	mapContainer.style.cursor = "pointer";
	mapContainer.style.backgroundColor = "whitesmoke";
	document.getElementById("petal-map-col").appendChild(mapContainer);

	let mapFme = new HWMapJsSDK.HWMap(mapContainer, mapOptions);
	let direction = new HWMapJsSDK.HWDirectionsService(mapFme);

	const request = {
		origin: originData,
		destination: destinationData
	};

	direction.routeDriving(request, (DirectionsResult, StatusCode) => {
		// Origin marker
		if (DirectionsResult.routes != undefined) {
			var result = DirectionsResult.routes[0].paths[0];
			IndexData.globalProcess.store.eta.travelDistance = result.distanceText;
			IndexData.globalProcess.store.eta.timeInTraffic = result.durationInTrafficText;
			IndexData.globalProcess.store.eta.estimatedTime = result.durationText;
			let originMarker = new HWMapJsSDK.HWMarker({
				map: mapFme,
				position: { lat: parseFloat(originData.lat), lng: parseFloat(originData.lng) },
				zIndex: 999,
				icon: {
					scale: 0.3,
					url: "https://1057-sg.teleows.com/adc-static/imagemgt/images/1057/netdrone_maps_v3/netdrone_maps_v3/sitedown_marker/fme.png?_v=standard_1707939751633?t=1707940456288"
				}
			});

			let destinationMarker = new HWMapJsSDK.HWMarker({
				map: mapFme,
				position: { lat: parseFloat(destinationData.lat), lng: parseFloat(destinationData.lng) },
				zIndex: 999,
				icon: {
					scale: 0.3,
					url: "https://1057-sg.teleows.com/adc-static/imagemgt/images/1057/netdrone_maps_v3/netdrone_maps_v3/sitedown_marker/sitefme.png?_v=standard_1707939751633?t=1707940456288"
				}
			});

			//draw direction
			var direction = new HWMapJsSDK.HWDirectionsRenderer();
			direction.setMap(mapFme);
			direction.setDirections(DirectionsResult, { visible: true });
		}

		// originMarker.setMap(map);
		// destinationMarker.setMap(map);
	});
}
