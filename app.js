// Função para iniciar o quiz
function startQuiz() {
    fetch('https://opentdb.com/api.php?amount=5&type=multiple')
        .then(response => response.json())
        .then(data => {
            const questoes = data.results;
            let questionIndex = 0;
            const usedQuestions = new Set();

            // Função para mostrar uma pergunta
            function showQuestion() {
                const mostrarPergunta = document.querySelector('.container');
                mostrarPergunta.innerHTML = ''; 

                // Escolher uma pergunta aleatória que não foi usada
                let perguntaAleatoria;
                do {
                    perguntaAleatoria = Math.floor(Math.random() * questoes.length);
                } while (usedQuestions.has(perguntaAleatoria));
                
                const currentQuestion = questoes[perguntaAleatoria];
                usedQuestions.add(perguntaAleatoria);

                // Mostrar a pergunta
                const questaoElement = document.createElement('div');
                questaoElement.classList.add('questao');
                questaoElement.innerText = currentQuestion.question;
                mostrarPergunta.appendChild(questaoElement);

                // Mostrar opções de resposta
                const opcoes = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
                opcoes.sort(() => Math.random() - 0.5); // Embaralhar as opções
                opcoes.forEach(opcao => {
                    const optionElement = document.createElement('button');
                    optionElement.classList.add('option');
                    optionElement.innerText = opcao;
                    optionElement.addEventListener('click', () => checarResposta(opcao, currentQuestion.correct_answer));
                    mostrarPergunta.appendChild(optionElement);
                });
            }

            // Resetar as perguntas para o próximo jogo
            function resetQuiz() {
                usedQuestions.clear();
            }

            // Função para verificar a resposta
            function checarResposta(selecionarResposta, respostaCorreta) {
                const feedbackElement = document.createElement('div');
                feedbackElement.classList.add('feedback');

                if (selecionarResposta === respostaCorreta) {
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
                    if (questionIndex < questoes.length - 1) {
                        questionIndex++;
                        showQuestion();
                    } else {
                         //mensagem de fim do quiz
                        resetQuiz();
                        questionContainer.innerHTML = 'Fim do Quiz. Obrigado por jogar!';
                    }
                }, 2000); //quanto tempo a mensagem de feedback é exibida (em milissegundos)
            }

            
            showQuestion();
        })
        
}

// Adicionar um event listener ao botão para iniciar o quiz
document.addEventListener('DOMContentLoaded', () => {
    const iniciarQuiz = document.getElementById('startQuizButton');
    iniciarQuiz.addEventListener('click', startQuiz);
});
