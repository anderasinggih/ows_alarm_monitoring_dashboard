import { MessageProcessor } from "@adc/vigour-ui/lib/spl";
import { IndexData } from "../../Data/IndexData";

const DF = IndexData;

//* ADD LINE FUNCTION
export function addLayerLine(datax, map, ref) {
	if (!datax.data || !Array.isArray(datax.data)) {
		console.error("Invalid datax.data structure");
		return;
	}
	const validData = datax.data.filter((item) => {
		const validCoords = item.lineCoords.filter((coord) => coord.lat !== null && coord.lng !== null);
		return validCoords.length >= 2;
	});

	validData.forEach(async function (item) {
		const lineCoords = item.lineCoords.filter((coord) => coord.lat !== null && coord.lng !== null).map((coord) => ({ lat: parseFloat(coord.lat), lng: parseFloat(coord.lng) }));

		const line = new HWMapJsSDK.HWPolyline({
			map,
			path: lineCoords,
			zIndex: datax.zindex,
			strokeColor: item.strokeColor || "#FF0000",
			strokeOpacity: 1.0,
			strokeWeight: 2,
			clickable: true
		});

		datax.lines.push(line);
		line.addListener("click", () => handleLineClick(datax, item, map, ref));
	});
}

//* HANDLE CLICK BASED ON PANEL TYPE
function handleLineClick(datax, item, map, ref) {
	console.log("Line clicked!", item);
	switch (datax.panelType) {
		case "lineDwdm":
			handleLineDwdmClick(item, map);
			break;
	}
}

//* HANDLE CLICK FUNCTION
function handleLineDwdmClick(item, map) {
	fetchDwdmLinkDetail(item.link_id)
		.then((linkDetailData) => {
			lineDetailProcess(linkDetailData);
		})
		.catch(console.error);
}

function fetchDwdmLinkDetail(linkId) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_dwdm_link_detail",
			data: {
				link_id: linkId
			},
			showErrorMessage: false,
			success: (json) => resolve(json.results),
			error: reject
		});
	});
}

//* LINE DATA PROCESSING
function lineDetailProcess(data) {
	let sourceData = data.source_site;
	let destinationData = data.destination_site;
	try {
		if (DF.globalProcess.state.tab.selectedOption == 'dwdmCheckTab') {
			DF.dwdm.store.lineDetails.sourceData = sourceData[0];
			DF.dwdm.store.lineDetails.destinationData = destinationData[0];
		}
	} catch (e) {
		console.error("Error: ", e);
	} finally {
		showModalDetails("lineDetails");
	}
}

//* CALL MODAL DETAILS
function showModalDetails(modalId) {
	const modalElement = document.getElementById(modalId);
	if (modalElement) {
		const modal = new bootstrap.Modal(modalElement, { backdrop: "static" });
		modal.show();
	} else {
		console.error(`Modal with element name '${modalId}' is not found.`);
	}
}
