<template>
	<div :class="status == 'active' ? 'badge-obd-active d-flex flex-row gap-8' : 'badge-obd-off d-flex flex-row gap-8'">
		<i class="bi bi-circle-fill" :style="status == 'active' ? 'color: #4fa700;' : 'color: #ED1C24;'"></i>
		<p :style="status == 'active' ? 'color: #4fa700;' : 'color: #ED1C24;'">{{ status == "active" ? "Active" : "Off" }}</p>
	</div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
	name: "ObdCarBadge",
	props: {
		status: {
			type: String,
			default: "inactive"
		}
	}
});
</script>

<style>
.badge-obd-active {
	border-radius: 20px;
	padding: 8px 15px;
	background-color: #eef6eb;
	border: 1px solid #4fa700;
}

.badge-obd-off {
	border-radius: 20px;
	padding: 8px 15px;
	background-color: #f9f2f2;
	border: 1px solid #ed1c24;
}
</style>
