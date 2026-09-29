let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

const formProduto = document.getElementById("formProduto");
const listaProdutos = document.getElementById("listaProdutos");
const pesquisa = document.getElementById("pesquisa");

formProduto.addEventListener("submit", function(event) {

    event.preventDefault();

    const codigo = document.getElementById("codigo").value.trim();
    const nome = document.getElementById("nome").value.trim();
    const categoria = document.getElementById("categoria").value.trim();
    const quantidade = Number(document.getElementById("quantidade").value);
    const preco = Number(document.getElementById("preco").value);

    const produtoExistente = produtos.find(
        produto => produto.codigo.toLowerCase() === codigo.toLowerCase()
    );

    if (produtoExistente) {
        alert("Já existe um produto com esse código.");
        return;
    }

    const novoProduto = {
        id: Date.now(),
        codigo,
        nome,
        categoria,
        quantidade,
        preco
    };

    produtos.push(novoProduto);

    salvarProdutos();
    mostrarProdutos();
    atualizarDashboard();

    formProduto.reset();

    alert("Produto cadastrado com sucesso!");
});


function salvarProdutos() {

    localStorage.setItem(
        "produtos",
        JSON.stringify(produtos)
    );

}


function mostrarProdutos() {

    const termo = pesquisa.value.toLowerCase();

    listaProdutos.innerHTML = "";

    const produtosFiltrados = produtos.filter(produto =>

        produto.nome.toLowerCase().includes(termo) ||
        produto.codigo.toLowerCase().includes(termo) ||
        produto.categoria.toLowerCase().includes(termo)

    );

    produtosFiltrados.forEach(produto => {

        const tr = document.createElement("tr");

        const valorTotal = produto.quantidade * produto.preco;

        const classeQuantidade =
            produto.quantidade <= 5
                ? "estoque-baixo"
                : "";

        tr.innerHTML = `

            <td>${produto.codigo}</td>

            <td>${produto.nome}</td>

            <td>${produto.categoria}</td>

            <td class="${classeQuantidade}">
                ${produto.quantidade}
            </td>

            <td>
                ${formatarMoeda(produto.preco)}
            </td>

            <td>
                ${formatarMoeda(valorTotal)}
            </td>

            <td>

                <button
                    class="btn-entrada"
                    onclick="entradaEstoque(${produto.id})">
                    + Entrada
                </button>

                <button
                    class="btn-saida"
                    onclick="saidaEstoque(${produto.id})">
                    - Saída
                </button>

                <button
                    class="btn-excluir"
                    onclick="excluirProduto(${produto.id})">
                    Excluir
                </button>

            </td>
        `;

        listaProdutos.appendChild(tr);

    });

}


function entradaEstoque(id) {

    const produto = produtos.find(
        produto => produto.id === id
    );

    if (!produto) return;

    const quantidade = Number(
        prompt("Digite a quantidade de entrada:")
    );

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        alert("Digite uma quantidade válida.");
        return;
    }

    produto.quantidade += quantidade;

    salvarProdutos();
    mostrarProdutos();
    atualizarDashboard();

}


function saidaEstoque(id) {

    const produto = produtos.find(
        produto => produto.id === id
    );

    if (!produto) return;

    const quantidade = Number(
        prompt("Digite a quantidade de saída:")
    );

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        alert("Digite uma quantidade válida.");
        return;
    }

    if (quantidade > produto.quantidade) {
        alert("Não há quantidade suficiente no estoque.");
        return;
    }

    produto.quantidade -= quantidade;

    salvarProdutos();
    mostrarProdutos();
    atualizarDashboard();

}


function excluirProduto(id) {

    const produto = produtos.find(
        produto => produto.id === id
    );

    if (!produto) return;

    const confirmar = confirm(
        `Deseja realmente excluir "${produto.nome}"?`
    );

    if (!confirmar) return;

    produtos = produtos.filter(
        produto => produto.id !== id
    );

    salvarProdutos();
    mostrarProdutos();
    atualizarDashboard();

}


function atualizarDashboard() {

    const totalProdutos = produtos.length;

    const totalItens = produtos.reduce(
        (total, produto) => total + produto.quantidade,
        0
    );

    const valorEstoque = produtos.reduce(
        (total, produto) =>
            total + produto.quantidade * produto.preco,
        0
    );

    const estoqueBaixo = produtos.filter(
        produto => produto.quantidade <= 5
    ).length;


    document.getElementById("totalProdutos").textContent =
        totalProdutos;

    document.getElementById("totalItens").textContent =
        totalItens;

    document.getElementById("valorEstoque").textContent =
        formatarMoeda(valorEstoque);

    document.getElementById("estoqueBaixo").textContent =
        estoqueBaixo;

}


function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


pesquisa.addEventListener(
    "input",
    mostrarProdutos
);


mostrarProdutos();
atualizarDashboard();