import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getNeDownMarker(status, hubType, vip, mcCluster, ttId, mcClusterFilter, region, circle, neType, siteType) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_all_ne_down_markers",
            data: {
                status: status,
                hub_type: hubType,
                is_vip: vip,
                mc_cluster_search : mcCluster,
                tt_id: ttId,
                mc_cluster: mcClusterFilter,
                region: region,
                circle: circle,
                ne_type: neType,
                site_type: siteType
            },
            showErrorMessage: false,
            success: (json) => {
                resolve({ res:json.results }); 
            },
            error: (error) => {
                console.error(error, "error netdrone_m_get_all_site_down_markers");
                reject(error); 
            }
        });
    });
}
