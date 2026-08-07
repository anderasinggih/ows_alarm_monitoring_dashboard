import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getTicketByHubType(regionSelected,areaSelected,mcClusterSelected) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: '/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_pg_ticket_by_hub_type',
            data: {
                mc_cluster: mcClusterSelected,
                region: areaSelected ,
                circle: regionSelected,
                hub_type: []
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
