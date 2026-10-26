// Smooth synthetic-population density channels, not measured luminosity or a photo.
const Model=require('./milky-way-model.cjs');
function blur(input,n){
 const weights=[1,4,6,4,1],tmp=new Float32Array(input.length),out=new Float32Array(input.length);
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){let a=0;for(let k=-2;k<=2;k++)a+=weights[k+2]*input[y*n+Math.max(0,Math.min(n-1,x+k))];tmp[y*n+x]=a/16;}
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){let a=0;for(let k=-2;k<=2;k++)a+=weights[k+2]*tmp[Math.max(0,Math.min(n-1,y+k))*n+x];out[y*n+x]=a/16;}
 return out;
}
function makeLightMap(n=384){
 const sample=Model.sample(),channels=Array.from({length:3},()=>new Float32Array(n*n));
 for(let i=0;i<sample.kinds.length;i++){const x=Math.floor((sample.positions[i*3]/34+.5)*n),y=Math.floor((sample.positions[i*3+1]/34+.5)*n),kind=sample.kinds[i];if(x>=0&&x<n&&y>=0&&y<n)channels[Math.min(kind,2)][y*n+x]+=kind===3?.38:1;}
 const smooth=channels.map(a=>blur(blur(a,n),n));
 // A subdued two-fold continuation fills the unmeasured far side for the natural view.
 // This is a rendering assumption, never included in the measured arm-fit overlay.
 const arms=smooth[2].slice();for(let k=0;k<arms.length;k++)smooth[2][k]+=.65*arms[arms.length-1-k];
 const normalizers=smooth.map(a=>{const sorted=Array.from(a).filter(v=>v>.01).sort((a,b)=>a-b);return sorted[Math.floor(sorted.length*.98)]||1;});
 const data=new Uint8Array(n*n*4);
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
  const k=y*n+x,px=x/n*34-17,py=y/n*34-17;
  for(let c=0;c<3;c++)data[4*k+c]=Math.round(255*Math.sqrt(Math.min(4,smooth[c][k]/normalizers[c])/4));
  const noise=.5+.21*Math.sin(2.3*px+.9*Math.sin(1.7*py))*Math.cos(2.1*py-.6*Math.cos(px))+.13*Math.sin(7.9*px+3.2*py)*Math.cos(6.7*py-1.1*px)+.06*Math.sin(23.7*px-16.2*py);
  data[4*k+3]=Math.round(255*Math.max(0,Math.min(1,noise)));
 }
 return {n,data,sample,normalizers};
}
module.exports={makeLightMap};
