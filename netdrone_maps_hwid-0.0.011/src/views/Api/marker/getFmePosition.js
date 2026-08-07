import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getFmePosition(username, taskid) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: "/netdrone_maps_v3/netdrone_maps_v3/netdrone_m_get_fme_position",
            data: {
                username: username,
				task_id: taskid
            },
            showErrorMessage: false,
            success: (json) => {
                resolve({ res:json.result[0] });
            },
            error: (error) => {
                console.error(error, "error fetch fme marker");
                reject(error);
            }
        });
    });
}
