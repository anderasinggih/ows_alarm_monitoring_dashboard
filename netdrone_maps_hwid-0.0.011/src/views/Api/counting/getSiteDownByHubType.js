import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getSiteDownByHubType(status, hubType, region, isVip, siteType, siteDown, start_time, end_time) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/CN_GSC_ID_Surge_Noc_Dashboard/netdrone_maps/nm_get_site_down_by_hub_type",
			data: {
				// power: false,
				// status: "",
				// hub_type: [],
				// mc_cluster: [],
				// region: [],
				// site_genset: "",
				// circle: "",
				// site_type: []
				// status: [],
				status,
				is_hub: hubType,
				region: region,
				is_vip: isVip,
				site_type: siteType,
				is_site_down: siteDown,
				start_time,
				end_time
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
