import { reactive } from 'vue';

export const DurationData = reactive({
    color1: "#0076CE",
    color14: "#ED6D00",
    color48: "#ec008c",
    color824: "#ED1C24",
    colorm24: "#313131",
    
    duration1: "Below 1 Hour",
    duration14: "1-4 Hour",
    duration48: "4-8 Hour",
    duration824: "8-24 Hour",
    durationm24: "Above 24 Hour",

    totalCell: '...',
    cellUrl: "",
    
    total: '...',
    hour1Sd: "...",
    hour14Sd: "...",
    hour48Sd: "...",
    hour824Sd: "...",
    hourM24Sd: "...",

    dataDurationSiteDown: null,

    power: false,

    todayDate: null,
    lastUpdated: null,
    fetching: null,
    refetch: false,

    power: false,
    hub: [],
    compState: 0,
    vipSite: null,
    mc: '',
    mcClusterSelected : [],
    selectedRegion: '',
    // siteTypeSelected: ['NORMAL'],
    siteTypeSelected: [],
    areaSelected: [],
})