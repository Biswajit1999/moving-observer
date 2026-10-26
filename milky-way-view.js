import * as THREE from 'three';
import Model from './milky-way-model.cjs';
import W from './warp.cjs';
import catalogue from './data/milky-way/masers.json';

export function createMilkyWay(scene){
 // A high-detail reconstruction is bent geometrically; a shallow emissive
 // volume supplies depth at grazing angles. Neither is a fitted star catalogue.
 const texture=new THREE.DataTexture(new Uint8Array([0,0,0,255]),1,1,THREE.RGBAFormat);texture.needsUpdate=true;
 const uniforms={lightMap:{value:texture},cameraLocal:{value:new THREE.Vector3()},opacity:{value:1},pixelScale:{value:800},edgeWeight:{value:0},warpTime:{value:0},warpEnabled:{value:1},patternAngle:{value:0},structure:{value:0}};
 const points=new THREE.Mesh(new THREE.PlaneGeometry(40,40,256,256),new THREE.ShaderMaterial({
  uniforms,transparent:true,depthWrite:false,side:THREE.DoubleSide,
  vertexShader:W.shader+`varying vec2 texCoord;varying float height;void main(){vec3 p=position;height=warpHeight(p.xy);p.z+=height;texCoord=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
  fragmentShader:`uniform sampler2D lightMap;uniform float opacity;uniform float edgeWeight;uniform float structure;varying vec2 texCoord;varying float height;
   void main(){vec3 c=texture2D(lightMap,texCoord).rgb;float brightness=max(max(c.r,c.g),c.b);
    float rim=1.-smoothstep(17.,19.8,length((texCoord-.5)*40.));
    float alpha=smoothstep(.001,.025,brightness)*rim*(1.-edgeWeight*.85);
    vec3 diagnostic=mix(vec3(.08,.32,.7),vec3(.8,.4,.1),smoothstep(-.5,.5,height));
    c=mix(c,diagnostic*brightness,structure*.65);gl_FragColor=vec4(c*opacity,alpha);
    #include <colorspace_fragment>
   }`
 }));
 points.name='ESA Gaia reconstruction on a warped three-dimensional disk';scene.add(points);
 const cameraPosition=new THREE.Vector3();points.onBeforeRender=(_renderer,_scene,camera)=>{camera.getWorldPosition(cameraPosition);uniforms.cameraLocal.value.copy(points.worldToLocal(cameraPosition));};
 const volume=new THREE.Mesh(new THREE.BoxGeometry(40,40,10),new THREE.ShaderMaterial({uniforms,transparent:true,depthWrite:false,side:THREE.BackSide,blending:THREE.AdditiveBlending,
  vertexShader:'varying vec3 rayEnd;void main(){rayEnd=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:W.shader+`uniform sampler2D lightMap;uniform vec3 cameraLocal;uniform float edgeWeight;uniform float opacity;varying vec3 rayEnd;
   void main(){if(edgeWeight<.001)discard;vec3 direction=normalize(rayEnd-cameraLocal);vec3 safeDirection=sign(direction+vec3(1.e-9))*max(abs(direction),vec3(1.e-6));
    vec3 a=(-vec3(20.,20.,5.)-cameraLocal)/safeDirection,b=(vec3(20.,20.,5.)-cameraLocal)/safeDirection;
    vec3 nearBox=min(a,b),farBox=max(a,b);float start=max(0.,max(max(nearBox.x,nearBox.y),nearBox.z)),end=min(min(farBox.x,farBox.y),farBox.z);if(end<=start)discard;
    float stepLength=(end-start)/144.;vec3 radiance=vec3(0.);float transmission=1.;
    for(int i=0;i<144;i++){vec3 p=cameraLocal+direction*(start+(float(i)+.5)*stepLength);float r=length(p.xy),z=p.z-warpHeight(p.xy);vec3 c=texture2D(lightMap,p.xy/40.+.5).rgb;
     float h=.14+.40*exp(-r*r/12.);float profile=exp(-abs(z)/h)/(2.*h);float luminosity=dot(c,vec3(.2126,.7152,.0722));
     radiance+=transmission*c*profile*stepLength*.52;transmission*=exp(-luminosity*profile*stepLength*.60);
    }
    gl_FragColor=vec4(1.-exp(-radiance*opacity),edgeWeight);
    #include <colorspace_fragment>
   }`
 }));volume.name='Illustrative vertical light profile';volume.onBeforeRender=points.onBeforeRender;points.add(volume);
 const measuredGeometry=new THREE.BufferGeometry().setFromPoints(catalogue.rows.map(r=>new THREE.Vector3(...r.position)));
 const measured=new THREE.Points(measuredGeometry,new THREE.PointsMaterial({color:0x6fffe8,size:4,sizeAttenuation:false,transparent:true,opacity:.85,depthTest:false}));measured.renderOrder=4;scene.add(measured);
 const errors=[];for(const r of catalogue.rows)if(r.positionFar&&r.parallaxMas/r.sigmaMas>=5)errors.push(new THREE.Vector3(...r.positionNear),new THREE.Vector3(...r.positionFar));
 const uncertainty=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(errors),new THREE.LineBasicMaterial({color:0x6fffe8,transparent:true,opacity:.35,depthTest:false}));scene.add(uncertainty);
 const fits=new THREE.Group();scene.add(fits);
 for(const arm of Model.arms){const pts=Array.from({length:161},(_,i)=>new THREE.Vector3(...Model.armPoint(arm,arm.range[0]+i/160*(arm.range[1]-arm.range[0]))));fits.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xf5d9a6,transparent:true,opacity:.6,depthTest:false})));}
 return {points,sampleCount:0,setTexture(texture){texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;uniforms.lightMap.value=texture;},update(time,{mode,observations,errors:showErrors,arms}){const epoch=Math.abs(time)<1e-12;points.visible=mode!=='evidence';measured.visible=observations&&epoch;uncertainty.visible=showErrors&&measured.visible;fits.visible=arms&&epoch;return epoch?(observations?'Cyan = measured VLBI positions at catalogue epochs, not propagated to 2026.':'ESA/Gaia artist’s reconstruction, mapped onto an illustrative 3D warp. Use “Inspect the measured evidence” for catalogue points and published arm segments.'):'ESA/Gaia reconstruction; pattern rotation and warp are illustrative, not a forecast of the future Galaxy.';}};
}
