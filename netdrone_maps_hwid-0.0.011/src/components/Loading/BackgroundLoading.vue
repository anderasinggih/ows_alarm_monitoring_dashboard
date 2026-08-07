<template>
	<div class="card fit-content">
		<div class="card-body d-flex flex-row align-items-center gap-8">
			<p class="font-14 font-500">{{ title }}</p>
			<div class="bg-card-loader bg-loader-statistic"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: "BackgroundLoading",
	props: {
		title: String
	}
};
</script>
