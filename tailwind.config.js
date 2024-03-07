/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		container: {
			center: true,
			padding: '16px'
		},
		screens: {
			sm: '640px',
			md: '768px',
			lg: '900px'
		},
		extend: {
			fontFamily: {
				sans: ['Fira Code', 'sans-serif']
			}
		}
	},
	plugins: []
};
