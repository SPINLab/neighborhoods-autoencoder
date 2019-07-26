import {reconstructEllipses, reconstructPolygon} from "./efdCoefficients";
import {animateEllipses, drawReconstruction} from "./polygonMap";

export default function updateRows(tableBody, coefficients) {
  tableBody.innerHTML = '';

  return coefficients.forEach((ellipse) => {
    const tableRow = tableBody.insertRow();

    return ellipse.forEach((coefficient) => {
      const newCell = tableRow.insertCell(-1);
      newCell.innerHTML =
        `<input  type="text" 
        value="${coefficient.toPrecision(7)}" 
        oninput="updateTableEvent();"
        style="width: 108px"/>`;
    });
  });
}

window.updateTableEvent = function () {
  const tableRows = document.querySelectorAll('#coefficients_table_body tr');
  const locusBox = document.getElementById('locus');

  const offsets = locusBox.value
    .split(',')
    .map(Number);
  let coefficients = [];

  tableRows.forEach(row => {
    const rowInputs = row.querySelectorAll('input');
    const ellipseCoeffs = Array.from(rowInputs).map(input => Number(input.value));
    coefficients.push(ellipseCoeffs);
  });

  return reconstructPolygon(coefficients, offsets)
    .then((reconstruction) => {
      drawReconstruction(reconstruction);
      // Get the individual ellipses

      const ellipses = reconstructEllipses(coefficients);
      return ellipses.array()
    })
  .then((ellipses) => {
    return animateEllipses(window.animationItems, ellipses, offsets)
  }).catch(console.error);
};
