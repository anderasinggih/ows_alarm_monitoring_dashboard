import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getOutageDistributionBySite(regionSelected, areaSelected, mcClusterSelected, hubType) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: '/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_outage_distribution_by_site',
            data: {
                mc_cluster: mcClusterSelected,
                circle: regionSelected,
                region: areaSelected,
                hub_type: hubType
            },
            showErrorMessage: false,
            success: (json) => {
                resolve({ res:json.results });
            },
            error: (error) => {
                console.error(error, 'error region site down count');
                reject(error);
            }
        });
    });
}
