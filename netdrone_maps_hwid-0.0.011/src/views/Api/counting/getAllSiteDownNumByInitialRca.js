import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getAllSiteDownNumByInitialRca(status, hubType, region, isVip, siteType, siteDown, start_time, end_time) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/CN_GSC_ID_Surge_Noc_Dashboard/netdrone_maps/nm_get_all_site_down_num_by_initial_rca",
			data: {
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
				console.error(error, "error initial RCA site down count");
				reject(error);
			}
		});
	});
}
