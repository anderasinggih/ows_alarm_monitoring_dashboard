import { MessageProcessor } from "@adc/vigour-ui/lib/spl";
// yxl 地图markers的服务
export function getOltDownMarker(status, hubType, vip, siteType, region, siteDown, start_time, end_time, siteStr = '') {
	let siteList = siteStr ? siteStr.split(',') : [];
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/CN_GSC_ID_Surge_Noc_Dashboard/netdrone_maps/nm_get_olt_down_maps_info",
			// serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_all_site_down_markers",
			data: {
				status: status,
				is_hub: hubType,
				is_vip: vip,
				is_site_down: siteDown,
				region: region,
				site_type: siteType,
				start_time,
				end_time,
				siteList
			},
			showErrorMessage: false,
			success: (json) => {
				resolve({ res: json.results });
			},
			error: (error) => {
				console.error(error, "error netdrone_m_get_all_site_down_markers");
				reject(error);
			}
		});
	});
}
