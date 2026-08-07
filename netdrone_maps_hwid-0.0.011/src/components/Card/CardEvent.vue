<template>
	<div class="card d-flex flex-grow-1">
		<div class="card-body">
			<p class="title mb-2">{{ title }}</p>
			<div class="d-flex flex-row justify-content-between">
				<p class="font-700 font-24 m-0">{{ total }}</p>
				<div class="d-flex flex-row gap-4">
					<p class="done-badge m-0">{{ done }} Done</p>
					<p class="ongoing-badge m-0">{{ ongoing }} Ongoing</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
	name: "CardEvent",
	props: {
		total: {
			type: String,
			default: "999999"
		},
		title: {
			type: String,
			default: ""
		},
		done: {
			type: String,
			default: "999999"
		},
		ongoing: {
			type: String,
			default: "999999"
		}
	}
});
</script>

<style>
.title {
	color: #292a3480;
}

.ongoing-badge {
	background-color: #c7000b;
	border-radius: 20px;
	padding: 7px 6px;
	margin: 0px !important;
	align-self: center;
	color: white;
}

.done-badge {
	background-color: #62b230;
	border-radius: 20px;
	padding: 7px 6px;
	margin: 0px !important;
	align-self: center;
	color: white;
}
</style>
