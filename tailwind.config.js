import { defineConfig } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

export default defineConfig({
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.scrollbar-none': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    })
  ]
})
