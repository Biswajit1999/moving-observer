const W=require('./warp.cjs');
// The artwork is faint in the outer disk. A labelled structural overlay makes
// its warped geometry legible; its colours are heights, not stellar colours.
const vertexShader=W.shader+`varying vec2 uvOut;varying float warpZ;
void main(){uvOut=uv;vec3 p=position;warpZ=warpHeight(p.xy);p.z+=warpZ;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`;
const fragmentShader=`uniform sampler2D map;uniform float contrast;uniform float viewFade;uniform float structure;
varying vec2 uvOut;varying float warpZ;
void main(){
 vec4 c=texture2D(map,uvOut);float r=length((uvOut-.5)*40.);
 float rim=1.-smoothstep(15.8,16.5,r);float outer=smoothstep(7.8,10.5,r);
 vec3 tint=mix(vec3(.18,.54,.76),vec3(.93,.59,.25),smoothstep(-.5,.5,warpZ));
 float alpha=rim*max(smoothstep(.002,.06,max(max(c.r,c.g),c.b)),structure*outer*.6);
 vec3 rgb=mix(pow(c.rgb,vec3(contrast)),tint,structure*outer*.8);
 gl_FragColor=vec4(rgb,alpha*.9*viewFade);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
// Do not erase the warped surface when the UNWARPED plane is edge-on.
function visibility(face){const x=Math.max(0,Math.min(1,(face-.015)/.185));return .65+.35*x*x*(3-2*x);}
module.exports={vertexShader,fragmentShader,visibility};
