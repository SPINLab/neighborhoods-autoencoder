(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{"/Wy3":function(e,t,n){e.exports=n.p+"images/19ebf71bfa54623f9bce179b1397b1f4.png"},0:function(e,t){},1:function(e,t){},2:function(e,t){},3:function(e,t){},4:function(e,t){},5:function(e,t){},"5NL3":function(e,t,n){"use strict";n.r(t);var o=n("4R65"),i=n.n(o),r=(n("bMVF"),n("INa4"),n("X7/S"),n("ONFo"),n("C1Pg"));const s=i.a.polygon([[-4.042968750000001,2.1176816099851083],[-1.634765490889549,4.924589343401756],[2.513672411441803,5.204741041764144],[7.576171606779099,4.854532792931999],[7.576171606779099,3.258983314545306],[5.994140356779099,1.2391610649483282],[4.412109106779099,1.5203286348304514],[3.498047143220902,2.574327983494544],[1.792968884110451,3.048365584499324],[1.335937902331352,1.4324671960870323],[2.63671875,.21972602392080884],[4.886719286441804,-.008788928355074324],[6.591796875000001,-1.8014609294680355],[6.082030981779099,-3.188782496583868],[4.130859375000001,-4.749434858640033],[1.00195325911045,-3.9256363494468745],[-2.320312634110451,-3.5923720419631144],[-3.849609307944774,-1.5027572298285927]]);function a(e,t,n){e.clearLayers();const o=r.tensor(n),s=r.tensor([t[0]]).add(o),a=r.concat([s,r.tensor(t.slice([1],[t.length]))]);t=a.arraySync();const l=a.transpose([1,0,2]).arraySync(),c=100;!function t(n,o,s){return setTimeout(()=>{const a=r.tensor(n[o]);return s.forEach((t,n)=>{const s=r.tensor(t);let l,c=r.tensor([0,0]);l=n>0?(c=a.slice([0],[n]).sum(0)).arraySync():s.mean(0).arraySync(),t=s.add(c).arraySync(),function(e,t){const n=i.a.polygon(t,{color:"green"});e.addLayer(n)}(e,t),function(e,t,n){const o=i.a.polyline([t,n],{color:"yellow"});e.addLayer(o)}(e,l,t[o])}),o<n.length-1&&t(n,o+1,s),e.eachLayer(t=>{t.setStyle({opacity:t.options.opacity?.5*t.options.opacity:.5,fillOpacity:t.options.fillOpacity?.5*t.options.fillOpacity:.2}),t.options.opacity<.1&&e.removeLayer(t)})},c)}(l,0,t)}n("7wNy"),n("yJkd"),n("/Wy3");const l=function(e,t){return new l.Instance(e,t||{})};function c(e,t,n){t*=l.ToRad;const o=Math.cos(t)*e.radius+e.center.x,i=Math.sin(t)*e.radius+e.center.y,r=l.utils.getQuadrant(o,i);l.utils.convertUnitToClock(t);e.knob.style.left=o+"px",e.knob.style.top=i+"px",void 0===e.knob.rotation&&l.utils.extend(e.knob,{rotation:e.opt.degreeStartAt,degree:l.utils.convertUnitToClock(t)}),n&&(e.info.now=l.utils.extend({},{rotation:n,quadrant:r}),e.info.old=l.utils.extend({},{rotation:n%360,quadrant:r}),l.utils.extend(e.knob,{rotation:n,degree:n%360})),l.utils.triggerEvent(e.knob,l.CustomEvent.MOUSE_MOVE)}l.Instance=function(e,t){return e.getAttribute("_jogDial_")?(window.alert("Please Check your code:\njogDial can not be initialized twice in a same element."),!1):(l.Ready||(l.Doc=window.document,l.ToRad=Math.PI/180,l.ToDeg=180/Math.PI,l.ModernEvent=!!l.Doc.addEventListener,l.MobileRegEx="/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/",l.MobileEvent="ontouchstart"in window&&window.navigator.userAgent.match(l.MobileRegEx),l.PointerEvent=window.navigator.pointerEnabled||window.navigator.msPointerEnabled,l.Defaults={debug:!1,touchMode:"knob",knobSize:"30%",wheelSize:"100%",zIndex:9999,degreeStartAt:0,minDegree:null,maxDegree:null},l.DegInfo={rotation:0,quadrant:1},l.DomEvent={MOUSE_DOWN:"mousedown",MOUSE_MOVE:"mousemove",MOUSE_OUT:"mouseout",MOUSE_UP:"mouseup"},l.CustomEvent={MOUSE_DOWN:"mousedown",MOUSE_MOVE:"mousemove",MOUSE_UP:"mouseup"},l.utils={extend:function(e,t){for(const n in t)e[n]=t[n];return e},getComputedStyle:function(e,t){return window.getComputedStyle?window.getComputedStyle(e).getPropertyValue(t):e.currentStyle?e.currentStyle[t]:void 0},getCoordinates:function(e){const t=((e=e||window.event).target||e.srcElement).getBoundingClientRect();return{x:(l.MobileEvent?e.targetTouches[0].clientX:e.clientX)-t.left,y:(l.MobileEvent?e.targetTouches[0].clientY:e.clientY)-t.top}},getQuadrant:function(e,t){return e>0&&t>0?4:e<0&&t>0?3:e<0&&t<0?2:e>=0&&t<0?1:void 0},getRotation:function(e,t,n){let o,i=0,r=e.info;return 1===t&&2===r.old.quadrant?i=360:2===t&&1===r.old.quadrant&&(i=-360),o=n+i-r.old.rotation+r.now.rotation,r.old.rotation=n,r.old.quadrant=t,o},checkBoxCollision:function(e,t){return e.x1<t.x&&e.x2>t.x&&e.y1<t.y&&e.y2>t.y},addEvent:function(e,t,n,o){t=t.split(" ");for(let i=0;i<t.length;i++)e.addEventListener?e.addEventListener(t[i],n,o):e.attachEvent&&e.attachEvent("on"+t[i],n)},removeEvent:function(e,t,n){t=t.split(" ");for(let o=0;o<t.length;o++)e.addEventListener?e.removeEventListener(t[o],n):e.detachEvent&&e.detachEvent("on"+t[o],n)},triggerEvent:function(e,t){let n;l.Doc.createEvent?((n=l.Doc.createEvent("HTMLEvents")).initEvent(t,!0,!0),e.dispatchEvent(n)):((n=l.Doc.createEventObject()).target={},l.utils.extend(n.target,e),e.fireEvent("on"+t,n))},convertClockToUnit:function(e){return e%360-90},convertUnitToClock:function(e){return e>=-180&&e<-90?450+e:90+e}},l.Ready=!0),function(e,t,n){e.base=t,e.base.setAttribute("_JogDial_",!0),e.opt=l.utils.extend(l.utils.extend({},l.Defaults),n),e.info={}||e,e.info.now=l.utils.extend({},l.DegInfo),e.info.old=l.utils.extend({},l.DegInfo),e.info.snapshot=l.utils.extend({},e.info),e.info.snapshot.direction=null}(this,e,t),function(e){let t,n,o,i,r={},s=e.base.getAttribute("id"),a=e.base.clientWidth,c=e.base.clientHeight,u=e.opt,d=r.knob=document.createElement("div"),p=r.wheel=document.createElement("div"),m=d.style,h=p.style;"static"===l.utils.getComputedStyle(e.base,"position")&&(e.base.style.position="relative");e.base.appendChild(d),e.base.appendChild(p),l.utils.extend(e,r),m.position=h.position="absolute",m.width=m.height=u.knobSize,h.width=h.height=u.wheelSize,t=d.clientWidth/2,n=p.clientWidth/2,d.setAttribute("id",s+"_knob"),m.margin=-t+"px 0 0 "+-t+"px",m.zIndex=u.zIndex,p.setAttribute("id",s+"_wheel"),o=(a-p.clientWidth)/2,i=(c-p.clientHeight)/2,h.left=h.top=0,h.margin=i+"px 0 0 "+o+"px",h.zIndex=u.zIndex,e.radius=n-t,e.center={x:n+o,y:n+i},u.debug&&function(e){const t=e.knob.style,n=e.wheel.style;t.backgroundColor="#00F",n.backgroundColor="#0F0",t.opacity=n.opacity=.4,t.filter=n.filter="progid:DXImageTransform.Microsoft.Alpha(Opacity=40)",t.webkitBorderRadius=n.webkitBorderRadius="50%",t.borderRadius=n.borderRadius="50%"}(e)}(this),function(e){l.PointerEvent?l.utils.extend(l.DomEvent,{MOUSE_DOWN:"pointerdown MSPointerDown",MOUSE_MOVE:"pointermove MSPointerMove",MOUSE_OUT:"pointerout MSPointerOut",MOUSE_UP:"pointerup pointercancel MSPointerUp MSPointerCancel"}):l.MobileEvent&&l.utils.extend(l.DomEvent,{MOUSE_DOWN:"touchstart",MOUSE_MOVE:"touchmove",MOUSE_OUT:"touchleave",MOUSE_UP:"touchend"});const t=e.opt,n=e.info,o=e.knob,i=e.wheel;function r(o){if(e.pressed){o.preventDefault?o.preventDefault():o.returnValue=!1;let r,s=l.utils.getCoordinates(o),a=s.x-e.center.x+i.offsetLeft,u=s.y-e.center.y+i.offsetTop,d=Math.atan2(u,a)*l.ToDeg,p=l.utils.getQuadrant(a,u),m=l.utils.convertUnitToClock(d);n.now.rotation=l.utils.getRotation(e,void 0===p?n.old.quadrant:p,m),r=n.now.rotation,null!=t.maxDegree&&t.maxDegree<=r?(null==n.snapshot.direction&&(n.snapshot.direction="right",n.snapshot.now=l.utils.extend({},n.now),n.snapshot.old=l.utils.extend({},n.old)),r=t.maxDegree,d=l.utils.convertClockToUnit(r),m=l.utils.convertUnitToClock(d)):null!=t.minDegree&&t.minDegree>=r?(null==n.snapshot.direction&&(n.snapshot.direction="left",n.snapshot.now=l.utils.extend({},n.now),n.snapshot.old=l.utils.extend({},n.old)),r=t.minDegree,d=l.utils.convertClockToUnit(r),m=l.utils.convertUnitToClock(d)):null!=n.snapshot.direction&&(n.snapshot.direction=null),l.utils.extend(e.knob,{rotation:r,degree:m}),c(e,d)}}function s(){e.pressed&&(e.pressed=!1,null!=e.info.snapshot.direction&&(e.info.now=l.utils.extend({},n.snapshot.now),e.info.old=l.utils.extend({},n.snapshot.old),e.info.snapshot.direction=null),l.utils.triggerEvent(e.knob,l.CustomEvent.MOUSE_UP))}e.pressed=!1,l.utils.addEvent(i,l.DomEvent.MOUSE_DOWN,function(n){switch(t.touchMode){case"knob":default:e.pressed=l.utils.checkBoxCollision({x1:o.offsetLeft-i.offsetLeft,y1:o.offsetTop-i.offsetTop,x2:o.offsetLeft-i.offsetLeft+o.clientWidth,y2:o.offsetTop-i.offsetTop+o.clientHeight},l.utils.getCoordinates(n));break;case"wheel":e.pressed=!0,r(n)}e.pressed&&l.utils.triggerEvent(e.knob,l.CustomEvent.MOUSE_DOWN)},!1),l.utils.addEvent(i,l.DomEvent.MOUSE_MOVE,r,!1),l.utils.addEvent(i,l.DomEvent.MOUSE_UP,s,!1),l.utils.addEvent(i,l.DomEvent.MOUSE_OUT,s,!1)}(this),c(this,l.utils.convertClockToUnit(this.opt.degreeStartAt)),this)},l.Instance.prototype={on:function(e,t){return l.utils.addEvent(this.knob,e,t,!1),this},off:function(e,t){return l.utils.removeEvent(this.knob,e,t),this},trigger:function(e,t){return"angle"===e?c(this,l.utils.convertClockToUnit(t),t):window.alert("Please Check your code:\njogDial does not have triggering event ["+e+"]"),this},angle:function(e){const t=e>this.opt.maxDegree?this.opt.maxDegree:e;c(this,l.utils.convertClockToUnit(t),t)}};var u=l;n("q4sD"),n("SYky");const d=n("C1Pg");function p(e,t=10){if("number"!=typeof t)return Promise.reject(new Error("Please provide an integer as order argument."));const n=(e=d.tensor(e)).slice([0],[e.shape[0]-1]),o=e.slice([1]).sub(n),i=d.scalar(1e-16);let r=o.square(),s=(r=r.sum(1).add(i).sqrt().sub(i)).cumsum(0);const a=d.zeros([1]);s=d.concat([a,s]);const l=d.max(s);let c=d.div(d.mul(2*Math.PI,s),l);const u=d.range(1,t+1).reshape([t,1]),p=d.square(u).mul(2).mul(d.square(Math.PI));let m=l.div(p);m=d.squeeze(m);const h=(c=u.matMul(c.reshape([1,-1]))).slice([0,1],[c.shape[0],c.shape[1]-1]),f=c.slice([0,0],[c.shape[0],c.shape[1]-1]),g=d.cos(h).sub(d.cos(f)),v=d.sin(h).sub(d.sin(f)),y=o.slice([0,0],[o.shape[0],1]).squeeze(),E=o.slice([0,1],[o.shape[0],1]).squeeze(),b=y.mul(g).div(r),w=m.mul(b.sum(1)),x=m.mul(y.div(r).mul(v).sum(1)),M=m.mul(E.div(r).mul(g).sum(1)),k=m.mul(E.div(r).mul(v).sum(1));return d.stack([w,x,M,k]).transpose().array()}function m(e){const t=(e=d.tensor(e)).slice([0],[e.shape[0]-1]),n=e.slice([1]).sub(t),o=d.scalar(1e-16);let i=n.square(),r=(i=i.sum(1).add(o).sqrt().sub(o)).cumsum(0);const s=d.zeros([1]);r=d.concat([s,r]);const a=d.max(r);let l=n.slice([0,0],[n.shape[0],1]).squeeze(),c=n.slice([0,1],[n.shape[0],1]).squeeze();const u=l.cumsum().sub(l.div(i).mul(r.slice([1],[r.shape[0]-1]))),p=r.square().slice([1],[r.shape[0]-1]).sub(r.square().slice([0],[r.shape[0]-1])),m=d.scalar(1).div(a).mul(l.div(d.scalar(2).mul(i)).mul(p).add(u.mul(i)).sum()),h=c.cumsum().sub(c.div(i).mul(r.slice([1],r.shape[0]-1))),f=d.scalar(1).div(a).mul(c.div(d.scalar(2).mul(i)).mul(p).add(h.mul(i)).sum());return d.concat([e.slice([0,0],[1,1]).add(m),e.slice([0,1],[1,1]).add(f)]).squeeze().array()}function h(e,t=200){let n=d.tensor(e);const o=n.shape[0],i=d.range(1,o+1).reshape([-1,1]),r=d.linspace(0,1,t),s=i.mul(d.scalar(2)).mul(d.scalar(Math.PI)).mul(r.reshape([1,-1])),a=n.slice([0,0],[n.shape[0],1]).mul(d.cos(s)).add(n.slice([0,1],[n.shape[0],1]).mul(d.sin(s))),l=n.slice([0,2],[n.shape[0],1]).mul(d.cos(s)).add(n.slice([0,3],[n.shape[0],1]).mul(d.sin(s)));return d.stack([a,l],2)}const{map:f,drawnItems:g,reconstructionItems:v,animationItems:y}=function(){delete i.a.Icon.Default.prototype._getIconUrl,i.a.Icon.Default.mergeOptions({iconRetinaUrl:n("WE1v"),iconUrl:n("Y5fm"),shadowUrl:n("4rkx")});const e=i.a.map("map"),t=i.a.featureGroup().addTo(e),o=i.a.featureGroup().addTo(e),r=i.a.featureGroup().addTo(e);return r.addLayer(s),i.a.control.mousePosition().addTo(e),e.addControl(new i.a.Control.Draw({draw:{polygon:{allowIntersection:!1,showArea:!1},polyline:!1,rectangle:!1,circle:!1,marker:!1,circlemarker:!1},edit:!1})),e.setView([2,0],5),{map:e,drawnItems:r,reconstructionItems:t,animationItems:o}}(),E=document.getElementById("num_ellipses"),b=document.getElementById("coefficients_table_body"),w=document.getElementById("locus");let x=!1;function M(e,t){let n,o;return Promise.all([m(e),p(e,t)]).then(e=>([n,o]=e,w.value=n.map(e=>e.toPrecision(6)),function(e,t){e.innerHTML="",t.forEach(t=>{const n=e.insertRow();return t.forEach(e=>{const t=n.insertCell(-1),o=document.createTextNode(e.toPrecision(8));t.appendChild(o)})})}(b,o),function(e,t=[0,0],n=200){const o=d.tensor(t);return h(e,n).sum(0).add(o).array()}(o,n,200))).then(e=>(function(e,t){e.eachLayer(e=>{e.setStyle({opacity:e.options.opacity?.3*e.options.opacity:.5,fillOpacity:e.options.fillOpacity?.3*e.options.fillOpacity:.1})});const n=i.a.polygon(t,{color:"orange"});e.addLayer(n)})(v,e)).then(()=>h(o,200)).then(e=>e.array()).then(e=>{console.log(e),a(y,e,n)})}f.on(i.a.Draw.Event.CREATED,e=>{g.eachLayer(e=>g.removeLayer(e));const t=e.layer;g.addLayer(t);const n=e.layer.editing.latlngs[0][0].map(e=>[e.lat,e.lng]);return M(n,Number(E.value)).then(()=>console.log("Done")).catch(console.error)});function k(e){E.value=e;let t=[];g.eachLayer(e=>t.push(e));const n=t[0].editing.latlngs[0][0].map(e=>[e.lat,e.lng]);return n.push(n[0]),M(n,e)}const D=u(document.getElementById("ellipses_jog_dial"),{debug:!1,wheelSize:"80%",minDegree:1,maxDegree:99999}).on("mouseup",e=>{return k(Math.round(.25*e.target.rotation)).then(()=>console.log("Done")).catch(console.error)}).on("mousemove",e=>{x||(E.value=Math.round(.25*e.target.rotation)),x=!1});E.oninput=()=>{x=!0;const e=Number(E.value);return D.angle(4*e),k(e).catch(console.error)}},6:function(e,t){},7:function(e,t){},"7wNy":function(e,t,n){var o=n("Unbp");"string"==typeof o&&(o=[[e.i,o,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};n("aET+")(o,i);o.locals&&(e.exports=o.locals)},Unbp:function(e,t,n){t=e.exports=n("JPst")(!1);var o=n("HeW1"),i=o(n("yJkd")),r=o(n("/Wy3"));t.push([e.i,"#dials {\r\n    height: 320px;\r\n    overflow: hidden;\r\n}\r\n\r\n.dial {\r\n    display: block;\r\n    position: relative;\r\n    height: 320px;\r\n}\r\n\r\n.dial.hidden {\r\n    display: none;\r\n}\r\n\r\n#ellipses_jog_dial {\r\n    position: relative;\r\n    width: 260px;\r\n    height: 260px;\r\n    margin: 20px auto;\r\n    background: url("+i+") no-repeat;\r\n}\r\n#ellipses_jog_dial #ellipses_jog_dial_knob {\r\n    background: url("+r+") no-repeat;\r\n}\r\n",""])},yJkd:function(e,t,n){e.exports=n.p+"images/558502491546f3959097267749723121.png"}},[["5NL3",1,2]]]);
//# sourceMappingURL=0.main.js.map