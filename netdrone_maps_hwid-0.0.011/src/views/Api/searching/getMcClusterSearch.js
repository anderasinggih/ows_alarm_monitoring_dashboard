import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getMcClusterSearch(query) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: "/netdrone_maps_v3/netdrone_maps_v3/netdrone_m_get_mc_cluster_list",
            data: {
                cluster: query
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
