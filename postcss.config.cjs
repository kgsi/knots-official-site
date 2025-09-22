module.exports = {
  plugins: [
    require('postcss-preset-env'),
    require('autoprefixer'),
    require('postcss-functions')({
      functions: {
        rem(num) {
          return `${Math.round(10 * num / 16) / 10}rem`;
        }
      },
    }),
  ],
};