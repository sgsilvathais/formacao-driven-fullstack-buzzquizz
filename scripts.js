//variáveis
let quizzDoUsuario = null;

//obterQuizzes();

function obterQuizzes(){

    const promessa = axios.get("mock-api.driven.com.br/api/v4/buzzquizz/quizzes");

    promessa.then(quizzesObtidos);

}

function quizzesObtidos(quizzes){

    let listaQuizzes = document.querySelector("main");
    listaQuizzes.innerHTML = `
        <h2>Todos os Quizzes</h2>
    `;

    quizzes.foreach(renderizaCapaDoQuizz);

}

function renderizaCapaDoQuizz(quizz){

   
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