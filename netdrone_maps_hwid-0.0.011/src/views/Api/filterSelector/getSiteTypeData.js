import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getSiteTypeData(regionSelected) {
    return new Promise((resolve, reject) => {
        MessageProcessor.process({
            serviceId: '/CN_GSC_ID_Surge_Noc_Dashboard/netdrone_maps/nm_get_site_type_info',
            data: {},
            showErrorMessage: false,
            success: (json) => {
                resolve({ res:json.results });
            },
            error: (error) => {
                console.error(error, 'error site type');
                reject(error);
            }
        });
    });
}
