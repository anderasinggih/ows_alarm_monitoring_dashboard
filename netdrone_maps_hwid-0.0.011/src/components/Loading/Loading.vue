<template>
	<div class="d-flex flex-row justify-content-center" v-if="isLoading == true">
		<div class="bg-card-loader"></div>
	</div>
</template>

<script>
export default {
	name: "loading",
	props: {
		isLoading: false
	}
};
</script>
