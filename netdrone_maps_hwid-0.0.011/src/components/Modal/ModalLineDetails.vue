<template>
	<div class="modal fade" id="lineDetails" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-xl modal-dialog-centered">
			<div class="modal-content modal-details">
				<div class="d-flex flex-row justify-content-between px-3 py-4 pb-0">
					<h4 class="font-inter mb-3"><b>Link Details</b></h4>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @keyup.esc="handleEscape" @click="removeBackdrop()"></button>
				</div>
				<div class="modal-body pt-0">
					<div class="card card-dwdm-link-details p-3">
						<div class="row">
							<div class="col-6">
								<h3 class="font-inter font-20 font-600 mb-3">Source</h3>
								<div class="box-text mb-2 mt-2">
									<p class="text-left">Site Name</p>
									<p class="text-right">{{ this.dwdm.store.lineDetails.sourceData.site_name != undefined ? this.dwdm.store.lineDetails.sourceData.site_name : "" }}</p>
								</div>
								<div class="box-text mb-2 mt-2">
									<p class="text-left">Site ID</p>
									<p class="text-right">{{ this.dwdm.store.lineDetails.sourceData.site_id != undefined ? this.dwdm.store.lineDetails.sourceData.site_id : "" }}</p>
								</div>
								<div class="box-text mb-2 mt-2">
									<p class="text-left">Source Port</p>
									<p class="text-right" style="width: 400px">{{ this.dwdm.store.lineDetails.sourceData.longitude != undefined ? this.dwdm.store.lineDetails.sourceData.port : "" }}</p>
								</div>
								<!-- <div class="box-text mb-2 mt-2">
									<p class="text-left">Site Class</p>
									<p class="text-right">{{ this.dwdm.store.lineDetails.sourceData.site_class != undefined ? this.dwdm.store.lineDetails.sourceData.site_class : "" }}</p>
								</div> -->
								<div class="box-text mb-2 mt-2">
									<p class="text-left">Circle</p>
									<p class="text-right">{{ this.dwdm.store.lineDetails.sourceData.circle_id != undefined ? this.dwdm.store.lineDetails.sourceData.circle_id : "" }}</p>
								</div>
								<div class="box-text mb-2 mt-2">
									<p class="text-left">Is VIP</p>
									<p class="text-right">{{ this.dwdm.store.lineDetails.sourceData.is_vip != undefined ? this.dwdm.store.lineDetails.sourceData.is_vip : "" }}</p>
								</div>
								<div class="box-text mb-2 mt-2">
									<p class="text-left">Latitude</p>
									<p class="text-right">{{ this.dwdm.store.lineDetails.sourceData.latitude != undefined ? this.dwdm.store.lineDetails.sourceData.latitude : "" }}</p>
								</div>
								<div class="box-text mb-2 mt-2">
									<p class="text-left">Longitude</p>
									<p class="text-right">{{ this.dwdm.store.lineDetails.sourceData.longitude != undefined ? this.dwdm.store.lineDetails.sourceData.longitude : "" }}</p>
								</div>
							</div>
							<div class="col-6">
								<h3 class="font-inter font-20 font-600 mb-3">Destination</h3>
								<div class="box-text mb-2 mt-2">
									<p class="text-left">Site Name</p>
									<p class="text-right">{{ this.dwdm.store.lineDetails.destinationData.site_name != undefined ? this.dwdm.store.lineDetails.destinationData.site_name : "" }}</p>
								</div>
								<div class="box-text mb-2 mt-2">
									<p class="text-left">Site ID</p>
									<p class="text-right">{{ this.dwdm.store.lineDetails.destinationData.site_id != undefined ? this.dwdm.store.lineDetails.destinationData.site_id : "" }}</p>
								</div>
								<div class="box-text mb-2 mt-2">
									<p class="text-left">Destination Port</p>
									<p class="text-right" style="width: 400px">{{ this.dwdm.store.lineDetails.destinationData.longitude != undefined ? this.dwdm.store.lineDetails.destinationData.port : "" }}</p>
								</div>
								<!-- <div class="box-text mb-2 mt-2">
									<p class="text-left">Site Class</p>
									<p class="text-right">{{ this.dwdm.store.lineDetails.destinationData.site_class != undefined ? this.dwdm.store.lineDetails.destinationData.site_class : "" }}</p>
								</div> -->
								<div class="box-text mb-2 mt-2">
									<p class="text-left">Circle</p>
									<p class="text-right">{{ this.dwdm.store.lineDetails.destinationData.circle_id != undefined ? this.dwdm.store.lineDetails.destinationData.circle_id : "" }}</p>
								</div>
								<div class="box-text mb-2 mt-2">
									<p class="text-left">Is VIP</p>
									<p class="text-right">{{ this.dwdm.store.lineDetails.destinationData.is_vip != undefined ? this.dwdm.store.lineDetails.destinationData.is_vip : "" }}</p>
								</div>
								<div class="box-text mb-2 mt-2">
									<p class="text-left">Latitude</p>
									<p class="text-right">{{ this.dwdm.store.lineDetails.destinationData.latitude != undefined ? this.dwdm.store.lineDetails.destinationData.latitude : "" }}</p>
								</div>
								<div class="box-text mb-2 mt-2">
									<p class="text-left">Longitude</p>
									<p class="text-right">{{ this.dwdm.store.lineDetails.destinationData.longitude != undefined ? this.dwdm.store.lineDetails.destinationData.longitude : "" }}</p>
								</div>
							</div>
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
	name: "ModalLineDetails",
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

<style>
.box-text {
	display: flex;
	flex-direction: row;
}

.text-left {
	width: 105px;
	color: #595757;
	font-weight: 500;
}

.text-right {
	width: fit-content;
	font-weight: 500;
}

.card-dwdm-link-details {
	border-radius: 8px;
	border: 1px solid #eaeaea;
}
</style>
