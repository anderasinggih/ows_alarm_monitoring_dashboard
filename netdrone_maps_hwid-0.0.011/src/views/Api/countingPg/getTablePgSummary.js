import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getTablePgSummary(regionSelected, areaSelected, mcClusterSelected, hubType) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_pg_summary_table",
			data: {
				mc_cluster: mcClusterSelected,
                circle: regionSelected,
                region: areaSelected,
                hub_type: hubType
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
