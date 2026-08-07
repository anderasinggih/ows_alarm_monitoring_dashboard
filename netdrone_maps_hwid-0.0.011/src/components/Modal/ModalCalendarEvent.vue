<template>
	<div class="modal fade" id="calendarEventModal" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-xl modal-dialog-centered">
			<div class="modal-content modal-details">
				<div class="modal-header">
					<h4><b>KEA Calendar</b></h4>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>

				<div class="modal-body">
					<div class="card p-2 d-flex flex-row gap-3 flex-wrap mb-3">
						<!-- <CardEvent title="International Event" total="5" done="2" ongoing="3" />
						<CardEvent title="Local Event" total="5" done="2" ongoing="3" />
						<CardEvent title="CXO Visit" total="5" done="2" ongoing="3" />
						<CardEvent title="National Event" total="5" done="2" ongoing="3" />
						<CardEvent title="Internal Event" total="5" done="2" ongoing="3" /> -->
						<CardEvent v-for="category in categories" :key="category.category" :title="category.category" :total="category.total" :done="category.done" :ongoing="category.ongoing" />
					</div>

					<div class="card p-2">
						<FullCalendar :options="calendarOptions" ref="calendarRef" />
					</div>

					<div v-if="selectedEvent.title" class="card p-3 mt-3">
						<h6>{{ selectedEvent.date }}</h6>
						<div class="collapse-style" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
							<p style="margin-left: 8px; font-size: 20px">{{ selectedEvent.title }}</p>
						</div>
						<div class="collapse" id="collapseExample">
							<div class="card card-body">
								<h6>• Date : {{ selectedEvent.date }}</h6>
								<h6>• Location : {{ selectedEvent.location }}</h6>
								<h6>• Event Type : {{ selectedEvent.type }}</h6>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { onMounted, ref, reactive } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import CardEvent from "../Card/CardEvent.vue";
import { IndexData } from "../../views/Data/IndexData";

import { getEventList, getCategoryCountEvent } from "../../views/Api/calendar/getEventNotification.js";

export default {
	name: "ModalCalendarEvent",
	components: {
		FullCalendar,
		CardEvent
	},
	methods: {
		showHide() {
			const store = IndexData.keaCalendar.store;
			store.showDetails = !store.showDetails;
		}
	},
	setup() {
		const store = IndexData;
		const calendarRef = ref(null);
		const categories = ref([]);
		const selectedEvent = ref({ title: "", date: "", type: "", location: "" });

		const calendarOptions = reactive({
			plugins: [dayGridPlugin],
			initialView: "dayGridMonth",
			initialDate: new Date(),
			contentHeight: 668,
			aspectRatio: 1.5,
			headerToolbar: {
				start: "prev",
				center: "title",
				end: "next"
			},
			events: [],
			eventClick(info) {
				selectedEvent.value = {
					title: info.event.title,
					date: `${info.event.startStr} }`,
					type: info.event.extendedProps.type,
					location: info.event.extendedProps.location
				};
			},
			dayCellDidMount(info) {
				const day = info.date.getDay();
				if (day === 0 || day === 6) {
					info.el.style.backgroundColor = "#f0f0f0";
				}
			}
		});

		const fetchEventList = async () => {
			try {
				const response = await getEventList();
				var data = response.res;
				const mappedData = data.map((item) => ({
					title: item.title,
					start: item.start,
					end: item.end,
					type: item.type,
					location: item.location
				}));
				calendarOptions.events = mappedData;

				if (calendarRef.value?.getApi) {
					calendarRef.value.getApi().refetchEvents();
				}
			} catch (e) {
				console.error("Failed to fetch events:", e);
			}
		};

		const getCategoryCount = async () => {
			try {
				const response = await getCategoryCountEvent();
				categories.value = response.res;
			} catch (e) {
				console.error("Failed to fetch group event:", e);
			}
		};

		onMounted(() => {
			const modal = document.getElementById("calendarEventModal");
			if (modal) {
				modal.addEventListener("shown.bs.modal", () => {
					fetchEventList();
					getCategoryCount();

					if (calendarRef.value?.getApi) {
						calendarRef.value.getApi().render();
					}
				});
			}
		});

		return {
			store,
			calendarOptions,
			selectedEvent,
			calendarRef,
			categories
		};
	}
};
</script>

<style scoped>
.event-details {
	margin-top: 20px;
	border-top: 1px solid #eee;
	padding-top: 10px;
}

.fc {
	background-color: #ffffff;
	color: black;
}

.fc-daygrid-day-frame {
	background-color: transparent !important;
}

.fc .fc-col-header-cell-cushion {
	color: black !important;
	font-weight: bold;
}

/* Tanggal (angka 1–31) */
.fc .fc-daygrid-day-number {
	color: black !important;
	font-weight: bold;
}

.collapse-style {
	border-left: 6px solid #ee690a;
	color: #ee690a !important;
	border-radius: 4px;
	background-color: #fee3c8;
}
</style>
