// import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

// export function getAllSiteDownDataTable() {
// 	return new Promise((resolve, reject) => {
// 		MessageProcessor.process({
// 			serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_site_down_data_table",
// 			data: {
// 				power: false,
// 				status: "",
// 				hub_type: [],
// 				mc_cluster: [],
// 				region: [],
// 				circle: "",
// 				site_genset: "",
// 				is_vip: "",
// 				site_type: []
// 			},
// 			showErrorMessage: false,
// 			success: (json) => {
// 				resolve({ res: json.results });
// 			},
// 			error: (error) => {
// 				console.error(error, "error region site down count");
// 				reject(error);
// 			}
// 		});
// 	});
// }

import { MessageProcessor } from "@adc/vigour-ui/lib/spl";

export function getAllOltDownDataTable(hubType, region, isVip, siteType, siteDown,start_time, end_time) {
// export function getAllSiteDownDataTable(power, hubType, mcCluster, region, circle, siteGenset, isVip, siteType, siteDown,start_time, end_time) {
	if (isVip == null) {
		isVip = "";
	}
	return new Promise((resolve, reject) => {
		MessageProcessor.process({
			serviceId: "/CN_GSC_ID_Surge_Noc_Dashboard/netdrone_maps/nm_get_all_olt_down_info",
			// serviceId: "/netdrone_maps_v3/netdrone_maps_v4/netdrone_maps_v4_site_down_data_table",
			data: {
				status: [],
				is_hub: hubType,
				region: region,
				is_vip: isVip,
				site_type: siteType,
				is_site_down: siteDown,
				start_time,
				end_time
			},
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

// // mine
// {
//     "power":false,
//     "status":["1","1_4"],
//     "hub_type":[],
//     "mc_cluster":"", //
//     "region":"", //
//     "circle":[],
//     "site_genset":"",
//     "is_vip":"",
//     "site_type":["NORMAL"],
//     "vendor":[]
// }

// //ows

// {
//     "power": false,
//     "status": ["1","1_4"],
//     "hub_type": [],
//     "mc_cluster": [], //
//     "region": [], //
//     "circle": "",
//     "site_genset": "",
//     "is_vip": "",
//     "site_type": ["NORMAL"],
//     "vendor": []
//   }
