import { toRaw } from "vue";

export function hideLayerMarker(layerObj){
        if (layerObj.markers && layerObj.markers.length > 0) {
            layerObj.markers.map((marker) => toRaw(marker).setMap(null));
        }
        layerObj.markers = [];
}