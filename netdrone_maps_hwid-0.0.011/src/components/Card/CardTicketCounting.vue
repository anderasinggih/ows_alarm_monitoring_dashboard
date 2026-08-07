<template>
	<div class="card p-2" :style="'background-color:' + cardColor + ';' + 'border: none;'">
		<p class="font-14 text-center font-600">{{ title }}</p>
		<div :class="title == 'POT' ? 'row mt-2 justify-content-center' : 'row mt-2'">
			<div class="col-3">
				<div class="d-flex flex-row justify-content-center" v-if="closed === '...'">
					<div class="bg-card-loader loader-25"></div>
				</div>
				<p v-else class="font-18 font-700 text-center">
					{{ closed }}
				</p>
				<p class="font-12 text-center">Closed</p>
			</div>
			<div class="col-3">
				<div class="d-flex flex-row justify-content-center" v-if="running === '...'">
					<div class="bg-card-loader loader-25"></div>
				</div>
				<p v-else class="font-18 font-700 text-center">
					{{ running }}
				</p>
				<p class="font-12 text-center">Running</p>
			</div>
			<div v-if="title != 'POT'" class="col-3">
				<div class="d-flex flex-row justify-content-center" v-if="mtte === '...'">
					<div class="bg-card-loader loader-25"></div>
				</div>
				<p v-else class="font-18 font-700 text-center">
					{{ mtte }}
				</p>
				<p class="font-12 text-center">MTTE (Min)</p>
			</div>
			<div v-if="title != 'POT'" class="col-3">
				<div class="d-flex flex-row justify-content-center" v-if="mttr === '...'">
					<div class="bg-card-loader loader-25"></div>
				</div>
				<p v-else class="font-18 font-700 text-center">
					{{ mttr }}
				</p>
				<p class="font-12 text-center">MTTR (Hrs)</p>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: "CardTicketCounting",
	props: {
		closed: String,
		running: String,
		mtte: String,
		mttr: String,
		title: String,
		cardColor: String
	},
	watch: {
		closed(newVal) {
			this.closedTicket = newVal;
		},
		running(newVal) {
			this.runningTicket = newVal;
		},
		mtte(newVal) {
			this.mtteCount = newVal;
		},
		mttr(newVal) {
			this.mttrCount = newVal;
		},
		title(newVal) {
			this.severity = newVal;
		}
	},
	data() {
		return {
			closedTicket: "...",
			runningTicket: "...",
			mtteCount: "...",
			mttrCount: "...",
			severity: "..."
		};
	}
};
</script>

<style>
.loader-25 {
	width: 25px !important;
}
</style>
