import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getLinkDownBreakdown() {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: '/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_link_down_breakdown',
            data: {
            },
            showErrorMessage: false,
            success: (json) => {
                resolve({ res:json.results });
            },
            error: (error) => {
                console.error(error, 'error get duration range');
                reject(error);
            }
        });
    });
}
