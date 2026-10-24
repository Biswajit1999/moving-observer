import E from './environment.cjs';
const $=id=>document.getElementById(id),f=(n,d=2)=>n.toLocaleString('en-GB',{maximumFractionDigits:d,minimumFractionDigits:d});
export function updateEnvironment(time){
 const q=E.along(time),R=+$('compareRadius').value,z=+$('compareHeight').value,c=E.circular(R),d=E.density(R,z);
 $('localDensityRatio').textContent=f(q.ratio)+'× 2026';$('localStarEstimate').textContent='≈ '+f(q.expectedWithin10pc,0);
 $('localEnvironment').textContent='R = '+f(q.radiusKpc,3)+' kpc; z = '+f(q.heightPc,1)+' pc. Smooth disk: '+f(q.starsPerPc3,3)+' stars/pc³. Counts are a scenario, not a catalogue forecast.';
 $('compareRadiusValue').textContent=f(R,1)+' kpc';$('compareHeightValue').textContent=f(z*1000,0)+' pc';$('compareCircularSpeed').textContent=f(c.speedKmS,1)+' km/s';$('comparePeriod').textContent=f(c.periodMyr,0)+' Myr';$('compareDensity').textContent=f(d.ratio,3)+'× 2026';
 const canvas=$('densityHistory'),ctx=canvas.getContext('2d'),w=270,h=126;canvas.width=w*2;canvas.height=h*2;ctx.scale(2,2);
 ctx.fillStyle='#0c1420';ctx.fillRect(0,0,w,h);const lo=.7,hi=1.15,x=t=>34+t/250*220,y=n=>100-(n-lo)/(hi-lo)*80;
 ctx.font='10px system-ui';ctx.strokeStyle='#344452';ctx.fillStyle='#afbecd';
 for(const v of [.75,1,1.1]){ctx.beginPath();ctx.moveTo(34,y(v));ctx.lineTo(254,y(v));ctx.stroke();ctx.fillText(v+'×',1,y(v)+3);}
 ctx.fillText('0',34,120);ctx.fillText('125',135,120);ctx.fillText('250 Myr',212,120);ctx.strokeStyle='#8ce0a3';ctx.beginPath();
 E.history.forEach((p,i)=>i?ctx.lineTo(x(p.timeMyr),y(p.ratio)):ctx.moveTo(x(p.timeMyr),y(p.ratio)));ctx.stroke();ctx.fillStyle='#f2c786';ctx.beginPath();ctx.arc(x(time),y(q.ratio),3.5,0,Math.PI*2);ctx.fill();
}
