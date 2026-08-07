import { MessageProcessor } from "@adc/vigour-ui/lib/spl";
import { IndexData } from "../../Data/IndexData";

const DF = IndexData;

var markerConfig = {
	site: { scale: 0.28 },
	// site: { scale: 0.25 },
	fme: { scale: 0.5 },
	fmePg: { scale: 0.3 },
	fmePgMovement: { scale: 0.3 },
	fmePgInstalled: { scale: 0.3 },
	sitePower: { scale: 0.25 },
	siteDwdm: { scale: 0.175 },
	vertex: { scale: 0.08 },
	siteLinkDown: { scale: 0.175 },
	siteCoreRouter: { scale: 0.325 },
	obd: { scale: 0.25 }
};

export function addLayerMarker(datax, map, ref, animated) {
	console.log(datax, 'datax inside export function')
	datax.data.forEach(async function (item) {
		const coord = item.lat && item.lon ? { lat: parseFloat(item.lat), lng: parseFloat(item.lon) } : { lat: 1, lng: 1 };
		const iconStr = item.src || item.url;
		const config = markerConfig[datax.panelType] || {};
		if (item.fme_status == "idle") {
			markerConfig.fmePg.scale = 0.09;
		} else {
			markerConfig.fmePg.scale = 0.3;
		}
		const MM = new HWMapJsSDK.HWMarker({
			map,
			position: coord,
			zIndex: 10,
			icon: { ...config, url: iconStr },
			animation: animated ? animated : ""
		});

		datax.markers.push(MM);
		MM.addListener("click", () => handleMarkerClick(datax, item, map, ref));
	});
}

function handleMarkerClick(datax, item, map, ref) {
	var status = item.fme_status;
	var title = "";
	if (status == "idle") {
		title = "FME Details";
	} else if (status == "pg_movement") {
		title = "FME PG Movement";
	} else if (status == "pg_installed") {
		title = "FME PG Installed";
	}
	switch (datax.panelType) {
		case "site":
			ref.dwdm.state.isDwdmSite = false;
			ref.dwdm.state.isVertexNode = false;
			ref.pg.state.component.isPgSite = false;
			ref.coreRouter.state.isCoreRouterSite = false;
			handleSiteClick(datax, item, map);
			break;
		case "siteDwdm":
			ref.dwdm.state.isDwdmSite = true;
			ref.dwdm.state.isVertexNode = false;
			ref.pg.state.component.isPgSite = false;
			ref.coreRouter.state.isCoreRouterSite = false;
			handleDwdmSiteClick(datax, item, map);
			break;
		case "sitePower":
			ref.dwdm.state.isDwdmSite = false;
			ref.dwdm.state.isVertexNode = false;
			ref.pg.state.component.isPgSite = true;
			ref.coreRouter.state.isCoreRouterSite = false;
			handleSiteClickPower(datax, item, map);
			break;
		case "fme":
			handleFmeClick(item, ref);
			break;
		case "fmePg":
			ref.pg.state.fme.fmePgModalTitle = title;
			handleFmePgClick(item, ref);
			break;
		case "fmePgMovement":
			ref.pg.state.fme.fmePgModalTitle = title;
			handleFmePgClick(item, ref);
			break;
		case "fmePgInstalled":
			ref.pg.state.fme.fmePgModalTitle = title;
			handleFmePgClick(item, ref);
			break;
		// case "vertex":
		// 	ref.dwdm.state.isDwdmSite = true;
		// 	ref.dwdm.state.isVertexNode = true;
		// 	ref.pg.state.component.isPgSite = false;
		// 	ref.coreRouter.state.isCoreRouterSite = false;
		// 	handleVertexClick(datax, item, map);
		// 	break;
		case "siteLinkDown":
			ref.dwdm.state.isDwdmSite = true;
			ref.dwdm.state.isVertexNode = false;
			ref.pg.state.component.isPgSite = false;
			ref.coreRouter.state.isCoreRouterSite = false;
			handleSiteLinkDownClick(datax, item, map);
			break;
		case "siteCoreRouter":
			ref.dwdm.state.isDwdmSite = false;
			ref.dwdm.state.isVertexNode = false;
			ref.pg.state.component.isPgSite = false;
			ref.coreRouter.state.isCoreRouterSite = true;
			handleSiteCoreRouterClick(datax, item, map);
			break;
		case "obd":
			handleObdCarMarkerClick(datax, item, map);
			break;
	}
}

