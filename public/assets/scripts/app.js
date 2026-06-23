const API_LOOKS = "http://localhost:3000/looks";
const API_CATS  = "http://localhost:3000/categorias";
 
let todosLooks = [];
 

async function carregarCategorias() {
  const res  = await fetch(API_CATS);
  const cats = await res.json();
 
  const select = document.getElementById("filtroCategoria");
  cats.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.nome;
    opt.textContent = cat.nome;
    select.appendChild(opt);
  });
}
 
async function carregarLooks() {
  const res  = await fetch(API_LOOKS);
  todosLooks = await res.json();
  renderCards(todosLooks);
}
 

function renderCards(looks) {
  const container = document.getElementById("cards");
  container.innerHTML = "";
 
  if (looks.length === 0) {
    container.innerHTML = "<p>Nenhum look encontrado.</p>";
    return;
  }
 
  looks.forEach(item => container.appendChild(criarCard(item)));
}
 
function criarCard(item) {
  const card = document.createElement("div");
  card.classList.add("card");
 
  card.innerHTML = `
    ${item.destaque ? '<span class="badge-destaque">★ Destaque</span>' : ""}
    <img src="${item.imagem}" alt="${item.nome}">
    <h2>${item.nome}</h2>
    <p>${item.descricaoCurta}</p>
    <p><strong>${item.categoria}</strong></p>
    <p class="preco">R$ ${item.preco.toFixed(2).replace(".", ",")}</p>
    <div class="card-links">
      <a class="btn-detalhe" href="details.html?id=${item.id}">Ver detalhes</a>
      <a class="btn-editar"  href="form.html?id=${item.id}">Editar</a>
      <button class="btn-excluir" onclick="excluir(${item.id})">Excluir</button>
    </div>
  `;
 
  return card;
}
 

function aplicarFiltros() {
  const busca     = document.getElementById("filtroBusca").value.toLowerCase();
  const categoria = document.getElementById("filtroCategoria").value;
  const destaque  = document.getElementById("filtroDestaque").value;
 
  const filtrados = todosLooks.filter(look => {
    const matchBusca     = look.nome.toLowerCase().includes(busca) ||
                           look.descricaoCurta.toLowerCase().includes(busca);
    const matchCategoria = !categoria || look.categoria === categoria;
    const matchDestaque  = destaque === ""
      ? true
      : destaque === "sim"
        ? look.destaque === true
        : look.destaque === false;
 
    return matchBusca && matchCategoria && matchDestaque;
  });
 
  renderCards(filtrados);
}
 

async function excluir(id) {
  if (!confirm("Deseja excluir este look?")) return;
 
  await fetch(`${API_LOOKS}/${id}`, { method: "DELETE" });
  await carregarLooks();
}
 

async function init() {
  await carregarCategorias();
  await carregarLooks();
 
  document.getElementById("filtroBusca").addEventListener("input", aplicarFiltros);
  document.getElementById("filtroCategoria").addEventListener("change", aplicarFiltros);
  document.getElementById("filtroDestaque").addEventListener("change", aplicarFiltros);
}
 
init();