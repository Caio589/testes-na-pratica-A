let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let carrinho = [];
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];
let caixaAberto = JSON.parse(localStorage.getItem("caixa")) || false;

function salvar() {
  localStorage.setItem("produtos", JSON.stringify(produtos));
  localStorage.setItem("vendas", JSON.stringify(vendas));
  localStorage.setItem("caixa", JSON.stringify(caixaAberto));
}

function addProduto() {
  produtos.push({
    nome: nomeProd.value,
    preco: parseFloat(precoProd.value),
    estoque: parseInt(estoqueProd.value)
  });
  salvar();
  listarProdutos();
}

function listarProdutos() {
  listaProdutos.innerHTML = "";
  prodVenda.innerHTML = "";
  produtos.forEach((p, i) => {
    listaProdutos.innerHTML += `<li>${p.nome} - R$${p.preco} | Est: ${p.estoque}</li>`;
    prodVenda.innerHTML += `<option value="${i}">${p.nome}</option>`;
  });
}

function addCarrinho() {
  const p = produtos[prodVenda.value];
  if (p.estoque <= 0) return alert("Sem estoque");
  carrinho.push(p);
  p.estoque--;
  atualizarCarrinho();
  listarProdutos();
  salvar();
}

function atualizarCarrinho() {
  carrinhoEl = document.getElementById("carrinho");
  carrinhoEl.innerHTML = "";
  let total = 0;
  carrinho.forEach(p => {
    total += p.preco;
    carrinhoEl.innerHTML += `<li>${p.nome} - R$${p.preco}</li>`;
  });
  document.getElementById("total").innerText = total.toFixed(2);

  const pago = parseFloat(valorPago.value || 0);
  document.getElementById("troco").innerText = (pago - total).toFixed(2);
}

valorPago?.addEventListener("input", atualizarCarrinho);

function finalizarVenda() {
  if (!caixaAberto) return alert("Caixa fechado!");
  vendas.push({
    total: total.innerText,
    pagamento: pagamento.value,
    data: new Date().toLocaleString()
  });
  carrinho = [];
  atualizarCarrinho();
  listarVendas();
  salvar();
}

function listarVendas() {
  vendasEl.innerHTML = "";
  vendas.forEach(v => {
    vendasEl.innerHTML += `<li>${v.data} - R$${v.total} (${v.pagamento})</li>`;
  });
}

function abrirCaixa() {
  caixaAberto = true;
  caixaStatus.innerText = "Caixa: Aberto";
  salvar();
}

function fecharCaixa() {
  caixaAberto = false;
  caixaStatus.innerText = "Caixa: Fechado";
  salvar();
}

function resetar() {
  if (confirm("Resetar demonstração?")) {
    localStorage.clear();
    location.reload();
  }
}

listarProdutos();
listarVendas();
caixaStatus.innerText = caixaAberto ? "Caixa: Aberto" : "Caixa: Fechado";
