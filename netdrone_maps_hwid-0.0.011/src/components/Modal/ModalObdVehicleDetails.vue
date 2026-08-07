<template>
	<div class="modal fade" id="modalObdVehicleDetails" ref="modalObdVehicleDetails" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-xl modal-dialog-centered">
			<div class="modal-content modal-details" style="zoom: 90%">
				<div class="d-flex flex-row justify-content-between px-3 py-4 pb-0">
					<h4><b>Vehicle Details</b></h4>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @keyup.esc="handleEscape" @click="removeBackdrop()"></button>
				</div>
				<hr />
				<div class="modal-body pt-0">
					<ul class="nav nav-underline mt-2" id="siteDetailsTab" role="tablist">
						<li class="nav-item" role="presentation">
							<button class="nav-link active" id="vehicle-info-tab" data-bs-toggle="tab" data-bs-target="#vehicle-info-tab-pane" type="button" role="tab" aria-controls="vehicle-info-tab-pane" aria-selected="true">VEHICLE INFORMATION</button>
						</li>
						<!-- <li class="nav-item" role="presentation">
							<button class="nav-link" id="task-list-dwdm-site-tab" data-bs-toggle="tab" data-bs-target="#task-list-dwdm-site-pane" type="button" role="tab" aria-controls="task-list-dwdm-site-pane" aria-selected="false">DWDM TASK LIST</button>
						</li> -->
					</ul>
					<div class="tab-content mt-3" id="vehicleDetailsTabContent">
						<TabContentVehicleInfo />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { getVehicleDetailByRegNumber } from "../../views/Api/markerObd/getVehicleDetailByRegNumber";
import { IndexData } from "../../views/Data/IndexData";
import { etaVehichleTrackMapsInit } from "../../views/Helper/MapFunction/etaVehichleTrackMapsInit";
import TabContentVehicleInfo from "../TabContent/ObdVehicleDetailTab/TabContentVehicleInfo.vue";

export default {
	name: "ModalObdVehicleDetails",
	components: {
		TabContentVehicleInfo
	},
	data() {
		return IndexData;
	},
	watch: {
		"obd.state.isOpen": function (newVal, oldVal) {
			if (newVal !== oldVal && newVal == true) {
				this.getData();
				this.obd.store.modal.interval = setInterval(() => {
					this.getData();
				}, 30000);
			}
		}
	},
	async mounted() {
		this.obd.state.modalObserver = new MutationObserver(() => {
			if (this.$refs.modalObdVehicleDetails.classList.contains("show")) {
				this.obd.state.isOpen = true;
			} else {
				this.obd.state.isOpen = false;
			}
		});

		if (this.$refs.modalObdVehicleDetails) {
			this.obd.state.modalObserver.observe(this.$refs.modalObdVehicleDetails, { attributes: true, attributeFilter: ["class"] });
		}
	},
	beforeUnmount() {
		if (this.obd.state.modalObserver) {
			this.obd.state.modalObserver.disconnect();
		}
	},
	methods: {
		async getData() {
			this.obd.state.isLoading = true;
			this.obd.store.vehicleTracking.travelDistance = null;
			await getVehicleDetailByRegNumber(this.obd.store.vehicleDetail.data.registration_number)
				.then((json) => {
					this.obd.store.vehicleTracking.data = json.res.results[0];

					let origin = this.obd.store.vehicleTracking.data.fme_origin;
					let destination = this.obd.store.vehicleTracking.data.car_destination;

					etaVehichleTrackMapsInit(origin, destination);
					this.obd.state.isLoading = false;
				})
				.catch((error) => {
					this.obd.state.isLoading = false;
					console.error("Error : ", error);
				});
		},
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
			clearInterval(this.obd.store.modal.interval);
		}
	}
};
</script>
