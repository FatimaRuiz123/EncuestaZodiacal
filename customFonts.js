// customFonts.js
const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');

const customFonts = {
  pdfMake: {
    vfs: pdfFonts.pdfMake.vfs,
    fonts: {
      customFont: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf',
      }
    }
  }
};

module.exports = customFonts;
