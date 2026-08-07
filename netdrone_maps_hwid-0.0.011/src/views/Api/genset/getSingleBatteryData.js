import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getSingleBatteryData(actual,batteryStatus,backupTime,siteid) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: "/ictsm_saas_battery_time_mgmt/ictsm_saas_battery_time_mgmt/get_site_battery_status_info",
            data: {
                actual_battery_backup_time: actual,
                battery_status: batteryStatus,
                max_backup_time: backupTime,
                site_id: siteid,
            },
            showErrorMessage: false,
            success: (json) => {
                resolve({ res:json });
            },
            error: (error) => {
                console.error(error, "error fetch fme marker");
                reject(error);
            }
        });
    });
}
