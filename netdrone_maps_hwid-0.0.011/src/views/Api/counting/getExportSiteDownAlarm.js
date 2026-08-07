import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getExportSiteDownAlarm() {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: '/netdrone_maps_v3/netdrone_maps_v3/netdrone_m_export_sitedown_alarm_list',
            data: {
                start: "",
                limit: "",
                site_type: "NORMAL",
                circle: "NATIONAL",
                is_vip: "",
                hub_type: "BIG_MEDIUM_CORE"
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
