<template>
	<div class="card fit-content d-flex flex-row align-items-center px-3">
		<p class="font-14 font-500 fit-content">TT Number : &nbsp;</p>
		<p class="btn-link-click" @click="linkToDetail(ttId)">
			{{ ttId }}
		</p>
	</div>
</template>

<script>
export default {
	name: "TtCorrelationBadge",
	props: {
		ttId: String
	},
	methods: {
		async linkToDetail(ttId) {
			window.open(
				"https://1057-sg.teleows.com/adc-ui/spl/TroubleTicket/ID_208_1502274240291_basicinfoPage.spl?processstatus=Completed&ttId=" +
					ttId +
					"&currentphase=&task_id=&ticketid=" +
					ttId +
					"&taskid=&processdefkey=ID_208_1502274240291&faultno=&current_user=&process_key=ID_208_1502274240291&order_id=" +
					ttId +
					"&uid=1717353178986",
				"_blank"
			);
		}
	}
};
</script>
