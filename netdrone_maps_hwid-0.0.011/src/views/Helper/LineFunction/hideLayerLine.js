export function hideLayerLine(layerObj){
    if (layerObj.lines && layerObj.lines.length) {
        layerObj.lines.forEach((line) => {
            line.setMap(null);
        });
        layerObj.lines = [];
    }
}