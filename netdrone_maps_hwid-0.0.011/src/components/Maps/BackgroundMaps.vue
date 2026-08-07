<template>
	<div id="container-maps-petal" style="width: 100%; height: 100%; position: fixed">
		<div class="background-maps" id="background-maps"></div>
		<div class="box-opacity" v-if="this.globalProcess.state.component.siteDownMarkerLoading == true"></div>
		<div class="box-opacity" v-if="this.globalProcess.state.component.neDownMarkerLoading == true"></div>
		<div class="box-opacity" v-if="this.globalProcess.state.component.applyFilterLoading == true"></div>
		<div class="box-opacity" v-if="this.globalProcess.state.component.fmeDetailsLoading == true"></div>
		<div class="box-opacity" v-if="this.globalProcess.state.component.siteDetailsLoading == true"></div>
		<div class="box-opacity" v-if="this.globalProcess.state.component.loadingMarkerPg == true"></div>
		<div class="box-opacity" v-if="this.globalProcess.state.component.loadingEtaDataPg == true"></div>
		<div class="box-opacity" v-if="this.globalProcess.state.component.loadingDwdmMarker == true"></div>
		<div class="box-opacity" v-if="this.globalProcess.state.component.loadingLinkDownData == true"></div>
		<div class="box-opacity" v-if="this.globalProcess.state.component.loadingCoreRouterData == true"></div>
	</div>
	<slot />
</template>

<script>
import { IndexData } from "../../views/Data/IndexData";
export default {
	name: "BackgroundMaps",
	data() {
		return IndexData;
	}
};
</script>

<style>
.background-maps {
	width: 100%;
	height: 100vh;
	z-index: 1;
	position: absolute;
	cursor: pointer;
	background-color: whitesmoke;
}

.box-opacity {
	background-color: black;
	width: 100%;
	height: 100%;
	position: absolute;
	z-index: 2;
	opacity: 30%;
}
</style>
