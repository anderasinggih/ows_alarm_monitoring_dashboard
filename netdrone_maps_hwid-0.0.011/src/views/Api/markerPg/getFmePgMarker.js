import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getFmePgMarker(status, regionSelected, areaSelected, mcClusterSelected, hubType) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_fme_pg_list",
            data: {
                fme_status: status,
                region: areaSelected,
                circle: regionSelected,
                area: '',
                mc_cluster: mcClusterSelected,
                hub_type: hubType,
            },
            showErrorMessage: false,
            success: (json) => {
                resolve({ res:json.results });
            },
            error: (error) => {
                console.error(error, "error fetch fme marker");
                reject(error);
            }
        });
    });
}
