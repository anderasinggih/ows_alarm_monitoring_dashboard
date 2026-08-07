import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getFmeMarker(status) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_fme_list",
			data: {
				fme_status: status
			},
			showErrorMessage: false,
			success: (json) => {
				resolve({ res: json.results });
			},
			error: (error) => {
				console.error(error, "error fetch fme marker");
				reject(error);
			}
		});
	});
}
