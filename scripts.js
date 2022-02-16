//variáveis
let quizzDoUsuario = null;

function obterQuizzes(){

    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");

    promessa.then(quizzesObtidos);
}

function quizzesObtidos(quizzes){

    const listaQuizzes = document.querySelector(".listar-quizzes");

    listaQuizzes.classList.remove("escondido");

    listaQuizzes.innerHTML = `
        <h2>Todos os Quizzes</h2>
    `;

    console.log(quizzes);
    quizzes.data.forEach(renderizarCapaDoQuizz);

}

function renderizarCapaDoQuizz(quizz){
    const titulo = quizz.title;
    const img = quizz.image;

    const listaQuizzes = document.querySelector(".listar-quizzes");
    
    const quizzHTML = `
        <article class="quizz-capa" onclick="exibirQuizz(this)">
            <img src=${img}>
            <h3>${titulo}</h3>
        </article> 
    `;

    listaQuizzes.innerHTML += quizzHTML;
   
}

function exibirQuizz(quizz){

    const listaQuizzes = document.querySelector(".listar-quizzes");
    listaQuizzes.classList.add("escondido");

    // THAIS >>> vc tem que editar a partir daqui
}

//criação do quizz

function criarQuizz(){
    const criacao = document.querySelector('.criacao');
    criacao.classList.remove('escondido');
}

function coletarInformacoesBasicas(){
    const tituloQuizz = document.querySelector('.titulo-quizz').value;
    const imagemQuizz = document.querySelector('.imagem-quizz').value;
    const quantidadePerguntas = document.querySelector('.quantidade-perguntas').value;
    const quantidadeNiveis = document.querySelector('.quantidade-niveis').value;
    if (validarInformacoesBasicas(tituloQuizz, imagemQuizz, quantidadePerguntas, quantidadeNiveis)){
        coletarPerguntas(quantidadePerguntas);
    } else {
        alert('Preencha as informações corretamente!');
    }
}

function validarInformacoesBasicas(titulo, imagem, perguntas, niveis){
    const verificacaoTitulo = titulo.length >= 20 && titulo.length <= 65;
    const verificacaoImagem = imagem.slice(0, 4) === 'http' && imagem.slice(5, 8) === '://';
    const verificacaoPerguntas = parseInt(perguntas) >= 3;
    const verificacaoNiveis = parseInt(niveis) >= 2;
    const verificacaoFinal = verificacaoTitulo && verificacaoImagem && verificacaoPerguntas && verificacaoNiveis;
    return verificacaoFinal
}

function coletarPerguntas(quantidade){
    const comeco = document.querySelector('.comeco');
    comeco.classList.add('escondido');
}

obterQuizzes();
