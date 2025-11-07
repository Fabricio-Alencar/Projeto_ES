// ================================
// SELEÇÃO DE ELEMENTOS
// ================================
const botaoCriar = document.querySelector(".botao-criar");
const bloco = document.getElementById("bloco-criacao");
const cancelar = document.getElementById("cancelarBloco");
const botaoSalvar = document.getElementById("salvarBloco");

// ================================
// RECUPERA O ID DO IDEALIZADOR (GLOBAL)
// ================================
let idIdealizador = window.idIdealizadorGlobal || localStorage.getItem("id_idealizador");


// ================================
// MOSTRAR E FECHAR BLOCO DE CRIAÇÃO
// ================================
botaoCriar.addEventListener("click", () => {
  bloco.style.display = "flex";
});

cancelar.addEventListener("click", () => {
  bloco.style.display = "none";
});

bloco.addEventListener("click", (e) => {
  if (e.target === bloco) bloco.style.display = "none";
});

// ================================
// ADICIONAR/REMOVER INPUTS DINÂMICOS
// ================================
const blocosDireita = document.querySelectorAll(".bloco_direita");

blocosDireita.forEach((bloco) => {
  const btnAdd = bloco.querySelector(".btn_add");
  const btnRemove = bloco.querySelector(".btn_remove");
  const containerInputs = bloco.querySelector(".inputs_bloco");

  const isTecnologias = bloco.id === "bloco-tecnologias";
  let contador = containerInputs.children.length + 1;

  btnAdd.addEventListener("click", () => {
    const novoInput = document.createElement("input");
    novoInput.type = "text";
    novoInput.placeholder = `${isTecnologias ? "Tecnologia" : "Repositório"}: ${contador}`;
    novoInput.classList.add(isTecnologias ? "input_bloco_flex" : "input_bloco");
    containerInputs.appendChild(novoInput);
    contador++;
  });

  btnRemove.addEventListener("click", () => {
    const inputs = containerInputs.querySelectorAll(isTecnologias ? ".input_bloco_flex" : ".input_bloco");
    if (inputs.length > 0) {
      containerInputs.removeChild(inputs[inputs.length - 1]);
      contador--;
    }
  });
});

// ================================
// SALVAR NOVO PROJETO VIA API
// ================================
botaoSalvar.addEventListener("click", async () => {
  // Pega valores do formulário
  const nome = document.querySelector('input[placeholder="Nome do Projeto"]').value.trim();
  const descricao = document.querySelector('textarea[placeholder="Descrição do Projeto"]').value.trim();
  const nivel = document.querySelector("#nivelProjeto").value;
  const categoria = document.querySelector('input[placeholder="Categoria do Projeto"]').value.trim() || "Geral";
  const status = "Em andamento";

  // Blocos de tecnologias e repositórios
  const blocoTecnologias = document.getElementById("bloco-tecnologias");
  const blocoRepositorios = document.getElementById("bloco-repositorios");

  // Validação básica
  if (!nome || !descricao || !nivel || !categoria) {
    alert("Preencha todos os campos obrigatórios! [Nome, Dificuldade, Descrição, Categoria]");
    return;
  }

  try {
    // 1️⃣ Criar projeto com o id do idealizador dinâmico
    const response = await fetch("http://127.0.0.1:8000/projetos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        id_idealizador: parseInt(idIdealizador),
        nivel,
        categoria,
        descricao,
        status
      })
    });

    if (!response.ok) throw new Error("Erro ao criar projeto");
    const data = await response.json();
    const projetoId = data.projeto.id;
    console.log("✅ Projeto criado:", data);

    // 2️⃣ Criar tecnologias
    const inputsTecnologias = blocoTecnologias.querySelectorAll(".input_bloco_flex");
    for (const input of inputsTecnologias) {
      if (input.value.trim() !== "") {
        await fetch("http://127.0.0.1:8000/tecnologias", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome: input.value.trim(), id_projeto: projetoId })
        });
      }
    }

    // 3️⃣ Criar repositórios
    const inputsRepos = blocoRepositorios.querySelectorAll(".input_bloco");
    for (const input of inputsRepos) {
      if (input.value.trim() !== "") {
        await fetch("http://127.0.0.1:8000/repositorios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome: input.value.trim(), id_projeto: projetoId })
        });
      }
    }

    // ✅ 4️⃣ Renderiza imediatamente os projetos do idealizador
    if (typeof carregarProjetos === "function") {
      console.log("🔄 Atualizando lista de projetos...");
      await carregarProjetos(parseInt(idIdealizador)); // garante renderização correta por idealizador
    }

    // ✅ 5️⃣ Limpa formulário e fecha bloco
    bloco.style.display = "none";
    document.querySelector('input[placeholder="Nome do Projeto"]').value = "";
    document.querySelector('textarea[placeholder="Descrição do Projeto"]').value = "";
    document.querySelector("#nivelProjeto").selectedIndex = 0;
    document.querySelector('input[placeholder="Categoria do Projeto"]').value = "";
    inputsTecnologias.forEach(i => i.value = "");
    inputsRepos.forEach(i => i.value = "");

    carregarProjetos();

  } catch (error) {
    console.error("❌ Erro ao criar projeto:", error);
    alert("Erro ao criar projeto. Verifique o console para mais detalhes.");
  }
});