function handleObdCarMarkerClick(datax, item, map) {
	DF.globalProcess.state.component.loadingObdCarDetailsData = true;

	const coord = { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
	map.panTo(coord);
	map.setZoom(12);

	DF.obd.store.vehicleDetail.data = item;
	DF.obd.state.isOpen = true;
	showModal('modalObdVehicleDetails');
}

function handleSiteCoreRouterClick(datax, item, map) {
	DF.globalProcess.state.component.siteDetailsLoading = true;
	const coord = { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
	map.panTo(coord);
	map.setZoom(12);

	fetchCoreRouterAlarmList(item, datax.panelType)
		.then(({ unmanagedCoreRouter, hardware, power, linkdown, hightemp, highutil }) => {
			siteDetailProcess(item, [], [], [], [], [], [], [], [], [], unmanagedCoreRouter, hardware, power, linkdown, hightemp, highutil);
		})
		.catch(console.error);
}

function handleSiteLinkDownClick(datax, item, map) {
	DF.globalProcess.state.component.siteDetailsLoading = true;
	if (DF.dwdm.state.isDwdmSite) {
		DF.globalProcess.store.eta.modalStatus = "DWDM";
	} else {
		DF.globalProcess.store.eta.modalStatus = "SITEDOWN";
	}
	const coord = { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
	map.panTo(coord);
	map.setZoom(12);

	fetchAlarmList(item, datax.panelType)
		.then(({ alarmList, powerList }) => {
			fetchDwdmAlarmList(item, datax.panelType)
				.then(({ powerDwdm, unmanagedDwdm, temperature, transport }) => {
					fetchTicketList(item.title)
						.then((ticketList) => {
							if (DF.dwdm.state.isDwdmSite) {
								fetchDwdmTicketList(item.title)
									.then((dwdmTicketList) => {
										fetchSiteTtList(item.title, ["DWDM Alarm", "DWDM Link Down"])
											.then((ttList) => {
												siteDetailProcess(item, alarmList, powerDwdm, ticketList, unmanagedDwdm, dwdmTicketList, [], ttList, temperature, transport, [], [], [], [], [], [], []);
											})
											.catch(console.error);
									})
									.catch(console.error);
							} else {
								siteDetailProcess(item, alarmList, powerList, ticketList, unmanagedDwdm, [], [], [], temperature, transport, [], [], [], [], [], [], []);
							}
						})
						.catch(console.error);
				})
				.catch(console.error);
		})
		.catch(console.error);
}

function handleVertexClick(datax, data, map) {
	DF.globalProcess.state.component.siteDetailsLoading = true;
	if (DF.dwdm.state.isDwdmSite) {
		DF.globalProcess.store.eta.modalStatus = "DWDM";
	} else {
		DF.globalProcess.store.eta.modalStatus = "SITEDOWN";
	}
	const coord = { lat: parseFloat(data.lat), lng: parseFloat(data.lon) };
	map.panTo(coord);
	map.setZoom(12);

	var item = {
		title: data.siteId
	};

	fetchAlarmList(item, datax.panelType)
		.then(({ alarmList, powerList }) => {
			fetchDwdmAlarmList(item, datax.panelType)
				.then(({ powerDwdm, unmanagedDwdm, temperature, transport }) => {
					fetchTicketList(data.siteId)
						.then((ticketList) => {
							if (DF.dwdm.state.isDwdmSite) {
								fetchDwdmTicketList(data.siteId)
									.then((dwdmTicketList) => {
										fetchSiteTtList(data.siteId, ["DWDM Alarm", "DWDM Link Down"])
											.then((ttList) => {
												console.log("ttList", ttList);
												fetchDwdmNodeDetails(data.siteId)
													.then((siteInfo) => {
														console.log("Site Info: ", siteInfo);
														nodeDetailProcess(siteInfo, alarmList, powerDwdm, ticketList, unmanagedDwdm, dwdmTicketList, [], ttList, temperature, transport, [], [], [], [], [], [], []);
													})
													.catch(console.error);
											})
											.catch(console.error);
									})
									.catch(console.error);
							} else {
								nodeDetailProcess(item, alarmList, powerList, ticketList, unmanagedDwdm, [], [], [], temperature, transport, [], [], [], [], [], [], []);
							}
						})
						.catch(console.error);
				})
				.catch(console.error);
		})
		.catch(console.error);
}

function handleDwdmSiteClick(datax, item, map) {
	DF.globalProcess.state.component.siteDetailsLoading = true;
	if (DF.dwdm.state.isDwdmSite) {
		DF.globalProcess.store.eta.modalStatus = "DWDM";
	} else {
		DF.globalProcess.store.eta.modalStatus = "SITEDOWN";
	}
	const coord = { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
	map.panTo(coord);
	map.setZoom(12);

	fetchAlarmList(item, datax.panelType)
		.then(({ alarmList, powerList }) => {
			fetchDwdmAlarmList(item, datax.panelType)
				.then(({ powerDwdm, unmanagedDwdm, temperature, transport }) => {
					fetchTicketList(item.title)
						.then((ticketList) => {
							if (DF.dwdm.state.isDwdmSite) {
								fetchDwdmTicketList(item.title)
									.then((dwdmTicketList) => {
										fetchSiteTtList(item.title, ["DWDM Alarm", "DWDM Link Down"])
											.then((ttList) => {
												siteDetailProcess(item, alarmList, powerDwdm, ticketList, unmanagedDwdm, dwdmTicketList, [], ttList, temperature, transport, [], [], [], [], [], [], []);
											})
											.catch(console.error);
									})
									.catch(console.error);
							} else {
								siteDetailProcess(item, alarmList, powerList, ticketList, unmanagedDwdm, [], [], [], temperature, transport, [], [], [], [], [], [], []);
							}
						})
						.catch(console.error);
				})
				.catch(console.error);
		})
		.catch(console.error);
}

function handleSiteClick(datax, item, map) {
	DF.globalProcess.state.component.siteDetailsLoading = true;
	if (DF.dwdm.state.isDwdmSite) {
		DF.globalProcess.store.eta.modalStatus = "DWDM";
	} else {
		DF.globalProcess.store.eta.modalStatus = "SITEDOWN";
	}
	const coord = { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
	map.panTo(coord);
	map.setZoom(12);

	if (DF.globalProcess.state.tab.selectedOption == "siteDown") {
		fetchAlarmList(item, datax.panelType)
			.then(({ alarmList, powerList }) => {
				fetchTicketList(item.title)
					.then((ticketList) => {
						fetchSiteTtList(item.title, [])
							.then((ttList) => {
								siteDetailProcess(item, alarmList, powerList, ticketList, [], [], [], ttList, [], [], [], [], [], [], [], [], []);
								// siteDetailProcess(item, alarmList, powerList, [], [], [], [], ttList, [], [], [], [], [], [], [], [], []);
							})
							.catch(console.error);
					})
					.catch(console.error);
				// siteDetailProcess(item, alarmList, powerList, [], [], [], [], [], [], [], [], [], [], [], [], [], []);
			})
			.catch(console.error);
	} else {
		fetchAlarmListOlt(item, datax.panelType)
			.then(({ alarmList, powerList }) => {
				fetchTicketList(item.title)
					.then((ticketList) => {
						fetchSiteTtList(item.title, [])
							.then((ttList) => {
								siteDetailProcess(item, alarmList, powerList, ticketList, [], [], [], ttList, [], [], [], [], [], [], [], [], []);
								// siteDetailProcess(item, alarmList, powerList, [], [], [], [], ttList, [], [], [], [], [], [], [], [], []);
							})
							.catch(console.error);
					})
					.catch(console.error);
				// siteDetailProcess(item, alarmList, powerList, [], [], [], [], [], [], [], [], [], [], [], [], [], []);
			})
			.catch(console.error);
	}

}

function handleSiteClickPower(datax, item, map) {
	DF.globalProcess.state.component.siteDetailsLoading = true;
	DF.globalProcess.store.eta.modalStatus = "PG";
	const coord = { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
	map.panTo(coord);
	map.setZoom(12);

	fetchAlarmList(item, datax.panelType)
		.then(({ alarmList, powerList }) => {
			fetchTicketListPower(item.title)
				.then((ticketList) => {
					fetchFmePgSiteTicketList(item.title)
						.then((pgTicketList) => {
							fetchSiteTtList(item.title, [])
								.then((ttList) => {
									siteDetailProcess(item, alarmList, powerList, ticketList, [], [], pgTicketList, ttList, [], [], [], [], [], [], []);
								})
								.catch(console.error);
						})
						.catch(console.error);
				})
				.catch(console.error);
		})
		.catch(console.error);
}

function handleFmeClick(item, ref) {
	ref.globalProcess.state.component.fmeDetailsLoading = true;

	MessageProcessor.process({
		serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_fme_basic_information",
		data: { user_id: item.username },
		showErrorMessage: false,
		success: (json) => {
			const fmeDetail = json.result;
			fetchFmeWoList(item.user_id)
				.then((fmeWoList) => {
					ref.globalProcess.store.fme.fmeDetailsSearch = fmeDetail;
					ref.globalProcess.store.fme.woListFmeSearch = fmeWoList;
					showModal("fmeDetails");
					ref.globalProcess.state.component.fmeDetailsLoading = false;
				})
				.catch(console.error);
		},
		error: console.error
	});
}

function handleFmePgClick(item, ref) {
	ref.globalProcess.state.component.fmeDetailsLoading = true;

	MessageProcessor.process({
		serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_fme_basic_information",
		data: {
			user_id: item.username
		},
		showErrorMessage: false,
		success: (json) => {
			const fmeDetail = json.result;
			fetchFmePgWoListAll(item.user_id)
				.then((fmeWoList) => {
					fetchFmePgWoListOnly(item.user_id)
						.then((fmePgWoList) => {
							ref.pg.store.fme.pgDetails = fmeDetail;
							ref.pg.store.fme.woList = fmeWoList;
							ref.pg.store.fme.woPgList = fmePgWoList;
							showModal("fmePgDetails");
							ref.globalProcess.state.component.fmeDetailsLoading = false;
						})
						.catch(console.error);
				})
				.catch(console.error);
		},
		error: console.error
	});
}

function fetchAlarmList(item, panelType) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/CN_GSC_ID_Surge_Noc_Dashboard/netdrone_maps/nm_get_maps_site_detail_info",
			// serviceId: "/netdrone_maps_v3/netdrone_maps_v3/netdrone_m_get_list_alarm_by_site",
			data: { siteid: item.title },
			showErrorMessage: false,
			success: (json) => {
				resolve({ alarmList: json.results, powerList: json.power });
			},
			error: reject
		});
	});
}
function fetchAlarmListOlt(item, panelType) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/CN_GSC_ID_Surge_Noc_Dashboard/netdrone_maps/nm_get_maps_site_detail_info_olt",
			// serviceId: "/netdrone_maps_v3/netdrone_maps_v3/netdrone_m_get_list_alarm_by_site",
			data: { siteid: item.title },
			showErrorMessage: false,
			success: (json) => {
				resolve({ alarmList: json.results, powerList: json.power });
			},
			error: reject
		});
	});
}

