export const RegionWiseData = {
    regionWiseData: null,
    sdSMTR: 0,
    cdSMTR: 0,
    sdJBRO: 0,
    cdJBRO: 0,
    sdKSMP: 0,
    cdKSMP: 0,
    sdEJBN: 0,
    cdEJBN: 0,
    sdCJWJ: 0,
    cdCJWJ: 0,

    totalCjwj: 0,
    totalEjbn: 0,
    totalJbro: 0,
    totalKsmp: 0,
    totalSmtr: 0,

    cellDownArrayKSMP: [],
    siteDownArrayKSMP: [],
    cellDownArrayJBRO: [],
    siteDownArrayJBRO: [],
    cellDownArrayCJWJ: [],
    siteDownArrayCJWJ: [],
    cellDownArraySMTR: [],
    siteDownArraySMTR: [],
    cellDownArrayEJBN: [],
    siteDownArrayEJBN: [],

    arraySMTR: [],
    arrayKSMP: [],
    arrayJBRO: [],
    arrayCJWJ: [],
    arrayEJBN: [],

    regions: [
        { label: "JAYA", circleData: [], barData: [], siteDownArray: [], total: 0 },
        { label: "JAVA", circleData: [], barData: [], siteDownArray: [], total: 0 },
        { label: "SMTR", circleData: [], barData: [], siteDownArray: [], total: 0 },
        { label: "KSMP", circleData: [], barData: [], siteDownArray: [], total: 0 },
    ],

    // REFETCH
    todayDate: null,
    lastUpdated: null,
    fetching: null,
    refetch: false,

    // POWER ALARM
    power: false,
    regionLoading: false,
    hub: [],
    compState: 0,
    vipSite: null,
    mc: '',
    siteTypeSelected: ['NORMAL'],
    areaSelected: [],
    selectedRegion : ''
}