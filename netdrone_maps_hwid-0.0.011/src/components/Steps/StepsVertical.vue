<template>
	<!-- IF DWDM -->
	<template v-if="this.dwdmStatus == true">
		<p class="text-dark font-800 font-16">{{ this.stepTitle }}</p>
		<div class="col-12 col-scroll">
			<div class="timeline m-0" v-if="this.alarmStepData.length">
				<div class="timeline-item" v-for="data in this.alarmStepData" :key="data.alarmid">
					<p class="font-14 font-400 text-light-grey mb-2">{{ data.lastoccurrence }} {{data.alarmsource}}</p>
					<p class="text-dark font-500 font-14 mb-2">{{ data.alarmname }}</p>
					<p v-if="data.severity != undefined" class="text-dark font-400 font-14 mb-2">Severity : {{ data.severity.toUpperCase() }}</p>
					<p v-if="data.alarm_location_info != undefined" class="text-dark font-500 font-14 mb-1">Alarm Location Info</p>
					<p v-if="data.alarm_location_info != undefined" class="text-dark font-400 font-14">{{ data.alarm_location_info.toUpperCase() }}</p>
				</div>
			</div>
			<p v-else class="font-600 font-16 text-dark mt-3">{{ this.emptyStepMessage }}</p>
		</div>
	</template>
	<!-- IF CORE ROUTER -->
	<template v-if="this.coreRouterStatus == true">
		<p class="text-dark font-800 font-16">{{ this.stepTitle }}</p>
		<div class="col-12 col-scroll">
			<div class="timeline m-0" v-if="this.alarmStepData.length">
				<div class="timeline-item" v-for="data in this.alarmStepData" :key="data.alarmid">
					<p class="font-14 font-400 text-light-grey mb-2">{{ data.lastoccurrence }} {{data.alarmsource}}</p>
					<p class="text-dark font-500 font-14">{{ data.alarmname }}</p>
					<!-- <p v-if="data.severity != undefined" class="text-dark font-400 font-14">{{ data.alarmsource.toUpperCase() }}</p> -->
				</div>
			</div>
			<p v-else class="font-600 font-16 text-dark mt-3">{{ this.emptyStepMessage }}</p>
		</div>
	</template>
	<!-- IF NOT DWDM -->
	<template v-if="this.dwdmStatus == false && this.coreRouterStatus == false">
		<p class="text-dark font-800 font-16">{{ this.stepTitle }}</p>
		<div class="col-12 col-scroll">
			<div class="timeline" v-if="this.alarmStepData.length">
				<div class="timeline-item" v-for="data in this.alarmStepData" :key="data.alarmid">
					<p class="font-14 font-400 text-light-grey">{{ data.lastoccurrence }} {{data.alarmsource}}</p>
					<p class="text-dark font-500 font-14">{{ data.alarmname }}</p>
				</div>
			</div>
			<p v-else class="font-600 font-16 text-dark mt-3">{{ this.emptyStepMessage }}</p>
		</div>
	</template>
</template>

<script>
export default {
	name: "StepsVertical",
	props: {
		isDwdm: {
			type: Boolean,
			default: false
		},
		isCoreRouter: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			default: ""
		},
		emptyMessage: {
			type: String,
			default: ""
		},
		alarmData: {
			type: Array,
			default: []
		}
	},
	watch: {
		isCoreRouter(newVal) {
			this.coreRouterStatus = newVal;
		},
		isDwdm(newVal) {
			this.dwdmStatus = newVal;
		},
		title(newVal) {
			this.stepTitle = newVal;
		},
		emptyMessage(newVal) {
			this.emptyStepMessage = newVal;
		},
		alarmData(newVal) {
			this.alarmStepData = newVal;
		}
	},
	data() {
		return {
			dwdmStatus: false,
			coreRouterStatus: false,
			stepTitle: "",
			emptyStepMessage: "",
			alarmStepData: []
		};
	},
	async mounted() {
		this.coreRouterStatus = this.isCoreRouter;
		this.dwdmStatus = this.isDwdm;
		this.stepTitle = this.title;
		this.emptyStepMessage = this.emptyMessage;
		this.alarmStepData = this.alarmData;
	}
};
</script>