function fetchDwdmAlarmList(item, panelType) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_dwdm_alarm_list_by_site_id",
			data: { site_id: item.title },
			showErrorMessage: false,
			success: (json) => {
				resolve({ powerDwdm: json.results.power, unmanagedDwdm: json.results.unmanaged, temperature: json.results.temp, transport: json.results.transport });
			},
			error: reject
		});
	});
}

function fetchCoreRouterAlarmList(item, panelType) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_core_router_alarm_list_by_site_id",
			data: { site_id: item.title },
			showErrorMessage: false,
			success: (json) => {
				resolve({ unmanagedCoreRouter: json.results.unmanage, hardware: json.results.hardware, power: json.results.power, linkdown: json.results.linkdown, hightemp: json.results.hightemp, highutil: json.results.highutil });
			},
			error: reject
		});
	});
}

function fetchTicketList(siteId) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/CN_GSC_ID_Surge_Noc_Dashboard/netdrone_maps/nm_get_running_task_list_by_site_id",
			data: { site_id: siteId, task_status: ["dispatched", "completed", "scheduled", "inprocess", "accepted", "unscheduled"] },
			showErrorMessage: false,
			success: (json) => resolve(json.results),
			error: reject
		});
	});
}

function fetchDwdmTicketList(siteId) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_ticket_list_for_dwdm",
			data: { site_id: siteId, task_status: ["dispatched", "scheduled", "inprocess", "accepted"] },
			showErrorMessage: false,
			success: (json) => resolve(json.results),
			error: reject
		});
	});
}

