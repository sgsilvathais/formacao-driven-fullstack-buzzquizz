//variáveis
let quizzDoUsuario = null;

const requisitos = {
    tituloQuizz: 'O título deve ter entre 20 e 65 caracteres',
    url: 'URL inválida',
    quantidadePerguntas: 'O quiz deve ter no mínimo 3 perguntas',
    quantidadeNiveis: 'O quiz deve ter no mínimo 2 níveis',
    textoPergunta: 'A pergunta deve ter no mínimo 20 caracteres',
    corDeFundo: 'Código hexadecimal inválido',
    textoResposta: 'Necessita algum texto',
    tituloNivel: 'O título no nível deve ter no mínimo 10 caracteres',
    acertoMinimo: 'Deve ser um número entre 0 e 100',
    descricaoNivel: 'A descrição deve ter no mínimo 30 caracteres'
}

function obterQuizzes(){

    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");

    promessa.then(quizzesObtidos);
    promessa.catch(erroEmObterQuizzes);
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
    const id = quizz.id;

    const listaQuizzes = document.querySelector(".listar-quizzes");
    
    const quizzHTML = `
        <article class="quizz-capa" onclick="exibirQuizz(${id})">
            <img src=${img}>
            <h3>${titulo}</h3>
        </article> 
    `;

    listaQuizzes.innerHTML += quizzHTML;
   
}

function erroEmObterQuizzes(){
    alert("O site está indisponível =( Tente novamente mais tarde.");
}

function exibirQuizz(idQuizz){

    const listaQuizzes = document.querySelector(".listar-quizzes");
    listaQuizzes.classList.add("escondido");
    
    const promessa = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idQuizz}`);

    promessa.then(quizzObtido);
    promessa.catch(erroEmObterQuizz);
    console.log(idQuizz);
}

//criação do quizz

function criarQuizz(){
    const criacao = document.querySelector('.criacao');
    const comeco = document.querySelector('.comeco');
    criacao.classList.remove('escondido');
    comeco.classList.remove('escondido');
}

function coletarInformacoesBasicas(){
    const mensagensErro = [...document.querySelectorAll('.mensagem-erro')];
    if (mensagensErro !== null){
        mensagensErro.forEach((mensagem) => mensagem.innerHTML = '');
    }   
    let tituloQuizz = document.querySelector('.tituloQuizz').value;
    let imagemQuizz = document.querySelector('.imagem-quizz').value;
    let quantidadePerguntas = document.querySelector('.quantidadePerguntas').value;
    let quantidadeNiveis = document.querySelector('.quantidadeNiveis').value;
    if (validarInformacoesBasicas(tituloQuizz, imagemQuizz, quantidadePerguntas, quantidadeNiveis)){
        coletarPerguntas(quantidadePerguntas);
        tituloQuizz = '';
        imagemQuizz = '';
        quantidadePerguntas = '';
        quantidadeNiveis = '';
    }
}

function validarInformacoesBasicas(titulo, imagem, perguntas, niveis){
    const verificacaoTitulo = titulo.length >= 20 && titulo.length <= 65;
    const verificacaoImagem = imagem.slice(0, 4) === 'http' && imagem.slice(5, 8) === '://';
    const verificacaoPerguntas = parseInt(perguntas) >= 3;
    const verificacaoNiveis = parseInt(niveis) >= 2;
    if (verificacaoTitulo === false){
        mostrarErros('tituloQuizz');
    }
    if (verificacaoImagem === false){
        mostrarErros('url');
    }
    if (verificacaoPerguntas === false){
        mostrarErros('quantidadePerguntas');
    }
    if (verificacaoNiveis === false){
        mostrarErros('quantidadeNiveis');
    }
    verificacaoFinal = verificacaoTitulo && verificacaoImagem && verificacaoPerguntas && verificacaoNiveis;
    return verificacaoFinal
}

function mostrarErros(requisito){
    const inputErrado = document.querySelector(`.${requisito}`);
    inputErrado.classList.add('erro');
    inputErrado.parentNode.innerHTML += `
        <p class="mensagem-erro">${requisitos[requisito]}</p>
    `;
}

function coletarPerguntas(quantidade){
    const comeco = document.querySelector('.comeco');
    comeco.classList.add('escondido');
}

obterQuizzes();
