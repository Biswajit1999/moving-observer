import * as THREE from 'three';
import Model from './milky-way-model.cjs';
import Light from './galaxy-light.cjs';
import W from './warp.cjs';
import catalogue from './data/milky-way/masers.json';

export function createMilkyWay(scene){
 const light=Light.makeLightMap(),texture=new THREE.DataTexture(light.data,light.n,light.n,THREE.RGBAFormat);
 texture.minFilter=texture.magFilter=THREE.LinearFilter;texture.generateMipmaps=false;texture.needsUpdate=true;
 const uniforms={lightMap:{value:texture},cameraLocal:{value:new THREE.Vector3()},opacity:{value:1},pixelScale:{value:800},edgeWeight:{value:0},warpTime:{value:0},warpEnabled:{value:1},patternAngle:{value:0},structure:{value:0}};
 const points=new THREE.Mesh(new THREE.BoxGeometry(34,34,10),new THREE.ShaderMaterial({
  uniforms,transparent:true,depthWrite:false,side:THREE.BackSide,blending:THREE.CustomBlending,blendSrc:THREE.OneFactor,blendDst:THREE.OneMinusSrcAlphaFactor,blendEquation:THREE.AddEquation,
  vertexShader:'varying vec3 rayEnd;void main(){rayEnd=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:W.shader+`
   uniform sampler2D lightMap;uniform vec3 cameraLocal;uniform float opacity;uniform float structure;varying vec3 rayEnd;
   void main(){
    vec3 direction=normalize(rayEnd-cameraLocal);
    vec3 safeDirection=sign(direction+vec3(1.e-9))*max(abs(direction),vec3(1.e-6));
    vec3 a=(-vec3(17.,17.,5.)-cameraLocal)/safeDirection,b=(vec3(17.,17.,5.)-cameraLocal)/safeDirection;
    vec3 nearBox=min(a,b),farBox=max(a,b);
    float start=max(0.,max(max(nearBox.x,nearBox.y),nearBox.z)),end=min(min(farBox.x,farBox.y),farBox.z);
    if(end<=start)discard;
    float stepLength=(end-start)/112.;vec3 radiance=vec3(0.);float transmission=1.;
    for(int i=0;i<112;i++){
     vec3 p=cameraLocal+direction*(start+(float(i)+.5)*stepLength);
     float r=length(p.xy),z=p.z-warpHeight(p.xy);vec2 uv=p.xy/34.+.5;
     vec4 tex=texture2D(lightMap,uv);vec3 density=4.*tex.rgb*tex.rgb;
     float disk=density.r*(exp(-abs(z)/.30)+.10*exp(-abs(z)/.90));
     float bar=density.g*exp(-.5*pow(z/(.22+.34*exp(-r*r/9.)),2.));
     float arm=density.b*exp(-abs(z)/.12);
     float textureWeight=.12+2.8*tex.a*tex.a;
     vec2 offset=normalize(p.xy+vec2(.001))*.20/34.;vec4 lane=texture2D(lightMap,uv+offset);
     float dust=4.*lane.b*lane.b*exp(-abs(z)/.065)*(.25+1.7*pow(lane.a,2.));
     vec3 emission=.36*disk*vec3(.64,.60,.53)+.48*bar*vec3(1.,.72,.39)+.65*arm*textureWeight*vec3(.43,.62,.94);
     emission+=.18*arm*pow(max(0.,(tex.a-.65)/.35),2.)*vec3(1.,.23,.36);
     vec3 diagnostic=mix(vec3(.20,.52,1.),vec3(1.,.57,.21),smoothstep(-.3,.3,warpHeight(p.xy)));
     emission=mix(emission,diagnostic*dot(emission,vec3(.3333)),structure*smoothstep(8.4,12.,r)*.6);
     float extinction=.20*disk+.40*bar+.24*arm+.85*dust;
     float absorbed=1.-exp(-extinction*stepLength);
     radiance+=transmission*emission*(absorbed/max(extinction,.00001));transmission*=1.-absorbed;
     if(transmission<.004)break;
    }
    float alpha=1.-transmission;if(alpha<.001)discard;
    vec3 colour=1.-exp(-radiance*3.2*opacity);
    gl_FragColor=vec4(colour,alpha);
    #include <colorspace_fragment>
   }`
 }));
 points.name='Continuous synthetic stellar light and illustrative dust';
 const cameraPosition=new THREE.Vector3();points.onBeforeRender=(_renderer,_scene,camera)=>{camera.getWorldPosition(cameraPosition);uniforms.cameraLocal.value.copy(points.worldToLocal(cameraPosition));};scene.add(points);
 const pos=[],col=[];for(let i=0;i<light.sample.kinds.length;i+=31){pos.push(...light.sample.positions.slice(i*3,i*3+3));col.push(...light.sample.colors.slice(i*3,i*3+3));}
 const starGeometry=new THREE.BufferGeometry();starGeometry.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));starGeometry.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
 const stars=new THREE.Points(starGeometry,new THREE.ShaderMaterial({uniforms,vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
  vertexShader:W.shader+`uniform float pixelScale;varying vec3 tint;void main(){vec3 p=position;p.z+=warpHeight(p.xy);tint=color;vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=clamp(.032*pixelScale/max(1.,-mv.z),.65,2.2);gl_Position=projectionMatrix*mv;}`,
  fragmentShader:'varying vec3 tint;void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;gl_FragColor=vec4(tint,.13*exp(-5.*r*r));}'
 }));points.add(stars);
 const measuredGeometry=new THREE.BufferGeometry().setFromPoints(catalogue.rows.map(r=>new THREE.Vector3(...r.position)));
 const measured=new THREE.Points(measuredGeometry,new THREE.PointsMaterial({color:0x6fffe8,size:4,sizeAttenuation:false,transparent:true,opacity:.85,depthTest:false}));measured.renderOrder=4;scene.add(measured);
 const errors=[];for(const r of catalogue.rows)if(r.positionFar&&r.parallaxMas/r.sigmaMas>=5)errors.push(new THREE.Vector3(...r.positionNear),new THREE.Vector3(...r.positionFar));
 const uncertainty=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(errors),new THREE.LineBasicMaterial({color:0x6fffe8,transparent:true,opacity:.35,depthTest:false}));scene.add(uncertainty);
 const fits=new THREE.Group();scene.add(fits);
 for(const arm of Model.arms){const pts=Array.from({length:161},(_,i)=>new THREE.Vector3(...Model.armPoint(arm,arm.range[0]+i/160*(arm.range[1]-arm.range[0]))));fits.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xf5d9a6,transparent:true,opacity:.6,depthTest:false})));}
 return {points,sampleCount:light.sample.kinds.length,update(time,{mode,observations,errors:showErrors,arms}){const epoch=Math.abs(time)<1e-12;points.visible=mode!=='evidence';measured.visible=observations&&epoch;uncertainty.visible=showErrors&&measured.visible;fits.visible=arms&&epoch;return epoch?(observations?'Cyan = measured VLBI positions at catalogue epochs, not propagated to 2026.':'Natural-light view. Use “Inspect the measured evidence” for catalogue points and published arm segments.'):'Synthetic stellar light and illustrative dust; the rotating pattern and warp are not a predicted future catalogue.';}};
}
