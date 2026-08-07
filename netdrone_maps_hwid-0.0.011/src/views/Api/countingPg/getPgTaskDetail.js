import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getPgTaskDetail(cmId) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_pg_task_detail",
            data: {
                cm_id: cmId,
            },
            showErrorMessage: false,
            success: (json) => {
                resolve({ res:json.result }); 
            },
            error: (error) => {
                console.error(error, "error netdrone_maps_v4_pg_task_detail");
                reject(error); 
            }
        });
    });
}
