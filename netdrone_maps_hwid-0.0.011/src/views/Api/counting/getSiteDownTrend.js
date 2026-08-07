import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getSiteDownTrend(startTime,endTime,hubType,timeCategory) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: '/netdrone_maps_v3/netdrone_maps_v3/netdrone_m_site_down_summary_trend_query',
            data: {
                start_time: startTime,
                end_time: endTime,
                hub_type: hubType,
                time_category: timeCategory,
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
