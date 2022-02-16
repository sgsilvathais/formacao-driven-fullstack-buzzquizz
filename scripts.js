obterQuizzes();

function obterQuizzes(){

    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");

    promessa.then(quizzesObtidos);
}

function quizzesObtidos(quizzes){

    const listaQuizzes = document.querySelector(".listar-quizzes");

    listaQuizzes.innerHTML = `
        <h2>Todos os Quizzes</h2>
    `;

    console.log(quizzes);
    quizzes.data.forEach(renderizarCapaDoQuizz);

}

function renderizarCapaDoQuizz(quizz){
    const titulo = quizz.title;
    const img = quizz.image;

    let listaQuizzes = document.querySelector(".listar-quizzes");
    
    const quizzHTML = `
        <article class="quizz-capa">
            <img src=${img}>
            <h3>${titulo}</h3>
        </article> 
    `;

    listaQuizzes.innerHTML += quizzHTML;
   
}