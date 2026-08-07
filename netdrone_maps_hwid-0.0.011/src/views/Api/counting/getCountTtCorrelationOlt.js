import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getCountTtCorrelationOlt(start_time, end_time) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: '/CN_GSC_ID_Surge_Noc_Dashboard/netdrone_maps/nm_get_multiple_olt_down_tt_info',
            data: {
                start_time, end_time
            },
            showErrorMessage: false,
            success: (json) => {
                resolve({ res: json });
            },
            error: (error) => {
                console.error(error, 'error get duration range');
                reject(error);
            }
        });
    });
}
