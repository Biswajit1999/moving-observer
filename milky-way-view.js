import * as THREE from 'three';
import Model from './milky-way-model.cjs';
import W from './warp.cjs';
import catalogue from './data/milky-way/masers.json';
export function createMilkyWay(scene){
 const sample=Model.sample(),geometry=new THREE.BufferGeometry();
 geometry.setAttribute('position',new THREE.Float32BufferAttribute(sample.positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(sample.colors,3));geometry.computeBoundingSphere();
 const points=new THREE.Points(geometry,new THREE.ShaderMaterial({uniforms:{opacity:{value:.45},pixelScale:{value:800},edgeWeight:{value:0},warpTime:{value:0},warpEnabled:{value:1},patternAngle:{value:0},structure:{value:0}},vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
 vertexShader:W.shader+`uniform float pixelScale;uniform float structure;varying vec3 tint;varying float height;
 void main(){vec3 p=position;float bend=warpHeight(p.xy);p.z+=bend;height=position.z;vec3 diagnostic=mix(vec3(.25,.65,1.),vec3(1.,.64,.3),smoothstep(-.3,.3,bend));tint=mix(color,diagnostic,structure*smoothstep(8.4,12.,length(p.xy))*.6);vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=clamp(.075*pixelScale/max(1.,-mv.z),.8,9.);gl_Position=projectionMatrix*mv;}`,
 fragmentShader:`uniform float opacity;uniform float edgeWeight;varying vec3 tint;varying float height;void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;float a=exp(-4.*r*r)*(1.-smoothstep(.65,1.,r));float dust=1.-.48*edgeWeight*exp(-abs(height)/.06);gl_FragColor=vec4(tint,a*opacity*dust);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`}));points.name='Synthetic light: published geometry, illustrative populations';scene.add(points);
 const measuredGeometry=new THREE.BufferGeometry().setFromPoints(catalogue.rows.map(r=>new THREE.Vector3(...r.position)));
 const measured=new THREE.Points(measuredGeometry,new THREE.PointsMaterial({color:0x6fffe8,size:4,sizeAttenuation:false,transparent:true,opacity:.85,depthTest:false}));measured.renderOrder=4;scene.add(measured);
 const errors=[];for(const r of catalogue.rows)if(r.positionFar&&r.parallaxMas/r.sigmaMas>=5)errors.push(new THREE.Vector3(...r.positionNear),new THREE.Vector3(...r.positionFar));
 const uncertainty=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(errors),new THREE.LineBasicMaterial({color:0x6fffe8,transparent:true,opacity:.35,depthTest:false}));scene.add(uncertainty);
 const fits=new THREE.Group();scene.add(fits);
 for(const arm of Model.arms){const pts=Array.from({length:161},(_,i)=>new THREE.Vector3(...Model.armPoint(arm,arm.range[0]+i/160*(arm.range[1]-arm.range[0]))));fits.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xf5d9a6,transparent:true,opacity:.6,depthTest:false})));}
 return {points,update(time,{mode,observations,errors:showErrors,arms}){const epoch=Math.abs(time)<1e-12;points.visible=mode!=='evidence';measured.visible=observations&&epoch;uncertainty.visible=showErrors&&measured.visible;fits.visible=arms&&epoch;return epoch?'199 VLBI entries (198 names), catalogue epochs; not propagated to 2026. Cyan = measured positions; gold = published arm-fit segments.':'Observed-source overlay hidden during future playback. Stellar light and warp are model illustrations, not a predicted catalogue.';}};
}
