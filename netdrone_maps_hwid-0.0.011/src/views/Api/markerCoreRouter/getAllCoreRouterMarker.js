import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getAllCoreRouterMarker(status, hubType, mcCluster, region, genset, siteType) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_all_core_router_markers",
            data: {
                status: status,
                mc_cluster: mcCluster,
                area: "",
                region: region,
                hub_type: hubType,
                site_genset: genset,
                site_type: siteType,
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
