import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getDurationRangeBreakLinkdown( status, hubType, vip, siteType, region, siteDown, start_time, end_time) {
// export function getDurationRangeBreakdown(power, hubType, vip, mcCluster, mcClusterFilter, circle, siteType, region, siteDown, start_time, end_time) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			// yxl
			serviceId: "/CN_GSC_ID_Surge_Noc_Dashboard/netdrone_maps/nm_link_down_duration_range",
			// serviceId: "/netdrone_maps_v3/netdrone_maps_v3/netdrone_m_site_down_duration_range_breakdown",
			data: {
				// hub_type: hubType,
				// status: ["1", "1_4", "4_8", "8_24", "m24"],
				status,
				is_hub: hubType,
				is_vip: vip,
				region: region,
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
				console.error(error, "error breakdown sitedown duration range");
				reject(error);
			}
		});
	});
}
