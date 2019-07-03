import {initMap, drawReconstruction} from './polygonMap';
import JogDial from './jogDial';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import L from "leaflet";
import {efd, efdOffsets, reconstructPolygon} from "./efdCoefficients";
import updateRows from "./tableRowsFromCoefficients";

const {map, drawnItems, reconstructionItems} = initMap();
const numEllipsesInput = document.getElementById('num_ellipses');
const tableBody = document.getElementById('coefficients_table_body');
const locusBox = document.getElementById('locus');

let didUserChangeEllipsesInputManually = false;

function extractPolygon(coords, numberOfEllipses) {
  return Promise.all([
    efdOffsets(coords),
    efd(coords, numberOfEllipses)
  ]).then((resultsArray) => {
    const [offsets, coefficients] = resultsArray;
    locusBox.value = offsets.map(offset => offset.toPrecision(6));
    updateRows(tableBody, coefficients);
    const numberOfPoints = coords.length;
    return reconstructPolygon(coefficients, offsets, numberOfPoints);
  })
    // Switch x/y for lat/lon
    .then((reconstruction) => reconstruction.map(point => [point[1], point[0]]))
    .then((reconstruction) => drawReconstruction(reconstructionItems, reconstruction));
}

map.on(L.Draw.Event.CREATED, (event) => {
  drawnItems.eachLayer((layer) => drawnItems.removeLayer(layer));
  const layer = event.layer;
  drawnItems.addLayer(layer);
  const drawnPoints = event.layer.editing.latlngs[0][0];
  console.log(drawnPoints);

  // Reverse axis order to match x-longitude/y-latitude!
  const coords = drawnPoints.map(latLng => [latLng.lng, latLng.lat]);
  const numberOfEllipses = Number(numEllipsesInput.value);

  return extractPolygon(coords, numberOfEllipses, drawnPoints)
    .then(() => console.log('Done'))
    .catch(console.error)
});

// Construct and register ellises jog dial
const options = {
  debug: false,
  wheelSize: "80%",
  minDegree: 1,
  maxDegree: 99999
};

const ellipsesJogDialElement = document.getElementById('ellipses_jog_dial');
const coefficientHeadingElement = document.getElementById('coefficient_heading');

function updateEllipses(numberOfEllipses) {
  // coefficientHeadingElement.innerText = 'Ellipsis coefficients (working)';
  numEllipsesInput.value = numberOfEllipses;

  let layers = [];
  drawnItems.eachLayer((layer) => layers.push(layer));
  const drawnPoints = layers[0].editing.latlngs[0][0];
  const coords = drawnPoints.map(latLng => [latLng.lng, latLng.lat]);
  coords.push(coords[0]); // Append closing point

  return extractPolygon(coords, numberOfEllipses)
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
    .then(() => console.log('Done'))
    .catch(console.error);
};
