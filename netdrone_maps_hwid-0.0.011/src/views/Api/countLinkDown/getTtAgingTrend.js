import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getTtAgingTrend(startDate, endDate, severity, status, region) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: '/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_tt_aging_trend',
            data: {
                start_time: `${startDate} 00:00:00`,
                end_time: `${endDate} 23:59:59`,
                severity: severity,
                status: status,
                circle: region,
            },
            showErrorMessage: false,
            success: (json) => {
                resolve({ res:json });
            },
            error: (error) => {
                console.error(error, 'error get duration range');
                reject(error);
            }
        });
    });
}
