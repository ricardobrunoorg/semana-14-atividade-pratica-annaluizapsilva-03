const API_LOOKS = "http://localhost:3000/looks";
const API_CATS  = "http://localhost:3000/categorias";
 
const params = new URLSearchParams(window.location.search);
const id     = params.get("id");
const isEdit = !!id;
 

async function carregarCategorias() {
  const res  = await fetch(API_CATS);
  const cats = await res.json();
  const select = document.getElementById("categoria");
 
  cats.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.nome;
    opt.textContent = cat.nome;
    select.appendChild(opt);
  });
}
 

async function carregarLook() {
  const res  = await fetch(`${API_LOOKS}/${id}`);
  const look = await res.json();
 
  document.getElementById("nome").value            = look.nome;
  document.getElementById("descricaoCurta").value  = look.descricaoCurta;
  document.getElementById("descricaoCompleta").value = look.descricaoCompleta;
  document.getElementById("imagem").value          = look.imagem;
  document.getElementById("categoria").value       = look.categoria;
  document.getElementById("preco").value           = look.preco;
  document.getElementById("tags").value            = look.tags.join(", ");
  document.getElementById("destaque").checked      = look.destaque;
}
 

async function salvar(e) {
  e.preventDefault();
 
  const msgEl = document.getElementById("msg");
  msgEl.className = "msg";
  msgEl.textContent = "";
 
  const tagsRaw = document.getElementById("tags").value;
  const tags    = tagsRaw
    .split(",")
    .map(t => t.trim().toLowerCase())
    .filter(t => t.length > 0);
 
  const dados = {
    nome:              document.getElementById("nome").value.trim(),
    descricaoCurta:    document.getElementById("descricaoCurta").value.trim(),
    descricaoCompleta: document.getElementById("descricaoCompleta").value.trim(),
    imagem:            document.getElementById("imagem").value.trim(),
    categoria:         document.getElementById("categoria").value,
    preco:             parseFloat(document.getElementById("preco").value),
    tags,
    destaque:          document.getElementById("destaque").checked,
  };
 
  
  if (!dados.nome || !dados.categoria || isNaN(dados.preco)) {
    msgEl.textContent = "Preencha os campos obrigatórios: nome, categoria e preço.";
    msgEl.className   = "msg error";
    return;
  }
 
  try {
    if (isEdit) {
      await fetch(`${API_LOOKS}/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(dados),
      });
    } else {
      await fetch(API_LOOKS, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(dados),
      });
    }
 
    msgEl.textContent = isEdit ? "Look atualizado com sucesso!" : "Look criado com sucesso!";
    msgEl.className   = "msg success";
 
    setTimeout(() => { window.location.href = "index.html"; }, 1200);
  } catch {
    msgEl.textContent = "Erro ao salvar. Verifique se o JSON Server está rodando.";
    msgEl.className   = "msg error";
  }
}
 

async function init() {
  document.getElementById("form-titulo").textContent = isEdit ? "Editar Look" : "Novo Look";
  document.title = isEdit ? "Editar Look" : "Novo Look";
 
  await carregarCategorias();
  if (isEdit) await carregarLook();
 
  document.getElementById("formLook").addEventListener("submit", salvar);
}
 
init();