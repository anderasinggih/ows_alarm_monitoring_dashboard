import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getSiteDownPgMarker(status, hubType, vip, gensetAvail, regionSelected, areaSelected, mcClusterSelected) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_all_pg_site_down_markers",
            data: {
                power: true,
                status: status,
                hub_type: hubType,
                is_vip: vip,
                site_genset: gensetAvail,
                region: areaSelected,
                circle: regionSelected,
                area: areaSelected == null ? '' : areaSelected,
                mc_cluster: mcClusterSelected == null ? '' : mcClusterSelected,
                site_type: 'NORMAL'
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
