import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getMcClusterByCircle(region, circle) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: '/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_mc_cluster_by_circle',
            data: {
                region: region, 
                circle: circle
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
