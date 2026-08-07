import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getDwdmSummary(mcCluster, region, hubType, genset, siteType,siteStatus, circle) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_dwdm_summary",
            data: {
                mc_cluster: mcCluster,
                region: region,
                hub_type: hubType,
                site_genset: genset,
                site_type: siteType,
                status: siteStatus,
                circle: circle,
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
