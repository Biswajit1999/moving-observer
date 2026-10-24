/* Screen-space label placement; hides labels when no nearby unobstructed slot exists. */
const intersects=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
function place(anchor,size,bounds,occupied=[],points=[]){
 const {x,y}=anchor,{w,h}=size;
 const candidates=[];
 for(const gap of [16,38,66,98])candidates.push({x:x-w/2,y:y-gap-h},{x:x+gap,y:y-h/2},{x:x-gap-w,y:y-h/2},{x:x-w/2,y:y+gap});
 return candidates.map(p=>({...p,w,h})).find(r=>r.x>=bounds.x&&r.y>=bounds.y&&r.x+r.w<=bounds.x+bounds.w&&r.y+r.h<=bounds.y+bounds.h&&!occupied.some(o=>intersects({...r,x:r.x-4,y:r.y-4,w:r.w+8,h:r.h+8},o))&&!points.some(p=>intersects(r,{x:p.x-9,y:p.y-9,w:18,h:18})))||null;
}
module.exports={place,intersects};
