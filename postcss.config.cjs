const desktopBaseWidth = 1440; // for calculation with vw when tablet
const mobileBaseWidth = 375; // for vw calculation
const vwPassThroughRatio = 1; // for decimal point problems with small values.

const getRoundedVw = (num) => {
  return Number.parseFloat(num).toFixed(2);
};

module.exports = {
  plugins: [
    require('postcss-preset-env'),
    require('autoprefixer'),
    require('@csstools/postcss-global-data')({
      files: ['./src/styles/media.css'],
    }),
    require('postcss-custom-media'),
    require('postcss-functions')({
      functions: {
        pw(num) {
          if (Math.abs(num) <= vwPassThroughRatio) return `${num}px`;
          return `${getRoundedVw((num / desktopBaseWidth) * 100)}vw`;
        },
        rem(num) {
          return `${Math.round(10 * num / 16) / 10}rem`;
        },
        vw(num) {
          if (Math.abs(num) <= vwPassThroughRatio) return `${num}px`;
          return `${getRoundedVw((num / mobileBaseWidth) * 100)}vw`;
        },
      },
    }),
  ],
};