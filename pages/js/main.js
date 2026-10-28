const PRODUCTS = [
 {id:'organizador',name:'Organizador Multiuso',category:'organizacao',categoryLabel:'Organização',price:39.90,oldPrice:49.90,image:'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=85',tag:'Oferta',description:'Organize os pequenos itens da casa com praticidade. Ideal para banheiro, cozinha, lavanderia ou escritório.'},
 {id:'luminaria',name:'Luminária de Mesa',category:'decoracao',categoryLabel:'Decoração',price:89.90,oldPrice:null,image:'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85',tag:'Mais vendido',description:'Iluminação aconchegante e design versátil para mesas de cabeceira, salas e espaços de leitura.'},
 {id:'manta',name:'Manta para Sofá',category:'textil',categoryLabel:'Cama, mesa e banho',price:69.90,oldPrice:null,image:'https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&w=900&q=85',tag:'Conforto',description:'Uma manta macia para deixar o sofá ainda mais confortável e dar um toque acolhedor à sala.'},
 {id:'vaso',name:'Vaso Decorativo',category:'decoracao',categoryLabel:'Decoração',price:34.90,oldPrice:44.90,image:'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=900&q=85',tag:'Oferta',description:'Peça decorativa de linhas simples que combina com estantes, mesas laterais e aparadores.'},
 {id:'potes',name:'Conjunto de Potes',category:'cozinha',categoryLabel:'Cozinha',price:54.90,oldPrice:null,image:'https://images.unsplash.com/photo-1495546968767-f0573cca821e?auto=format&fit=crop&w=900&q=85',tag:'Prático',description:'Conjunto para ajudar a manter ingredientes e pequenos itens organizados na cozinha.'},
 {id:'almofada',name:'Almofada Decorativa',category:'textil',categoryLabel:'Cama, mesa e banho',price:42.90,oldPrice:null,image:'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=85',tag:'Novo',description:'Almofada decorativa para renovar a aparência do sofá, poltrona ou cama.'},
 {id:'cesto',name:'Cesto Organizador',category:'organizacao',categoryLabel:'Organização',price:47.90,oldPrice:null,image:'https://images.unsplash.com/photo-1593085260707-5377ba37f868?auto=format&fit=crop&w=900&q=85',tag:'Versátil',description:'Cesto versátil para guardar mantas, brinquedos, acessórios ou itens do dia a dia.'},
 {id:'tábua',name:'Tábua para Servir',category:'cozinha',categoryLabel:'Cozinha',price:59.90,oldPrice:null,image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85',tag:'Escolha da casa',description:'Uma peça útil para servir petiscos e compor a mesa em momentos especiais.'}
];
const money = value => value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const getCart = () => { try { return JSON.parse(localStorage.getItem('larcia-cart') || '[]'); } catch { return []; } };
const saveCart = cart => { localStorage.setItem('larcia-cart',JSON.stringify(cart)); updateCartCount(); };
function updateCartCount(){const count=getCart().reduce((sum,item)=>sum+item.qty,0);document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=count);}
function notify(message){let toast=document.querySelector('#toast');if(!toast){toast=document.createElement('div');toast.id='toast';toast.className='toast';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');document.body.appendChild(toast);}toast.textContent=message;toast.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove('show'),2400);}
function addToCart(id){const product=PRODUCTS.find(p=>p.id===id);if(!product)return;const cart=getCart();const item=cart.find(p=>p.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart(cart);notify(`${product.name} adicionado ao carrinho!`);}
function productCard(product){return `<article class="product-card" data-category="${product.category}" data-name="${product.name.toLocaleLowerCase('pt-BR')}"><div class="product-image"><a href="produto.html?id=${encodeURIComponent(product.id)}" aria-label="Ver ${product.name}"><img loading="lazy" src="${product.image}" alt="${product.name}"></a>${product.tag?`<span class="tag">${product.tag}</span>`:''}<button class="add-btn" type="button" data-add="${product.id}">Adicionar ao carrinho</button></div><div class="product-info"><div class="product-category">${product.categoryLabel}</div><h3><a href="produto.html?id=${encodeURIComponent(product.id)}">${product.name}</a></h3><div class="product-meta"><span class="price">${product.oldPrice?`<span class="old-price">${money(product.oldPrice)}</span>`:''}${money(product.price)}</span><span class="rating">★ 4,8</span></div></div></article>`;}
function renderProducts(target,items=PRODUCTS){const container=document.querySelector(target);if(container)container.innerHTML=items.map(productCard).join('');}
function setupProductListing(){const grid=document.querySelector('#products');if(!grid)return;renderProducts('#products');const params=new URLSearchParams(location.search);const search=document.querySelector('#busca');if(search&&params.get('q'))search.value=params.get('q');let active=params.get('categoria')||'todos';const filters=[...document.querySelectorAll('[data-filter]')];if(!filters.some(btn=>btn.dataset.filter===active))active='todos';filters.forEach(btn=>btn.classList.toggle('active',btn.dataset.filter===active));function filter(){const term=(search?.value||'').trim().toLocaleLowerCase('pt-BR');const shown=PRODUCTS.filter(p=>(active==='todos'||p.category===active)&&`${p.name} ${p.categoryLabel}`.toLocaleLowerCase('pt-BR').includes(term));renderProducts('#products',shown);const empty=document.querySelector('#no-results');if(empty)empty.hidden=shown.length>0;}filters.forEach(btn=>btn.addEventListener('click',()=>{filters.forEach(b=>b.classList.toggle('active',b===btn));active=btn.dataset.filter;filter();}));search?.addEventListener('input',filter);filter();}
function setupProductDetail(){const target=document.querySelector('#product-detail');if(!target)return;const id=new URLSearchParams(location.search).get('id');const p=PRODUCTS.find(item=>item.id===id)||PRODUCTS[0];target.innerHTML=`<div><img class="detail-image" src="${p.image}" alt="${p.name}"></div><div class="detail-info"><div class="breadcrumbs"><a href="index.html">Início</a> / <a href="produtos.html">Produtos</a> / ${p.name}</div><span class="eyebrow">${p.categoryLabel}</span><h1>${p.name}</h1><div class="rating">★ 4,8 · Avaliações demonstrativas</div><div class="detail-price">${money(p.price)} ${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:''}</div><p>${p.description}</p><p>✓ Compra protegida<br>✓ Envio para todo o Brasil<br>✓ Atendimento dedicado</p><button class="button" type="button" data-add="${p.id}">Adicionar ao carrinho</button><p class="small-note">Demonstração visual: preços e disponibilidade são ilustrativos.</p></div>`;}
function setupCart(){const root=document.querySelector('#cart-content');if(!root)return;const cart=getCart();const items=cart.map(item=>({...item,product:PRODUCTS.find(p=>p.id===item.id)})).filter(item=>item.product);const subtotal=items.reduce((sum,item)=>sum+item.product.price*item.qty,0);if(!items.length){root.innerHTML=`<div class="empty-state"><div class="empty-icon">🛍️</div><h2>Seu carrinho está vazio</h2><p>Encontre algo especial para deixar sua casa ainda melhor.</p><a class="button" href="produtos.html">Explorar produtos</a></div>`;return;}root.innerHTML=`<div class="cart-layout"><div class="cart-items">${items.map(item=>`<article class="cart-item"><img src="${item.product.image}" alt="${item.product.name}"><div><h3>${item.product.name}</h3><p>${money(item.product.price)} cada</p><div class="qty-control"><button type="button" data-qty="${item.id}" data-change="-1" aria-label="Diminuir quantidade">−</button><span>${item.qty}</span><button type="button" data-qty="${item.id}" data-change="1" aria-label="Aumentar quantidade">+</button></div><button class="remove-btn" type="button" data-remove="${item.id}">Remover</button></div><strong class="price">${money(item.product.price*item.qty)}</strong></article>`).join('')}</div><aside class="cart-summary"><h2>Resumo do pedido</h2><div class="summary-line"><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div class="summary-line"><span>Frete</span><strong>${subtotal>=199?'Grátis':'Calculado depois'}</strong></div><div class="summary-line total"><span>Total parcial</span><strong>${money(subtotal)}</strong></div><a class="button" href="checkout.html">Continuar para entrega</a><p class="secure-note">🔒 Ambiente demonstrativo. Nenhum pagamento será processado.</p></aside></div>`;}
function setupCheckout(){
 const form=document.querySelector('#checkout-form');
 if(!form)return;
 const cart=getCart().map(item=>({...item,product:PRODUCTS.find(p=>p.id===item.id)})).filter(item=>item.product&&Number(item.qty)>0);
 if(!cart.length){
  const msg=document.querySelector('#checkout-empty');if(msg)msg.hidden=false;
  form.hidden=true;return;
 }
 const subtotal=cart.reduce((sum,item)=>sum+item.product.price*item.qty,0);
 const summary=document.querySelector('#checkout-total');
 if(summary)summary.textContent=money(subtotal);
 const shipping=document.querySelector('#checkout-shipping');
 if(shipping)shipping.textContent=subtotal>=199?'Frete grátis (pedido a partir de R$ 199,00).':'Frete: confirmar com a loja antes do pagamento.';
 const itemsTarget=document.querySelector('#checkout-items');
 if(itemsTarget)itemsTarget.innerHTML='<strong>Itens:</strong><br>'+cart.map(item=>`${item.qty} × ${item.product.name} — ${money(item.product.price*item.qty)}`).join('<br>');
 form.addEventListener('submit',e=>{
  e.preventDefault();
  if(!form.reportValidity())return;
  const value=id=>document.getElementById(id)?.value.trim()||'';
  const lines=[
   '*NOVO PEDIDO — LAR & CIA*',
   '',
   '*Dados do cliente*',
   `Nome: ${value('nome')}`,
   `E-mail: ${value('email')}`,
   `Telefone: ${value('telefone')}`,
   '',
   '*Endereço de entrega*',
   `CEP: ${value('cep')}`,
   `Endereço: ${value('endereco')}`,
   `Cidade: ${value('cidade')} - ${value('estado')}`,
   '',
   '*Produtos*',
   ...cart.map(item=>`• ${item.qty} x ${item.product.name} — ${money(item.product.price)} cada = ${money(item.product.price*item.qty)}`),
   '',
   `*Subtotal dos produtos: ${money(subtotal)}*`,
   subtotal>=199?'Frete: GRÁTIS':'Frete: confirmar com a loja',
   '',
   'Solicito a confirmação do total final e o envio do link/QR Code de pagamento da Infinity Pay.'
  ];
  const url='https://wa.me/5521996381554?text='+encodeURIComponent(lines.join('\n'));
  window.open(url,'_blank','noopener,noreferrer');
 });
}
document.addEventListener('click',event=>{const add=event.target.closest('[data-add]');if(add){addToCart(add.dataset.add);return;}const remove=event.target.closest('[data-remove]');if(remove){saveCart(getCart().filter(item=>item.id!==remove.dataset.remove));setupCart();notify('Produto removido do carrinho.');return;}const qty=event.target.closest('[data-qty]');if(qty){const cart=getCart();const item=cart.find(p=>p.id===qty.dataset.qty);if(item)item.qty+=Number(qty.dataset.change);saveCart(cart.filter(p=>p.qty>0));setupCart();}});
document.querySelector('.mobile-menu')?.addEventListener('click',()=>{const nav=document.querySelector('.main-nav');const open=nav?.classList.toggle('open');document.querySelector('.mobile-menu')?.setAttribute('aria-expanded',String(!!open));});
document.querySelector('#signup')?.addEventListener('submit',event=>{event.preventDefault();notify('Obrigado! Este formulário é apenas demonstrativo.');event.target.reset();});
updateCartCount();setupProductListing();setupProductDetail();setupCart();setupCheckout();
