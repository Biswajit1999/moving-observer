import * as THREE from 'three';

// Appearance only. Orbital states, radii readouts and clock calculations never
// consume these materials. The mapped surfaces are illustrative, not ephemerides.
const textures=new Map(), bodies=new Map();
export function setPlanetTexture(name,texture){
 texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;
 textures.set(name,texture);
 for(const mesh of bodies.get(name)||[]){mesh.material.map=texture;mesh.material.color.set(0xffffff);mesh.material.needsUpdate=true;}
}
export function decoratePlanet(mesh,name){
 const colour=mesh.material.color.clone();mesh.material.dispose();
 mesh.material=name==='Sun'?new THREE.MeshBasicMaterial({color:colour}):new THREE.MeshStandardMaterial({color:colour,roughness:1,metalness:0});
 mesh.name='Body: '+name;
 if(!bodies.has(name))bodies.set(name,[]);bodies.get(name).push(mesh);
 if(textures.has(name)){mesh.material.map=textures.get(name);mesh.material.color.set(0xffffff);}
 const radius=mesh.geometry.parameters.radius;
 if(name==='Saturn'){
  // Ring radii in units of the globe's equatorial radius; illustrative optical
  // bands, including the Cassini division. No inference of dust dynamics.
  const bands=[[1.24,1.52,.22],[1.52,1.72,.64],[1.72,1.87,.82],[1.87,1.95,.68],[2.02,2.12,.53],[2.12,2.25,.45],[2.25,2.27,.60]];
  for(const [inner,outer,alpha] of bands){const ring=new THREE.Mesh(new THREE.RingGeometry(inner*radius,outer*radius,192),new THREE.MeshStandardMaterial({color:0xc8b79b,roughness:1,side:THREE.DoubleSide,transparent:true,opacity:alpha,depthWrite:false}));ring.rotation.x=Math.PI/2;ring.name='Illustrative Saturn ring band';mesh.add(ring);}
 }
 if(name==='Earth'||name==='Sun'){
  const shell=new THREE.Mesh(new THREE.SphereGeometry(radius*(name==='Earth'?1.025:1.22),48,32),new THREE.ShaderMaterial({
   transparent:true,depthWrite:false,side:THREE.BackSide,blending:THREE.AdditiveBlending,
   uniforms:{tint:{value:new THREE.Color(name==='Earth'?0x4586c0:0xffb947)},strength:{value:name==='Earth'?.25:.12}},
   vertexShader:'varying vec3 n;varying vec3 v;void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',
   fragmentShader:'uniform vec3 tint;uniform float strength;varying vec3 n;varying vec3 v;void main(){float rim=pow(1.-abs(dot(normalize(n),normalize(v))),2.);gl_FragColor=vec4(tint,strength*rim);}'
  }));shell.name=name==='Earth'?'Atmospheric limb illustration':'Solar glow illustration';mesh.add(shell);
 }
 return mesh;
}
