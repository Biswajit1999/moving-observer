import * as THREE from 'three';
import {setPlanetTexture} from './planet-appearance.js';
import Mercury from './assets/planets/mercury.jpg';
import Venus from './assets/planets/venus.jpg';
import Earth from './earth.jpg';
import Mars from './assets/planets/mars.jpg';
import Jupiter from './assets/planets/jupiter.jpg';
import Saturn from './assets/planets/saturn.jpg';
import Uranus from './assets/planets/uranus.jpg';
import Neptune from './assets/planets/neptune.jpg';
import Sun from './assets/planets/sun.jpg';
import Moon from './assets/planets/moon.jpg';
export function loadPlanetTextures(){
 const loader=new THREE.TextureLoader();
 for(const [name,url] of Object.entries({Sun,Mercury,Venus,Earth,Mars,Jupiter,Saturn,Uranus,Neptune,Moon})){
  const texture=loader.load(url,()=>setPlanetTexture(name,texture));
  setPlanetTexture(name,texture);
 }
}
