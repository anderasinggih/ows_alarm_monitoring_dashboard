import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getFmeNameSearch(fmeName, username) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_search_fme",
            data: {
                fme_name: fmeName,
                username: username
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
