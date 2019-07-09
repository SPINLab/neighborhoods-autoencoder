import {initMap, drawReconstruction, animateEllipses} from './polygonMap';
import JogDial from './jogDial';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import L from "leaflet";
import {efd, efdOffsets, reconstructPolygon, reconstructEllipses} from "./efdCoefficients";
import updateRows from "./tableRowsFromCoefficients";

const {map, drawnItems, reconstructionItems, animationItems} = initMap();
const numEllipsesInput = document.getElementById('num_ellipses');
const tableBody = document.getElementById('coefficients_table_body');
const locusBox = document.getElementById('locus');

let didUserChangeEllipsesInputManually = false;

function extractPolygon(coords, numberOfEllipses) {
  let offsets, coefficients;
  const numberOfPoints = 200;

  return Promise.all([
    efdOffsets(coords),
    efd(coords, numberOfEllipses)
  ]).then((resultsArray) => {
    [offsets, coefficients] = resultsArray;
    locusBox.value = offsets.map(offset => offset.toPrecision(6));
    updateRows(tableBody, coefficients);
    // const numberOfPoints = coords.length;
    return reconstructPolygon(coefficients, offsets, numberOfPoints);
  })
    .then((reconstruction) => drawReconstruction(reconstructionItems, reconstruction))
    // Get the individual ellipses
    .then(() => reconstructEllipses(coefficients, numberOfPoints))
    .then((ellipses) => ellipses.array())
    .then((ellipses) => {
      console.log(ellipses);
      animateEllipses(animationItems, ellipses, offsets)
    })
  // ;
}

map.on(L.Draw.Event.CREATED, (event) => {
  drawnItems.eachLayer((layer) => drawnItems.removeLayer(layer));
  const layer = event.layer;
  drawnItems.addLayer(layer);

  const drawnPoints = event.layer.editing.latlngs[0][0]
    .map(latLng => [latLng.lat, latLng.lng]);

  const numberOfEllipses = Number(numEllipsesInput.value);

  return extractPolygon(drawnPoints, numberOfEllipses, drawnPoints)
    .then(() => console.log('Done'))
    .catch(console.error)
});

// Construct and register ellipses jog dial
const options = {
  debug: false,
  wheelSize: "80%",
  minDegree: 1,
  maxDegree: 99999
};

const ellipsesJogDialElement = document.getElementById('ellipses_jog_dial');
// const coefficientHeadingElement = document.getElementById('coefficient_heading');

function updateEllipses(numberOfEllipses) {
  // coefficientHeadingElement.innerText = 'Ellipsis coefficients (working)';
  numEllipsesInput.value = numberOfEllipses;

  let layers = [];
  drawnItems.eachLayer((layer) => layers.push(layer));
  const drawnPoints = layers[0].editing.latlngs[0][0]
    .map(latLng => [latLng.lat, latLng.lng]);

  drawnPoints.push(drawnPoints[0]); // Append start->closing point to create fully closed polygon contour

  return extractPolygon(drawnPoints, numberOfEllipses)
}

const ellipsesJogDial = JogDial(ellipsesJogDialElement, options)
  .on("mouseup", (event) => {
    const numberOfEllipses = Math.round(event.target.rotation * 0.25);

    return updateEllipses(numberOfEllipses)
      .then(() => console.log('Done'))
      .catch(console.error);
  })
  .on( "mousemove", (event) => {
    if (!didUserChangeEllipsesInputManually) {
      numEllipsesInput.value = Math.round(event.target.rotation * 0.25);
    }
    didUserChangeEllipsesInputManually = false;
  });

numEllipsesInput.oninput = () => {
  didUserChangeEllipsesInputManually = true;
  const numberOfEllipses = Number(numEllipsesInput.value);
  ellipsesJogDial.angle(numberOfEllipses * 4);

  return updateEllipses(numberOfEllipses)
    .catch(console.error);
};
