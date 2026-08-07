import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getCountByRegion(power, hubType, vip, mcCluster, mcClusterFilter, circle, siteType, region) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/netdrone_maps_v3/netdrone_maps_v3/netdrone_m_count_site_down_cell_down_aging_by_region",
			data: {
				hub_type: hubType,
				power: power,
				is_vip: vip,
				mc_cluster_search: mcCluster,
				mc_cluster: mcClusterFilter,
				region: region,
				circle: circle,
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
