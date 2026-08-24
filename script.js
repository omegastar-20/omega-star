const WHATSAPP="573024330121";
const products=[
["120",1.10],["240",2.20],["605",5.50],["1.230",11],["3.125",27.50],
["6.250",55],["10.000",88],["13.800",110],["20.850",165],["43.000",330],
["50.050",385],["71.500",550],["100.000",770],["142.500",1100],
["214.500",1650],["287.000",2200],["785.000",5500]
];
let cart=JSON.parse(localStorage.getItem("omegaCart")||"[]");
const $=id=>document.getElementById(id);
function money(n){return "$"+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
function renderProducts(){
 $("products").innerHTML=products.map((p,i)=>`<article class="product"><div class="coins">🪙 ${p[0]} monedas</div><div class="price">${money(p[1])}</div><button class="add" onclick="add(${i})">Agregar al carrito</button></article>`).join("");
}
function add(i){const p=products[i], found=cart.find(x=>x.i===i); if(found)found.q++;else cart.push({i,q:1}); save();openCart()}
function save(){localStorage.setItem("omegaCart",JSON.stringify(cart));renderCart()}
function renderCart(){
 $("cartCount").textContent=cart.reduce((s,x)=>s+x.q,0);
 if(!cart.length){$("cartItems").innerHTML="<p style='color:#9fb0c5'>Tu carrito está vacío.</p>";$("cartTotal").textContent="$0.00";return}
 $("cartItems").innerHTML=cart.map(x=>{let p=products[x.i];return `<div class="cart-item"><div class="cart-row"><b>🪙 ${p[0]} monedas</b><b>${money(p[1]*x.q)}</b></div><div class="qty" style="margin-top:9px"><button onclick="change(${x.i},-1)">−</button><span>${x.q}</span><button onclick="change(${x.i},1)">+</button><button onclick="removeItem(${x.i})" style="margin-left:10px">🗑</button></div></div>`}).join("");
 $("cartTotal").textContent=money(cart.reduce((s,x)=>s+products[x.i][1]*x.q,0));
}
function change(i,d){let x=cart.find(a=>a.i===i);if(!x)return;x.q+=d;if(x.q<=0)cart=cart.filter(a=>a.i!==i);save()}
function removeItem(i){cart=cart.filter(a=>a.i!==i);save()}
function openCart(){$("cartPanel").classList.add("open");$("overlay").classList.add("show");$("cartPanel").setAttribute("aria-hidden","false")}
function closeCart(){$("cartPanel").classList.remove("open");$("overlay").classList.remove("show");$("cartPanel").setAttribute("aria-hidden","true")}
$("openCart").onclick=openCart;$("closeCart").onclick=closeCart;$("overlay").onclick=closeCart;
$("checkoutBtn").onclick=()=>{if(!cart.length){alert("Agrega al menos un paquete al carrito.");return} $("checkoutModal").classList.remove("hidden")};
$("closeModal").onclick=()=>$("checkoutModal").classList.add("hidden");
$("sendWhatsApp").onclick=()=>{
 const id=$("superliveId").value.trim(), country=$("country").value, payment=$("payment").value;
 if(!id){alert("Escribe tu ID o usuario de SuperLive.");$("superliveId").focus();return}
 const name=$("customerName").value.trim(), note=$("note").value.trim();
 const lines=cart.map(x=>`• ${products[x.i][0]} monedas x${x.q} = ${money(products[x.i][1]*x.q)}`).join("\n");
 const total=money(cart.reduce((s,x)=>s+products[x.i][1]*x.q,0));
 let msg=`⭐ *NUEVO PEDIDO - OMEGA STAR*%0A%0A${encodeURIComponent(lines)}%0A%0A*Total: ${encodeURIComponent(total)}*%0A🌎 País: ${encodeURIComponent(country)}%0A👤 ID SuperLive: ${encodeURIComponent(id)}%0A💳 Pago: ${encodeURIComponent(payment)}`;
 if(name)msg+=`%0A🙋 Nombre: ${encodeURIComponent(name)}`; if(note)msg+=`%0A📝 Nota: ${encodeURIComponent(note)}`;
 window.open(`https://wa.me/${WHATSAPP}?text=${msg}`,"_blank");
};
renderProducts();renderCart();