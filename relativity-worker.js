import R from './relativity.cjs';
self.onmessage=event=>{
 try{
  const {years=5,h=.0625}=event.data;if(![1,5,10,20].includes(years)||![.0625,.03125].includes(h))throw Error('Unsupported integration settings');
  const days=years*365.25,n=R.names.length,rows=[],dt=2;
  let pn=new Float64Array(R.initial),newton=new Float64Array(R.initial),time=0,clock=new Float64Array(n),last=0;
  const save=()=>rows.push({day:time,pn:Array.from(pn),newton:Array.from(newton),clockSeconds:Array.from(clock)});save();
  for(let sample=dt;time<days-1e-9;sample+=dt){
   const target=Math.min(sample,days);
   while(time<target-1e-9){const step=Math.min(h,target-time),before=R.clockOffsets(pn);pn=R.step(pn,step,R.mu,true);newton=R.step(newton,step,R.mu,false);const after=R.clockOffsets(pn);for(let i=0;i<n;i++)clock[i]+=(before[i]+after[i])/2*step/1e6;time+=step;}
   save();if(time-last>100){last=time;self.postMessage({progress:time/days});}
  }
  self.postMessage({progress:1});self.postMessage({done:true,rows,years,h});
 }catch(e){self.postMessage({error:e.message});}
};
