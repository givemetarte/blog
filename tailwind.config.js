module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        cherry: '#c06c84',
        cherrylight: '#cf90a2',
        lavenderblush: '#F9F0F3',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': {
            transform: 'rotate(-3deg)'
          },
          '50%': {
            transform: 'rotate(3deg)'
          },
        }
      },
      animation: {
        wiggle: 'wiggle 0.5s ease-in-out infinite'
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            h1: {
              color: '#374151',
            },
            h2: {
              color: '#374151',
            },
            h3: {
              color: '#374151',
            },
            h4: {
              color: '#374151',
            },
          }
        }
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
