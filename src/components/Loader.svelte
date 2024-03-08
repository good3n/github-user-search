<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	data-tag-assistant-present=""
	class="w-12 absolute top-0 lg:top-1 left-0 right-0 fill-white mx-auto"
>
	<circle class="spinner-circle" cx="4" cy="12" r="1.5"></circle>
	<circle class="spinner-circle middle" cx="12" cy="12" r="3"> </circle>
	<circle class="spinner-circle" cx="20" cy="12" r="1.5"></circle>
</svg>

<style>
	.spinner-circle {
		animation: spinner_qhi1 0.75s linear infinite;
	}
	.middle {
		animation-delay: -0.375s;
	}

	@keyframes spinner_qhi1 {
		0%,
		100% {
			r: 1.5px;
		}
		50% {
			r: 3px;
		}
	}
</style>
