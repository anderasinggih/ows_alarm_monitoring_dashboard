import { reactive } from "vue";

export const IndexData = reactive({
	url: "",

	// DUMMY LAT LNG
	origin: { lat: -6.27165, lng: 106.60151 },
	destination: { lat: -6.3041903, lng: 106.5851097 },

	// TOTAL OUTAGES
	totalOutages: "...",

	// BACKGROUND MAPS
	backgroundMaps: null,

	componentState: 0,

	// SITE SEARCH
	coverageSite: null,
	siteItemSearch: {
		siteid: "",
		sitename: ""
	},
	siteSearchMarker: {
		clickAble: true,
		data: [],
		markers: [],
		zindex: 5,
		panelType: "siteSearch"
	},

	fmeSearchIco: "https://1057-sg-studio.teleows.com/adc-static/imagemgt/images/1057/netdrone_maps_v3/netdrone_maps_v3/sitedown_marker/fme.png?_v=standard_1716903051654?t=1716927516520",

	// REFETCH
	// SENTUH PALING TERAKHIR
	todayDate: null,
	lastUpdated: null,
	fetching: null,
	refetch: false,

	//==========================================================================================================================================================
	// BACKGROUND PROCESS
	globalProcess: {
		state: {
			tab: {
				selectedOption: "siteDown"
			},
			searching: {
				queryToSearch: "",
				queryState: 0,
				clearSearchBtn: false,
				modalSearchState: 0
			},
			component: {
				// FILTER APPLY
				applyFilterLoading: false,

				// SITEDOWN
				neDownMarkerLoading: false,
				neDownDataLoading: false,
				neDownMarkerMessage: "Loading NE Down Marker",

				// NE DOWN
				siteDownMarkerLoading: false,
				siteDownDataLoading: false,
				siteDownMarkerMessage: "Loading Site Down Marker",

				// REGION FILTER
				regionApply: false,
				areaApply: false,
				mcApply: false,

				// SEARCHING
				searchingLoading: false,
				fmeDetailsLoading: false,
				siteDetailsLoading: false,

				// PG
				loadingDataPg: false,
				loadingDataBreakdownPg: false,
				loadingEtaDataPg: false,
				loadingMarkerPg: false,
				loadingRefreshPgTrack: false,
				loadingMarkerNe: false,

				// DWDM
				loadingDwdmData: false,
				loadingDwdmMarker: false,
				isCoordZero: false,

				// LINK DOWN
				loadingLinkDownData: false,
				loadingLinkDownModal: true,
				loadingLinkDownBanner: 0,

				// CORE ROUTER
				loadingCoreRouterData: false,
				loadingCoreRouterMarker: false,

				// OBD
				loadingObdCarDetailsData: false
			}
		},
		marker: {
			selectMcClusterById: {
				clickAble: true,
				data: [],
				markers: [],
				zindex: 5,
				panelType: "site"
			}
		},
		store: {
			fme: {
				fmeDetailsSearch: undefined,
				woListFmeSearch: undefined,
				filteredWoListFmeSearch: [],
				fmeWoMessage: "Work Order List Not Found"
			},
			site: {
				information: {
					siteItem: undefined,
					siteTaskMessage: "Site Task List Not Found"
				},
				alarm: {
					siteAlarmList: undefined,
					powerAlarmList: [],
					alarmIdList: [],
					dwdmAlarmList: [],
					dwdmTemperatureAlarmList: [],
					dwdmTransportAlarmList: [],

					coreRouterUnmanaged: [],
					coreRouterHardware: [],
					coreRouterPower: [],
					coreRouterLinkDown: [],
					coreRouterHighTemp: [],
					coreRouterHighUtil: []
				},
				ticket: {
					siteTicketList: [],
					siteDwdmTicketList: [],
					ticketList: [],
					sitePgTicketList: [],
					siteTtList: []
				},
				query: {
					siteSearchQuery: "",
					siteDwdmSearchQuery: "",
					sitePgSearchQuery: "",
					siteTtSearchQuery: ""
				},
				checker: {
					siteTaskAll: true,
					siteTaskCm: true,
					siteTaskPm: true,
					siteTaskPlm: true,

					siteDwdmTaskAll: true,
					siteDwdmTaskCm: true,
					siteDwdmTaskPm: true,
					siteDwdmTaskPlm: true,

					sitePgTaskAll: true,
					sitePgTaskCm: true,
					sitePgTaskPm: true,
					sitePgTaskPlm: true,

					siteTtTaskAll: true,
					siteTtTaskCm: true,
					siteTtTaskNonCm: true
				}
			},
			maps: {
				backgroundMaps: null
			},
			searching: {
				emptyClusterMessage: "No result found",
				emptySiteMessage: "No result found",
				emptyFmeMessage: "No result found",
				clusterData: [],
				siteData: [],
				fmeData: [],
				mcClusterSearchResult: [],
				fmeSearchResult: [],
				siteSearchResult: [],
				siteQuickAccess: [
					{
						site_name: "09KLA0038_SENOPATI_KLA_PL",
						site_address: "JL. JUANG KEL. RT01/RW04 BATU GALIH KEC. CURUP TENGAH KAB. REJANG LEBONG",
						src: "https//1057-sg.teleows.com/app/images/1057/marker/sites2.png",
						is_vip: "No",
						latitude: "-5.32606",
						five_region: "SOUTHERN SUMATERA - LAMPUNG",
						hub_type: "SMALL HUB SITE",
						title: "09KLA0038",
						circle: "SUMATERA",
						longitude: "105.2898",
						site_class: "CRITICAL"
					},
					{
						site_name: "04PBR0185_MUARA_FAJAR_BARU_TB",
						site_address: "JL. YOS SUDARSO KM. 19 RT. 01 RW. 02 KEL. MUARA FAJAR KEC. RUMBAI KOTA PEKANBARU",
						src: "https://1057-sg.teleows.com/app/images/1057/marker/sites2.png",
						is_vip: "No",
						latitude: "0.64986",
						five_region: "NORTHERN SUMATERA - PKU BATAM",
						hub_type: "SMALL HUB SITE",
						title: "04PBR0185",
						circle: "SUMATERA",
						longitude: "101.43386",
						site_class: "B"
					},
					{
						site_name: "02LBP0250_MDN_TB",
						site_address: "JL PERHUBUNGAN LINGKUNGAN VIII KEC PERCUTSEI TUAN KEL LAUT DENDANG KAB DELI SERDANG",
						src: "https://1057-sg.teleows.com/app/images/1057/marker/sites2.png",
						is_vip: "No",
						latitude: "3.62086",
						five_region: "	NORTHERN SUMATERA - ACEH MEDAN",
						hub_type: "MEDIUM HUB SITE",
						title: "02LBP0250",
						circle: "SUMATERA",
						longitude: "98.73597",
						site_class: "CRITICAL"
					},
					{
						site_name: "02MDN0522_SEKSAMA_GT",
						site_address: "JL SEKSAMA NO 209 LINGK 2 KEL BINJAI KEC MEDAN DENAI KOTA MEDAN",
						src: "https://1057-sg.teleows.com/app/images/1057/marker/sites2.png",
						is_vip: "No",
						latitude: "3.55247",
						five_region: "NORTHERN SUMATERA - ACEH MEDAN",
						hub_type: "SMALL HUB SITE",
						title: "02MDN0522",
						circle: "SUMATERA",
						longitude: "98.71052",
						site_class: "CRITICAL"
					},
					{
						site_name: "07PLG0223_TELKOM_SUDIRMAN_PL",
						site_address: "JL JEND SUDIRMAN NO 23 RT021/RW007 KEL SEKIP JAYA KEC KEMUNING KOTA PALEMBANG",
						src: "https//1057-sg.teleows.com/app/images/1057/marker/sites2.png",
						is_vip: "No",
						latitude: "-2.96787",
						five_region: "SOUTHERN SUMATERA - PALEMBANG BABEL",
						hub_type: "END SITE",
						title: "07PLG0223",
						circle: "SUMATERA",
						longitude: "104.74992",
						site_class: "A"
					},
					{
						site_name: "07PLG0429_SAKO_PLG1_ST",
						site_address: "JL. MULYOREJO NO. 27 DUSUN II RT 04 RW 02 DESA MULYOREJO I KEC. BUNGAMAYANG KAB. LAMPUNG UTARA",
						src: "https://1057-sg.teleows.com/app/images/1057/marker/sites2.png",
						is_vip: "No",
						latitude: "-2.94925",
						five_region: "SOUTHERN SUMATERA - PALEMBANG BABEL",
						hub_type: "END SITE",
						title: "07PLG0429",
						circle: "SUMATERA",
						longitude: "104.81272",
						site_class: "A"
					},
					{
						site_name: "09TJK0128_PARING_MT",
						site_address: "JL.RA BASYID NO 19 RT.05 LT II KEL.LABUHAN DALAM KEC.TANJUNG SENANG KOTA BANDAR LAMPUNG",
						src: "https://1057-sg.teleows.com/app/images/1057/marker/sites2.png",
						is_vip: "No",
						latitude: "-5.35748",
						five_region: "SOUTHERN SUMATERA - LAMPUNG",
						hub_type: "END SITE",
						title: "09TJK0128",
						circle: "SUMATERA",
						longitude: "105.26184",
						site_class: "A"
					},
					{
						site_name: "09KOT0051_RAYAMINCANG_MT",
						site_address: "JALAN RAYA MINANG RT01 DUSUN PODO MORO DESA NEGERI SAKTI KECAMATAN TALANG PADANG KABUPATEN TANGGAMUS LAMPUNG",
						src: "https://1057-sg.teleows.com/app/images/1057/marker/sites2.png",
						is_vip: "No",
						latitude: "-5.35636",
						five_region: "SOUTHERN SUMATERA - LAMPUNG",
						hub_type: "END SITE",
						title: "09KOT0051",
						circle: "SUMATERA",
						longitude: "104.77846",
						site_class: "B"
					},
					{
						site_name: "04PBR0024_PONPES_UMMUL_QURO_PL",
						site_address: "RT001/RW006 JL. SEMANGKA KEL. BINA WIDYA KEC. TAMPAN KAB. PEKANBARU",
						src: "https://1057-sg.teleows.com/app/images/1057/marker/sites2.png",
						is_vip: "No",
						latitude: "0.4982",
						five_region: "NORTHERN SUMATERA - PKU BATAM",
						hub_type: "END SITE",
						title: "04PBR0024",
						circle: "SUMATERA",
						longitude: "101.37764",
						site_class: "B"
					},
					{
						site_name: "04PBR0295_LIMBUNGAN_IB",
						site_address: "JL. TELUK LEOK RT. 003 RW.011 KELURAHAN LIMBUNGAN KECAMATAN RUMBAI PESISIR KOTA PEKANBARU PROVINSI RIAU",
						src: "https://1057-sg.teleows.com/app/images/1057/marker/sites2.png",
						is_vip: "No",
						latitude: "0.55354",
						five_region: "NORTHERN SUMATERA - PKU BATAM",
						hub_type: "END SITE",
						title: "04PBR0295",
						circle: "SUMATERA",
						longitude: "101.46201",
						site_class: "C"
					},
					{
						site_name: "01BIR0108_SAMPOI_AJAD_JEUNIB",
						site_address: "JL. IRIGASI, KEL. TANJONG BUNGONG, KEC. JEUNIEB, KAB. BIREUEN",
						src: "https://1057-sg.teleows.com/app/images/1057/marker/sites2.png",
						is_vip: "No",
						latitude: "5.15992",
						five_region: "NORTHERN SUMATERA - PKU BATAM",
						hub_type: "END SITE",
						title: "01BIR0108",
						circle: "SUMATERA",
						longitude: "96.52925",
						site_class: "C"
					},
					{
						site_name: "01BIR0079_GEROGOK_EP",
						site_address: "JL. RAYA BANDA ACEH MEDAN KM 235 DESA KULU KEC. GANDA PURA",
						src: "https://1057-sg.teleows.com/app/images/1057/marker/sites2.png",
						is_vip: "No",
						latitude: "5.21347",
						five_region: "NORTHERN SUMATERA - ACEH MEDAN",
						hub_type: "MEDIUM HUB SITE",
						title: "01BIR0079",
						circle: "SUMATERA",
						longitude: "96.83878",
						site_class: "A"
					},
					{
						site_name: "02MDN0097_JLTANJUNG_RAYA_PL",
						site_address: "BUILDING/KOMPLEK : SUBAREA : STREETNAME : NO: RT: RW: DUSUNKAMPUNG: DESAKELURAHAN: HELVETIA TENGAH POSTCODE : 20124",
						src: "https://1057-sg.teleows.com/app/images/1057/marker/sites2.png",
						is_vip: "No",
						latitude: "3.61032",
						five_region: "NORTHERN SUMATERA - ACEH MEDAN",
						hub_type: "SMALL HUB SITE",
						title: "02MDN0097",
						circle: "SUMATERA",
						longitude: "98.63682",
						site_class: "A"
					},
					{
						site_name: "02MDN0506_JLGARU_EP",
						site_address: "KODYA MEDAN PROP SUMATERA UTARA",
						src: "https://1057-sg.teleows.com/app/images/1057/marker/sites2.png",
						is_vip: "No",
						latitude: "3.54303",
						five_region: "NORTHERN SUMATERA - ACEH MEDAN",
						hub_type: "SMALL HUB SITE",
						title: "02MDN0506",
						circle: "SUMATERA",
						longitude: "98.70641",
						site_class: "CRITICAL"
					}
				]
			},
			eta: {
				ticketDetail: null,
				originData: { lat: 0, lng: 0 },
				destinationData: { lat: 0, lng: 0 },
				travelDistance: null,
				estimatedTime: null,
				timeInTraffic: null,
				modalStatus: "",

				dwdmTicketDetail: null,
				dwdmOriginData: { lat: 0, lng: 0 },
				dwdmDestinationData: { lat: 0, lng: 0 },

				pgTicketDetail: null,
				pgOriginData: { lat: 0, lng: 0 },
				pgDestinationData: { lat: 0, lng: 0 }
			}
		},
		checker: {
			fme: {
				fmeAll: true,
				fmeCm: true,
				fmePm: true,
				fmePlm: true
			}
		},
		query: {
			fme: {
				woSearchQuery: ""
			},
			searching: {
				modalSearchQuery: "",
				searchQueryAll: ""
			},
			mc: {
				searchQuery: ""
			}
		},
		apiParams: {
			mcClusterData: ""
		},
		screen: 0
	},

	siteDown: {
		marker: {
			aging: {
				multipleSiteDown: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "site"
				},
				arraySiteDown: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "site"
				},
				moreDay: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "site"
				}
			},
			fme: {
				fmeIdle: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "fme"
				},
				fmeBusy: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "fme"
				}
			}
		},
		state: {
			ttCorrelation: {
				modalState: 0,
				ttTableLoading: false,
				showTtId: false
			},
			filter: {
				isShowing: 0
			},
			collapse: {
				data: [],
				loading: false,
				show: 0
			},
			collapseInitialRca: {
				data: [],
				loading: false,
				show: 0
			},
			modalRegion: {
				isOpen: false,
				isMaximize: false,
				circle: "",
				openState: 0
			},
			modalExport: {
				title: "",
				step: "",
				isRegionWise: false,
				rowsPerPage: 10,
				currentPage: 1,
				showing: 0,
				loading: false,
				data: [],
				showHubBadge: false,
				showRegionBadge: false,
				networkModel: "all-selected",
				durationModel: "all-duration",
				isMaximize: false,
				searchQuery: ""
			},
			regionWise: {
				data: [],
				step: ""
			},
			siteDownTrend: {
				isOpen: 0,
				pickDate: false,
				pickDateFifteen: false
			},
			siteDownHubType: {
				clearFilter: false
			}
		},
		component: {
			regionApply: false,
			mcApply: false,
			areaApply: false
		},
		checker: {
			marker: {
				oneHour: false,
				fourHour: false,
				eightHour: false,
				twentyFourHour: false,
				moreDay: false
			},
			hub: {
				core: false,
				big: false,
				medium: false,
				small: false,
				end: false,
				isHub: false,
				nonHub: false
			},
			vip: {
				isVip: false,
				nonVip: false
			},
			fme: {
				busy: false,
				idle: false
			},
			power: {
				isPowerAlarm: false
			},
			siteType: {
				n3t: false,
				uso: false,
				all: true
			},
			siteDown: {
				isSiteDown: false,
				nonSiteDown: false
			},
		},
		store: {
			ttCorrelation: {
				data: [],
				cardColors: ["rgb(199, 0, 11, 0.05)", "rgb(237, 109, 0, 0.05)", "rgb(252, 200, 0, 0.05)", "rgb(206, 206, 206,0.2)"],
				tableData: [],
				ttCorrelationId: ""
			},
			exportSiteDownAlarm: {
				data: [],
				loading: false
			},
			siteDownTrend: {
				data: {
					JAVA: {},
					JAYA: {},
					KALISUMAPA: {},
					SUMATERA: {}
				},
				cutOffTime: new Date("2024-11-25"),
				selector: {
					datePickerSelected: [new Date(), new Date()],
					startDate: null,
					endDate: null,
					hubType: {
						selectedOption: [],
						apiParams: [],
						option: [{ hub_type: "CORE HUB SITE" }, { hub_type: "BIG HUB SITE" }, { hub_type: "MEDIUM HUB SITE" }, { hub_type: "SMALL HUB SITE" }, { hub_type: "END SITE" }],
						value: [],
						selectedOptionString: ""
					},
					interval: {
						timePicker: "8",
						value: "Hourly"
					}
				}
			},
			modalRegion: {
				regionSummaryData: []
			}
		},
		selector: {
			region: {
				selectedOption: "",
				selectedLon: "",
				selectedLat: "",
				selectedZoom: "",
				option: [
					{ area_name: "JAYA", location_name: "JAYA", lat: -6.23807, lon: 106.83288, zoom: 10.5 },
					{ area_name: "JAVA", location_name: "JAVA", lat: -7.285102, lon: 108.776913, zoom: 8 },
					{ area_name: "SUMATERA", location_name: "SUMATERA", lat: -0.549317, lon: 101.89911, zoom: 5 },
					{ area_name: "KALISUMAPA", location_name: "KALISUMAPA", lat: 0.81076, lon: 124.880993, zoom: 5.5 }
				],
				value: null
			},
			area: {
				selectedOption: [],
				option: [],
				value: [],
				selectedOptionString: ""
			},
			siteType: {
				selectedOption: [],
				option: [],
				value: [],
				selectedOptionString: ""
			},
			mcCluster: {
				selectedOption: [],
				option: [],
				value: [],
				selectedOptionString: ""
			}
		},
		apiParams: {
			hubType: null,
			hubCheck: null,
			vipCheck: null,
			siteDownCheck: null,
			powerAlarm: false,
			siteDownChecker: [],
			siteType: [],
			circleString: "",
			hubTypeString: ""
		},
		start_time: getSevenDaysAgoStart(),
		end_time: getCurrentDateTime(),
		inputSite:'',
		vendorWiseData: null
	},

	oltDown: {
		marker: {
			aging: {
				multipleSiteDown: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "site"
				},
				arraySiteDown: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "site"
				},
				moreDay: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "site"
				}
			},
			fme: {
				fmeIdle: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "fme"
				},
				fmeBusy: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "fme"
				}
			}
		},
		state: {
			ttCorrelation: {
				modalState: 0,
				ttTableLoading: false,
				showTtId: false
			},
			filter: {
				isShowing: 0
			},
			collapse: {
				data: [],
				loading: false,
				show: 0
			},
			modalRegion: {
				isOpen: false,
				isMaximize: false,
				circle: "",
				openState: 0
			},
			modalExport: {
				title: "",
				step: "",
				isRegionWise: false,
				rowsPerPage: 10,
				currentPage: 1,
				showing: 0,
				loading: false,
				data: [],
				showHubBadge: false,
				showRegionBadge: false,
				networkModel: "all-selected",
				durationModel: "all-duration",
				isMaximize: false,
				searchQuery: ""
			},
			regionWise: {
				data: [],
				step: ""
			},
			siteDownTrend: {
				isOpen: 0,
				pickDate: false,
				pickDateFifteen: false
			},
			siteDownHubType: {
				clearFilter: false
			}
		},
		component: {
			regionApply: false,
			mcApply: false,
			areaApply: false
		},
		checker: {
			marker: {
				oneHour: false,
				fourHour: false,
				eightHour: false,
				twentyFourHour: false,
				moreDay: false
			},
			hub: {
				core: false,
				big: false,
				medium: false,
				small: false,
				end: false,
				isHub: false,
				nonHub: false
			},
			vip: {
				isVip: false,
				nonVip: false
			},
			fme: {
				busy: false,
				idle: false
			},
			power: {
				isPowerAlarm: false
			},
			siteType: {
				n3t: false,
				uso: false,
				all: true
			},
			oltDown: {
				isSiteDown: false,
				nonSiteDown: false
			},
		},
		store: {
			ttCorrelation: {
				data: [],
				cardColors: ["rgb(199, 0, 11, 0.05)", "rgb(237, 109, 0, 0.05)", "rgb(252, 200, 0, 0.05)", "rgb(206, 206, 206,0.2)"],
				tableData: [],
				ttCorrelationId: ""
			},
			exportSiteDownAlarm: {
				data: [],
				loading: false
			},
			siteDownTrend: {
				data: {
					JAVA: {},
					JAYA: {},
					KALISUMAPA: {},
					SUMATERA: {}
				},
				cutOffTime: new Date("2024-11-25"),
				selector: {
					datePickerSelected: [new Date(), new Date()],
					startDate: null,
					endDate: null,
					hubType: {
						selectedOption: [],
						apiParams: [],
						option: [{ hub_type: "CORE HUB SITE" }, { hub_type: "BIG HUB SITE" }, { hub_type: "MEDIUM HUB SITE" }, { hub_type: "SMALL HUB SITE" }, { hub_type: "END SITE" }],
						value: [],
						selectedOptionString: ""
					},
					interval: {
						timePicker: "8",
						value: "Hourly"
					}
				}
			},
			modalRegion: {
				regionSummaryData: []
			}
		},
		selector: {
			region: {
				selectedOption: "",
				selectedLon: "",
				selectedLat: "",
				selectedZoom: "",
				option: [
					{ area_name: "JAYA", location_name: "JAYA", lat: -6.23807, lon: 106.83288, zoom: 10.5 },
					{ area_name: "JAVA", location_name: "JAVA", lat: -7.285102, lon: 108.776913, zoom: 8 },
					{ area_name: "SUMATERA", location_name: "SUMATERA", lat: -0.549317, lon: 101.89911, zoom: 5 },
					{ area_name: "KALISUMAPA", location_name: "KALISUMAPA", lat: 0.81076, lon: 124.880993, zoom: 5.5 }
				],
				value: null
			},
			area: {
				selectedOption: [],
				option: [],
				value: [],
				selectedOptionString: ""
			},
			siteType: {
				selectedOption: [],
				option: [],
				value: [],
				selectedOptionString: ""
			},
			mcCluster: {
				selectedOption: [],
				option: [],
				value: [],
				selectedOptionString: ""
			}
		},
		apiParams: {
			hubType: null,
			hubCheck: null,
			vipCheck: null,
			siteDownCheck: null,
			powerAlarm: false,
			siteDownChecker: [],
			siteType: [],
			circleString: "",
			hubTypeString: ""
		},
		start_time: getSevenDaysAgoStart(),
		end_time: getCurrentDateTime()
	},

	neDown: {
		marker: {
			aging: {
				multipleSiteDown: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "site"
				},
				arrayNeDown: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "site"
				},
				oneHour: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "site"
				},
				fourHour: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "site"
				},
				eightHour: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "site"
				},
				twentyFourHour: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "site"
				},
				moreDay: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "site"
				}
			},
			fme: {
				fmeIdle: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "fme"
				},
				fmeBusy: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "fme"
				}
			}
		},
		store: {
			regionWise: {
				regions: [
					{ label: "JAVA", circleData: [], barData: [], siteDownArray: [], total: 0 },
					{ label: "JAYA", circleData: [], barData: [], siteDownArray: [], total: 0 },
					{ label: "KSMP", circleData: [], barData: [], siteDownArray: [], total: 0 },
					{ label: "SMTR", circleData: [], barData: [], siteDownArray: [], total: 0 }
				]
			},
			durationRange: {
				totalUnique: "...",
				belowOneHourUnique: "...",
				oneToFourHourUnique: "...",
				fourToEightHourUnique: "...",
				eightToTwentyFourHourUnique: "...",
				moreDayUnique: "...",

				total2G: "...",
				belowOneHour2G: "...",
				oneToFourHour2G: "...",
				fourToEightHour2G: "...",
				eightToTwentyFourHour2G: "...",
				moreDay2G: "...",

				total4G: "...",
				belowOneHour4G: "...",
				oneToFourHour4G: "...",
				fourToEightHour4G: "...",
				eightToTwentyFourHour4G: "...",
				moreDay4G: "...",

				total5G: "...",
				belowOneHour5G: "...",
				oneToFourHour5G: "...",
				fourToEightHour5G: "...",
				eightToTwentyFourHour5G: "...",
				moreDay5G: "..."
			},
			vendorWise: {
				imgHuawei: require("../../assets/img/logo/huawei-logo-square.png"),
				imgNokia: require("../../assets/img/logo/nokia-logo-square.png"),
				imgEricsson: require("../../assets/img/logo/ericsson-logo-square.png"),

				cellDownHuawei2G: 0,
				cellDownNokia2G: 0,
				cellDownEricsson2G: 0,

				cellDownHuawei4G: 0,
				cellDownNokia4G: 0,
				cellDownEricsson4G: 0,

				totalHuawei: 9999999,
				totalNokia: 9999999,
				totalEricsson: 9999999,

				huaweiNe2G: 9999999,
				nokiaNe2G: 9999999,
				ericssonNe2G: 9999999,

				huaweiNe4G: 9999999,
				nokiaNe4G: 9999999,
				ericssonNe4G: 9999999,

				huaweiNe5G: 9999999,
				nokiaNe5G: 9999999,
				ericssonNe5G: 9999999
			},
			regionWise: {
				regionsAll: [
					{ label: "JAYA", circleData: [], barData: [], neDownArray: [], total: 0 },
					{ label: "JAVA", circleData: [], barData: [], neDownArray: [], total: 0 },
					{ label: "SMTR", circleData: [], barData: [], neDownArray: [], total: 0 },
					{ label: "KSMP", circleData: [], barData: [], neDownArray: [], total: 0 }
				],
				regions2G: [
					{ label: "JAYA", circleData: [], barData: [], neDownArray: [], total: 0 },
					{ label: "JAVA", circleData: [], barData: [], neDownArray: [], total: 0 },
					{ label: "SMTR", circleData: [], barData: [], neDownArray: [], total: 0 },
					{ label: "KSMP", circleData: [], barData: [], neDownArray: [], total: 0 }
				],
				regions4G: [
					{ label: "JAYA", circleData: [], barData: [], neDownArray: [], total: 0 },
					{ label: "JAVA", circleData: [], barData: [], neDownArray: [], total: 0 },
					{ label: "SMTR", circleData: [], barData: [], neDownArray: [], total: 0 },
					{ label: "KSMP", circleData: [], barData: [], neDownArray: [], total: 0 }
				],
				regions5G: [
					{ label: "JAYA", circleData: [], barData: [], neDownArray: [], total: 0 },
					{ label: "JAVA", circleData: [], barData: [], neDownArray: [], total: 0 },
					{ label: "SMTR", circleData: [], barData: [], neDownArray: [], total: 0 },
					{ label: "KSMP", circleData: [], barData: [], neDownArray: [], total: 0 }
				],
				regionsSelected: [
					{ label: "JAYA", circleData: [], barData: [], neDownArray: [], total: 0 },
					{ label: "JAVA", circleData: [], barData: [], neDownArray: [], total: 0 },
					{ label: "SMTR", circleData: [], barData: [], neDownArray: [], total: 0 },
					{ label: "KSMP", circleData: [], barData: [], neDownArray: [], total: 0 }
				]
			}
		},
		component: {
			regionApply: false,
			mcApply: false,
			areaApply: false,
			bannerState: 0
		},
		state: {
			regionWise: {
				loadingAll: false,
				loading2g: false,
				loading4g: false,
				loading5g: false,
				selectedTechType: "all"
			},
			filter: {
				isShowing: 0
			},
			modalExport: {
				title: "",
				step: "",
				isRegionWise: false,
				rowsPerPage: 10,
				currentPage: 1,
				showing: 0,
				loading: false,
				data: [],
				showHubBadge: false,
				showRegionBadge: false,
				networkModel: "all-selected",
				durationModel: "all-duration",
				isMaximize: false,
				searchQuery: ""
			},
			collapse: {
				show: 0,
				loading: false,
				data: [],
				clearFilter: false
			},
			modalFilter: {
				selectedNetwork: "allNetwork",
				selectedDuration: "allDuration"
			}
		},
		selector: {
			regionWise: {
				buttonValue: "allChecker"
			},
			region: {
				selectedOption: "",
				selectedLon: "",
				selectedLat: "",
				selectedZoom: "",
				option: [
					{ area_name: "JAYA", location_name: "JAYA", lat: -6.23807, lon: 106.83288, zoom: 10.5 },
					{ area_name: "JAVA", location_name: "JAVA", lat: -7.285102, lon: 108.776913, zoom: 8 },
					{ area_name: "SUMATERA", location_name: "SUMATERA", lat: -0.549317, lon: 101.89911, zoom: 5 },
					{ area_name: "KALISUMAPA", location_name: "KALISUMAPA", lat: 0.81076, lon: 124.880993, zoom: 5.5 }
				],
				value: null
			},
			area: {
				selectedOption: [],
				option: [],
				value: [],
				selectedOptionString: ""
			},
			mcCluster: {
				selectedOption: [],
				option: [],
				value: [],
				selectedOptionString: ""
			}
		},
		checker: {
			marker: {
				oneHour: true,
				fourHour: true,
				eightHour: false,
				twentyFourHour: false,
				moreDay: false
			},
			hub: {
				core: false,
				big: false,
				medium: false,
				small: false,
				end: false
			},
			vip: {
				isVip: false,
				nonVip: false
			},
			fme: {
				busy: false,
				idle: false
			},
			type: {
				ne2G: true,
				ne4G: true,
				ne5G: true
			},
			siteType: {
				n3t: false,
				uso: false,
				all: true
			}
		},
		apiParams: {
			hubType: [],
			hubTypeString: "",
			circleString: "",
			vipCheck: null,
			powerAlarm: false,
			neType: ["2g", "4g", "5g"],
			neDownChecker: [],
			siteType: []
		}
	},

	pg: {
		marker: {
			site: {
				oneHour: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "sitePower"
				},
				fourHour: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "sitePower"
				},
				eightHour: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "sitePower"
				},
				twentyFourHour: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "sitePower"
				},
				moreDay: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "sitePower"
				},
				all: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "sitePower"
				}
			},
			fme: {
				pgAll: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 10,
					panelType: "fmePg"
				}
			}
		},
		store: {
			fme: {
				pgDetails: undefined,
				woList: undefined,
				woPgList: undefined,
				woPgSearchQuery: "",

				filteredWoList: [],
				filteredWoListPg: [],
				fmePgWoMessage: "Work Order List Not Found",
				fmePgAll: true,
				fmePgCm: true,
				fmePgPm: true,
				fmePgPlm: true,
				fmePgOnlyAll: true,
				fmePgOnlyCm: true,
				fmePgOnlyPlm: true
			},
			route: {
				travelDistance: null,
				estimatedTime: null,
				timeInTraffic: null
			},
			ticket: {
				getSingleTicket: null
			},
			modalSummary: {
				data: []
			},
			pgSummary: {
				pg_existing: "...",
				pg_idle: "...",
				pg_installed: "...",
				pg_movement: "...",
				pg_not_allocated: "...",
				fm_office_impacted: "...",
				site_impacted: "...",
				fm_not_allocated: []
			},
			pgCountHubType: [
				{
					not_yet: "...",
					handled: "...",
					hub_type: "Core Site"
				},
				{
					not_yet: "...",
					handled: "...",
					hub_type: "Big Hub"
				},
				{
					not_yet: "...",
					handled: "...",
					hub_type: "Medium Hub"
				},
				{
					not_yet: "...",
					handled: "...",
					hub_type: "Critical"
				},
				{
					not_yet: "...",
					handled: "...",
					hub_type: "Small Hub"
				},
				{
					not_yet: "...",
					handled: "...",
					hub_type: "End Site"
				}
			],
			pgBreakDownData: [
				{
					hub_type: "Core Site",
					site_down: "...",
					no_pg_allocated: "...",
					pg_movement: "...",
					pg_installed: "..."
				},
				{
					hub_type: "Big Hub",
					site_down: "...",
					no_pg_allocated: "...",
					pg_movement: "...",
					pg_installed: "..."
				},
				{
					hub_type: "Medium Hub",
					site_down: "...",
					no_pg_allocated: "...",
					pg_movement: "...",
					pg_installed: "..."
				},
				{
					hub_type: "Small Hub",
					site_down: "...",
					no_pg_allocated: "...",
					pg_movement: "...",
					pg_installed: "..."
				},
				{
					hub_type: "Critical",
					site_down: "...",
					no_pg_allocated: "...",
					pg_movement: "...",
					pg_installed: "..."
				},
				{
					hub_type: "End Site",
					site_down: "...",
					no_pg_allocated: "...",
					pg_movement: "...",
					pg_installed: "...",
					is_end_site: true
				}
			],
			pgOutageSummary: {
				loading: false,
				dataFmOffice: [],
				dataSite: []
			},
			pgNotAllocated: {
				data: [],
				dataSummary: {
					pg_not_allocated: "...",
					pg_movement: "...",
					pg_installed: "...",
					pg_not_allocated_table: [],
					pg_movement_table: [],
					pg_installed_table: []
				},
				pgNotYetDeploy: [],
				pgMovement: [],
				pgInstalled: []
			}
		},
		state: {
			pgNotAllocated: {
				openModal: 0,
				openDropdown: false,
				pgNotAllocatedModalLoading: false
			},
			fmOfficeModal: {
				openModal: 0
			},
			siteImpactModal: {
				openModal: 0
			},
			fme: {
				titleStatus: "",
				pgStateEta: "",
				modalEtaState: "",
				fmePgModalTitle: "",
				fmePgModalLastUpdated: ""
			},
			component: {
				pg: 0,
				pgTrackingDetail: 0,
				pgTrackingDetailProps: 0,
				compStatePgBanner: 0,
				isCoordZero: false,
				intervalId: null,
				isPgSite: false,

				showPgModalSummary: false,
				showDataFmOffice: true,
				showDataSite: false,
				pgModalSummary: 0,
				modalSummaryLoading: false,
				modalSummaryLoadingFmOffice: false,
				percentageLoadingFmOffice: 0,
				percentageLoadingSiteImpacted: 0,
				pagination: {
					fmOffice: {
						currentPage: 1,
						itemsPerPage: 10
					},
					site: {
						currentPage: 1,
						itemsPerPage: 10
					}
				},

				circleModel: "",
				hubModel: ""
			},
			collapse: {
				isOpen: 0
			},
			filter: {
				isShowing: 0
			}
		},
		component: {
			regionApply: false,
			mcApply: false,
			areaApply: false
		},
		checker: {
			site: {
				oneHour: true,
				fourHour: true,
				eightHour: true,
				twentyFourHour: true,
				moreDay: true
			},
			fme: {
				idle: false,
				movement: true,
				installed: true
			},
			hub: {
				core: false,
				big: false,
				medium: false,
				critical: false,
				small: false,
				end: false
			},
			vip: {
				isVip: false,
				nonVip: false,
				vipSite: null
			},
			genset: {
				avail: false,
				notAvail: false
			}
		},
		selector: {
			region: {
				selectedOption: "",
				selectedLon: "",
				selectedLat: "",
				selectedZoom: "",
				option: [
					{ area_name: "JAYA", location_name: "JAYA", lat: -6.23807, lon: 106.83288, zoom: 10.5 },
					{ area_name: "JAVA", location_name: "JAVA", lat: -7.285102, lon: 108.776913, zoom: 8 },
					{ area_name: "SUMATERA", location_name: "SUMATERA", lat: -0.549317, lon: 101.89911, zoom: 5 },
					{ area_name: "KALISUMAPA", location_name: "KALISUMAPA", lat: 0.81076, lon: 124.880993, zoom: 5.5 }
				],
				value: null
			},
			area: {
				selectedOption: [],
				option: [],
				value: [],
				selectedOptionString: ""
			},
			mcCluster: {
				selectedOption: [],
				option: [],
				value: [],
				selectedOptionString: ""
			}
		},
		apiParams: {
			hubType: [],
			vipCheckPg: null,
			genset: false,
			pgParams: []
		}
	},

	dwdm: {
		marker: {
			site: {
				dwdmMarker: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "siteDwdm"
				}
			},
			fme: {
				idle: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "fme"
				},
				busy: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "fme"
				}
			},
			vertex: {
				vertexLine: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 4,
					panelType: "vertex"
				}
			}
		},
		line: {
			dwdmLine: {
				clickAble: true,
				data: [],
				lines: [],
				zindex: 3,
				panelType: "lineDwdm"
			}
		},
		component: {
			regionApply: false,
			mcApply: false,
			areaApply: false
		},
		store: {
			banner: {
				countAllAlarm: "...",
				countNe: "...",
				countPower: "...",
				countSites: "...",
				countSuspectedDown: "...",
				countTemperature: "...",
				countTransport: "...",
				countUnmanaged: "...",
				countWithDg: "..."
			},
			siteStats: {
				data: {}
			},
			lineDetails: {
				sourceData: {},
				destinationData: {}
			},
			nodeDetails: {
				data: {}
			}
		},
		state: {
			isDwdmSite: false,
			isVertexNode: false,
			dwdmBanner: 0,
			siteStats: 0,
			filter: {
				isShowing: 0
			}
		},
		checker: {
			line: {
				huawei: true,
				nokia: true,
				zte: true
			},
			map: {
				showNode: true,
				showLine: true,
				showSite: true
			},
			status: {
				normalCheck: false,
				withAlarmCheck: true,
				powerAlarmCheck: true,
				powerDgCheck: true,
				temperatureCheck: true,
				unmanagedCheck: true,
				suspectDown: true,
				transportCheck: true
			},
			siteType: {
				land: true,
				submarine: true
			},
			hub: {
				big: false,
				critical: false,
				medium: false,
				small: false,
				end: false
			},
			vip: {
				isVip: false,
				nonVip: false
			},
			genset: {
				available: false,
				notAvailable: false
			},
			fme: {
				idle: false,
				busy: false
			}
		},
		selector: {
			region: {
				selectedOption: "",
				selectedLon: "",
				selectedLat: "",
				selectedZoom: "",
				option: [
					{ area_name: "JAYA", location_name: "JAYA", lat: -6.23807, lon: 106.83288, zoom: 10.5 },
					{ area_name: "JAVA", location_name: "JAVA", lat: -7.285102, lon: 108.776913, zoom: 8 },
					{ area_name: "SUMATERA", location_name: "SUMATERA", lat: -0.549317, lon: 101.89911, zoom: 5 },
					{ area_name: "KALISUMAPA", location_name: "KALISUMAPA", lat: 0.81076, lon: 124.880993, zoom: 5.5 }
				],
				value: null
			},
			area: {
				selectedOption: [],
				option: [],
				value: [],
				selectedOptionString: ""
			},
			mcCluster: {
				selectedOption: [],
				option: [],
				value: [],
				selectedOptionString: ""
			}
		},
		apiParams: {
			dwdmStatus: [],
			dwdmSiteType: null,
			dwdmHubType: [],
			dwdmVipCheck: null,
			dwdmGenset: null,
			dwdmLinkVendor: ["HUAWEI", "NOKIA", "ZTE"]
		}
	},

	coreRouter: {
		store: {
			siteByAlarm: [
				{
					alarmName: "Unmanaged Alarm",
					chartData: [
						{ value: 30, label: "SMTR" },
						{ value: 50, label: "JAYA" },
						{ value: 20, label: "JAVA" },
						{ value: 10, label: "KSMP" }
					],
					total: 90
				},
				{
					alarmName: "Hardware Fault",
					chartData: [
						{ value: 30, label: "SMTR" },
						{ value: 50, label: "JAYA" },
						{ value: 20, label: "JAVA" },
						{ value: 10, label: "KSMP" }
					],
					total: 90
				},
				{
					alarmName: "Interface Down",
					chartData: [
						{ value: 30, label: "SMTR" },
						{ value: 50, label: "JAYA" },
						{ value: 20, label: "JAVA" },
						{ value: 10, label: "KSMP" }
					],
					total: 90
				},
				{
					alarmName: "Power Alarm",
					chartData: [
						{ value: 30, label: "SMTR" },
						{ value: 50, label: "JAYA" },
						{ value: 20, label: "JAVA" },
						{ value: 10, label: "KSMP" }
					],
					total: 90
				},
				{
					alarmName: "Link Down",
					chartData: [
						{ value: 30, label: "SMTR" },
						{ value: 50, label: "JAYA" },
						{ value: 20, label: "JAVA" },
						{ value: 10, label: "KSMP" }
					],
					total: 90
				},
				{
					alarmName: "CRC",
					chartData: [
						{ value: 30, label: "SMTR" },
						{ value: 50, label: "JAYA" },
						{ value: 20, label: "JAVA" },
						{ value: 10, label: "KSMP" }
					],
					total: 90
				},
				{
					alarmName: "High Utilization",
					chartData: [
						{ value: 30, label: "SMTR" },
						{ value: 50, label: "JAYA" },
						{ value: 20, label: "JAVA" },
						{ value: 10, label: "KSMP" }
					],
					total: 90
				},
				{
					alarmName: "High Temp",
					chartData: [
						{ value: 30, label: "SMTR" },
						{ value: 50, label: "JAYA" },
						{ value: 20, label: "JAVA" },
						{ value: 10, label: "KSMP" }
					],
					total: 90
				}
			],
			banner: {
				countAllAlarm: "...",
				countUnmanaged: "...",
				countHardware: "...",
				countPower: "...",
				countLinkDown: "...",
				countHighTemp: "...",
				countHighUtilization: "..."
			}
		},
		component: {
			regionApply: false,
			mcApply: false,
			areaApply: false
		},
		state: {
			coreRouterBanner: 0,
			isCoreRouterSite: false,
			isCoreRouterTab: false
		},
		marker: {
			site: {
				coreRouterMarker: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "siteCoreRouter"
				}
			}
		},
		selector: {
			region: {
				selectedOption: "",
				selectedLon: "",
				selectedLat: "",
				selectedZoom: "",
				option: [
					{ area_name: "SUMATERA", location_name: "SUMATERA", lat: -0.549317, lon: 101.89911, zoom: 5 },
					{ area_name: "JABOTABEK", location_name: "JABOTABEK", lat: -6.23807, lon: 106.83288, zoom: 10.5 },
					{ area_name: "WEST JAVA & CENTRAL JAVA", location_name: "WEST JAVA & CENTRAL JAVA", lat: -7.285102, lon: 108.776913, zoom: 8 },
					{ area_name: "EAST JAVA & BALI NUSRA", location_name: "EAST JAVA & BALI NUSRA", lat: -8.039653, lon: 113.656046, zoom: 8 },
					{ area_name: "KALIMANTAN & SULAMPAPUA", location_name: "KALIMANTAN & SULAMPAPUA", lat: 0.81076, lon: 124.880993, zoom: 5.5 }
				],
				value: null
			},
			area: {
				selectedOption: "",
				option: []
			},
			mcCluster: {
				selectedOption: [],
				option: [],
				value: [],
				selectedOptionString: ""
			}
		},
		checker: {
			siteAlarm: {
				unmanaged: true,
				hardwareFault: true,
				powerAlarm: true,
				linkDown: true,
				highUtilization: true,
				highTemperature: true
			},
			hub: {
				big: false,
				critical: false,
				medium: false,
				small: false,
				end: false
			}
		},
		apiParams: {
			coreRouterStatus: [],
			coreRouterHubType: [],
			coreRouterSiteType: null,
			coreRouterVipCheck: null
		}
	},

	linkDown: {
		line: {
			linkDownLine: {
				clickAble: true,
				data: [],
				lines: [],
				zindex: 5,
				panelType: "line"
			},
			linkSmtr: {
				clickAble: true,
				data: [],
				lines: [],
				zindex: 6,
				panelType: "line"
			},
			linkJava: {
				clickAble: true,
				data: [],
				lines: [],
				zindex: 6,
				panelType: "line"
			},
			linkJaya: {
				clickAble: true,
				data: [],
				lines: [],
				zindex: 6,
				panelType: "line"
			},
			linkKsmp: {
				clickAble: true,
				data: [],
				lines: [],
				zindex: 6,
				panelType: "line"
			}
		},
		marker: {
			aging: {
				multipleSiteDown: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "site"
				},
				arraySiteDown: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "site"
				},
				moreDay: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "site"
				}
			},
			fme: {
				fmeIdle: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "fme"
				},
				fmeBusy: {
					clickAble: true,
					data: [],
					markers: [],
					zindex: 5,
					panelType: "fme"
				}
			},
			smtrMarker: {
				clickAble: true,
				data: [],
				markers: [],
				zindex: 5,
				panelType: "siteLinkDown"
			},
			jayaMarker: {
				clickAble: true,
				data: [],
				markers: [],
				zindex: 5,
				panelType: "siteLinkDown"
			},
			javaMarker: {
				clickAble: true,
				data: [],
				markers: [],
				zindex: 5,
				panelType: "siteLinkDown"
			},
			ksmpMarker: {
				clickAble: true,
				data: [],
				markers: [],
				zindex: 5,
				panelType: "siteLinkDown"
			}
		},
		state: {
			ttCorrelation: {
				modalState: 0,
				ttTableLoading: false,
				showTtId: false
			},
			filter: {
				isShowing: 0
			},
			collapse: {
				data: [],
				loading: false,
				show: 0
			},
			modalRegion: {
				isOpen: false,
				isMaximize: false,
				circle: "",
				openState: 0
			},
			modalExport: {
				title: "",
				step: "",
				isRegionWise: false,
				rowsPerPage: 10,
				currentPage: 1,
				showing: 0,
				loading: false,
				data: [],
				showHubBadge: false,
				showRegionBadge: false,
				networkModel: "all-selected",
				durationModel: "all-duration",
				isMaximize: false,
				searchQuery: ""
			},
			regionWise: {
				data: [],
				step: ""
			},
			siteDownTrend: {
				isOpen: 0,
				pickDate: false,
				pickDateFifteen: false
			},
			siteDownHubType: {
				clearFilter: false
			},
			line: {
				isShowingLine: false
			},
			button: {
				showClearLine: false
			},
			modal: {
				ticketOpenAnalysis: 0
			},
			potential: {
				loadingEmr: false,
				loadingCrit: false
			}
		},
		component: {
			regionApply: false,
			mcApply: false,
			areaApply: false,
			bannerState: 0
		},
		checker: {
			marker: {
				oneHour: false,
				fourHour: false,
				eightHour: false,
				twentyFourHour: false,
				moreDay: false
			},
			hub: {
				core: false,
				big: false,
				medium: false,
				small: false,
				end: false,
				isHub: false,
				nonHub: false
			},
			vip: {
				isVip: false,
				nonVip: false
			},
			fme: {
				busy: false,
				idle: false
			},
			power: {
				isPowerAlarm: false
			},
			siteType: {
				n3t: false,
				uso: false,
				all: true
			},
			oltDown: {
				isSiteDown: false,
				nonSiteDown: false
			},
		},
		store: {
			ttCorrelation: {
				data: [],
				cardColors: ["rgb(199, 0, 11, 0.05)", "rgb(237, 109, 0, 0.05)", "rgb(252, 200, 0, 0.05)", "rgb(206, 206, 206,0.2)"],
				tableData: [],
				ttCorrelationId: ""
			},
			exportSiteDownAlarm: {
				data: [],
				loading: false
			},
			siteDownTrend: {
				data: {
					JAVA: {},
					JAYA: {},
					KALISUMAPA: {},
					SUMATERA: {}
				},
				cutOffTime: new Date("2024-11-25"),
				selector: {
					datePickerSelected: [new Date(), new Date()],
					startDate: null,
					endDate: null,
					hubType: {
						selectedOption: [],
						apiParams: [],
						option: [{ hub_type: "CORE HUB SITE" }, { hub_type: "BIG HUB SITE" }, { hub_type: "MEDIUM HUB SITE" }, { hub_type: "SMALL HUB SITE" }, { hub_type: "END SITE" }],
						value: [],
						selectedOptionString: ""
					},
					interval: {
						timePicker: "8",
						value: "Hourly"
					}
				}
			},
			modalRegion: {
				regionSummaryData: []
			},
			infoWindow: {
				smtr: null,
				jaya: null,
				java: null,
				ksmp: null
			},
			sumateraPolyLine: [
				{
					lineCoords: [
						{ lat: 5.54829, lng: 95.323753 }, // Banda Aceh, Aceh
						{ lat: 3.609912, lng: 98.744912 } // Medan, North Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 3.609912, lng: 98.744912 }, // Medan, North Sumatra
						{ lat: 0.507068, lng: 101.447779 } // Pekanbaru, Riau
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 0.507068, lng: 101.447779 }, // Pekanbaru, Riau
						{ lat: -0.947083, lng: 100.417181 } // Padang, West Sumatra
					],
					strokeColor: "#FF0000"
				},
				{
					lineCoords: [
						{ lat: -0.947083, lng: 100.417181 }, // Padang, West Sumatra
						{ lat: -3.592373, lng: 104.725465 } // Palembang, South Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 5.54829, lng: 95.323753 }, // Banda Aceh, Aceh
						{ lat: -3.592373, lng: 104.725465 } // Palembang, South Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 1.485368, lng: 102.438047 }, // Dumai, Riau
						{ lat: 3.609912, lng: 98.744912 } // Medan, North Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 0.942474, lng: 104.45845 }, // Tanjungpinang, Riau Islands
						{ lat: -2.962634, lng: 104.739978 } // Palembang, South Sumatra
					],
					strokeColor: "#FF0000"
				},
				{
					lineCoords: [
						{ lat: -0.789275, lng: 100.660484 }, // Bukittinggi, West Sumatra
						{ lat: 1.485368, lng: 102.438047 } // Dumai, Riau
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 2.974985, lng: 99.068167 }, // Sibolga, North Sumatra
						{ lat: 3.609912, lng: 98.744912 } // Medan, North Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: -3.362609, lng: 102.569742 }, // Bengkulu, Bengkulu
						{ lat: -0.789275, lng: 100.660484 } // Bukittinggi, West Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: -1.629056, lng: 103.61062 }, // Jambi, Jambi
						{ lat: 0.507068, lng: 101.447779 } // Pekanbaru, Riau
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: -5.429431, lng: 105.261502 }, // Bandar Lampung, Lampung
						{ lat: -3.592373, lng: 104.725465 } // Palembang, South Sumatra
					],
					strokeColor: "#FF0000"
				},
				{
					lineCoords: [
						{ lat: -0.789275, lng: 100.660484 }, // Bukittinggi, West Sumatra
						{ lat: -3.592373, lng: 104.725465 } // Palembang, South Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 3.609912, lng: 98.744912 }, // Medan, North Sumatra
						{ lat: 5.54829, lng: 95.323753 } // Banda Aceh, Aceh
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 0.507068, lng: 101.447779 }, // Pekanbaru, Riau
						{ lat: -0.789275, lng: 100.660484 } // Bukittinggi, West Sumatra
					],
					strokeColor: "#000000"
				},
				// Additional Connections
				{
					lineCoords: [
						{ lat: -0.789275, lng: 100.660484 }, // Bukittinggi, West Sumatra
						{ lat: 2.974985, lng: 99.068167 } // Sibolga, North Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: -3.592373, lng: 104.725465 }, // Palembang, South Sumatra
						{ lat: -5.429431, lng: 105.261502 } // Bandar Lampung, Lampung
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 1.485368, lng: 102.438047 }, // Dumai, Riau
						{ lat: 0.507068, lng: 101.447779 } // Pekanbaru, Riau
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 1.264556, lng: 100.647101 }, // Pasaman, West Sumatra
						{ lat: -1.203377, lng: 102.755239 } // Rokan Hilir, Riau
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: -3.80788, lng: 102.262922 }, // Kepahiang, Bengkulu
						{ lat: -2.9147, lng: 104.745655 } // Musi Rawas, South Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 2.9596, lng: 98.65883 }, // Pematangsiantar, North Sumatra
						{ lat: 3.294508, lng: 99.602141 } // Gunung Tua, North Sumatra
					],
					strokeColor: "#FF0000"
				},
				{
					lineCoords: [
						{ lat: -0.58333, lng: 100.16667 }, // Payakumbuh, West Sumatra
						{ lat: 0.33626, lng: 101.025139 } // Pekanbaru, Riau
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 2.685212, lng: 99.112616 }, // Sipirok, North Sumatra
						{ lat: 3.609912, lng: 98.744912 } // Medan, North Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: -2.981434, lng: 104.764561 }, // Musi Banyuasin, South Sumatra
						{ lat: -3.214579, lng: 104.674968 } // Lahat, South Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 0.678356, lng: 99.561196 }, // Padang Sidempuan, North Sumatra
						{ lat: 1.325418, lng: 99.207862 } // Sibuhuan, North Sumatra
					],
					strokeColor: "#FF0000"
				},
				{
					lineCoords: [
						{ lat: -3.206655, lng: 103.792536 }, // Sekayu, South Sumatra
						{ lat: -4.134825, lng: 104.113469 } // Lahat, South Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: -2.62592, lng: 104.94053 }, // Pagar Alam, South Sumatra
						{ lat: -3.592373, lng: 104.725465 } // Palembang, South Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: -5.429431, lng: 105.261502 }, // Bandar Lampung, Lampung
						{ lat: -4.840605, lng: 104.894471 } // Kotabumi, Lampung
					],
					strokeColor: "#FF0000"
				},
				{
					lineCoords: [
						{ lat: -1.203377, lng: 102.755239 }, // Rokan Hilir, Riau
						{ lat: -2.05856, lng: 102.95618 } // Muara Enim, South Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: -0.947083, lng: 100.417181 }, // Padang, West Sumatra
						{ lat: 0.842183, lng: 99.800959 } // Gunung Tua, North Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: -3.80548, lng: 102.26206 }, // Rejang Lebong, Bengkulu
						{ lat: -4.134825, lng: 104.113469 } // Lahat, South Sumatra
					],
					strokeColor: "#FF0000"
				},
				{
					lineCoords: [
						{ lat: -3.362609, lng: 102.569742 }, // Bengkulu, Bengkulu
						{ lat: -1.892601, lng: 103.383616 } // Jambi, Jambi
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 2.21462, lng: 99.49005 }, // Tarutung, North Sumatra
						{ lat: 3.609912, lng: 98.744912 } // Medan, North Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 1.527858, lng: 98.535079 }, // Toba Samosir, North Sumatra
						{ lat: 2.21462, lng: 99.49005 } // Tarutung, North Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 0.942474, lng: 104.45845 }, // Tanjungpinang, Riau Islands
						{ lat: 0.292083, lng: 101.56146 } // Siak, Riau
					],
					strokeColor: "#FF0000"
				},
				{
					lineCoords: [
						{ lat: -3.362609, lng: 102.569742 }, // Bengkulu, Bengkulu
						{ lat: -4.195689, lng: 104.548915 } // Prabumulih, South Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 1.739553, lng: 98.875544 }, // Dolok Sanggul, North Sumatra
						{ lat: 2.68952, lng: 98.94368 } // Balige, North Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 2.742811, lng: 99.065448 }, // Laguboti, North Sumatra
						{ lat: 3.609912, lng: 98.744912 } // Medan, North Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 1.2856, lng: 102.7126 }, // Tembilahan, Riau
						{ lat: 0.507068, lng: 101.447779 } // Pekanbaru, Riau
					],
					strokeColor: "#FF0000"
				},
				{
					lineCoords: [
						{ lat: 0.18924, lng: 99.51351 }, // Aek Godang, North Sumatra
						{ lat: 0.507068, lng: 101.447779 } // Pekanbaru, Riau
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 3.294508, lng: 99.602141 }, // Gunung Tua, North Sumatra
						{ lat: 3.609912, lng: 98.744912 } // Medan, North Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 3.324171, lng: 99.060609 }, // Porsea, North Sumatra
						{ lat: 2.21462, lng: 99.49005 } // Tarutung, North Sumatra
					],
					strokeColor: "#FF0000"
				},
				{
					lineCoords: [
						{ lat: 1.739553, lng: 98.875544 }, // Dolok Sanggul, North Sumatra
						{ lat: 0.678356, lng: 99.561196 } // Padang Sidempuan, North Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: -3.80548, lng: 102.26206 }, // Rejang Lebong, Bengkulu
						{ lat: -1.203377, lng: 102.755239 } // Rokan Hilir, Riau
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 1.264556, lng: 100.647101 }, // Pasaman, West Sumatra
						{ lat: -0.58333, lng: 100.16667 } // Payakumbuh, West Sumatra
					],
					strokeColor: "#FF0000"
				},
				{
					lineCoords: [
						{ lat: -2.981434, lng: 104.764561 }, // Musi Banyuasin, South Sumatra
						{ lat: -4.134825, lng: 104.113469 } // Lahat, South Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 2.9596, lng: 98.65883 }, // Pematangsiantar, North Sumatra
						{ lat: 3.609912, lng: 98.744912 } // Medan, North Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 1.527858, lng: 98.535079 }, // Toba Samosir, North Sumatra
						{ lat: 0.942474, lng: 104.45845 } // Tanjungpinang, Riau Islands
					],
					strokeColor: "#FF0000"
				},
				{
					lineCoords: [
						{ lat: 3.324171, lng: 99.060609 }, // Porsea, North Sumatra
						{ lat: 2.68952, lng: 98.94368 } // Balige, North Sumatra
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: -4.195689, lng: 104.548915 }, // Prabumulih, South Sumatra
						{ lat: -5.429431, lng: 105.261502 } // Bandar Lampung, Lampung
					],
					strokeColor: "#000000"
				},
				{
					lineCoords: [
						{ lat: 1.264556, lng: 100.647101 }, // Pasaman, West Sumatra
						{ lat: 1.485368, lng: 102.438047 } // Dumai, Riau
					],
					strokeColor: "#FF0000"
				},
				{
					lineCoords: [
						{ lat: -3.362609, lng: 102.569742 }, // Bengkulu, Bengkulu
						{ lat: -4.134825, lng: 104.113469 } // Lahat, South Sumatra
					],
					strokeColor: "#000000"
				}
			],
			polyLineData: {
				smtr: [],
				ksmp: [],
				java: [],
				jaya: []
			},
			infoWindow: {
				ticketSmtr: 0,
				ticketKsmp: 0,
				ticketJava: 0,
				ticketJaya: 0
			},
			ticket: {
				tableData: []
			},
			modal: {
				segmentLinkDown: [
					{
						four_circle: "JAYA",
						ticket_status: "running",
						potential_severity: "Potential Emergency",
						tt_count: 0
					},
					{
						four_circle: "JAYA",
						ticket_status: "running",
						potential_severity: "Potential Critical",
						tt_count: 0
					},
					{
						four_circle: "JAYA",
						ticket_status: "completed",
						potential_severity: "Potential Emergency",
						tt_count: 0
					},
					{
						four_circle: "JAYA",
						ticket_status: "completed",
						potential_severity: "Potential Critical",
						tt_count: 0
					},
					{
						four_circle: "JAYA",
						ticket_status: "running",
						potential_severity: "Potential Emergency",
						tt_count: 0
					},
					{
						four_circle: "JAYA",
						ticket_status: "running",
						potential_severity: "Potential Critical",
						tt_count: 0
					},
					{
						four_circle: "JAYA",
						ticket_status: "completed",
						potential_severity: "Potential Emergency",
						tt_count: 0
					},
					{
						four_circle: "JAYA",
						ticket_status: "completed",
						potential_severity: "Potential Critical",
						tt_count: 0
					},
					{
						four_circle: "JAVA",
						ticket_status: "running",
						potential_severity: "Potential Emergency",
						tt_count: 0
					},
					{
						four_circle: "JAVA",
						ticket_status: "running",
						potential_severity: "Potential Critical",
						tt_count: 0
					},
					{
						four_circle: "JAVA",
						ticket_status: "completed",
						potential_severity: "Potential Emergency",
						tt_count: 0
					},
					{
						four_circle: "JAVA",
						ticket_status: "completed",
						potential_severity: "Potential Critical",
						tt_count: 0
					},
					{
						four_circle: "SMTR",
						ticket_status: "running",
						potential_severity: "Potential Emergency",
						tt_count: 0
					},
					{
						four_circle: "SMTR",
						ticket_status: "running",
						potential_severity: "Potential Critical",
						tt_count: 0
					},
					{
						four_circle: "SMTR",
						ticket_status: "completed",
						potential_severity: "Potential Emergency",
						tt_count: 0
					},
					{
						four_circle: "SMTR",
						ticket_status: "completed",
						potential_severity: "Potential Critical",
						tt_count: 0
					},
					{
						four_circle: "KSMP",
						ticket_status: "running",
						potential_severity: "Potential Emergency",
						tt_count: 0
					},
					{
						four_circle: "KSMP",
						ticket_status: "running",
						potential_severity: "Potential Critical",
						tt_count: 0
					},
					{
						four_circle: "KSMP",
						ticket_status: "completed",
						potential_severity: "Potential Emergency",
						tt_count: 0
					},
					{
						four_circle: "KSMP",
						ticket_status: "completed",
						potential_severity: "Potential Critical",
						tt_count: 0
					}
				],
				ttNumberTrend: {
					datePickerSelected: [calculateDate(new Date().toString(), 7), new Date().toString()],
					ttStatus: "",
					severity: "",
					circle: "",
					ttTrendData: []
				},
				ttAgingTrend: {
					datePickerSelected: [calculateDate(new Date().toString(), 7), new Date().toString()],
					ttStatus: "",
					severity: "",
					circle: "",
					ttTrendData: []
				},
				ticketOpenAnalysis: {
					tableData: [],
					ttStatus: "",
					severity: "",
					circle: ""
				}
			},
			counting: {
				breakdown: {
					total: {
						critical: "...",
						emergency: "..."
					},
					total_by_circle: {
						KALISUMAPA: [
							{
								circle: "KALISUMAPA",
								tt_count: "...",
								potential_severity: "Potential Emergency"
							},
							{
								circle: "KALISUMAPA",
								tt_count: "...",
								potential_severity: "Potential Critical"
							}
						],
						SUMATERA: [
							{
								circle: "SUMATERA",
								tt_count: "...",
								potential_severity: "Potential Critical"
							},
							{
								circle: "SUMATERA",
								tt_count: "...",
								potential_severity: "Potential Emergency"
							}
						],
						JAYA: [
							{
								circle: "JAYA",
								tt_count: "...",
								potential_severity: "Potential Critical"
							},
							{
								circle: "JAYA",
								tt_count: "...",
								potential_severity: "Potential Emergency"
							}
						],
						JAVA: [
							{
								circle: "JAVA",
								tt_count: "...",
								potential_severity: "Potential Critical"
							},
							{
								circle: "JAVA",
								tt_count: "...",
								potential_severity: "Potential Emergency"
							}
						]
					}
				}
			},
			regionsEmergency: [
				{ label: "NAT", circleData: [], barData: [], siteDownArray: [], total: 0 },
				{ label: "JAVA", circleData: [], barData: [], siteDownArray: [], total: 0 },
				{ label: "JAYA", circleData: [], barData: [], siteDownArray: [], total: 0 },
				{ label: "KSMP", circleData: [], barData: [], siteDownArray: [], total: 0 },
				{ label: "SMTR", circleData: [], barData: [], siteDownArray: [], total: 0 }
			],
			regionsCritical: [
				{ label: "NAT", circleData: [], barData: [], siteDownArray: [], total: 0 },
				{ label: "JAVA", circleData: [], barData: [], siteDownArray: [], total: 0 },
				{ label: "JAYA", circleData: [], barData: [], siteDownArray: [], total: 0 },
				{ label: "KSMP", circleData: [], barData: [], siteDownArray: [], total: 0 },
				{ label: "SMTR", circleData: [], barData: [], siteDownArray: [], total: 0 }
			]
		},
		selector: {
			region: {
				selectedOption: "",
				selectedLon: "",
				selectedLat: "",
				selectedZoom: "",
				option: [
					{ area_name: "JAYA", location_name: "JAYA", lat: -6.23807, lon: 106.83288, zoom: 10.5 },
					{ area_name: "JAVA", location_name: "JAVA", lat: -7.285102, lon: 108.776913, zoom: 8 },
					{ area_name: "SUMATERA", location_name: "SUMATERA", lat: -0.549317, lon: 101.89911, zoom: 5 },
					{ area_name: "KALISUMAPA", location_name: "KALISUMAPA", lat: 0.81076, lon: 124.880993, zoom: 5.5 }
				],
				value: null
			},
			area: {
				selectedOption: [],
				option: [],
				value: [],
				selectedOptionString: ""
			},
			siteType: {
				selectedOption: [],
				option: [],
				value: [],
				selectedOptionString: ""
			},
			mcCluster: {
				selectedOption: [],
				option: [],
				value: [],
				selectedOptionString: ""
			},
			potential: {
				btnValue: "emergency"
			}
		},
		apiParams: {
			hubType: null,
			hubCheck: null,
			vipCheck: null,
			siteDownCheck: null,
			powerAlarm: false,
			siteDownChecker: [],
			siteType: [],
			circleString: "",
			hubTypeString: ""
		},
		mockData: [
			{
				ne_2g: {
					more_than_24_hours_2g: 0,
					total: 0,
					one_to_4_hour_2g: 0,
					less_than_1_hour_2g: 0,
					eight_to_24_hour_2g: 0,
					four_to_8_hour_2g: 0
				},
				ne_unq: {
					less_than_1_hour_unq: 0,
					total: 0,
					eight_to_24_hour_unq: 0,
					four_to_8_hour_unq: 0,
					more_than_24_hours_unq: 0,
					one_to_4_hour_unq: 0
				},
				unique_sitedown: 0,
				total_2g_site: 0,
				ne_4g: {
					more_than_24_hours_4g: 0,
					total: 0,
					one_to_4_hour_4g: 0,
					less_than_1_hour_4g: 0,
					eight_to_24_hour_4g: 0,
					four_to_8_hour_4g: 0
				},
				total_4g_site: 0,
				location: "SMTR"
			},
			{
				ne_2g: {
					more_than_24_hours_2g: 0,
					total: 0,
					one_to_4_hour_2g: 0,
					less_than_1_hour_2g: 0,
					eight_to_24_hour_2g: 0,
					four_to_8_hour_2g: 0
				},
				ne_unq: {
					less_than_1_hour_unq: 0,
					total: 0,
					eight_to_24_hour_unq: 0,
					four_to_8_hour_unq: 0,
					more_than_24_hours_unq: 0,
					one_to_4_hour_unq: 0
				},
				unique_sitedown: 0,
				total_2g_site: 0,
				ne_4g: {
					more_than_24_hours_4g: 0,
					total: 0,
					one_to_4_hour_4g: 0,
					less_than_1_hour_4g: 0,
					eight_to_24_hour_4g: 0,
					four_to_8_hour_4g: 0
				},
				total_4g_site: 0,
				location: "KSMP"
			},
			{
				ne_2g: {
					more_than_24_hours_2g: 0,
					total: 0,
					one_to_4_hour_2g: 0,
					less_than_1_hour_2g: 0,
					eight_to_24_hour_2g: 0,
					four_to_8_hour_2g: 0
				},
				ne_unq: {
					less_than_1_hour_unq: 0,
					total: 0,
					eight_to_24_hour_unq: 0,
					four_to_8_hour_unq: 0,
					more_than_24_hours_unq: 0,
					one_to_4_hour_unq: 0
				},
				unique_sitedown: 0,
				total_2g_site: 0,
				ne_4g: {
					more_than_24_hours_4g: 0,
					total: 0,
					one_to_4_hour_4g: 0,
					less_than_1_hour_4g: 0,
					eight_to_24_hour_4g: 0,
					four_to_8_hour_4g: 0
				},
				total_4g_site: 0,
				location: "JAYA"
			},
			{
				ne_2g: {
					more_than_24_hours_2g: 0,
					total: 0,
					one_to_4_hour_2g: 0,
					less_than_1_hour_2g: 0,
					eight_to_24_hour_2g: 0,
					four_to_8_hour_2g: 0
				},
				ne_unq: {
					less_than_1_hour_unq: 0,
					total: 0,
					eight_to_24_hour_unq: 0,
					four_to_8_hour_unq: 0,
					more_than_24_hours_unq: 0,
					one_to_4_hour_unq: 0
				},
				unique_sitedown: 0,
				total_2g_site: 0,
				ne_4g: {
					more_than_24_hours_4g: 0,
					total: 0,
					one_to_4_hour_4g: 0,
					less_than_1_hour_4g: 0,
					eight_to_24_hour_4g: 0,
					four_to_8_hour_4g: 0
				},
				total_4g_site: 0,
				location: "JAVA"
			}
		],
		start_time: getSevenDaysAgoStart(),
		end_time: getCurrentDateTime()
	},
	// linkDown: {
	// 	line: {
	// 		linkDownLine: {
	// 			clickAble: true,
	// 			data: [],
	// 			lines: [],
	// 			zindex: 5,
	// 			panelType: "line"
	// 		},
	// 		linkSmtr: {
	// 			clickAble: true,
	// 			data: [],
	// 			lines: [],
	// 			zindex: 6,
	// 			panelType: "line"
	// 		},
	// 		linkJava: {
	// 			clickAble: true,
	// 			data: [],
	// 			lines: [],
	// 			zindex: 6,
	// 			panelType: "line"
	// 		},
	// 		linkJaya: {
	// 			clickAble: true,
	// 			data: [],
	// 			lines: [],
	// 			zindex: 6,
	// 			panelType: "line"
	// 		},
	// 		linkKsmp: {
	// 			clickAble: true,
	// 			data: [],
	// 			lines: [],
	// 			zindex: 6,
	// 			panelType: "line"
	// 		}
	// 	},
	// 	marker: {
	// 		smtrMarker: {
	// 			clickAble: true,
	// 			data: [],
	// 			markers: [],
	// 			zindex: 5,
	// 			panelType: "siteLinkDown"
	// 		},
	// 		jayaMarker: {
	// 			clickAble: true,
	// 			data: [],
	// 			markers: [],
	// 			zindex: 5,
	// 			panelType: "siteLinkDown"
	// 		},
	// 		javaMarker: {
	// 			clickAble: true,
	// 			data: [],
	// 			markers: [],
	// 			zindex: 5,
	// 			panelType: "siteLinkDown"
	// 		},
	// 		ksmpMarker: {
	// 			clickAble: true,
	// 			data: [],
	// 			markers: [],
	// 			zindex: 5,
	// 			panelType: "siteLinkDown"
	// 		}
	// 	},
	// 	store: {
	// 		infoWindow: {
	// 			smtr: null,
	// 			jaya: null,
	// 			java: null,
	// 			ksmp: null
	// 		},
	// 		sumateraPolyLine: [
	// 			{
	// 				lineCoords: [
	// 					{ lat: 5.54829, lng: 95.323753 }, // Banda Aceh, Aceh
	// 					{ lat: 3.609912, lng: 98.744912 } // Medan, North Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 3.609912, lng: 98.744912 }, // Medan, North Sumatra
	// 					{ lat: 0.507068, lng: 101.447779 } // Pekanbaru, Riau
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 0.507068, lng: 101.447779 }, // Pekanbaru, Riau
	// 					{ lat: -0.947083, lng: 100.417181 } // Padang, West Sumatra
	// 				],
	// 				strokeColor: "#FF0000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: -0.947083, lng: 100.417181 }, // Padang, West Sumatra
	// 					{ lat: -3.592373, lng: 104.725465 } // Palembang, South Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 5.54829, lng: 95.323753 }, // Banda Aceh, Aceh
	// 					{ lat: -3.592373, lng: 104.725465 } // Palembang, South Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 1.485368, lng: 102.438047 }, // Dumai, Riau
	// 					{ lat: 3.609912, lng: 98.744912 } // Medan, North Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 0.942474, lng: 104.45845 }, // Tanjungpinang, Riau Islands
	// 					{ lat: -2.962634, lng: 104.739978 } // Palembang, South Sumatra
	// 				],
	// 				strokeColor: "#FF0000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: -0.789275, lng: 100.660484 }, // Bukittinggi, West Sumatra
	// 					{ lat: 1.485368, lng: 102.438047 } // Dumai, Riau
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 2.974985, lng: 99.068167 }, // Sibolga, North Sumatra
	// 					{ lat: 3.609912, lng: 98.744912 } // Medan, North Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: -3.362609, lng: 102.569742 }, // Bengkulu, Bengkulu
	// 					{ lat: -0.789275, lng: 100.660484 } // Bukittinggi, West Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: -1.629056, lng: 103.61062 }, // Jambi, Jambi
	// 					{ lat: 0.507068, lng: 101.447779 } // Pekanbaru, Riau
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: -5.429431, lng: 105.261502 }, // Bandar Lampung, Lampung
	// 					{ lat: -3.592373, lng: 104.725465 } // Palembang, South Sumatra
	// 				],
	// 				strokeColor: "#FF0000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: -0.789275, lng: 100.660484 }, // Bukittinggi, West Sumatra
	// 					{ lat: -3.592373, lng: 104.725465 } // Palembang, South Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 3.609912, lng: 98.744912 }, // Medan, North Sumatra
	// 					{ lat: 5.54829, lng: 95.323753 } // Banda Aceh, Aceh
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 0.507068, lng: 101.447779 }, // Pekanbaru, Riau
	// 					{ lat: -0.789275, lng: 100.660484 } // Bukittinggi, West Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			// Additional Connections
	// 			{
	// 				lineCoords: [
	// 					{ lat: -0.789275, lng: 100.660484 }, // Bukittinggi, West Sumatra
	// 					{ lat: 2.974985, lng: 99.068167 } // Sibolga, North Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: -3.592373, lng: 104.725465 }, // Palembang, South Sumatra
	// 					{ lat: -5.429431, lng: 105.261502 } // Bandar Lampung, Lampung
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 1.485368, lng: 102.438047 }, // Dumai, Riau
	// 					{ lat: 0.507068, lng: 101.447779 } // Pekanbaru, Riau
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 1.264556, lng: 100.647101 }, // Pasaman, West Sumatra
	// 					{ lat: -1.203377, lng: 102.755239 } // Rokan Hilir, Riau
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: -3.80788, lng: 102.262922 }, // Kepahiang, Bengkulu
	// 					{ lat: -2.9147, lng: 104.745655 } // Musi Rawas, South Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 2.9596, lng: 98.65883 }, // Pematangsiantar, North Sumatra
	// 					{ lat: 3.294508, lng: 99.602141 } // Gunung Tua, North Sumatra
	// 				],
	// 				strokeColor: "#FF0000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: -0.58333, lng: 100.16667 }, // Payakumbuh, West Sumatra
	// 					{ lat: 0.33626, lng: 101.025139 } // Pekanbaru, Riau
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 2.685212, lng: 99.112616 }, // Sipirok, North Sumatra
	// 					{ lat: 3.609912, lng: 98.744912 } // Medan, North Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: -2.981434, lng: 104.764561 }, // Musi Banyuasin, South Sumatra
	// 					{ lat: -3.214579, lng: 104.674968 } // Lahat, South Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 0.678356, lng: 99.561196 }, // Padang Sidempuan, North Sumatra
	// 					{ lat: 1.325418, lng: 99.207862 } // Sibuhuan, North Sumatra
	// 				],
	// 				strokeColor: "#FF0000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: -3.206655, lng: 103.792536 }, // Sekayu, South Sumatra
	// 					{ lat: -4.134825, lng: 104.113469 } // Lahat, South Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: -2.62592, lng: 104.94053 }, // Pagar Alam, South Sumatra
	// 					{ lat: -3.592373, lng: 104.725465 } // Palembang, South Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: -5.429431, lng: 105.261502 }, // Bandar Lampung, Lampung
	// 					{ lat: -4.840605, lng: 104.894471 } // Kotabumi, Lampung
	// 				],
	// 				strokeColor: "#FF0000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: -1.203377, lng: 102.755239 }, // Rokan Hilir, Riau
	// 					{ lat: -2.05856, lng: 102.95618 } // Muara Enim, South Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: -0.947083, lng: 100.417181 }, // Padang, West Sumatra
	// 					{ lat: 0.842183, lng: 99.800959 } // Gunung Tua, North Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: -3.80548, lng: 102.26206 }, // Rejang Lebong, Bengkulu
	// 					{ lat: -4.134825, lng: 104.113469 } // Lahat, South Sumatra
	// 				],
	// 				strokeColor: "#FF0000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: -3.362609, lng: 102.569742 }, // Bengkulu, Bengkulu
	// 					{ lat: -1.892601, lng: 103.383616 } // Jambi, Jambi
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 2.21462, lng: 99.49005 }, // Tarutung, North Sumatra
	// 					{ lat: 3.609912, lng: 98.744912 } // Medan, North Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 1.527858, lng: 98.535079 }, // Toba Samosir, North Sumatra
	// 					{ lat: 2.21462, lng: 99.49005 } // Tarutung, North Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 0.942474, lng: 104.45845 }, // Tanjungpinang, Riau Islands
	// 					{ lat: 0.292083, lng: 101.56146 } // Siak, Riau
	// 				],
	// 				strokeColor: "#FF0000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: -3.362609, lng: 102.569742 }, // Bengkulu, Bengkulu
	// 					{ lat: -4.195689, lng: 104.548915 } // Prabumulih, South Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 1.739553, lng: 98.875544 }, // Dolok Sanggul, North Sumatra
	// 					{ lat: 2.68952, lng: 98.94368 } // Balige, North Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 2.742811, lng: 99.065448 }, // Laguboti, North Sumatra
	// 					{ lat: 3.609912, lng: 98.744912 } // Medan, North Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 1.2856, lng: 102.7126 }, // Tembilahan, Riau
	// 					{ lat: 0.507068, lng: 101.447779 } // Pekanbaru, Riau
	// 				],
	// 				strokeColor: "#FF0000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 0.18924, lng: 99.51351 }, // Aek Godang, North Sumatra
	// 					{ lat: 0.507068, lng: 101.447779 } // Pekanbaru, Riau
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 3.294508, lng: 99.602141 }, // Gunung Tua, North Sumatra
	// 					{ lat: 3.609912, lng: 98.744912 } // Medan, North Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 3.324171, lng: 99.060609 }, // Porsea, North Sumatra
	// 					{ lat: 2.21462, lng: 99.49005 } // Tarutung, North Sumatra
	// 				],
	// 				strokeColor: "#FF0000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 1.739553, lng: 98.875544 }, // Dolok Sanggul, North Sumatra
	// 					{ lat: 0.678356, lng: 99.561196 } // Padang Sidempuan, North Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: -3.80548, lng: 102.26206 }, // Rejang Lebong, Bengkulu
	// 					{ lat: -1.203377, lng: 102.755239 } // Rokan Hilir, Riau
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 1.264556, lng: 100.647101 }, // Pasaman, West Sumatra
	// 					{ lat: -0.58333, lng: 100.16667 } // Payakumbuh, West Sumatra
	// 				],
	// 				strokeColor: "#FF0000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: -2.981434, lng: 104.764561 }, // Musi Banyuasin, South Sumatra
	// 					{ lat: -4.134825, lng: 104.113469 } // Lahat, South Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 2.9596, lng: 98.65883 }, // Pematangsiantar, North Sumatra
	// 					{ lat: 3.609912, lng: 98.744912 } // Medan, North Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 1.527858, lng: 98.535079 }, // Toba Samosir, North Sumatra
	// 					{ lat: 0.942474, lng: 104.45845 } // Tanjungpinang, Riau Islands
	// 				],
	// 				strokeColor: "#FF0000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 3.324171, lng: 99.060609 }, // Porsea, North Sumatra
	// 					{ lat: 2.68952, lng: 98.94368 } // Balige, North Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: -4.195689, lng: 104.548915 }, // Prabumulih, South Sumatra
	// 					{ lat: -5.429431, lng: 105.261502 } // Bandar Lampung, Lampung
	// 				],
	// 				strokeColor: "#000000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: 1.264556, lng: 100.647101 }, // Pasaman, West Sumatra
	// 					{ lat: 1.485368, lng: 102.438047 } // Dumai, Riau
	// 				],
	// 				strokeColor: "#FF0000"
	// 			},
	// 			{
	// 				lineCoords: [
	// 					{ lat: -3.362609, lng: 102.569742 }, // Bengkulu, Bengkulu
	// 					{ lat: -4.134825, lng: 104.113469 } // Lahat, South Sumatra
	// 				],
	// 				strokeColor: "#000000"
	// 			}
	// 		],
	// 		polyLineData: {
	// 			smtr: [],
	// 			ksmp: [],
	// 			java: [],
	// 			jaya: []
	// 		},
	// 		infoWindow: {
	// 			ticketSmtr: 0,
	// 			ticketKsmp: 0,
	// 			ticketJava: 0,
	// 			ticketJaya: 0
	// 		},
	// 		ticket: {
	// 			tableData: []
	// 		},
	// 		modal: {
	// 			segmentLinkDown: [
	// 				{
	// 					four_circle: "JAYA",
	// 					ticket_status: "running",
	// 					potential_severity: "Potential Emergency",
	// 					tt_count: 0
	// 				},
	// 				{
	// 					four_circle: "JAYA",
	// 					ticket_status: "running",
	// 					potential_severity: "Potential Critical",
	// 					tt_count: 0
	// 				},
	// 				{
	// 					four_circle: "JAYA",
	// 					ticket_status: "completed",
	// 					potential_severity: "Potential Emergency",
	// 					tt_count: 0
	// 				},
	// 				{
	// 					four_circle: "JAYA",
	// 					ticket_status: "completed",
	// 					potential_severity: "Potential Critical",
	// 					tt_count: 0
	// 				},
	// 				{
	// 					four_circle: "JAYA",
	// 					ticket_status: "running",
	// 					potential_severity: "Potential Emergency",
	// 					tt_count: 0
	// 				},
	// 				{
	// 					four_circle: "JAYA",
	// 					ticket_status: "running",
	// 					potential_severity: "Potential Critical",
	// 					tt_count: 0
	// 				},
	// 				{
	// 					four_circle: "JAYA",
	// 					ticket_status: "completed",
	// 					potential_severity: "Potential Emergency",
	// 					tt_count: 0
	// 				},
	// 				{
	// 					four_circle: "JAYA",
	// 					ticket_status: "completed",
	// 					potential_severity: "Potential Critical",
	// 					tt_count: 0
	// 				},
	// 				{
	// 					four_circle: "JAVA",
	// 					ticket_status: "running",
	// 					potential_severity: "Potential Emergency",
	// 					tt_count: 0
	// 				},
	// 				{
	// 					four_circle: "JAVA",
	// 					ticket_status: "running",
	// 					potential_severity: "Potential Critical",
	// 					tt_count: 0
	// 				},
	// 				{
	// 					four_circle: "JAVA",
	// 					ticket_status: "completed",
	// 					potential_severity: "Potential Emergency",
	// 					tt_count: 0
	// 				},
	// 				{
	// 					four_circle: "JAVA",
	// 					ticket_status: "completed",
	// 					potential_severity: "Potential Critical",
	// 					tt_count: 0
	// 				},
	// 				{
	// 					four_circle: "SMTR",
	// 					ticket_status: "running",
	// 					potential_severity: "Potential Emergency",
	// 					tt_count: 0
	// 				},
	// 				{
	// 					four_circle: "SMTR",
	// 					ticket_status: "running",
	// 					potential_severity: "Potential Critical",
	// 					tt_count: 0
	// 				},
	// 				{
	// 					four_circle: "SMTR",
	// 					ticket_status: "completed",
	// 					potential_severity: "Potential Emergency",
	// 					tt_count: 0
	// 				},
	// 				{
	// 					four_circle: "SMTR",
	// 					ticket_status: "completed",
	// 					potential_severity: "Potential Critical",
	// 					tt_count: 0
	// 				},
	// 				{
	// 					four_circle: "KSMP",
	// 					ticket_status: "running",
	// 					potential_severity: "Potential Emergency",
	// 					tt_count: 0
	// 				},
	// 				{
	// 					four_circle: "KSMP",
	// 					ticket_status: "running",
	// 					potential_severity: "Potential Critical",
	// 					tt_count: 0
	// 				},
	// 				{
	// 					four_circle: "KSMP",
	// 					ticket_status: "completed",
	// 					potential_severity: "Potential Emergency",
	// 					tt_count: 0
	// 				},
	// 				{
	// 					four_circle: "KSMP",
	// 					ticket_status: "completed",
	// 					potential_severity: "Potential Critical",
	// 					tt_count: 0
	// 				}
	// 			],
	// 			ttNumberTrend: {
	// 				datePickerSelected: [calculateDate(new Date().toString(), 7), new Date().toString()],
	// 				ttStatus: "",
	// 				severity: "",
	// 				circle: "",
	// 				ttTrendData: []
	// 			},
	// 			ttAgingTrend: {
	// 				datePickerSelected: [calculateDate(new Date().toString(), 7), new Date().toString()],
	// 				ttStatus: "",
	// 				severity: "",
	// 				circle: "",
	// 				ttTrendData: []
	// 			},
	// 			ticketOpenAnalysis: {
	// 				tableData: [],
	// 				ttStatus: "",
	// 				severity: "",
	// 				circle: ""
	// 			}
	// 		},
	// 		counting: {
	// 			breakdown: {
	// 				total: {
	// 					critical: "...",
	// 					emergency: "..."
	// 				},
	// 				total_by_circle: {
	// 					KALISUMAPA: [
	// 						{
	// 							circle: "KALISUMAPA",
	// 							tt_count: "...",
	// 							potential_severity: "Potential Emergency"
	// 						},
	// 						{
	// 							circle: "KALISUMAPA",
	// 							tt_count: "...",
	// 							potential_severity: "Potential Critical"
	// 						}
	// 					],
	// 					SUMATERA: [
	// 						{
	// 							circle: "SUMATERA",
	// 							tt_count: "...",
	// 							potential_severity: "Potential Critical"
	// 						},
	// 						{
	// 							circle: "SUMATERA",
	// 							tt_count: "...",
	// 							potential_severity: "Potential Emergency"
	// 						}
	// 					],
	// 					JAYA: [
	// 						{
	// 							circle: "JAYA",
	// 							tt_count: "...",
	// 							potential_severity: "Potential Critical"
	// 						},
	// 						{
	// 							circle: "JAYA",
	// 							tt_count: "...",
	// 							potential_severity: "Potential Emergency"
	// 						}
	// 					],
	// 					JAVA: [
	// 						{
	// 							circle: "JAVA",
	// 							tt_count: "...",
	// 							potential_severity: "Potential Critical"
	// 						},
	// 						{
	// 							circle: "JAVA",
	// 							tt_count: "...",
	// 							potential_severity: "Potential Emergency"
	// 						}
	// 					]
	// 				}
	// 			}
	// 		},
	// 		regionsEmergency: [
	// 			{ label: "NAT", circleData: [], barData: [], siteDownArray: [], total: 0 },
	// 			{ label: "JAVA", circleData: [], barData: [], siteDownArray: [], total: 0 },
	// 			{ label: "JAYA", circleData: [], barData: [], siteDownArray: [], total: 0 },
	// 			{ label: "KSMP", circleData: [], barData: [], siteDownArray: [], total: 0 },
	// 			{ label: "SMTR", circleData: [], barData: [], siteDownArray: [], total: 0 }
	// 		],
	// 		regionsCritical: [
	// 			{ label: "NAT", circleData: [], barData: [], siteDownArray: [], total: 0 },
	// 			{ label: "JAVA", circleData: [], barData: [], siteDownArray: [], total: 0 },
	// 			{ label: "JAYA", circleData: [], barData: [], siteDownArray: [], total: 0 },
	// 			{ label: "KSMP", circleData: [], barData: [], siteDownArray: [], total: 0 },
	// 			{ label: "SMTR", circleData: [], barData: [], siteDownArray: [], total: 0 }
	// 		]
	// 	},
	// 	state: {
	// 		line: {
	// 			isShowingLine: false
	// 		},
	// 		button: {
	// 			showClearLine: false
	// 		},
	// 		modal: {
	// 			ticketOpenAnalysis: 0
	// 		},
	// 		potential: {
	// 			loadingEmr: false,
	// 			loadingCrit: false
	// 		}
	// 	},
	// 	selector: {
	// 		potential: {
	// 			btnValue: "emergency"
	// 		}
	// 	},
	// 	component: {
	// 		bannerState: 0
	// 	},
	// 	mockData: [
	// 		{
	// 			ne_2g: {
	// 				more_than_24_hours_2g: 0,
	// 				total: 0,
	// 				one_to_4_hour_2g: 0,
	// 				less_than_1_hour_2g: 0,
	// 				eight_to_24_hour_2g: 0,
	// 				four_to_8_hour_2g: 0
	// 			},
	// 			ne_unq: {
	// 				less_than_1_hour_unq: 0,
	// 				total: 0,
	// 				eight_to_24_hour_unq: 0,
	// 				four_to_8_hour_unq: 0,
	// 				more_than_24_hours_unq: 0,
	// 				one_to_4_hour_unq: 0
	// 			},
	// 			unique_sitedown: 0,
	// 			total_2g_site: 0,
	// 			ne_4g: {
	// 				more_than_24_hours_4g: 0,
	// 				total: 0,
	// 				one_to_4_hour_4g: 0,
	// 				less_than_1_hour_4g: 0,
	// 				eight_to_24_hour_4g: 0,
	// 				four_to_8_hour_4g: 0
	// 			},
	// 			total_4g_site: 0,
	// 			location: "SMTR"
	// 		},
	// 		{
	// 			ne_2g: {
	// 				more_than_24_hours_2g: 0,
	// 				total: 0,
	// 				one_to_4_hour_2g: 0,
	// 				less_than_1_hour_2g: 0,
	// 				eight_to_24_hour_2g: 0,
	// 				four_to_8_hour_2g: 0
	// 			},
	// 			ne_unq: {
	// 				less_than_1_hour_unq: 0,
	// 				total: 0,
	// 				eight_to_24_hour_unq: 0,
	// 				four_to_8_hour_unq: 0,
	// 				more_than_24_hours_unq: 0,
	// 				one_to_4_hour_unq: 0
	// 			},
	// 			unique_sitedown: 0,
	// 			total_2g_site: 0,
	// 			ne_4g: {
	// 				more_than_24_hours_4g: 0,
	// 				total: 0,
	// 				one_to_4_hour_4g: 0,
	// 				less_than_1_hour_4g: 0,
	// 				eight_to_24_hour_4g: 0,
	// 				four_to_8_hour_4g: 0
	// 			},
	// 			total_4g_site: 0,
	// 			location: "KSMP"
	// 		},
	// 		{
	// 			ne_2g: {
	// 				more_than_24_hours_2g: 0,
	// 				total: 0,
	// 				one_to_4_hour_2g: 0,
	// 				less_than_1_hour_2g: 0,
	// 				eight_to_24_hour_2g: 0,
	// 				four_to_8_hour_2g: 0
	// 			},
	// 			ne_unq: {
	// 				less_than_1_hour_unq: 0,
	// 				total: 0,
	// 				eight_to_24_hour_unq: 0,
	// 				four_to_8_hour_unq: 0,
	// 				more_than_24_hours_unq: 0,
	// 				one_to_4_hour_unq: 0
	// 			},
	// 			unique_sitedown: 0,
	// 			total_2g_site: 0,
	// 			ne_4g: {
	// 				more_than_24_hours_4g: 0,
	// 				total: 0,
	// 				one_to_4_hour_4g: 0,
	// 				less_than_1_hour_4g: 0,
	// 				eight_to_24_hour_4g: 0,
	// 				four_to_8_hour_4g: 0
	// 			},
	// 			total_4g_site: 0,
	// 			location: "JAYA"
	// 		},
	// 		{
	// 			ne_2g: {
	// 				more_than_24_hours_2g: 0,
	// 				total: 0,
	// 				one_to_4_hour_2g: 0,
	// 				less_than_1_hour_2g: 0,
	// 				eight_to_24_hour_2g: 0,
	// 				four_to_8_hour_2g: 0
	// 			},
	// 			ne_unq: {
	// 				less_than_1_hour_unq: 0,
	// 				total: 0,
	// 				eight_to_24_hour_unq: 0,
	// 				four_to_8_hour_unq: 0,
	// 				more_than_24_hours_unq: 0,
	// 				one_to_4_hour_unq: 0
	// 			},
	// 			unique_sitedown: 0,
	// 			total_2g_site: 0,
	// 			ne_4g: {
	// 				more_than_24_hours_4g: 0,
	// 				total: 0,
	// 				one_to_4_hour_4g: 0,
	// 				less_than_1_hour_4g: 0,
	// 				eight_to_24_hour_4g: 0,
	// 				four_to_8_hour_4g: 0
	// 			},
	// 			total_4g_site: 0,
	// 			location: "JAVA"
	// 		}
	// 	]
	// },

	obd: {
		state: {
			isCollapse: false,
			isOpen: false,
			modalObserver: null,
			observer: null,
			isLoading: false
		},
		store: {
			vehicleDetail: {
				data: {}
			},
			vehicleTracking: {
				data: {},
				travelDistance: null,
				estimatedTime: null,
				timeInTraffic: null
			},
			modal: {
				interval: null
			},
			collapseObd: {
				data: {
					busy_fme: "9999",
					idle_fme: "9999",
					off_vehicle: "9999",
					active_vehicle: "9999"
				},
				table: [
					{
						activity: "Idle FME",
						jaya: 0,
						java: 0,
						ksmp: 0,
						smtr: 0
					},
					{
						activity: "Busy FME",
						jaya: 0,
						java: 0,
						ksmp: 0,
						smtr: 0
					},
					{
						activity: "Off Vehicle",
						jaya: 0,
						java: 0,
						ksmp: 0,
						smtr: 0
					},
					{
						activity: "Active Vehicle",
						jaya: 0,
						java: 0,
						ksmp: 0,
						smtr: 0
					}
				],
				tableSupplier: [
					{
						activity: "Idle FME",
						PMT: 0,
						CCSI: 0,
						Nexwave: 0,
						MKU: 0,
						Adyawinsa: 0,
						Persada: 0
					},
					{
						activity: "Busy FME",
						PMT: 0,
						CCSI: 0,
						Nexwave: 0,
						MKU: 0,
						Adyawinsa: 0,
						Persada: 0
					},
					{
						activity: "Off Vehicle",
						PMT: 0,
						CCSI: 0,
						Nexwave: 0,
						MKU: 0,
						Adyawinsa: 0,
						Persada: 0
					},
					{
						activity: "Active Vehicle",
						PMT: 0,
						CCSI: 0,
						Nexwave: 0,
						MKU: 0,
						Adyawinsa: 0,
						Persada: 0
					}
				]
			}
		},
		checker: {
			vehicle: {
				inactive: false,
				active: false
			},
			supplier: {
				pmt: false,
				ccsi: false,
				nw: false,
				mku: false,
				adw: false,
				psd: false
			}
		},
		marker: {
			obdCarMarker: {
				clickAble: true,
				data: [],
				markers: [],
				zindex: 5,
				panelType: "obd"
			}
		},
		apiParams: {
			supplierChecker: [],
			carStatus: []
		}
	},

	siteDownDemarcation:{
		state: {
			isCollapse: false,
			store: {
				data: []
			}
		}
	},

	keaCalendar: {
		store: {
			listEvent: {},
			showDetails: false,
			currentEvent: "..."
		}
	}
});



function calculateDate(dateString, interval) {
	const date = new Date(dateString);
	const newTimestamp = date.getTime() - interval * 24 * 60 * 60 * 1000;
	const newDate = new Date(newTimestamp);
	const newDateString = newDate.toISOString().slice(0, 10);
	console.log(newDateString, "new date string index data");
	return newDateString;
}

function setDefaultTwelveTimeRange() {
	const now = new Date();
	const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

	const formatDate = (date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		return `${year}-${month}-${day} ${hours}:${minutes}`;
	};

	console.log(formatDate(twelveHoursAgo), formatDate(now), "date picker range");
	return [formatDate(twelveHoursAgo), formatDate(now)];
}
function getCurrentDateTime() {
    const now = new Date();
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
function getSevenDaysAgoStart() {
    const now = new Date();
    // 减去7天
    now.setDate(now.getDate() - 7);
    // 设置为当天的0点
    now.setHours(0, 0, 0, 0);
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day} 00:00:00`;
}
