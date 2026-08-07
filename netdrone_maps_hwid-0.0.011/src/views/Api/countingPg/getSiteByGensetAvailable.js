import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getSiteByGensetAvailable(hubType, vip) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: '/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4__genset_available',
            data: {
                hub_type: hubType,
                is_vip: vip,
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