function fetchTicketListPower(siteId) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_ticket_list",
			data: { site_id: siteId, task_status: ["dispatched", "scheduled", "inprocess", "accepted"] },
			showErrorMessage: false,
			success: (json) => resolve(json.results),
			error: reject
		});
	});
}

function fetchFmeWoList(userId) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_ticket_list",
			data: { user_id: userId, task_status: ["dispatched", "completed", "scheduled", "inprocess", "accepted"] },
			showErrorMessage: false,
			success: (json) => resolve(json.results),
			error: reject
		});
	});
}

function fetchFmePgWoListAll(userId) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_ticket_list",
			data: { user_id: userId, update_description: "", task_status: ["dispatched", "scheduled", "inprocess", "accepted"] },
			showErrorMessage: false,
			success: (json) => resolve(json.results),
			error: reject
		});
	});
}

function fetchFmePgWoListOnly(userId) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_ticket_list",
			data: { user_id: userId, update_description: "PGB", task_status: ["dispatched", "scheduled", "inprocess", "accepted", "completed"] },
			showErrorMessage: false,
			success: (json) => resolve(json.results),
			error: reject
		});
	});
}

function fetchFmePgSiteTicketList(siteId) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_ticket_list",
			data: { site_id: siteId, user_id: "", update_description: "PGB", task_status: ["dispatched", "scheduled", "inprocess", "accepted", "completed"] },
			showErrorMessage: false,
			success: (json) => resolve(json.results),
			error: reject
		});
	});
}

