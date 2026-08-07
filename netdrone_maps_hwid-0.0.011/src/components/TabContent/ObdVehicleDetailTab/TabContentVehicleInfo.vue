<template>
	<div class="tab-pane fade show active" id="vehicle-info-tab-pane" role="tabpanel" aria-labelledby="vehicle-info-tab" tabindex="0">
		<div class="card card-obd p-4 pt-3">
			<!-- TOP CONTENT -->
			<div class="row">
				<div class="d-flex flex-row justify-content-between mb-4">
					<div class="d-flex gap-8">
						<img src="../../../assets/svg/obd-car-icon.svg" alt="" />
						<div class="d-flex flex-column gap-8 align-self-center">
							<p class="font-14 font-400 text-grey">Registration Number</p>
							<p class="font-20 font-700 text-dark">{{ this.obd.store.vehicleDetail.data.registration_number != undefined ? this.obd.store.vehicleDetail.data.registration_number : "-" }}</p>
						</div>
					</div>
					<div class="d-flex align-self-center">
						<ObdCarBadge :status="this.obd.store.vehicleDetail.data.status != undefined ? this.obd.store.vehicleDetail.data.status : 'inactive'" />
					</div>
				</div>
				<div class="col-6 d-flex flex-column gap-16">
					<p class="text-grey text-start font-500 font-18">Vehicle Type</p>
					<p class="text-grey text-start font-500 font-18">Vehicle Name</p>
					<p class="text-grey text-start font-500 font-18">Last Updated Time</p>
				</div>
				<div class="col-6 d-flex flex-column gap-16">
					<p class="text-dark text-end font-500 font-18">{{ this.obd.store.vehicleDetail.data.vehicle_type != undefined ? this.obd.store.vehicleDetail.data.vehicle_type : "-" }}</p>
					<p class="text-dark text-end font-500 font-18">{{ this.obd.store.vehicleDetail.data.vehicle_name != undefined ? this.obd.store.vehicleDetail.data.vehicle_name : "-" }}</p>
					<p class="text-dark text-end font-500 font-18">{{ this.obd.store.vehicleDetail.data.created_at != undefined ? this.obd.store.vehicleDetail.data.created_at : "-" }}</p>
				</div>
			</div>
			<!-- MAP CONTENT -->
		</div>
		<p class="text-dark font-20 font-600 py-4 d-flex flex-row align-content-center align-items-center">
			Live Location
			<div class="bg-card-loader" v-if="this.obd.state.isLoading == true"></div>
		</p>

		<div class="card card-obd">
			<div class="row" id="vehicle-info-map-card">
				<div class="petal-obd-vehicle-info px-0" style="width: 100%; height: 400px; cursor: pointer; background-color: none !important" id="petal-obd-vehicle-info"></div>
			</div>
			<div class="row p-4">
				<div class="col-6 d-flex flex-column gap-16">
					<p class="text-grey text-start font-500 font-18">FME Name</p>
					<p class="text-grey text-start font-500 font-18">Default FM Office</p>
					<p class="text-grey text-start font-500 font-18">Supplier</p>
					<p class="text-grey text-start font-500 font-18">Distance To Vehicle</p>
					<p class="text-grey text-start font-500 font-18">Phone Number</p>
					<p class="text-grey text-start font-500 font-18">On Progress Task</p>
				</div>
				<div class="col-6 d-flex flex-column gap-16">
					<p class="text-dark text-end font-500 font-18">{{ this.obd.store.vehicleTracking.data.fme_name !== undefined ? (this.obd.store.vehicleTracking.data.fme_name !== null ? this.obd.store.vehicleTracking.data.fme_name : "-") : "-" }}</p>
					<p class="text-dark text-end font-500 font-18">{{ this.obd.store.vehicleTracking.data.default_fm_office != undefined ? (this.obd.store.vehicleTracking.data.default_fm_office !== null ? this.obd.store.vehicleTracking.data.default_fm_office : "-") : "-" }}</p>
					<p class="text-dark text-end font-500 font-18">{{ this.obd.store.vehicleTracking.data.supplier != undefined ? (this.obd.store.vehicleTracking.data.supplier !== null ? this.obd.store.vehicleTracking.data.supplier : "-") : "-" }}</p>
					<p class="text-dark text-end font-500 font-18">{{ this.obd.store.vehicleTracking.travelDistance != null ? this.obd.store.vehicleTracking.travelDistance : "0" }}</p>
					<p class="text-dark text-end font-500 font-18">{{ this.obd.store.vehicleTracking.data.phone_number != undefined ? (this.obd.store.vehicleTracking.data.phone_number !== null ? this.obd.store.vehicleTracking.data.phone_number : "-") : "-" }}</p>
					<p class="text-dark text-end font-500 font-18">{{ this.obd.store.vehicleTracking.data.task != undefined ? (this.obd.store.vehicleTracking.data.task !== null ? this.obd.store.vehicleTracking.data.task : "-") : "-" }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { IndexData } from "../../../views/Data/IndexData";
import ObdCarBadge from "../../Badge/ObdCarBadge.vue";

export default {
	name: "TabContentVehicleInfo",
	data() {
		return IndexData;
	},
	components: {
		ObdCarBadge
	}
};
</script>

<style>
.card-obd {
	border-radius: 4px;
	border: 1px solid #eaeaea;
}
</style>
