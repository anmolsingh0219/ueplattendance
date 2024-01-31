/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'main-bg': '#f7f7f7', // Light grey background
        'header-bg': '#eff6ff', // Light blue header background
        'present-bg': '#c6f6d5', // Light green for Present
        'absent-bg': '#fed7d7', // Light red for Absent
        'leave-bg': '#feebc8', // Light yellow for Paid Leave
        // Define other colors you need here
      },},
  },
  plugins: [],
}