function fetchSiteTtList(siteId, ttType) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/CN_GSC_ID_Surge_Noc_Dashboard/netdrone_maps/nm_get_running_ticket_list_by_site_id",
			// serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_ticket_list_for_dwdm",
			data: {
				site_id: siteId,
				user_id: "",
				update_description: "",
				task_status: [],
				tt_type: ttType
			},
			showErrorMessage: false,
			success: (json) => resolve(json.results),
			error: reject
		});
	});
}

function fetchDwdmNodeDetails(siteId) {
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_get_dwdm_site_detail",
			data: {
				site_id: siteId
			},
			showErrorMessage: false,
			success: (json) => resolve(json.results),
			error: reject
		});
	});
}

async function nodeDetailProcess(item, alarmList, powerList, ticketList, dwdmList, dwdmTicketList, pgTicketList, ttList, temperatureAlarmList, transportAlarm, unmanagedCoreRouter, hardware, power, linkdown, hightemp, highutil) {
	console.log("item", item);
	DF.globalProcess.store.site.alarm.dwdmAlarmList = [];
	DF.globalProcess.store.site.alarm.dwdmTemperatureAlarmList = [];
	DF.globalProcess.store.site.alarm.dwdmTransportAlarmList = [];
	DF.globalProcess.store.site.ticket.siteDwdmTicketList = [];
	DF.globalProcess.store.site.alarm.siteAlarmList = [];
	DF.globalProcess.store.site.alarm.powerAlarmList = [];
	DF.globalProcess.store.site.ticket.siteTicketList = [];
	DF.globalProcess.store.site.ticket.siteTtList = [];
	DF.globalProcess.store.site.information.siteItem = [];
	DF.globalProcess.store.site.ticket.sitePgTicketList = [];

	// CORE ROUTER
	DF.globalProcess.store.site.alarm.coreRouterUnmanaged = [];
	DF.globalProcess.store.site.alarm.coreRouterHardware = [];
	DF.globalProcess.store.site.alarm.coreRouterPower = [];
	DF.globalProcess.store.site.alarm.coreRouterLinkDown = [];
	DF.globalProcess.store.site.alarm.coreRouterHighTemp = [];
	DF.globalProcess.store.site.alarm.coreRouterHighUtil = [];

	const formatTimestamp = (timestamp) => {
		const date = new Date(timestamp);
		return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
	};

	try {
		if (DF.dwdm.state.isDwdmSite) {
			if (dwdmList && dwdmList.length > 0) {
				DF.globalProcess.store.site.alarm.dwdmAlarmList = dwdmList.map((dwdm) => ({ ...dwdm, lastoccurrence: formatTimestamp(dwdm.lastoccurrence) }));
			}
			if (temperatureAlarmList && temperatureAlarmList.length > 0) {
				DF.globalProcess.store.site.alarm.dwdmTemperatureAlarmList = temperatureAlarmList.map((dwdm) => ({ ...dwdm, lastoccurrence: formatTimestamp(dwdm.lastoccurrence) }));
			}
			if (transportAlarm && transportAlarm.length > 0) {
				DF.globalProcess.store.site.alarm.dwdmTransportAlarmList = transportAlarm.map((dwdm) => ({ ...dwdm, lastoccurrence: formatTimestamp(dwdm.lastoccurrence) }));
			}
			if (dwdmTicketList && dwdmTicketList.length > 0) {
				DF.globalProcess.store.site.ticket.siteDwdmTicketList = dwdmTicketList.map((dwdm) => ({ ...dwdm, lastoccurrence: formatTimestamp(dwdm.lastoccurrence) }));
			}
		}
		if (DF.pg.state.component.isPgSite) {
			DF.globalProcess.store.site.ticket.sitePgTicketList = pgTicketList;
		}

		if (DF.coreRouter.state.isCoreRouterSite) {
			if (unmanagedCoreRouter && unmanagedCoreRouter.length > 0) {
				DF.globalProcess.store.site.alarm.coreRouterUnmanaged = unmanagedCoreRouter.map((dwdm) => ({ ...dwdm, lastoccurrence: formatTimestamp(dwdm.lastoccurrence) }));
			}
			if (hardware && hardware.length > 0) {
				DF.globalProcess.store.site.alarm.coreRouterHardware = hardware.map((dwdm) => ({ ...dwdm, lastoccurrence: formatTimestamp(dwdm.lastoccurrence) }));
			}
			if (power && power.length > 0) {
				DF.globalProcess.store.site.alarm.coreRouterPower = power.map((dwdm) => ({ ...dwdm, lastoccurrence: formatTimestamp(dwdm.lastoccurrence) }));
			}
			if (linkdown && linkdown.length > 0) {
				DF.globalProcess.store.site.alarm.coreRouterLinkDown = linkdown.map((dwdm) => ({ ...dwdm, lastoccurrence: formatTimestamp(dwdm.lastoccurrence) }));
			}
			if (hightemp && hightemp.length > 0) {
				DF.globalProcess.store.site.alarm.coreRouterHighTemp = hightemp.map((dwdm) => ({ ...dwdm, lastoccurrence: formatTimestamp(dwdm.lastoccurrence) }));
			}
			if (highutil && highutil.length > 0) {
				DF.globalProcess.store.site.alarm.coreRouterHighUtil = highutil.map((dwdm) => ({ ...dwdm, lastoccurrence: formatTimestamp(dwdm.lastoccurrence) }));
			}
		}

		DF.globalProcess.store.site.alarm.siteAlarmList = alarmList.map((alarm) => ({ ...alarm, lastoccurrence: formatTimestamp(alarm.lastoccurrence) }));
		DF.globalProcess.store.site.alarm.powerAlarmList = powerList.map((power) => ({ ...power, lastoccurrence: formatTimestamp(power.lastoccurrence) }));
		DF.globalProcess.store.site.ticket.siteTicketList = ticketList;
		DF.globalProcess.store.site.ticket.siteTtList = ttList;
		DF.globalProcess.store.site.information.siteItem = item;
		console.log("site item : ", DF.globalProcess.store.site.information.siteItem);
	} catch (error) {
		console.error("error process site detail data:", error);
	} finally {
		DF.globalProcess.state.component.siteDetailsLoading = false;
		showModal("nodeDetails");
	}
}

