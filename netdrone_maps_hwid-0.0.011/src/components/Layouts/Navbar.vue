<template>
	<nav class="navbar bg-body-netdrone py-3" id="netdrone-navbar">
		<div class="container-fluid">
			<div class="row row-nav">
				<div class="col-4 d-flex flex-row align-self-center">
					<!-- yxl <a class="me-2 align-self-center" data-bs-toggle="offcanvas" href="#netdrone-sidebar" role="button"
						aria-controls="netdrone-sidebar">
						<i class="bi bi-list text-white font-24 font-600"></i>
					</a> -->
					<a class="navbar-brand">
						<img src="../../assets/img/logo/huawei.png" class="navbar-logo-hw" alt="" />
					</a>
				</div>
				<div class="col-4 text-center d-flex flex-column align-self-center">
					<h3 class="text-white font-700 netdrone-title">NetDrone</h3>
				</div>
				<div class="col-4 d-flex flex-row justify-content-end time-reload">
					<div class="d-flex flex-column gap-8 me-2">
						<p class="last-updated-title text-white mb-0 text-end">Last Updated Time</p>
						<p class="last-updated-subtitle text-white mb-0 font-600 text-end">&nbsp; &nbsp;{{
							this.todayDate }} &nbsp; {{ this.lastUpdated }}</p>
					</div>
					<img src="../../assets/img/logo/surge_logo.png" class="navbar-logo-ioh" alt="" />
				</div>
			</div>
		</div>
	</nav>
	<!-- <nav class="navbar d-flex flex-row justify-content-center" style="background-color: #fff5e680">
		<p v-if="eventStatus == false" class="text-ioh">
			<img src="../../assets/svg/ic_public_tips_border.svg" alt="" />
			No live events today – <a class="event-link text-ioh" data-bs-toggle="modal"
				data-bs-target="#calendarEventModal">Check the calendar for what's
				coming next.</a>
		</p>
		<p v-else class="text-ioh"><img src="../../assets/svg/ic_public_tips_border.svg" alt="" /> NOW LIVE: {{
			eventName }} - <a class="event-link text-ioh" data-bs-toggle="modal" data-bs-target="#calendarEventModal">
				VIEW </a></p>
	</nav> -->
	<slot />
</template>

<script>
import { IndexData } from "../../views/Data/IndexData";
import { getEventList } from "../../views/Api/calendar/getEventNotification.js"

export default {
	name: "Navbar",
	data() {
		return IndexData;
	},
	props: {
		eventStatus: {
			type: Boolean,
			default: false
		},
		eventName: {
			type: String,
			default: ""
		}
	},
};
</script>

<style>
.event-link {
	text-decoration: underline !important;
	cursor: pointer !important;
}

.event-link:hover {
	font-weight: 600 !important;
}

.last-updated-title {
	color: white;
	font-size: 14px;
	font-weight: 400;
	letter-spacing: 1px;
}

.netdrone-nav {
	background: #ed6d00;
}

.netdrone-title {
	color: white;
	font-weight: 600;
}

.navbar-logo-hw {
	width: 115px !important;
	height: 30px;
}

.navbar-logo-ioh {
	width: 115px !important;
	height: 40px;
}

.time-reload {
	gap: 12px;
}

@media screen and (max-width: 1600px) {
	.navbar-logo-hw {
		width: 95 !important;
		height: 24px;
	}

	.navbar-logo-ioh {
		width: 95 !important;
		height: 38px;
	}

	.navbar {
		padding-top: 10px !important;
		padding-bottom: 10px !important;
	}

	.netdrone-title {
		font-size: 20px !important;
	}

	.time-reload {
		gap: 8px;
	}

	.last-updated-title {
		font-size: 12px !important;
	}

	.last-updated-subtitle {
		font-size: 12px !important;
	}
}
</style>
