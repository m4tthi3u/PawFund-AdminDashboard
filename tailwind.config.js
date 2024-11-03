module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,scss}"],
  theme: {
    extend: {
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      transitionProperty: {
        'width': 'width',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
}