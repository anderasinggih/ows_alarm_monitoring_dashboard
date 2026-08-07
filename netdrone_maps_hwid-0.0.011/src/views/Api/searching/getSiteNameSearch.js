import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getSiteNameSearch(query) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: "/netdrone_maps_v3/netdrone_maps_v3/netdrone_m_get_site_name",
            data: {
                sitename: query,
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
