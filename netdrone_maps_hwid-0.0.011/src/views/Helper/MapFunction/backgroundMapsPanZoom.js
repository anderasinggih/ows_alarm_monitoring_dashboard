import { IndexData } from "../../Data/IndexData";

export function backgroundMapsPanZoom(latCoord,lngCoord,zoom){
    IndexData.globalProcess.store.maps.backgroundMaps.panTo({ lat: latCoord, lng: lngCoord });
	IndexData.globalProcess.store.maps.backgroundMaps.setZoom(zoom);
}