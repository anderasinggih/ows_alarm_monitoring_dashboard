<template>
	<div :class="'card card-obd ' + type">
		<div class="card-body d-flex flex-column gap-8">
			<p v-if="count != '9999'" class="font-24 font-600 text-dark">{{ count }}</p>
			<div v-else class="d-flex flex-row">
				<div class="bg-card-loader"></div>
			</div>
			<p class="font-12 font-400 text-dark">{{ subtitle }}</p>
		</div>
	</div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
	name: "CardObd",
	props: {
		type: "fme-idle" || "fme-busy" || "car-idle" || "car-busy",
		count: String,
		subtitle: String
	}
});
</script>

<style>
.card-obd {
	border: 1px solid #eaeaea;
	border-radius: 4px;
}

.fme-idle {
	background-image: url("../../assets/svg/obd-fme-idle.svg");
	background-size: cover;
}

.fme-busy {
	background-image: url("../../assets/svg/obd-fme-busy.svg");
	background-size: cover;
}

.car-idle {
	background-image: url("../../assets/svg/obd-car-idle.svg");
	background-size: cover;
}

.car-busy {
	background-image: url("../../assets/svg/obd-car-busy.svg");
	background-size: cover;
}
</style>
