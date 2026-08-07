<template>
	<div class="cat action">
		<label>
			<input type="radio" :checked="checker" @change="handleChange($event)" />
			<span>
				{{ title }}
				<i class="ico font-14 font-normal">{{ count.length }}</i>
			</span>
		</label>
	</div>
</template>

<script>
export default {
	name: "ButtonChecker",
	props: {
		change: {
			type: Function,
			required: true
		},
		count: {
			type: Array,
			required: true
		},
		checker: {
			type: Boolean,
			required: true
		},
		title: {
			type: String,
			default: ""
		}
	},
	methods: {
		handleChange(event) {
			this.change(event);
		}
	}
};
</script>

<style>
.cat {
	cursor: pointer;
	background: #ffffff;
	color: #595757;
	font-weight: 600;
	overflow: hidden;
	float: left;
	width: fit-content;
	padding: 0;
}

.cat label {
	cursor: pointer;
	float: left;
	line-height: 3em;
	width: fit-content;
}

.cat label span {
	cursor: pointer;
	text-align: center;
	display: block;
}

.cat label input {
	cursor: pointer;
	position: absolute;
	display: none;
	color: #fff !important;
}

.cat label input + span {
	cursor: pointer;
	color: #595757;
}

.cat label input:checked + span {
	cursor: pointer;
	color: #ffffff;
}

.action label input + span {
	border: 1px solid #dcdddd;
	border-radius: 8px;
	color: #595757;
	padding: 0px 12px;
}

.action label input + span .ico {
	padding: 5px 6px;
	border-radius: 20px;
	background-color: #e1e1e1;
	color: #595757;
}

.action label input:checked + span .ico {
	padding: 5px 6px;
	border-radius: 20px;
	background-color: #f8e2ce;
	color: #ed6d00;
}

.action label input + span .img-ico {
	width: 32px;
	background: #e1e1e1;
	border-radius: 50px;
	padding: 3px 3px;
}

.action label input:checked + span .img-ico {
	width: 32px;
	background: #f8e2ce;
	border-radius: 50px;
	padding: 3px 3px;
}

.action label input:checked + span {
	cursor: pointer;
	background-color: #fff9f3;
	color: #ed6d00;
	border: 1px solid #ed6d00;
	border-radius: 8px;
	font-weight: 700;
	padding: 0px 12px;
}

.cat label input:hover + span {
	cursor: pointer;
	color: #ffffff;
}

.action label input:hover + span .ico {
	padding: 5px 6px;
	border-radius: 20px;
	background-color: #f8e2ce;
	color: #ed6d00;
}

.action label input:hover + span .img-ico {
	width: 32px;
	background: #f8e2ce;
	border-radius: 50px;
	padding: 3px 3px;
}

.action label input:hover + span {
	cursor: pointer;
	background-color: #fff9f3;
	color: #ed6d00;
	border: 1px solid #ed6d00;
	border-radius: 8px;
	font-weight: 700;
	padding: 0px 12px;
}
</style>
