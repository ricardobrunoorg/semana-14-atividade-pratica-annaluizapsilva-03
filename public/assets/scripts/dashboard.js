const API_URL = "http://localhost:3000/looks";
 
const CORES = [
  "#4A90D9", "#E67E22", "#2ECC71", "#9B59B6",
  "#E74C3C", "#1ABC9C", "#F39C12", "#34495E"
];
 

function groupBy(arr, campo) {
  return arr.reduce((acc, item) => {
    const chave = item[campo];
    acc[chave]  = acc[chave] || [];
    acc[chave].push(item);
    return acc;
  }, {});
}
 

function renderKPIs(looks) {
  const total       = looks.length;
  const emDestaque  = looks.filter(l => l.destaque).length;
  const categorias  = [...new Set(looks.map(l => l.categoria))].length;
  const ticketMedio = looks.reduce((s, l) => s + l.preco, 0) / total;
 
  const kpis = [
    { valor: total,       label: "Looks cadastrados" },
    { valor: categorias,  label: "Categorias" },
    { valor: emDestaque,  label: "Em destaque" },
    { valor: `R$ ${ticketMedio.toFixed(2).replace(".", ",")}`, label: "Ticket médio" },
  ];
 
  const strip = document.getElementById("kpiStrip");
  strip.innerHTML = kpis.map(k => `
    <div class="kpi">
      <div class="kpi__value">${k.valor}</div>
      <div class="kpi__label">${k.label}</div>
    </div>
  `).join("");
}
 

function renderPizza(looks) {
  const grupos  = groupBy(looks, "categoria");
  const labels  = Object.keys(grupos);
  const valores = labels.map(c => grupos[c].length);
 
  new Chart(document.getElementById("chartPizza"), {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: valores,
        backgroundColor: CORES.slice(0, labels.length),
        borderColor: "#fff",
        borderWidth: 2,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "right" },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.parsed} look(s)`
          }
        }
      }
    }
  });
}
 

function renderDestaque(looks) {
  const total    = looks.length;
  const comDest  = looks.filter(l => l.destaque).length;
  const semDest  = total - comDest;
 
  new Chart(document.getElementById("chartDestaque"), {
    type: "doughnut",
    data: {
      labels: ["Em destaque", "Sem destaque"],
      datasets: [{
        data: [comDest, semDest],
        backgroundColor: ["#4A90D9", "#D5D5D5"],
        borderColor: "#fff",
        borderWidth: 2,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "55%",
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: ctx =>
              ` ${ctx.label}: ${ctx.parsed} (${Math.round(ctx.parsed / total * 100)}%)`
          }
        }
      }
    }
  });
}
 

function renderPreco(looks) {
  const grupos = groupBy(looks, "categoria");
  const labels = Object.keys(grupos);
  const medias = labels.map(cat => {
    const itens = grupos[cat];
    return +(itens.reduce((s, i) => s + i.preco, 0) / itens.length).toFixed(2);
  });
 
  
  const idx        = [...labels.keys()].sort((a, b) => medias[b] - medias[a]);
  const labelsOrd  = idx.map(i => labels[i]);
  const mediasOrd  = idx.map(i => medias[i]);
 
  new Chart(document.getElementById("chartPreco"), {
    type: "bar",
    data: {
      labels: labelsOrd,
      datasets: [{
        label: "Preço médio (R$)",
        data:  mediasOrd,
        backgroundColor: idx.map(i => CORES[i % CORES.length]),
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` R$ ${ctx.parsed.y.toFixed(2).replace(".", ",")}`
          }
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          ticks:  { callback: v => `R$ ${v}` },
          grid:   { color: "#eee" },
          border: { display: false }
        }
      }
    }
  });
}
 

async function init() {
  const statusEl = document.getElementById("status");
 
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Erro ao buscar dados.");
 
    const looks = await res.json();
 
    if (looks.length === 0) {
      statusEl.textContent = "Nenhum look cadastrado ainda.";
      return;
    }
 
    renderKPIs(looks);
    renderPizza(looks);
    renderDestaque(looks);
    renderPreco(looks);
 
  } catch (err) {
    statusEl.textContent =
      `Não foi possível carregar os dados. Verifique se o JSON Server está rodando em ${API_URL}.`;
    console.error(err);
  }
}
 
init();