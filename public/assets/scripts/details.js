const params = new URLSearchParams(window.location.search);
const id     = params.get("id");
const container = document.getElementById("detalhes");
 
if (!id) {
  container.innerHTML = "<h2>ID não informado.</h2>";
} else {
  fetch(`http://localhost:3000/looks/${id}`)
    .then(res => {
      if (!res.ok) throw new Error("Look não encontrado.");
      return res.json();
    })
    .then(item => {
      container.innerHTML = `
        <img src="${item.imagem}" alt="${item.nome}">
        <h1>${item.nome}</h1>
        ${item.destaque ? '<span class="tag" style="background:#222;color:#fff;">★ Destaque</span>' : ""}
        <p><strong>Categoria:</strong> ${item.categoria}</p>
        <p><strong>Preço:</strong> R$ ${item.preco.toFixed(2).replace(".", ",")}</p>
        <p style="margin-top:12px;">${item.descricaoCompleta}</p>
        <h3 style="margin:16px 0 8px;">Tags</h3>
        <ul class="tags-lista">
          ${item.tags.map(tag => `<li class="tag">${tag}</li>`).join("")}
        </ul>
        <div style="display:flex;gap:10px;margin-top:24px;">
          <a href="index.html" class="btn-secondary">← Voltar</a>
          <a href="form.html?id=${item.id}" class="btn-primary">Editar</a>
        </div>
      `;
    })
    .catch(err => {
      container.innerHTML = `<h2>${err.message}</h2><a href="index.html" class="btn-secondary">← Voltar</a>`;
    });
}