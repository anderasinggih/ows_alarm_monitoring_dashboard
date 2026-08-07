import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getSummaryByCircle(circle, siteType, hubType, power, isVip) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_site_down_summary_table_by_circle",
			data: {
				power: power,
				region: [],
				site_type: siteType,
				mc_cluster: [],
				circle: circle,
				status: [],
				hub_type: hubType,
				site_genset: "",
				is_vip: isVip
			},
			showErrorMessage: false,
			success: (json) => {
				resolve({ res: json });
			},
			error: (error) => {
				console.error(error, "error region site down count");
				reject(error);
			}
		});
	});
}
