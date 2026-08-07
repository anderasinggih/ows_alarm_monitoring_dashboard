import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getSegmentLinkDown() {
    var todayDate = new Date();

    const year = todayDate.getFullYear();
    const month = String(todayDate.getMonth() + 1).padStart(2, '0');
    const day = String(todayDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    const formattedDateStart = `${year}-${month}-${day-1}`;
    
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: '/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_segment_link_down',
            data: {
                start_time: `${formattedDateStart} 17:00:00`,
                end_time: `${formattedDate} 17:00:00`
            },
            showErrorMessage: false,
            success: (json) => {
                resolve({ res:json.results });
            },
            error: (error) => {
                console.error(error, 'error get potential tt');
                reject(error);
            }
        });
    });
}
