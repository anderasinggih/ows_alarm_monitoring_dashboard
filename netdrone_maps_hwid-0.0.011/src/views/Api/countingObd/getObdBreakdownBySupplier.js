import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getObdBreakdownBySupplier() {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_obd_activity_breakdown_by_supplier",
            data: {},
            showErrorMessage: false,
            success: (json) => {
                resolve({ res:json });
            },
            error: (error) => {
                console.error(error, "error fetch obd breakdown by circle");
                reject(error);
            }
        });
    });
}
