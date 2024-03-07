/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		container: {
			center: true,
			padding: '16px',
			screens: {
				lg: '900px',
				md: '100%'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Fira Code', 'sans-serif']
			}
		}
	},
	plugins: []
};
