import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getCountSiteStatisticNe() {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: '/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_ne_down_site_statistic',
            data: {
                hub_type: ["BIG HUB SITE", "MEDIUM HUB SITE", "SMALL HUB SITE"]
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
