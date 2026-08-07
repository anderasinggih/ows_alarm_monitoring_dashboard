<template>
	<div class="row px-3 row-steps">
		<ol class="list-group horizontal-steps d-flex flex-row justify-content-center">
			<div class="d-flex flex-column">
				<li :class="accept !== '' ? 'list-group-item completed' : 'list-group-item'">
					<span class="text-left pt-3 ps-0"> Accept </span>
					<p :class="accept != '' ? 'fit-content mb-3 text-left absolute-48' : 'fit-content mb-3 text-left'">{{ accept }}</p>
				</li>
			</div>
			<div class="d-flex flex-column">
				<li :class="depart !== '' ? 'list-group-item completed' : 'list-group-item'">
					<span class="text-left pt-3 ps-0"> Depart </span>
					<p :class="depart != '' ? 'fit-content mb-3 text-left absolute-48' : 'fit-content mb-3 text-left'">{{ depart }}</p>
				</li>
			</div>
			<div class="d-flex flex-column">
				<li :class="arrive !== '' ? 'list-group-item completed' : 'list-group-item'">
					<span class="text-left pt-3 ps-0" style="position: absolute; left: -16px"> Arrive </span>
					<p class="fit-content mb-3 text-left" :style="arrive !== '' ? 'position: absolute; left: -64px; top: 41px;' : ''">{{ arrive }}</p>
				</li>
			</div>
			<div class="d-flex flex-column">
				<li :class="complete !== '' ? 'list-group-item fit-content completed' : 'list-group-item fit-content'" style="border-top: none; margin-top: 3px">
					<span class="fit-content text-left pt-3 ps-0" :style="complete !== '' ? 'position:absolute;' : 'left: -40px;position: absolute;'"> Complete </span>
					<p :class="complete !== '' ? 'fit-content mb-3 text-left' : 'max-content mb-3 text-left'" :style="complete !== '' ? 'position: absolute; top: 41px; left: -77px;' : ''">{{ complete }}</p>
				</li>
			</div>
		</ol>
	</div>
</template>

<script>
export default {
	name: "StepHorizontal",
	props: {
		acceptTime: {
			type: String,
			default: ""
		},
		departTime: {
			type: String,
			default: ""
		},
		arriveTime: {
			type: String,
			default: ""
		},
		completeTime: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			accept: "",
			depart: "",
			arrive: "",
			complete: ""
		};
	},
	watch: {
		acceptTime(newVal) {
			this.accept = newVal;
		},
		departTime(newVal) {
			this.depart = newVal;
		},
		arriveTime(newVal) {
			this.arrive = newVal;
		},
		completeTime(newVal) {
			this.complete = newVal;
		}
	},
	mounted() {
		// Initialize values
		this.accept = this.acceptTime;
		this.depart = this.departTime;
		this.arrive = this.arriveTime;
		this.complete = this.completeTime;
	}
};
</script>

<style>
.row-steps {
	width: 100%;
	max-width: 900px;
	overflow-x: hidden;
}

.list-group {
	display: block;
}

.list-group.horizontal-steps {
	padding-top: 20px;
	height: 100px;
}

.list-group.horizontal-steps .list-group-item {
	border: 0px;
	border-radius: unset;
	border-top: 3px solid #ece5dd;
	box-sizing: border-box;
	counter-increment: step-counter;
	display: table-cell;
	padding-top: 10px;
	padding-left: 0px;
	padding-bottom: 0px;
	width: 200px;
}

.list-group.horizontal-steps .list-group-item.active {
	background-color: transparent;
	color: inherit;
}

.list-group.horizontal-steps .list-group-item:last-child {
	border-top: 3px solid #9fa0a0;
}

.list-group.horizontal-steps .list-group-item::before {
	border-radius: 50%;
	background-color: #9fa0a0;
	color: #555;
	content: counter(step-counter);
	display: inline-block;
	float: left;
	height: 25px;
	line-height: 25px;
	margin-left: 0px;
	margin-top: -25px;
	text-align: center;
	width: 25px;
	font-size: 0px;
}

.list-group.horizontal-steps .list-group-item span,
.list-group.horizontal-steps .list-group-item a {
	display: block;
	overflow: hidden;
	padding-top: 2px;
	padding-left: 10px;
	font-family: "Inter", sans-serif;
}

/*Active/ Completed States*/
.list-group.horizontal-steps .list-group-item.active::before {
	background-color: #62b230;
	color: #fff;
}

.list-group.horizontal-steps .list-group-item.completed span {
	color: #62b230;
	font-weight: 600;
}

.list-group.horizontal-steps .list-group-item.completed {
	border-top: 2px dashed #62b230;
}

.list-group.horizontal-steps .list-group-item.completed::before {
	background-color: #62b230;
	color: #fff;
}

.list-group.horizontal-steps .list-group-item.completed:last-child {
	border-top: 2px dashed #62b230;
}

.absolute-48 {
	position: absolute;
	left: -48px;
}
</style>
