import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getSiteStatisticByRegion(circle, region) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: '/netdrone_maps_v3/netdrone_maps_v3/netdrone_m_get_site_statistic_by_region',
            data: {
                region: region,
                circle: circle,
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
