import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getSummaryNeTable() {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_ne_down_by_hub_type",
			data: {
				power: false,
				status: "",
				hub_type: [],
				mc_cluster: [],
				region: [],
				circle: "",
				site_genset: "",
				is_vip: "",
				site_type: []
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
