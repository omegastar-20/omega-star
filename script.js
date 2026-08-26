const PACKAGES = [
  [120,1.10],[240,2.20],[605,5.50],[1230,11],[3125,27.50],
  [6250,55],[10000,88],[13800,110],[20850,165],[43000,330],
  [50050,385],[71500,550],[100000,770],[142500,1100],
  [214500,1650],[287000,2200],[785000,5500]
];

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let cart = JSON.parse(localStorage.getItem("omega_cart") || "[]");
let selectedCountry = "US";
let checkoutStep = 1;

const money = n => `$${Number(n).toFixed(2)} USD`;
const fmtCoins = n => Number(n).toLocaleString("en-US");

function save(){localStorage.setItem("omega_cart", JSON.stringify(cart)); renderAll();}
function total(){return cart.reduce((s,x)=>s+x.price*x.qty,0)}
function count(){return cart.reduce((s,x)=>s+x.qty,0)}

function coinHTML(){
  return `<img class="coin-art" src="assets/coins-reference.png" alt="" aria-hidden="true">`;
}

function add(id){
  const p=PACKAGES[id];
  const found=cart.find(x=>x.id===id);
  if(found) found.qty++;
  else cart.push({id,coins:p[0],price:p[1],qty:1});
  save();
  show("cartScreen");
}

function change(id,delta){
  const x=cart.find(v=>v.id===id);
  if(!x)return;
  x.qty+=delta;
  if(x.qty<=0) cart=cart.filter(v=>v.id!==id);
  save();
}

function renderHome(){
  $("#homeProducts").innerHTML=PACKAGES.slice(0,6).map((p,i)=>`
    <article class="product-card">
      ${coinHTML()}
      <div class="coins">${fmtCoins(p[0])}</div>
      <small>MONEDAS</small>
      <div class="price">${money(p[1])}</div>
      <button class="add" data-add="${i}">🛒 Agregar</button>
    </article>`).join("");
}

function renderPackages(){
  $("#packageList").innerHTML=PACKAGES.map((p,i)=>`
    <div class="list-row">
      ${coinHTML()}
      <div><b class="coins">${fmtCoins(p[0])}</b><small>MONEDAS</small></div>
      <b class="amount">${money(p[1])}</b>
      <button data-add="${i}">+</button>
    </div>`).join("");
}

function renderCart(){
  $("#cartBadge").textContent=count();
  $("#cartItems").innerHTML=cart.length?cart.map(x=>`
    <div class="cart-item">
      ${coinHTML()}
      <div>
        <b>${fmtCoins(x.coins)} MONEDAS</b>
        <small>${money(x.price)} c/u</small>
        <div class="qty">
          <button data-minus="${x.id}">−</button><span>${x.qty}</span><button data-plus="${x.id}">+</button>
        </div>
      </div>
      <strong>${money(x.price*x.qty)}</strong>
    </div>`).join(""):`<div class="empty">Tu carrito está vacío.</div>`;
  $("#subtotal").textContent=money(total());
  $("#cartTotal").textContent=money(total());
}

function renderConfirm(){
  const labels={US:"🇺🇸 Estados Unidos (USD)",MX:"🇲🇽 México (MXN)",AR:"🇦🇷 Argentina (ARS)",CO:"🇨🇴 Colombia (COP)",VE:"🇻🇪 Venezuela (VES)",OTHER:"🌐 Otros países"};
  $("#confirmCountry").textContent=labels[selectedCountry]||labels.US;
  $("#confirmPayment").textContent=$("#paymentMethod").value||"—";
  $("#confirmId").textContent=$("#superliveId").value||"—";
  $("#confirmName").textContent=$("#customerName").value||"—";
  $("#confirmNote").textContent=$("#customerNote").value||"—";
  $("#confirmLines").innerHTML=cart.map(x=>`<div><span>${fmtCoins(x.coins)} MONEDAS × ${x.qty}</span><b>${money(x.price*x.qty)}</b></div>`).join("")+
    `<div><span>Subtotal</span><b>${money(total())}</b></div><div><span>Envío</span><b class="green">GRATIS</b></div><div><strong>Total</strong><strong>${money(total())}</strong></div>`;
}

function show(id){
  $$(".screen").forEach(s=>s.classList.remove("active"));
  $("#"+id).classList.add("active");
  $$(".bottom button").forEach(b=>b.classList.toggle("active",b.dataset.screen===id));
  window.scrollTo({top:0,behavior:"smooth"});
}

function setStep(n){
  checkoutStep=n;
  ["step1","step2","step3"].forEach((id,i)=>$("#"+id).classList.toggle("hidden",i!==n-1));
  ["stepDot1","stepDot2","stepDot3"].forEach((id,i)=>$("#"+id).classList.toggle("on",i<n));
  renderConfirm();
}

function renderAll(){renderHome();renderPackages();renderCart();renderConfirm();}

document.addEventListener("click",e=>{
  const addBtn=e.target.closest("[data-add]");
  if(addBtn){add(Number(addBtn.dataset.add));return}
  const plus=e.target.closest("[data-plus]");
  if(plus){change(Number(plus.dataset.plus),1);return}
  const minus=e.target.closest("[data-minus]");
  if(minus){change(Number(minus.dataset.minus),-1);return}
  const nav=e.target.closest("[data-screen]");
  if(nav){show(nav.dataset.screen);return}
  if(e.target.closest("[data-home]")){show("homeScreen");return}
});

$("#cartBtn").onclick=()=>show("cartScreen");
$("#clearCart").onclick=()=>{cart=[];save()};
$("#checkoutBtn").onclick=()=>{if(!cart.length){alert("Agrega al menos un paquete al carrito.");return}show("checkoutScreen");setStep(1)};
$("#menuBtn").onclick=()=>show("packagesScreen");
$("#toStep2").onclick=()=>{setStep(2)};
$("#backStep1").onclick=()=>setStep(1);
$("#toStep3").onclick=()=>{
  if(!$("#superliveId").value.trim() || !$("#paymentMethod").value || !$("#customerName").value.trim()){
    alert("Completa ID de SuperLive, método de pago y nombre.");
    return;
  }
  setStep(3);
};
$("#checkoutBack").onclick=()=>setStep(Math.max(1,checkoutStep-1));

$("#homeCountry").onchange=e=>{selectedCountry=e.target.value;$("#packageCountry").value=selectedCountry};
$("#packageCountry").onchange=e=>{selectedCountry=e.target.value;$("#homeCountry").value=selectedCountry};
$$(".country-list button").forEach(b=>b.onclick=()=>{selectedCountry=b.dataset.country;$("#homeCountry").value=selectedCountry;$("#packageCountry").value=selectedCountry;$$(".country-list button").forEach(x=>x.style.background="none");b.style.background="#0a2031"});

["superliveId","paymentMethod","customerName","customerNote"].forEach(id=>$(("#"+id)).addEventListener("input",renderConfirm));

$("#whatsappBtn").onclick=()=>{
  const lines=cart.map(x=>`${fmtCoins(x.coins)} monedas x${x.qty} — ${money(x.price*x.qty)}`).join("%0A");
  const msg=`Hola, quiero realizar este pedido en Omega Star:%0A%0A${lines}%0A%0ATotal: ${money(total())}%0AID SuperLive: ${encodeURIComponent($("#superliveId").value)}%0ANombre: ${encodeURIComponent($("#customerName").value)}%0AMétodo de pago: ${encodeURIComponent($("#paymentMethod").value)}`;
  window.open(`https://wa.me/?text=${msg}`,"_blank");
};

renderAll();
