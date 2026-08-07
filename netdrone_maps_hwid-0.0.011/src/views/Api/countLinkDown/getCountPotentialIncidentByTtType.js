import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getCountPotentialIncidentByTtType() {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: '/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_tt_breakdown_by_type',
            data: {},
            showErrorMessage: false,
            success: (json) => {
                resolve({ res:json });
            },
            error: (error) => {
                console.error(error, 'error get potential incident by status');
                reject(error);
            }
        });
    });
}
