import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getVehicleDetailByRegNumber(regisNumb) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_fme_vehicle_by_reg_number",
            data: {
              reg_number : regisNumb,
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
