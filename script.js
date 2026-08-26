const WHATSAPP="573024330121";
const packages=["120","240","605","1.230","3.125","6.250","10.000","13.800","20.850","43.000","50.050","71.500","100.000","142.500","214.500","287.000","785.000"];
const countries={
"Estados Unidos":{code:"USD",name:"Dólar estadounidense",flag:"🇺🇸",prices:[1.10,2.20,5.50,11,27.50,55,88,110,165,330,385,550,770,1100,1650,2200,5500]},
"México":{code:"MXN",name:"Peso mexicano",flag:"🇲🇽",prices:[22,44,110,220,550,1100,1760,2200,3300,6600,7700,11000,15400,22000,33000,44000,110000]},
"Argentina":{code:"ARS",name:"Peso argentino",flag:"🇦🇷",prices:[1980,3960,9900,19800,49500,99000,154400,198000,297000,594000,693000,990000,1386000,1980000,2970000,3960000,9900000]},
"Colombia":{code:"COP",name:"Peso colombiano",flag:"🇨🇴",prices:[3900,7700,19300,38500,96300,192500,308000,385000,577500,1155000,1347500,1925000,2695000,3850000,5775000,7700000,19250000]},
"Venezuela":{code:"VES",name:"Bolívar venezolano",flag:"🇻🇪",prices:[1090,2178,5445,10890,27225,54450,87120,108900,163350,326700,381150,544500,762300,1089000,1633500,2178000,5445000]},
"Otros países":{code:"USD",name:"Dólar estadounidense",flag:"🌎",prices:[1.10,2.20,5.50,11,27.50,55,88,110,165,330,385,550,770,1100,1650,2200,5500]}
};
let country=localStorage.getItem("omegaCountry")||"Colombia";
let cart=JSON.parse(localStorage.getItem("omegaCart")||"[]");
const $=id=>document.getElementById(id);
const fmt=(n,c)=>new Intl.NumberFormat(c==="USD"?"en-US":"es-419",{minimumFractionDigits:2,maximumFractionDigits:2}).format(n)+" "+c;
function renderCountries(){
 const opts=Object.entries(countries).map(([n,d])=>`<option value="${n}" ${n===country?"selected":""}>${d.flag} ${n}</option>`).join("");
 $("country").innerHTML=opts;$("checkoutCountry").innerHTML=opts;
}
function renderCurrency(){const d=countries[country];$("currency").textContent=`${d.code} — ${d.name}`;$("checkoutCurrency").textContent=`${d.code} — ${d.name}`}
function renderProducts(){
 const d=countries[country];
 $("products").innerHTML=packages.map((p,i)=>`<article class="product"><div class="coin">🪙</div><div class="coin-info"><b>${p}</b><small>MONEDAS</small></div><div class="price">${fmt(d.prices[i],d.code)}</div><button class="add" onclick="add(${i})">🛒</button></article>`).join("");
}
function add(i){let x=cart.find(a=>a.i===i);if(x)x.q++;else cart.push({i,q:1});save();openCart()}
function save(){localStorage.setItem("omegaCart",JSON.stringify(cart));renderCart()}
function renderCart(){
 const d=countries[country];$("cartCount").textContent=cart.reduce((s,x)=>s+x.q,0);
 if(!cart.length){$("cartItems").innerHTML="<p style='color:#9fb0c5'>Tu carrito está vacío.</p>";$("cartTotal").textContent=fmt(0,d.code);return}
 $("cartItems").innerHTML=cart.map(x=>`<div class="drawer-item"><div><b>🪙 ${packages[x.i]} monedas</b><div class="qty" style="margin-top:8px"><button onclick="change(${x.i},-1)">−</button><span>${x.q}</span><button onclick="change(${x.i},1)">+</button><button onclick="removeItem(${x.i})">🗑</button></div></div><b>${fmt(d.prices[x.i]*x.q,d.code)}</b></div>`).join("");
 $("cartTotal").textContent=fmt(cart.reduce((s,x)=>s+d.prices[x.i]*x.q,0),d.code)
}
function change(i,n){let x=cart.find(a=>a.i===i);if(!x)return;x.q+=n;if(x.q<=0)cart=cart.filter(a=>a.i!==i);save()}
function removeItem(i){cart=cart.filter(a=>a.i!==i);save()}
function openCart(){$("cartPanel").classList.add("open");$("overlay").classList.add("show")}
function closeCart(){$("cartPanel").classList.remove("open");$("overlay").classList.remove("show")}
function syncCountry(v){country=v;localStorage.setItem("omegaCountry",country);renderCountries();renderCurrency();renderProducts();renderCart()}
$("country").onchange=e=>syncCountry(e.target.value);$("checkoutCountry").onchange=e=>syncCountry(e.target.value);
$("openCart").onclick=openCart;$("bottomCart").onclick=openCart;$("closeCart").onclick=closeCart;$("continueBtn").onclick=closeCart;$("overlay").onclick=closeCart;
$("whatsappBtn").onclick=()=>{if(cart.length)openCheckout();else window.open(`https://wa.me/${WHATSAPP}`,"_blank")};
$("bottomContact").onclick=()=>window.open(`https://wa.me/${WHATSAPP}`,"_blank");
function openCheckout(){if(!cart.length)return alert("Agrega al menos un paquete.");$("checkoutModal").classList.remove("hidden");renderCurrency();$("checkoutCountry").value=country}
$("checkoutBtn").onclick=openCheckout;$("closeModal").onclick=()=>$("checkoutModal").classList.add("hidden");
$("sendWhatsApp").onclick=()=>{
 const id=$("superliveId").value.trim();if(!id)return alert("Escribe tu ID o usuario de SuperLive.");
 const d=countries[country], lines=cart.map(x=>`• ${packages[x.i]} monedas x${x.q} = ${fmt(d.prices[x.i]*x.q,d.code)}`).join("\n");
 const total=fmt(cart.reduce((s,x)=>s+d.prices[x.i]*x.q,0),d.code);
 let msg=`⭐ NUEVO PEDIDO - OMEGA STAR\n\n${lines}\n\nTOTAL: ${total}\nPaís: ${country}\nMoneda: ${d.code} — ${d.name}\nID SuperLive: ${id}\nMétodo de pago: ${$("payment").value}`;
 if($("customerName").value.trim())msg+=`\nNombre: ${$("customerName").value.trim()}`;
 if($("customerWhatsapp").value.trim())msg+=`\nWhatsApp: ${$("customerWhatsapp").value.trim()}`;
 if($("note").value.trim())msg+=`\nNota: ${$("note").value.trim()}`;
 window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,"_blank");
};
$("menuBtn").onclick=()=>document.querySelector(".section").scrollIntoView();
renderCountries();renderCurrency();renderProducts();renderCart();