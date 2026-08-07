import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getCountTtCorrelationDetails(start_time, end_time) {
    // const todayDate = new Date();

    // const yearEndDate = todayDate.getFullYear();
    // const monthEndDate = String(todayDate.getMonth() + 1).padStart(2, "0");
    // const dayEndDate = String(todayDate.getDate()).padStart(2, "0");

    // const formattedDate = `${yearEndDate}-${monthEndDate}-${dayEndDate}`;
    // const startDate = `${formattedDate} 00:00:00`;
    // const endDate = `${formattedDate} 23:59:59`;

	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/CN_GSC_ID_Surge_Noc_Dashboard/netdrone_maps/nm_get_multiple_site_down_tt_detail_info",
			// serviceId: "/operation_dashboard/noc_dashboard/noc_dashboard_get_all_multiple_site_down_tt_version2",
			data: {
				start_time, end_time
				// start_time: startDate,
                // end_time: endDate
			},
			showErrorMessage: false,
			success: (json) => {
				resolve({ res: json });
			},
			error: (error) => {
				console.error(error, "error get network availability");
				reject(error);
			}
		});
	});
}
