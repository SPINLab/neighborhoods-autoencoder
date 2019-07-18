import {initMap} from './polygonMap';
import JogDial from './jogDial';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import L from "leaflet";
import extractPolygon from "./extractPolygon";

const {map, drawnItems, reconstructionItems, animationItems} = initMap();
// expose to global window state
window.animationItems = animationItems;
window.reconstructionItems = reconstructionItems;
const numEllipsesInput = document.getElementById('num_ellipses');

let didUserChangeEllipsesInputManually = false;

map.on(L.Draw.Event.CREATED, (event) => {
  drawnItems.eachLayer((layer) => drawnItems.removeLayer(layer));
  const layer = event.layer;
  drawnItems.addLayer(layer);

  const drawnPoints = event.layer.editing.latlngs[0][0]
    .map(latLng => [latLng.lat, latLng.lng]);

  const numberOfEllipses = Number(numEllipsesInput.value);

  return extractPolygon(drawnPoints, numberOfEllipses, reconstructionItems, animationItems)
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
  return extractPolygon(drawnPoints, numberOfEllipses, reconstructionItems, animationItems)
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
