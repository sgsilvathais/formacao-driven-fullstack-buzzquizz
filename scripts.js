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