const WA="573024330121";
const packages=["120","240","605","1.230","3.125","6.250","10.000","13.800","20.850","43.000","50.050","71.500","100.000","142.500","214.500","287.000","785.000"];
const countries={
"Estados Unidos":{flag:"🇺🇸",code:"USD",name:"Dólar estadounidense",p:[1.10,2.20,5.50,11,27.50,55,88,110,165,330,385,550,770,1100,1650,2200,5500]},
"México":{flag:"🇲🇽",code:"MXN",name:"Peso mexicano",p:[22,44,110,220,550,1100,1760,2200,3300,6600,7700,11000,15400,22000,33000,44000,110000]},
"Argentina":{flag:"🇦🇷",code:"ARS",name:"Peso argentino",p:[1980,3960,9900,19800,49500,99000,154400,198000,297000,594000,693000,990000,1386000,1980000,2970000,3960000,9900000]},
"Colombia":{flag:"🇨🇴",code:"COP",name:"Peso colombiano",p:[3900,7700,19300,38500,96300,192500,308000,385000,577500,1155000,1347500,1925000,2695000,3850000,5775000,7700000,19250000]},
"Venezuela":{flag:"🇻🇪",code:"VES",name:"Bolívar venezolano",p:[1090,2178,5445,10890,27225,54450,87120,108900,163350,326700,381150,544500,762300,1089000,1633500,2178000,5445000]},
"Otros países":{flag:"🌐",code:"USD",name:"Dólar estadounidense",p:[1.10,2.20,5.50,11,27.50,55,88,110,165,330,385,550,770,1100,1650,2200,5500]}
};
const pays=["PayPal","Zelle","Cash App","Venmo","Nequi","Bancolombia","Binance","Mercado Pago","Revolut","Lemon","Pago Móvil","Wise"];
let country=localStorage.getItem("omegaCountry")||"Estados Unidos";
let cart=JSON.parse(localStorage.getItem("omegaCart")||"[]");
const $=x=>document.getElementById(x);
const fmt=(n,c)=>new Intl.NumberFormat(c==="USD"?"en-US":"es-419",{minimumFractionDigits:2,maximumFractionDigits:2}).format(n)+" "+c;
function opts(){return Object.entries(countries).map(([n,d])=>`<option value="${n}" ${n===country?"selected":""}>${d.flag} ${n}</option>`).join("")}
function syncCountries(){["countryHome","countryPackages","countryCheckout"].forEach(id=>{if($(id))$(id).innerHTML=opts()});}
function renderHome(){const d=countries[country];$("homeProducts").innerHTML=packages.map((p,i)=>card(p,d.p[i],d.code,i)).join("")}
function card(p,price,code,i){return `<div class="product-card"><div class="coin-stack">🪙</div><div class="coins">${p}</div><small>MONEDAS</small><div class="price">${fmt(price,code)}</div><button class="add" onclick="add(${i})">🛒 Agregar</button></div>`}
function renderPackages(){const d=countries[country];$("currencyCode").textContent=d.code;$("currencyName").textContent=d.name;$("allProducts").innerHTML=packages.map((p,i)=>`<div class="list-row"><span class="coins">🪙</span><div><b>${p}</b> <small>MONEDAS</small></div><span class="amount">${fmt(d.p[i],d.code)}</span><button onclick="add(${i})">+</button></div>`).join("")}
function add(i){let x=cart.find(a=>a.i===i);x?x.q++:cart.push({i,q:1});save();show("cart")}
function save(){localStorage.setItem("omegaCart",JSON.stringify(cart));renderCart()}
function renderCart(){const d=countries[country];$("cartBadge").textContent=cart.reduce((s,x)=>s+x.q,0);$("emptyCart").classList.toggle("hidden",cart.length>0);$("cartList").innerHTML=cart.map(x=>`<div class="cart-item"><span class="coins">🪙</span><div><b>${packages[x.i]} MONEDAS</b><small>${fmt(d.p[x.i],d.code)}</small><div class="qty"><button onclick="qty(${x.i},-1)">−</button><span>${x.q}</span><button onclick="qty(${x.i},1)">+</button></div></div><strong class="line-total">${fmt(d.p[x.i]*x.q,d.code)}</strong></div>`).join("");const total=cart.reduce((s,x)=>s+d.p[x.i]*x.q,0);$("subtotal").textContent=fmt(total,d.code);$("total").textContent=fmt(total,d.code)}
function qty(i,n){const x=cart.find(a=>a.i===i);if(!x)return;x.q+=n;if(x.q<1)cart=cart.filter(a=>a.i!==i);save()}
function clearCart(){cart=[];save()}
function show(view){document.querySelectorAll(".view").forEach(v=>v.classList.add("hidden"));$(view+"View").classList.remove("hidden");window.scrollTo(0,0);document.querySelectorAll(".bottom button").forEach(b=>b.classList.remove("active"))}
function go(name){show(name)}
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
$("cartBtn").onclick=()=>go("cart");$("clearCart").onclick=clearCart;
["countryHome","countryPackages","countryCheckout"].forEach(id=>{if($(id))$(id).onchange=e=>{country=e.target.value;localStorage.setItem("omegaCountry",country);syncCountries();renderHome();renderPackages();renderCart();}});
$("toStep2").onclick=()=>step(2);$("backStep1").onclick=()=>step(1);
$("toStep3").onclick=()=>{if(!$("superliveId").value.trim()){alert("Ingresa tu ID de SuperLive.");return}step(3)};
$("finishCart").onclick=()=>{if(!cart.length){alert("Tu carrito está vacío.");return}step(1);go("checkout")};
function step(n){[1,2,3].forEach(i=>$("step"+i).classList.toggle("hidden",i!==n));document.querySelectorAll(".steps span").forEach((s,i)=>s.classList.toggle("on",i<n));if(n===3)renderCheckout()}
function renderCheckout(){const d=countries[country];$("payment").innerHTML=pays.map(x=>`<option>${x}</option>`).join("");$("customerSummary").innerHTML=`<b>País seleccionado</b><br>${d.flag} ${country} (${d.code})<br><b>Método de pago</b><br>${$("payment").value}<br><b>ID de SuperLive</b><br>${$("superliveId").value}`;$("checkoutItems").innerHTML=cart.map(x=>`<div style="display:flex;justify-content:space-between;font-size:9px;padding:6px 0;border-bottom:1px solid #172732"><span>${packages[x.i]} MONEDAS × ${x.q}</span><b>${fmt(d.p[x.i]*x.q,d.code)}</b></div>`).join("");const t=cart.reduce((s,x)=>s+d.p[x.i]*x.q,0);$("checkoutSubtotal").textContent=fmt(t,d.code);$("checkoutTotal").textContent=fmt(t,d.code)}
$("sendOrder").onclick=()=>{const d=countries[country];const lines=cart.map(x=>`• ${packages[x.i]} monedas × ${x.q} = ${fmt(d.p[x.i]*x.q,d.code)}`).join("\n");const t=cart.reduce((s,x)=>s+d.p[x.i]*x.q,0);const msg=`⭐ OMEGA STAR — NUEVO PEDIDO\n\n${lines}\n\nTOTAL: ${fmt(t,d.code)}\nPaís: ${country}\nID SuperLive: ${$("superliveId").value}\nMétodo de pago: ${$("payment").value}\nNombre: ${$("name").value||"No indicado"}\nNota: ${$("note").value||"Sin nota"}`;window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,"_blank")};
$("menuBtn").onclick=()=>go("packages");
syncCountries();renderHome();renderPackages();renderCart();