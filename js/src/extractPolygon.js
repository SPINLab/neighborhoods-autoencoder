import {efd, efdOffsets, reconstructEllipses, reconstructPolygon} from "./efdCoefficients";
import updateRows from "./tableRowsFromCoefficients";
import {animateEllipses, drawReconstruction} from "./polygonMap";

export default function extractPolygon(coords, numberOfEllipses) {
  const locusBox = document.getElementById('locus');
  const tableBody = document.getElementById('coefficients_table_body');

  let offsets, coefficients;
  const numberOfPoints = 200;

  return Promise.all([
    efdOffsets(coords),
    efd(coords, numberOfEllipses)
  ]).then((resultsArray) => {
      [offsets, coefficients] = resultsArray;
      locusBox.value = offsets.map(offset => offset.toPrecision(6));
      updateRows(tableBody, coefficients);

      return reconstructPolygon(coefficients, offsets, numberOfPoints);
    }).then((reconstruction) => drawReconstruction(reconstruction))
      // Get the individual ellipses
      .then(() => reconstructEllipses(coefficients, numberOfPoints))
      .then((ellipses) => ellipses.array())
      .then((ellipses) => animateEllipses(window.animationItems, ellipses, offsets))
      .catch(console.error);
}
