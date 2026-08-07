import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getCountByVendorOlt(status, hubType, vip, siteDown, region, siteType, start_time, end_time) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/CN_GSC_ID_Surge_Noc_Dashboard/netdrone_maps/nm_count_olt_down_by_vendor",
			// serviceId: "/netdrone_maps_v3/netdrone_maps_v3/netdrone_m_count_site_down_cell_down_by_vendor",
			data: {
				status: status,
				is_hub: hubType,
				is_vip: vip,
				is_site_down: siteDown,
				region: region,
				site_type: siteType,
				start_time,
				end_time
			},
			showErrorMessage: false,
			success: (json) => {
				resolve({ res: json });
			},
			error: (error) => {
				console.error(error, "error breakdown sitedown duration range");
				reject(error);
			}
		});
	});
}
