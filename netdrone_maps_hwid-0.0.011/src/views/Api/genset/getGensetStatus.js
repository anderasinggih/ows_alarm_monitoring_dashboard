import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getGensetStatus(siteid) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_genset_status",
            data: {
                site_id: siteid
            },
            showErrorMessage: false,
            success: (json) => {
                resolve({ res:json.result });
            },
            error: (error) => {
                console.error(error, "error fetch fme marker");
                reject(error);
            }
        });
    });
}