async function siteDetailProcess(item, alarmList, powerList, ticketList, dwdmList, dwdmTicketList, pgTicketList, ttList, temperatureAlarmList, transportAlarm, unmanagedCoreRouter, hardware, power, linkdown, hightemp, highutil) {
	DF.globalProcess.store.site.alarm.dwdmAlarmList = [];
	DF.globalProcess.store.site.alarm.dwdmTemperatureAlarmList = [];
	DF.globalProcess.store.site.alarm.dwdmTransportAlarmList = [];
	DF.globalProcess.store.site.ticket.siteDwdmTicketList = [];
	DF.globalProcess.store.site.alarm.siteAlarmList = [];
	DF.globalProcess.store.site.alarm.powerAlarmList = [];
	DF.globalProcess.store.site.ticket.siteTicketList = [];
	DF.globalProcess.store.site.ticket.siteTtList = [];
	DF.globalProcess.store.site.information.siteItem = [];
	DF.globalProcess.store.site.ticket.sitePgTicketList = [];

	// CORE ROUTER
	DF.globalProcess.store.site.alarm.coreRouterUnmanaged = [];
	DF.globalProcess.store.site.alarm.coreRouterHardware = [];
	DF.globalProcess.store.site.alarm.coreRouterPower = [];
	DF.globalProcess.store.site.alarm.coreRouterLinkDown = [];
	DF.globalProcess.store.site.alarm.coreRouterHighTemp = [];
	DF.globalProcess.store.site.alarm.coreRouterHighUtil = [];

	const formatTimestamp = (timestamp) => {
		const date = new Date(timestamp);
		return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
	};

	try {
		if (DF.dwdm.state.isDwdmSite) {
			if (dwdmList && dwdmList.length > 0) {
				DF.globalProcess.store.site.alarm.dwdmAlarmList = dwdmList.map((dwdm) => ({ ...dwdm, lastoccurrence: formatTimestamp(dwdm.lastoccurrence) }));
			}
			if (temperatureAlarmList && temperatureAlarmList.length > 0) {
				DF.globalProcess.store.site.alarm.dwdmTemperatureAlarmList = temperatureAlarmList.map((dwdm) => ({ ...dwdm, lastoccurrence: formatTimestamp(dwdm.lastoccurrence) }));
			}
			if (transportAlarm && transportAlarm.length > 0) {
				DF.globalProcess.store.site.alarm.dwdmTransportAlarmList = transportAlarm.map((dwdm) => ({ ...dwdm, lastoccurrence: formatTimestamp(dwdm.lastoccurrence) }));
			}
			if (dwdmTicketList && dwdmTicketList.length > 0) {
				DF.globalProcess.store.site.ticket.siteDwdmTicketList = dwdmTicketList.map((dwdm) => ({ ...dwdm, lastoccurrence: formatTimestamp(dwdm.lastoccurrence) }));
			}
		}
		if (DF.pg.state.component.isPgSite) {
			DF.globalProcess.store.site.ticket.sitePgTicketList = pgTicketList;
		}

		if (DF.coreRouter.state.isCoreRouterSite) {
			if (unmanagedCoreRouter && unmanagedCoreRouter.length > 0) {
				DF.globalProcess.store.site.alarm.coreRouterUnmanaged = unmanagedCoreRouter.map((dwdm) => ({ ...dwdm, lastoccurrence: formatTimestamp(dwdm.lastoccurrence) }));
			}
			if (hardware && hardware.length > 0) {
				DF.globalProcess.store.site.alarm.coreRouterHardware = hardware.map((dwdm) => ({ ...dwdm, lastoccurrence: formatTimestamp(dwdm.lastoccurrence) }));
			}
			if (power && power.length > 0) {
				DF.globalProcess.store.site.alarm.coreRouterPower = power.map((dwdm) => ({ ...dwdm, lastoccurrence: formatTimestamp(dwdm.lastoccurrence) }));
			}
			if (linkdown && linkdown.length > 0) {
				DF.globalProcess.store.site.alarm.coreRouterLinkDown = linkdown.map((dwdm) => ({ ...dwdm, lastoccurrence: formatTimestamp(dwdm.lastoccurrence) }));
			}
			if (hightemp && hightemp.length > 0) {
				DF.globalProcess.store.site.alarm.coreRouterHighTemp = hightemp.map((dwdm) => ({ ...dwdm, lastoccurrence: formatTimestamp(dwdm.lastoccurrence) }));
			}
			if (highutil && highutil.length > 0) {
				DF.globalProcess.store.site.alarm.coreRouterHighUtil = highutil.map((dwdm) => ({ ...dwdm, lastoccurrence: formatTimestamp(dwdm.lastoccurrence) }));
			}
		}

		DF.globalProcess.store.site.alarm.siteAlarmList = alarmList.map((alarm) => ({ ...alarm, lastoccurrence: formatTimestamp(alarm.lastoccurrence) }));
		// DF.globalProcess.store.site.alarm.powerAlarmList = powerList.map((power) => ({ ...power, lastoccurrence: formatTimestamp(power.lastoccurrence) }));
		DF.globalProcess.store.site.ticket.siteTicketList = ticketList;
		DF.globalProcess.store.site.ticket.siteTtList = ttList;
		DF.globalProcess.store.site.information.siteItem = item;
	} catch (error) {
		console.error("error process site detail data:", error);
	} finally {
		DF.globalProcess.state.component.siteDetailsLoading = false;
		showModal("siteDetails");
	}
}

function showModal(modalId) {
	const modalElement = document.getElementById(modalId);
	if (modalElement) {
		const modal = new bootstrap.Modal(modalElement, { backdrop: "static" });
		modal.show();
	} else {
		console.error(`Modal element with ID '${modalId}' not found.`);
	}
}
