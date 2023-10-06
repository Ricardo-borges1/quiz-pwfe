let pontuacao = 0;

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

                // Mostrar pontuação abaixo da pergunta
                const pontuacaoElement = document.createElement('div');
                pontuacaoElement.classList.add('pontuacao');
                pontuacaoElement.innerHTML = `Pontuação: <span id="pontuacaoAtual">${pontuacao}</span>`;
                mostrarPergunta.appendChild(pontuacaoElement);
            }

            // Função para verificar a resposta
            function checarResposta(selecionarResposta, respostaCorreta) {
                const feedbackElement = document.createElement('div');
                feedbackElement.classList.add('feedback');

                if (selecionarResposta === respostaCorreta) {
                    feedbackElement.innerText = 'Boa!! Resposta correta!';
                    feedbackElement.style.color = 'green';

                    // Atualizar pontuação abaixo da pergunta
                    pontuacao += 1;
                    const pontuacaoAtualElement = document.getElementById('pontuacaoAtual');
                    pontuacaoAtualElement.innerText = pontuacao;
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
                        // Mensagem de fim do quiz
                        mostrarResultadoFinal();
                    }
                }, 2000); // Quanto tempo a mensagem de feedback é exibida (em milissegundos)
            }

            // Função para mostrar o resultado final
            function mostrarResultadoFinal() {
                const resultadoFinalElement = document.getElementById('resultadoFinal');
                resultadoFinalElement.innerText = `Você acertou ${pontuacao} de ${questoes.length} perguntas!`;
            }

            // Adicionar um event listener ao botão para iniciar o quiz
            const iniciarQuiz = document.getElementById('startQuizButton');
            iniciarQuiz.addEventListener('click', showQuestion);
        });
}

// Adicionar um event listener ao carregar a página para iniciar o quiz
document.addEventListener('DOMContentLoaded', startQuiz);