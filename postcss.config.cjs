const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = ({ env }) => ({
  plugins: [
    env === 'production' && purgecss({
      content: [
        './index.html',
        './src/**/*.{tsx,ts}',
      ],
      variables: true,
    })
  ]
})
