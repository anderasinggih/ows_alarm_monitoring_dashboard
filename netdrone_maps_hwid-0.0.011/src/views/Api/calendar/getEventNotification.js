import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getEventList() {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/adc-service/rest/v1/services/netdrone_maps_v3/netdrone_calendar/netdrone_calendar_get_all_events",
			data: {},
			showErrorMessage: false,
			success: (json) => {
				resolve({ res: json.results });
			},
			error: (error) => {
				console.error(error, "error region site down count");
				reject(error);
			}
		});
	});
}

export function getCurrentEvent() {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/adc-service/rest/v1/services/netdrone_maps_v3/netdrone_calendar/netdrone_calendar_today_event_title",
			data: {},
			showErrorMessage: false,
			success: (json) => {
				resolve({ res: json.results });
			},
			error: (error) => {
				console.error(error, "error region site down count");
				reject(error);
			}
		});
	});
}

export function getCategoryCountEvent() {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/adc-service/rest/v1/services/netdrone_maps_v3/netdrone_calendar/netdrone_calendar_get_event_count_by_category",
			data: {},
			showErrorMessage: false,
			success: (json) => {
				resolve({ res: json.results });
			},
			error: (error) => {
				console.error(error, "error region site down count");
				reject(error);
			}
		});
	});
}
