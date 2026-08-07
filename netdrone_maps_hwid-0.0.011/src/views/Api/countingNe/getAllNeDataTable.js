import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getAllNeDataTable(power, status, hubType, mcCluster, region, circle, siteGenset, isVip, siteType) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_ne_down_data_table",
			data: {
				// power: false,
				// status: "",
				// hub_type: [],
				// mc_cluster: [],
				// region: [],
				// circle: "",
				// site_genset: "",
				// is_vip: "",
				// site_type: []
				power: power,
				status: status,
				hub_type: hubType,
				mc_cluster: mcCluster,
				region: region,
				circle: circle,
				site_genset: siteGenset,
				is_vip: isVip,
				site_type: siteType
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
