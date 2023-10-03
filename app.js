// Função para iniciar o quiz
function startQuiz() {
    fetch('https://opentdb.com/api.php?amount=5&type=multiple')
        .then(response => response.json())
        .then(data => {
            const questions = data.results;
            let questionIndex = 0;
            const usedQuestions = new Set();

            // Função para mostrar uma pergunta
            function showQuestion() {
                const questionContainer = document.querySelector('.container');
                questionContainer.innerHTML = ''; // Limpar o conteúdo anterior

                // Escolher uma pergunta aleatória que não foi usada
                let randomIndex;
                do {
                    randomIndex = Math.floor(Math.random() * questions.length);
                } while (usedQuestions.has(randomIndex));
                
                const currentQuestion = questions[randomIndex];
                usedQuestions.add(randomIndex);

                // Mostrar a pergunta
                const questionElement = document.createElement('div');
                questionElement.classList.add('question');
                questionElement.innerText = currentQuestion.question;
                questionContainer.appendChild(questionElement);

                // Mostrar opções de resposta
                const options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
                options.sort(() => Math.random() - 0.5); // Embaralhar as opções
                options.forEach(option => {
                    const optionElement = document.createElement('button');
                    optionElement.classList.add('option');
                    optionElement.innerText = option;
                    optionElement.addEventListener('click', () => checkAnswer(option, currentQuestion.correct_answer));
                    questionContainer.appendChild(optionElement);
                });
            }

            // Restaurar o conjunto de perguntas usadas para o próximo jogo
            function resetQuiz() {
                usedQuestions.clear();
            }

            // Função para verificar a resposta
            function checkAnswer(selectedAnswer, correctAnswer) {
                const feedbackElement = document.createElement('div');
                feedbackElement.classList.add('feedback');

                if (selectedAnswer === correctAnswer) {
                    feedbackElement.innerText = 'Boa!! Resposta correta!';
                    feedbackElement.style.color = 'green';
                } else {
                    feedbackElement.innerText = 'Resposta incorreta. A próxima você acerta, não desista!';
                    feedbackElement.style.color = 'red';
                }

                const questionContainer = document.querySelector('.container');
                questionContainer.appendChild(feedbackElement);

                // Passar para a próxima pergunta após um breve intervalo 
                setTimeout(() => {
                    // Verificar se ainda há perguntas
                    if (questionIndex < questions.length - 1) {
                        // Se houver mais perguntas, mostrar a próxima
                        questionIndex++;
                        showQuestion();
                    } else {
                        // Se todas as perguntas foram exibidas, mostrar uma mensagem de fim do quiz
                        resetQuiz();
                        questionContainer.innerHTML = 'Fim do Quiz. Obrigado por jogar!';
                    }
                }, 2000); // Mude para o valor desejado para controlar por quanto tempo a mensagem de feedback é exibida (em milissegundos)
            }

            // Mostrar a primeira pergunta ao iniciar o quiz
            showQuestion();
        })
        
}

// Adicionar um event listener ao botão para iniciar o quiz
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startQuizButton');
    startButton.addEventListener('click', startQuiz);
});
