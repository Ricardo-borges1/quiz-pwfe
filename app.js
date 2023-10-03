function startQuiz() {
    fetch('https://opentdb.com/api.php?amount=5&type=multiple')
        .then(response => response.json())
        .then(data => {
            // Manipular os dados recebidos da API (data) aqui
            const questions = data.results;
            // Chame a função para mostrar as perguntas
            questions.forEach(question => {
                showQuestion(question);
            });
        })
        .catch(error => {
            // Em caso de erro na chamada da API
            console.error('Erro ao obter dados da API:', error);
        });
}

function showQuestion(question) {
    const questionContainer = document.querySelector('.container');
    // Mostrar a pergunta
    const questionElement = document.createElement('div');
    questionElement.classList.add('question');
    questionElement.innerText = question.question;
    questionContainer.appendChild(questionElement);

    // Mostrar opções de resposta
    const options = [...question.incorrect_answers, question.correct_answer];
    options.sort(() => Math.random() - 0.5); // Embaralhar as opções
    options.forEach(option => {
        const optionElement = document.createElement('button');
        optionElement.classList.add('option');
        optionElement.innerText = option;
        optionElement.addEventListener('click', () => checkAnswer(option, question.correct_answer));
        questionContainer.appendChild(optionElement);
    });
}


function checkAnswer(selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
        alert('Resposta correta!');
        // Chame a função para mostrar a próxima pergunta
        // showQuestion(nextQuestion);
    } else {
        alert('Resposta incorreta. Tente novamente!');
    }
}

// Inicializar o quiz quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startQuizButton');
    startButton.addEventListener('click', startQuiz);
});
