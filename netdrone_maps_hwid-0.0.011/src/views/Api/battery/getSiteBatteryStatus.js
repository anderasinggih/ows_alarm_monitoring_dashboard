import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getSiteBatteryStatus(siteId) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: '/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_battery_status_by_site_id',
            data: {
               site_id: siteId
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
