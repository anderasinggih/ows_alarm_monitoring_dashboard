import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getCountNeByRegion( hubType, vip, mcCluster, mcClusterFilter, region, circle, siteType) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: '/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_count_ne_down_aging_by_region',
            data: {
                hub_type: hubType,
                is_vip: vip,
                mc_cluster_search : mcCluster,
                mc_cluster: mcClusterFilter,
                region: region,
                circle: circle,
                site_type: siteType,
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
