//variáveis
let quizzDoUsuario = {};

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

    checarQuizzesDoUsuario(quizzes);

    listaQuizzes.innerHTML += `
        <h2>Todos os Quizzes</h2>
    `;

    quizzes.data.forEach(renderizarCapaDoQuizz);

}

function checarQuizzesDoUsuario(quizzes){

    let quizzesDoUsuario = (quizzes.data).filter(filtrarQuizzesDoUsuario);

    const listaQuizzes = document.querySelector(".listar-quizzes");
    
    if (quizzesDoUsuario.length === 0){
        
        listaQuizzes.innerHTML=`
            <nav class="container-botao-adicionar">
                <p>Você não criou nenhum quizz ainda :(</p>
                <button class="botao-adicionar" onclick="criarQuizz()">Criar Quizz</button>
            </nav>
        `;

    } else {

        const listaQuizzes = document.querySelector(".listar-quizzes");

        listaQuizzes.innerHTML += `
        <header class="quizzes-usuario-header">
            <h2>Seus Quizzes</h2>
                <button onclick="criarQuizz()">
                    <img src="./icons/add-button.svg" alt="Botão de adicionar">
                </button>
            </header>
        `;

        quizzesDoUsuario.forEach(renderizarCapaDoQuizz);

    }
}

function filtrarQuizzesDoUsuario(quizz){
    
    const idsString = localStorage.getItem("idsQuizzesCriados");  

    if (idsString !== null){
        const idsArray = JSON.parse(idsString);

        for (let i = 0; i < idsArray.length; i++){
            if (quizz.id === idsArray[i]){
                return true;
            }
        }

        return false;
    } else {
        return false;
    } 
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
       
    setTimeout(function(){
        const caixaPergunta = document.querySelector(`.caixa-quizz:nth-child(${indicePergunta + 2})`);

        caixaPergunta.scrollIntoView({block: "center", behavior: "smooth"});
    }, 2000);
}

// function scrollarParaProximaPergunta(){
//     const caixaPergunta = document.querySelector(`.caixa-quizz:nth-child(${indicePergunta + 2}) figure`);

//     caixaPergunta.scrollIntoView({block: "end", behavior: "smooth"});
// }

//criação do quizz

function criarQuizz(){
    const listaQuizzes = document.querySelector(".listar-quizzes");
    listaQuizzes.classList.add("escondido");

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
        quizzDoUsuario.title = tituloQuizz.value;
        quizzDoUsuario.image = imagemQuizz.value;
        // console.log(quizzDoUsuario);
        renderizarCriacaoPerguntas(quantidadePerguntas.value, quantidadeNiveis.value);
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
    const extensoesImagem = ['png', 'jpg', 'gif']
    return ((url.slice(0, 8) === 'https://' || url.slice(0, 7) === 'http://') && (extensoesImagem.includes(url.slice(-3))));
}

function mostrarErros(requisito){
    const inputErrado = document.querySelector(`.${requisito}`);
    inputErrado.classList.add('erro');
    inputErrado.parentNode.innerHTML += `
        <p class="mensagem-erro">${requisitos[requisito]}</p>
    `;
}

