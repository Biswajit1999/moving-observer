import * as THREE from 'three';
import H from './heliosphere.cjs';
export function createHeliosphere(scene,labels){
 const group=new THREE.Group();group.name='Heliosphere illustration';scene.add(group);
 const surface=new THREE.Mesh(new THREE.SphereGeometry(H.boundaryAU,64,32),new THREE.MeshBasicMaterial({color:0x518da5,transparent:true,opacity:.045,side:THREE.DoubleSide,depthWrite:false}));group.add(surface);
 const lines=new THREE.Group();group.add(lines);
 for(const radius of [H.terminationAU,H.boundaryAU])for(let plane=0;plane<3;plane++){
  const points=Array.from({length:257},(_,i)=>{const a=i*Math.PI/128,p=[radius*Math.cos(a),radius*Math.sin(a),0];return new THREE.Vector3(...(plane===0?p:plane===1?[p[0],0,p[1]]:[0,p[0],p[1]]));});
  lines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineDashedMaterial({color:radius===H.boundaryAU?0x75c9d1:0xcba36b,transparent:true,opacity:.55,dashSize:3,gapSize:2})));lines.children.at(-1).computeLineDistances();
 }
 const positions=new Float32Array(180*3),geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
 const wind=new THREE.Points(geometry,new THREE.PointsMaterial({color:0xf1c786,size:2,sizeAttenuation:false,transparent:true,opacity:.55,depthWrite:false}));group.add(wind);
 labels.push({text:'HELIOPAUSE · 120 AU SCHEMATIC',scene:'system',position:()=>group.position.clone().add(new THREE.Vector3(0,120,0)),visible:()=>group.visible});
 return {update(t,sun,visible){group.visible=visible;group.position.set(...sun);if(!visible)return;for(let i=0;i<180;i++){
  const z=1-2*(i+.5)/180,angle=i*Math.PI*(3-Math.sqrt(5)),radius=.5+((H.windDistanceAU(t)+i*H.terminationAU/180)%(H.terminationAU-.5));
  const p=H.spherePoint(radius,angle,Math.asin(z));positions.set(p,i*3);
 }geometry.attributes.position.needsUpdate=true;geometry.computeBoundingSphere();}};
}
