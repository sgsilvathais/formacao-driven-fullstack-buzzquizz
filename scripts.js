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
    quantidadeResposta: 'Deve haver pelo menos uma resposta incorreta',
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

function quizzObtido(quiz) {
    const exibirQuiz = document.querySelector(".exibir-quizz");
    exibirQuiz.classList.remove("escondido");
    
    renderizarQuiz(quiz);
}

let perguntas = null;

function renderizarQuiz(quiz) {
    const tituloQuizz = quiz.data.title;
    const imagemCapaQuizz = quiz.data.image;
    perguntas = quiz.data.questions;
    const exibirCapaQuizz = document.querySelector(".capa-quizz-individual");
    
    exibirCapaQuizz.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${imagemCapaQuizz})`
    exibirCapaQuizz.innerHTML = `
                                <h4>${tituloQuizz}</h4>
                            `;
    
    const quadroPerguntas = document.querySelector(".perguntas");
    
    
    for(let i = 0; i < perguntas.length; i++){
        quadroPerguntas.innerHTML = quadroPerguntas.innerHTML + ` 
                                
                                <article class="caixa-quizz">
                                    <h4>${perguntas[i].title}</h4>
                                    <div class="caixa-respostas"></div>
                                </article>
                                `;
        let backgroundPergunta = document.querySelector(".caixa-quizz:last-child h4");
        backgroundPergunta.style.backgroundColor = `${perguntas[i].color}`;
        
        respostas = perguntas[i].answers;
        respostas.sort(comparador);
        
        for(let j = 0; j < respostas.length; j++) {
            const resposta = document.querySelector(".caixa-quizz:last-child div");
            
            resposta.innerHTML = resposta.innerHTML + `<figure onclick="selecionarResposta(${respostas[j].isCorrectAnswer}, this, ${i})">
                                                            <img src="${respostas[j].image}">
                                                            <figcaption>${respostas[j].text}</figcaption>
                                                        </figure>`;                                            
        }                       
    }
    
}

function comparador() { 
	return Math.random() - 0.5; 
}
    
function erroEmObterQuizz(quiz) {
    alert("O site está indisponível =( Tente novamente mais tarde.");
}

function selecionarResposta(valorDaAlternativa, alternativaSelecionada, indicePergunta) {
    const alternativas = document.querySelectorAll(`.caixa-quizz:nth-child(${indicePergunta + 1}) figure`);
    console.log(alternativas)

    alternativaSelecionada.classList.add(".selecionado");

    for(let i = 0; i < alternativas.length; i++){
            if(perguntas[indicePergunta].answers[i].isCorrectAnswer){
                alternativas[i].classList.add("resposta-certa");
            }
            else{
                alternativas[i].classList.add("resposta-errada");
            }
            if(!alternativas[i].classList.contains(".selecionado")){
                alternativas[i].classList.add("nao-selecionado");
            }
    }         
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
    let tituloQuizz = document.querySelector('.tituloQuizz');
    let imagemQuizz = document.querySelector('.imagem-quizz');
    let quantidadePerguntas = document.querySelector('.quantidadePerguntas');
    let quantidadeNiveis = document.querySelector('.quantidadeNiveis');
    if (validarInformacoesBasicas(tituloQuizz.value, imagemQuizz.value, quantidadePerguntas.value, quantidadeNiveis.value)){
        renderizarCriacaoPerguntas(quantidadePerguntas.value);
        tituloQuizz.value='';
        imagemQuizz.value='';
        quantidadePerguntas.value='';
        quantidadeNiveis.value='';
    }
}

function validarInformacoesBasicas(titulo, imagem, perguntas, niveis){
    const verificacaoTitulo = titulo.length >= 20 && titulo.length <= 65;
    const verificacaoImagem = verificarUrl(imagem);
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

function verificarUrl(url){
    return (url.slice(0, 4) === 'http' && url.slice(5, 8) === '://');
}

function mostrarErros(requisito){
    const inputErrado = document.querySelector(`.${requisito}`);
    inputErrado.classList.add('erro');
    inputErrado.parentNode.innerHTML += `
        <p class="mensagem-erro">${requisitos[requisito]}</p>
    `;
}

function renderizarCriacaoPerguntas(quantidade){
    const comeco = document.querySelector('.comeco');
    comeco.classList.add('escondido');
    const criacaoPerguntas = document.querySelector('.criacao-perguntas');
    criacaoPerguntas.classList.remove('escondido');
    criacaoPerguntas.innerHTML = '<h3>Crie suas perguntas</h3>'
    for (let i = 1; i<=quantidade; i++){
        criacaoPerguntas.innerHTML += `
        <div class="pergunta-minimizada">
            <h4>Pergunta ${i}</h4>
            <i class="fa-regular fa-pen-to-square" onclick="criarPergunta(this, ${i})"></i>
        </div>
        `
    }
    criacaoPerguntas.innerHTML += `<button onclick="coletarPerguntas()">Prosseguir pra criar níveis</button>`
}

function criarPergunta(icone, i){
    const criacaoPergunta = icone.parentNode;
    criacaoPergunta.innerHTML = `
        <h4>Pergunta ${i}</h4>
        <input type="text" placeholder="Texto da pergunta" class="textoPergunta">
        <input type="text" placeholder="Cor de fundo da pergunta" class="corDeFundo">
        <h4>Resposta correta</h4>
        <div class="resposta">
            <input type="text" placeholder="Resposta correta" class="textoResposta resposta-correta">
            <input type="text" placeholder="URL da imagem" class="url">
        </div>
        <h4>Respostas incorretas</h4>
        <div class="resposta">
            <input type="text" placeholder="Resposta incorreta 1" class="textoResposta resposta-incorreta">
            <input type="text" placeholder="URL da imagem 1" class="url">
        </div>
        <div class="resposta">
            <input type="text" placeholder="Resposta incorreta 2" class="textoResposta resposta-incorreta">
            <input type="text" placeholder="URL da imagem 2" class="url">
        </div>
        <div class="resposta">
            <input type="text" placeholder="Resposta incorreta 3" class="textoResposta resposta-incorreta">
            <input type="text" placeholder="URL da imagem 3" class="url">
        </div>
    `
    criacaoPergunta.classList.remove('pergunta-minimizada');
    criacaoPergunta.classList.add('criacao-pergunta');
}

function coletarPerguntas(){
    console.log('agora pega as informações');
    const criacaoPerguntas = document.querySelector('.criacao-perguntas');
    criacaoPerguntas.classList.add('escondido');
    const perguntas = [...document.querySelectorAll('.criacao-pergunta')];
    let validacaoPerguntas = null;
    perguntas.forEach(function(){
        const textoPergunta = document.querySelector('.textoPergunta');
        const corDeFundo = document.querySelector('.corDeFundo');
        const textoRespostas =[...document.querySelectorAll('.textoResposta')];
        const respostasIncorretas = [...document.querySelectorAll('.respostas-incorretas')];
        const url = [...document.querySelectorAll('.criacao-perguntas .url')];
        validacaoPerguntas = validacaoPerguntas && validarPerguntas(textoPergunta.value, corDeFundo.value, textoRespostas, respostasIncorretas, url);
    });
    if (validacaoPerguntas === true){
        console.log('segue em frente')
    } else{
        alert('Tem algo errado aí');
    }
}

function validarPerguntas(textoPergunta, corDeFundo, textoResposta, respostasIncorretas, url){
    const verificacaoTextoPergunta = textoPergunta.length >= 20;
    const verificacaoCorDeFundo = validarHexadecimal(corDeFundo);
    let verificacaoTextoResposta = null;
    textoResposta.forEach(function(textoResposta){
        if (textoResposta.length >= 1){
            verificacaoTextoResposta = true;
        }
    })
    const verificacaoRespostasIncorretas = respostasIncorretas.length >= 1;
    const verificacaoUrl = url.forEach(verificarUrl);
    const verificacaoFinal = verificacaoTextoPergunta && verificacaoCorDeFundo && verificacaoTextoResposta && verificacaoRespostasIncorretas && verificacaoUrl;
    return verificacaoFinal
}

function validarHexadecimal(hexadecimal){
    let verificacao = null;
    if (hexadecimal.length === 6){
        if (hexadecimal.slice(0,1) === '#'){
            for (let i = 1; i<hexadecimal; i++){
                if (!((hexadecimal[i] >= 0 && hexadecimal <= 9) ||(hexadecimal[i].toUpperCase().charCodeAt(0) <=65 && hexadecimal[i].toUpperCase().charCodeAt(0) >= 70))){
                    return false
                }
            }
            return true
        } else{
            return false
        }
    } else{
        return false
    }
}

// obterQuizzes();