function renderizarCriacaoPerguntas(quantidadePerguntas, quantidadeNiveis){
    const comeco = document.querySelector('.comeco');
    comeco.classList.add('escondido');
    const criacaoPerguntas = document.querySelector('.criacao-perguntas');
    criacaoPerguntas.classList.remove('escondido');
    criacaoPerguntas.innerHTML = '<h3>Crie suas perguntas</h3>'
    for (let i = 1; i<=quantidadePerguntas; i++){
        criacaoPerguntas.innerHTML += `
        <div class="pergunta-minimizada">
            <h4>Pergunta ${i}</h4>
            <i class="fa-regular fa-pen-to-square" onclick="criarPergunta(this, ${i})"></i>
        </div>
        `
    }
    criacaoPerguntas.innerHTML += `<button onclick="coletarPerguntas(${quantidadeNiveis})">Prosseguir pra criar níveis</button>`
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
            <input type="text" placeholder="URL da imagem" class="url imagem-correta">
        </div>
        <h4>Respostas incorretas</h4>
        <div class="resposta">
            <input type="text" placeholder="Resposta incorreta 1" class="textoResposta resposta-incorreta resposta-incorreta1">
            <input type="text" placeholder="URL da imagem 1" class="url imagem-incorreta1">
        </div>
        <div class="resposta">
            <input type="text" placeholder="Resposta incorreta 2" class="textoResposta resposta-incorreta resposta-incorreta2">
            <input type="text" placeholder="URL da imagem 2" class="url imagem-incorreta2">
        </div>
        <div class="resposta">
            <input type="text" placeholder="Resposta incorreta 3" class="textoResposta resposta-incorreta resposta-incorreta">
            <input type="text" placeholder="URL da imagem 3" class="url imagem-incorreta1">
        </div>
    `
    criacaoPergunta.classList.remove('pergunta-minimizada');
    criacaoPergunta.classList.add('criacao-pergunta');
}

function coletarPerguntas(quantidadeNiveis){
    const perguntas = [...document.querySelectorAll('.criacao-pergunta')];
    quizzDoUsuario.questions = []
    let validacaoPerguntas = true;
    let i = 0;
    perguntas.forEach(function(pergunta){
        const textoPergunta = pergunta.querySelector('.textoPergunta');
        const corDeFundo = pergunta.querySelector('.corDeFundo');
        const textoRespostas =[...pergunta.querySelectorAll('.textoResposta')];
        const respostasIncorretas = [...pergunta.querySelectorAll('.resposta-incorreta')];
        const url = [...pergunta.querySelectorAll('.criacao-perguntas .url')];
        const validacaoPergunta = validarPerguntas(textoPergunta.value, corDeFundo.value, textoRespostas, respostasIncorretas, url);
        console.log(`validacao da pergunta: ${validacaoPergunta}`);
        if (validacaoPergunta === true){
            quizzDoUsuario.questions.push({});
            quizzDoUsuario.questions[i].title = textoPergunta.value;
            quizzDoUsuario.questions[i].color = corDeFundo.value;
            quizzDoUsuario.questions[i].answers = [];
            let j = 0;
            textoRespostas.forEach((texto)=>{
                quizzDoUsuario.questions[i].answers.push({})
                quizzDoUsuario.questions[i].answers[j].text = texto.value;
                if (texto.classList.contains('resposta-correta')){
                    quizzDoUsuario.questions[i].answers[j].isCorrectAnswer = true;
                } else if (texto.classList.contains('resposta-incorreta')){
                    quizzDoUsuario.questions[i].answers[j].isCorrectAnswer = false;
                }
                j++;
            })
            j = 0;
            url.forEach((imagem)=>{
                quizzDoUsuario.questions[i].answers[j].image = imagem.value;
                j++;
            })
            i++;
        }
        validacaoPerguntas = validacaoPerguntas && validacaoPergunta;
    });
    if (validacaoPerguntas === true){
        renderizarCriacaoNiveis(quantidadeNiveis);
    } else{
        alert('Tem algo errado aí');
    }
}

function validarPerguntas(textoPergunta, corDeFundo, textoResposta, respostasIncorretas, url){
    const verificacaoTextoPergunta = textoPergunta.length >= 20;
    const verificacaoCorDeFundo = validarHexadecimal(corDeFundo);
    let verificacaoTextoResposta = true;
    textoResposta.forEach(function(texto){
        if (texto.value.length >= 1){
            verificacaoTextoResposta = verificacaoTextoResposta && true;
        }
    })
    const verificacaoRespostasIncorretas = respostasIncorretas.length >= 1;
    let verificacaoUrl = true;
    url.forEach((imagem) => verificacaoUrl = verificacaoUrl && verificarUrl(imagem.value));
    
    const verificacaoFinal = verificacaoTextoPergunta && verificacaoCorDeFundo && verificacaoTextoResposta && verificacaoRespostasIncorretas && verificacaoUrl;
    // console.log(`texto:${verificacaoTextoPergunta}`);
    // console.log(`cor: ${verificacaoCorDeFundo}`);
    // console.log(`texto resposta: ${verificacaoTextoResposta}`);
    // console.log(`resposta incorretas: ${verificacaoRespostasIncorretas}`);
    // console.log(`url: ${verificacaoUrl}`);
    // console.log(`verificacaoFinal: ${verificacaoFinal}`);
    return verificacaoFinal
}

function validarHexadecimal(hexadecimal){
    let verificacao = null;
    console.log(hexadecimal.length);
    if (hexadecimal.length === 7){
        if (hexadecimal.slice(0,1) === '#'){
            for (let i = 1; i<hexadecimal; i++){
                if (!((hexadecimal[i] >= 0 && hexadecimal <= 9) ||(hexadecimal.toUpperCase().charCodeAt(i) <=65 && hexadecimal.toUpperCase().charCodeAt(i) >= 70))){
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

function renderizarCriacaoNiveis(quantidadeNiveis){
    const criacaoPergunta = document.querySelector('.criacao-perguntas');
    criacaoPergunta.classList.add('escondido');
    const criacaoNiveis = document.querySelector('.criacao-niveis');
    criacaoNiveis.classList.remove('escondido');
    criacaoNiveis.innerHTML = `
        <h3>Agora, decida os níveis</h3>
    `
    for (let i = 1; i<=quantidadeNiveis; i++){
        criacaoNiveis.innerHTML += `
            <div class="nivel-minimizado">
                <h4>Nível ${i}</h4>
                <i class="fa-regular fa-pen-to-square" onclick="criarNivel(this, ${i})"></i>
            </div>
        `
    }

    criacaoNiveis.innerHTML += `
        <button onclick = "coletarNiveis()">Finalizar Quizz</button>
    `
}

function criarNivel(icone, i){
    const criacaoNivel = icone.parentNode;
    criacaoNivel.innerHTML = `
        <h4>Nível ${i}</h4>
        <input type="text" placeholder="Título do nível" class="tituloNivel">
        <input type="text" placeholder="% de acerto mínima" class="acertoMinimo">
        <input type="text" placeholder="URL da imagem do nível" class="url">
        <textarea placeholder="Descrição do nível" class="descricaoNivel" cols="30" rows="10"></textarea>
    `
    criacaoNivel.classList.remove('nivel-minimizado');
    criacaoNivel.classList.add('criacao-nivel')
}

function coletarNiveis(){
    const niveis = [...document.querySelectorAll('.criacao-nivel')];
    let validacaoNiveis = true;
    let i = 0;
    quizzDoUsuario.levels = [];
    niveis.forEach(function(nivel){
        const tituloNivel = nivel.querySelector('.tituloNivel');
        const acertoMinimo = nivel.querySelector('.acertoMinimo');
        const url = nivel.querySelector('.criacao-niveis .url');
        const descricaoNivel = nivel.querySelector('.descricaoNivel');
        const validacaoNivel = validarNivel(tituloNivel.value, acertoMinimo.value, url.value, descricaoNivel.value);
        if (validacaoNivel === true){
            quizzDoUsuario.levels.push({});
            quizzDoUsuario.levels[i].title = tituloNivel.value;
            quizzDoUsuario.levels[i].image = url.value;
            quizzDoUsuario.levels[i].text = descricaoNivel.value;
            quizzDoUsuario.levels[i].minValue = parseInt(acertoMinimo.value);
            i++;
        }
        validacaoNiveis = validacaoNiveis && validacaoNivel;
    });
    // console.log(`validacao antes do 0: ${validacaoNiveis}`);
    let validacaoMinimoZero = false;
    quizzDoUsuario.levels.forEach((level)=> {
        if (level.minValue === 0){
            // console.log(`acerto minimo: ${level.minValue}`);
            validacaoMinimoZero = true;
        }
    });
    validacaoNiveis = validacaoNiveis && validacaoMinimoZero;
    // console.log(`validacao depois do 0: ${validacaoNiveis}`);
    if (validacaoNiveis === true){
        enviarQuizz(quizzDoUsuario);

    } else{
        alert('Tem algo errado aí')
    }
}

function validarNivel(tituloNivel, acertoMinimo, url, descricaoNivel){
    const validacaoTituloNivel = tituloNivel.length >= 10;
    const validacaoAcertoMinimo = parseInt(acertoMinimo) >= 0 && parseInt(acertoMinimo) <= 100;
    const validacaoUrl = verificarUrl(url);
    const validacaoDescricaoNivel = descricaoNivel.length >= 30;
    const validacaoFinal = validacaoTituloNivel && validacaoAcertoMinimo && validacaoUrl && validacaoDescricaoNivel;
    return validacaoFinal
}

function enviarQuizz(quiz){
    const criacaoNiveis = document.querySelector('.criacao-niveis');
    criacaoNiveis.classList.add('escondido');    
    console.log(quiz);
    const promessa = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', quiz);
    console.log('enviando');
    promessa.then(salvarQuizzDoUsuario);
    promessa.catch(erroNoEnvio);
}

function erroNoEnvio(){
    alert('não deu não');
    criarQuizz();
}

function salvarQuizzDoUsuario(quizz){
    const idQuizzCriado = quizz.data.id;
   
    if (localStorage.getItem("idsQuizzesCriados") === null){
        localStorage.setItem("idsQuizzesCriados","[]");      
    }

    let idsString = localStorage.getItem("idsQuizzesCriados");
    let idsArray = JSON.parse(idsString);
    idsArray.push(idQuizzCriado);
    idsString = JSON.stringify(idsArray);
    localStorage.setItem("idsQuizzesCriados", idsString);
    
    const passaOQuizz = quizz.data;
    renderizarSucessoDoQuizz(passaOQuizz);
    quizzDoUsuario = {};
}

function renderizarSucessoDoQuizz(quizz){
    
    const telaSucesso = document.querySelector('.criacao-sucesso');
    telaSucesso.classList.remove('escondido');
    const id = quizz.id;
    const img = quizz.image;
    const titulo = quizz.title;
    telaSucesso.innerHTML = `
        <h3 class="tela-sucesso">Seu quizz está pronto!</h3>
        <article class="quizz-capa" onclick="exibirQuizz(${id})">
            <img src=${img}>
            <h3>${titulo}</h3>
        </article>
        <div class="botoes">
            <button onclick="exibirQuizz(${id})">Acessar quizz</button>
            <button class="voltar" onclick="voltarParaInicio()">Voltar para home</button>
        </div>
    `;
}

function exibirQuizzCriado(id){
    const telaSucesso = document.querySelector('.criacao-sucesso');
    const telaCriacao = document.querySelector('.criacao');
    telaSucesso.classList.add('escondido');
    telaCriacao.classList.add('escondido');
    exibirQuizz(id);
}

function voltarParaInicio(){
    const telaSucesso = document.querySelector('.criacao-sucesso');
    const telaCriacao = document.querySelector('.criacao');
    telaSucesso.classList.add('escondido');
    telaCriacao.classList.add('escondido');
    obterQuizzes();
}

obterQuizzes();
