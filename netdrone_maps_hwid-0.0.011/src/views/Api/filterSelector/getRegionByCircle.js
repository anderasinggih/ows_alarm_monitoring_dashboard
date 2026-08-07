import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getRegionByCircle(regionSelected) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: '/CN_GSC_ID_Surge_Noc_Dashboard/netdrone_maps/nm_get_site_region_info',
            // serviceId: '/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_region_by_circle',
            data: {region: regionSelected},
            showErrorMessage: false,
            success: (json) => {
                resolve({ res:json.result });
            },
            error: (error) => {
                console.error(error, 'error region site down count');
                reject(error);
            }
        });
    });
}
