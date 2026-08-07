<template>
	<template v-if="type == 'NE'">
		<div class="card card-flex-hovered py-3 px-2" @mouseover="hovered = true" @mouseleave="hovered = false">
			<p class="card-title-text mb-3 text-center font-600" :style="'font-size:' + fontSize + ';'">{{ duration }}</p>
			<div class="row row-gap-12" v-if="!hovered">
				<div class="col-lg-6 col-md-6">
					<h3 v-if="totalSiteDown != '...'" class="font-600 text-center" :style="'color:' + color + ';'">{{ totalSiteDown }}</h3>
					<div class="d-flex flex-row justify-content-center" v-if="totalSiteDown == '...'">
						<div class="bg-card-loader"></div>
					</div>
					<p class="text-center font-11">{{ subtitle }}</p>
				</div>
				<div class="col-lg-6 col-md-6">
					<h3 v-if="totalSiteDown2 != '...'" class="font-600 text-center" :style="'color:' + color + ';'">{{ totalSiteDown2 }}</h3>
					<div class="d-flex flex-row justify-content-center" v-if="totalSiteDown2 == '...'">
						<div class="bg-card-loader"></div>
					</div>
					<p class="text-center font-11">{{ subtitle2 }}</p>
				</div>
				<div class="col-lg-6 col-md-6">
					<h3 v-if="totalSiteDown3 != '...'" class="font-600 text-center" :style="'color:' + color + ';'">{{ totalSiteDown3 }}</h3>
					<div class="d-flex flex-row justify-content-center" v-if="totalSiteDown3 == '...'">
						<div class="bg-card-loader"></div>
					</div>
					<p class="text-center font-11">{{ subtitle3 }}</p>
				</div>
				<div class="col-lg-6 col-md-6">
					<h3 v-if="totalSiteDown4 != '...'" class="font-600 text-center" :style="'color:' + color + ';'">{{ totalSiteDown4 }}</h3>
					<div class="d-flex flex-row justify-content-center" v-if="totalSiteDown4 == '...'">
						<div class="bg-card-loader"></div>
					</div>
					<p class="text-center font-11">{{ subtitle4 }}</p>
				</div>
			</div>
			<div class="row row-gap-12" v-else>
				<div class="col-lg-12 col-md-12 d-flex flex-column align-items-center pt-4">
					<slot name="downloadDataBtn" />
				</div>
			</div>
		</div>
	</template>

	<template v-if="type != 'NE'">
		<div class="card card-flex-hovered py-3 px-2" @mouseover="hovered = true" @mouseleave="hovered = false">
			<p class="card-title-text mb-3 text-center font-600" :style="'font-size:' + fontSize + ';'">{{ duration }}</p>
			<div class="row row-gap-12" v-if="!hovered">
				<div class="col-lg-12 col-md-12">
					<h3 v-if="totalSiteDown != '...'" class="site-down-ctext font-600 text-center" :style="'color:' + color + ';'">{{ totalSiteDown }}</h3>
					<div class="d-flex flex-row justify-content-center" v-if="totalSiteDown == '...'">
						<div class="bg-card-loader"></div>
					</div>
					<p class="text-center font-12">{{ subtitle }}</p>
				</div>
			</div>
			<div class="row row-gap-12" v-else>
				<div class="col-lg-12 col-md-12 d-flex flex-column align-items-center pt-1">
					<slot name="downloadDataBtn" />
				</div>
			</div>
		</div>
	</template>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
	name: "CardAccordidonDuration",
	props: {
		color: String,
		totalSiteDown: String,
		totalSiteDown2: String,
		totalSiteDown3: String,
		totalSiteDown4: String,
		type: String,
		duration: String,
		duration2: String,
		duration3: String,
		duration4: String,
		subtitle: String,
		subtitle2: String,
		subtitle3: String,
		subtitle4: String,
		fontSize: String,
		fontSize2: String
	},
	data() {
		return {
			hovered: false
		};
	}
});
</script>

<style>
.card-flex-hovered {
	width: 19.2%;
	border: none;
	background-color: #cecece26;
}

.card-flex-hovered:hover {
	border: 1px solid #ed6d00;
}
.card-title-text {
    font-size: 18px;
    margin-bottom: 6px !important;
}
.site-down-ctext{
	font-size: 28px;
}
</style>
