import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function postMapsHit(hitState, markerCount, markerDesc, time) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_maps_api_log_create",
			data: {
				hit_state: hitState,
				marker_count: markerCount,
				marker_description: markerDesc,
				time_hit: time
			},
			showErrorMessage: false,
			success: (json) => {
				resolve({ res: json.results });
			},
			error: (error) => {
				console.error(error, "error region site down count");
				reject(error);
			}
		});
	});
}
