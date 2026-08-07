import { addLayerLine } from "../LineFunction/addLayerLine";
import { IndexData } from "../../Data/IndexData";
import { addLayerMarker } from "../MarkerFunction/addLayerMarker";


export function createInfoWindow(lat, lng, bgMap, lineData, location, totalTicket, lineStore, color, idx, windowVar, marker) {
	const contentHtml = `
    <style>
        #container-id-infowindow-${idx} .ol-popup {
            background-color: ${color} !important;
            border-radius: 8px;
            min-width: max-content;
            padding: 10px;
            border: none;
            zoom: 75%;
        }

        #container-id-infowindow-${idx} .ol-popup-closer:after {
            color: white;
            display: none !important;
        }

        #container-id-infowindow-${idx} .ol-popup:after {
            border-top-color: ${color} !important;
            left: 77px;
            border-width: 20px;
            margin-left: -10px;
        }

         #container-id-infowindow-${idx} .ol-popup:before {
           display: none;
        }

        #container-id-infowindow-${idx} .ol-popup .ol-popup-content .btn-show-topo {
            align-items: center;
            background: ${color} !important;
            border: 2px solid white;
            border-radius: 8px;
            box-sizing: border-box;
            color: white;
            cursor: pointer;
            display: flex;
            flex-direction: row;
            font-size: 14px;
            font-weight: 500;
            justify-content: center;
            letter-spacing: .4px;
            line-height: 1;
            max-width: 100%;
            text-decoration: none;
            padding: 10px 10px;
            user-select: none;
            width: fit-content;
            -webkit-user-select: none;
            touch-action: manipulation;
        }

        #container-id-infowindow-${idx} .ol-popup .ol-popup-content .btn-show-topo:active {
            outline: 0;
            background: white !important;
            border: 2px solid white);
            color: ${color} !important;
        }

        #container-id-infowindow-${idx} .ol-popup .ol-popup-content .btn-show-topo:hover {
            background: white !important;
            border: 2px solid white;
            color: ${color} !important;
        }

        #container-id-infowindow-${idx} .ol-popup .ol-popup-content .btn-show-topo span {
            transition: all 100ms;
        }

        #container-id-infowindow-${idx} .ol-popup .ol-popup-content .btn-show-topo:hover span {
            transform: scale(.9);
        }

        @media screen and (max-width: 991px) {
            #container-id-infowindow-${idx} .ol-popup .ol-popup-content .btn-show-topo {
                font-size: 14px;
                height: 50px;
            }

            #container-id-infowindow-${idx} .ol-popup .ol-popup-content .btn-show-topo span {
                line-height: 50px;
            }
        }
    </style>

    <div class="d-flex flex-row align-items-center gap-12 mb-2">
        <i class="bi bi-ticket-detailed font-28 text-white"></i>
        <div class="d-flex flex-column gap-8">
            <p class="font-500 font-18 text-white">${location}</p>
            <p class="font-300 font-14 text-white">${totalTicket} Ticket</p>
        </div>
    </div>
    <button id="button-show-topo-${location}" class='btn btn-show-topo'>SHOW TOPOLOGY</button>
    `;

	windowVar = new HWMapJsSDK.HWInfoWindow({
		map: bgMap,
		position: { lat: parseFloat(lat), lng: parseFloat(lng) },
		content: contentHtml,
		offset: [0, -40]
	});

	const elements = document.getElementsByClassName("ol-overlay-container");

	Array.from(elements)
		.reverse()
		.forEach((element, index) => {
			element.id = "container-id-infowindow-" + index;
		});

	const btnId = `button-show-topo-${location}`;

	setTimeout(() => {
		const button = document.getElementById(btnId);
		if (button) {
			button.addEventListener("click", () => {
				windowVar.close();
				lineStore.data = lineData;
				bgMap.panTo({ lat: lat, lng: lng });
				bgMap.setZoom(6);
				addLayerLine(lineStore, bgMap, IndexData);
                addLayerMarker(marker, IndexData.globalProcess.store.maps.backgroundMaps, IndexData)
                IndexData.linkDown.state.line.isShowingLine = true;
			});
		} else {
			console.log(`Button with ID ${btnId} not found.`);
		}
	}, 100);

	return windowVar;
}
