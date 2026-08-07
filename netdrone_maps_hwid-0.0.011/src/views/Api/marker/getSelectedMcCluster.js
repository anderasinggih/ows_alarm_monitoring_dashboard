import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getSelectedMcCluster(query) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_all_site_down_markers",
			data: {
				hub_type: ["BIG HUB SITE", "MEDIUM HUB SITE", "SMALL HUB SITE"],
				status: "",
				mc_cluster: query
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
