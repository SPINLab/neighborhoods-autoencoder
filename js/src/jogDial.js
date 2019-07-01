import $ from 'jquery';
import 'jquery-knob';

export function initDial() {
  $(".dial").knob({
    'min': 1,
    'max': 50,
    'release' : (v) => console.log(v)
  });
}

export default initDial;
