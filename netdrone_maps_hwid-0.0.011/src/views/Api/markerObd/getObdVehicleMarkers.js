import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getObdVehicleMarkers(vehicleStatus, supplier) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_all_vehicle_markers",
            data: {
                vehicle_status: vehicleStatus,
                supplier : supplier
            },
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
