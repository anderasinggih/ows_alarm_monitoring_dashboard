<template>
	<div class="modal fade" id="etaDetails" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-xl modal-dialog-centered">
			<div class="modal-content modal-details">
				<div class="modal-header">
					<h4><b>Task Details</b></h4>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @keyup.esc="handleEscape" @click="removeBackdrop()"></button>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-6">
							<div class="row">
								<div class="col-4">
									<p class="font-left font-16 mb-2 color-black"><b>Task</b></p>
									<p class="font-left font-16 mb-3">Task ID</p>
									<p class="font-left font-16 mb-2 color-black"><b>Site</b></p>
									<p class="font-left font-16 mb-2">Site ID</p>
									<p class="font-left font-16 mb-2">Lat</p>
									<p class="font-left font-16 mb-3">Lon</p>
									<p class="font-left font-16 mb-2 color-black"><b>User</b></p>
									<p class="font-left font-16 mb-2">User</p>
									<p class="font-left font-16 mb-2">User ID</p>
									<p class="font-left font-16 mb-2">Lat</p>
									<p :class="this.globalProcess.store.eta.modalStatus == 'PG' ? 'font-left font-16 mb-2' : 'font-left font-16 mb-2'">Lon</p>
									<p v-if="this.globalProcess.store.eta.modalStatus == 'PG'" class="font-left font-16 mb-3">Phone Number</p>
									<p class="font-left font-16 mb-2 color-black"><b>User Distance</b></p>
									<p class="font-left font-16 mb-2">Distance</p>
									<p class="font-left font-16 mb-2">ETA</p>
								</div>
								<div class="col-8" v-if="this.globalProcess.store.eta.ticketDetail != undefined && this.globalProcess.store.eta.ticketDetail != null">
									<p class="font-right font-16 mb-2">
										<b>&nbsp;</b>
									</p>
									<p class="font-right font-16 mb-3 font-500 text-dark">
										{{ this.globalProcess.store.eta.ticketDetail.wo_id }}
									</p>
									<p class="font-right font-16 mb-2">
										<b>&nbsp;</b>
									</p>
									<p class="font-right font-16 mb-2 font-500 text-dark">
										{{ this.globalProcess.store.eta.ticketDetail.site_id }}
									</p>
									<p class="font-right font-16 mb-2 font-500 text-dark">
										{{ this.globalProcess.store.eta.ticketDetail.site_lat }}
									</p>
									<p class="font-right font-16 mb-3 font-500 text-dark">
										{{ this.globalProcess.store.eta.ticketDetail.site_lon }}
									</p>
									<p class="font-right font-16 mb-2">
										<b>&nbsp;</b>
									</p>
									<p class="font-right font-16 mb-2 font-500 text-dark">
										{{ this.globalProcess.store.eta.ticketDetail.full_name }}
									</p>
									<p class="font-right font-16 mb-2 font-500 text-dark">
										{{ this.globalProcess.store.eta.ticketDetail.username }}
									</p>

									<p v-if="this.globalProcess.state.component.isCoordZero == true" class="font-right font-16 mb-2 font-700 text-ioh">No Updates From FME</p>
									<p v-else class="font-right font-16 mb-2 font-500 text-dark">
										{{ this.globalProcess.store.eta.ticketDetail.fme_lat }}
									</p>

									<p v-if="this.globalProcess.state.component.isCoordZero == true" :class="this.globalProcess.store.eta.modalStatus == 'PG' ? 'font-right font-16 mb-2 font-700 text-ioh' : 'font-right font-16 mb-3 font-700 text-ioh'">No Updates From FME</p>
									<p v-else :class="this.globalProcess.store.eta.modalStatus == 'PG' ? 'font-right font-16 mb-2 font-500 text-dark' : 'font-right font-16 mb-3 font-500 text-dark'">
										{{ this.globalProcess.store.eta.ticketDetail.fme_lon }}
									</p>

									<p v-if="this.globalProcess.store.eta.modalStatus == 'PG'" class="font-right font-16 mb-3 font-500 text-dark">
										{{ this.globalProcess.store.eta.ticketDetail.mobile }}
									</p>
									<p class="font-right font-16 mb-2">
										<b>&nbsp;</b>
									</p>
									<p class="font-right font-16 mb-3 font-500 text-dark">
										{{ this.globalProcess.store.eta.travelDistance }}
									</p>
									<p class="font-right font-16 mb-3 font-500 text-dark">
										{{ this.globalProcess.store.eta.timeInTraffic }}
									</p>
								</div>
							</div>
						</div>
						<div class="col-6" id="petal-map-col">
							<div class="site-map-petal-hw" style="width: 100%; height: 500px; cursor: pointer; background-color: whitesmoke" id="site-map-petal-hw"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { IndexData } from "../../views/Data/IndexData";
export default {
	name: "ModalEtaDetails",
	data() {
		return IndexData;
	},
	methods: {
		handleEscape(event) {
			if (event.key === "Escape" || event.keyCode === 27) {
				this.removeBackdrop();
			}
		},
		removeBackdrop() {
			var backdrops = document.getElementsByClassName("modal-backdrop fade show");
			Array.from(backdrops).forEach(function (backdrop) {
				backdrop.classList.remove("modal-backdrop");
				backdrop.classList.remove("fade");
				backdrop.classList.remove("show");
			});
		}
	}
};
</script>
