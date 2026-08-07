<template>
	<Navbar>
		<button class="btn open-btn" @click="openModal">Open Calendar</button>

		<div v-if="showModal" class="modal-backdrop">
			<div class="modal-content">
				<FullCalendar :options="calendarOptions" />
				<div v-if="selectedEvent.title" class="event-details">
					<h2>{{ selectedEvent.title }}</h2>
					<p>Date: {{ selectedEvent.date }}</p>
				</div>
				<button class="btn close-btn" @click="closeModal">Close</button>
			</div>
		</div>
	</Navbar>
</template>

<script setup>
import { ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import Navbar from "../../components/Layouts/Navbar.vue";

const showModal = ref(false);
const selectedEvent = ref({ title: "", date: "" });

function openModal() {
	showModal.value = true;
}

function closeModal() {
	showModal.value = false;
	selectedEvent.value = { title: "", date: "" };
}

const calendarOptions = {
	plugins: [dayGridPlugin],
	initialView: "dayGridMonth",
	initialDate: "2025-05-01", //get today date
	events: [
		{
			title: "May Day Celebration",
			start: "2025-05-01",
			end: "2025-05-03"
		},
		{
			title: "Product Review",
			start: "2025-05-10",
			end: "2025-05-12"
		},
		{
			title: "Marketing Launch",
			start: "2025-05-21",
			end: "2025-05-24"
		}
	],
	eventClick(info) {
		selectedEvent.value = {
			title: info.event.title,
			date: `${info.event.startStr} to ${info.event.endStr || info.event.startStr}`
		};
	}
};
</script>
