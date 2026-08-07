<template>
	<div class="card card-badge d-flex flex-row align-items-center p-3" :title="subtitle">
		<p class="font-14 font-500 fit-content">{{ title }} : &nbsp;</p>
		<p class="font-600 font-14 text-ioh subtitle-text-badge">
			{{ subtitle }}
		</p>
	</div>
</template>

<script>
export default {
	name: "McClusterBadge",
	props: {
		subtitle: String,
		title: String
	}
};
</script>

<style scoped>
.subtitle-text-badge {
	max-width: 300px;
	width: auto;
	text-overflow: ellipsis;
	text-wrap: nowrap;
	overflow-x: hidden;
}

.subtitle-text-badge:hover {
	width: auto;
	max-width: 600px;
	text-overflow: inherit;
	text-wrap: wrap;
	overflow-x: visible;
	transition: all 0.3s ease;
}
</style>
