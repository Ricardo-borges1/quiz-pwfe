let pontuacao = 0
let questionIndex = 0
const usedQuestions = new Set()
const mostrarPergunta = document.querySelector('.container')
let questoes
let quizEmAndamento = false
let tempoInicio = 0
let tempoPassado = 0
let timerId

function startQuiz() {
    if (!quizEmAndamento) {
        quizEmAndamento = true
        tempoInicio = new Date().getTime() / 1000

        function atualizarTempo() {
            const tempoAtual = new Date().getTime() / 1000
            tempoPassado = Math.round(tempoAtual - tempoInicio)
            document.getElementById('tempoPassado').textContent = tempoPassado
        }

        timerId = setInterval(atualizarTempo, 1000)

        fetch('https://opentdb.com/api.php?amount=5&type=multiple')
            .then(response => response.json())
            .then(data => {
                questoes = data.results
                showQuestion()
            })
    }
}

function showQuestion() {
    if (questionIndex >= questoes.length) {
        finalizarQuiz()
        return
    }

    let perguntaAleatoria
    do {
        perguntaAleatoria = Math.floor(Math.random() * questoes.length)
    } while (usedQuestions.has(perguntaAleatoria))

    const currentQuestion = questoes[perguntaAleatoria]
    usedQuestions.add(perguntaAleatoria)

    mostrarPergunta.innerHTML = `
    <div class="questao">${currentQuestion.question}</div>
    ${currentQuestion.incorrect_answers.concat(currentQuestion.correct_answer)
      .sort(() => Math.random() - 0.5)
      .map(opcao => `
        <button class="option">${opcao}</button>
      `).join('')}
    <div class="pontuacao">Pontuação: <span id="pontuacaoAtual">${pontuacao}</span></div>
    <div class="tempo">Tempo: <span id="tempoPassado">${tempoPassado}</span> segundos</div>`

  document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', () => checarResposta(option.innerText, currentQuestion.correct_answer))
  })
}

function checarResposta(selecionarResposta, respostaCorreta) {
  const feedbackElement = document.createElement('div')
  feedbackElement.classList.add('feedback')

  if (selecionarResposta === respostaCorreta) {
    feedbackElement.innerText = 'Boa!! Resposta correta!'
    feedbackElement.style.color = 'green'
    pontuacao += 1
  } else {
    feedbackElement.innerText = 'Resposta incorreta. A próxima você acerta, não desista!'
    feedbackElement.style.color = 'red'
  }

  mostrarPergunta.appendChild(feedbackElement)

  setTimeout(() => {
    questionIndex++
    showQuestion()
  }, 2000)
}

function finalizarQuiz() {
  quizEmAndamento = false
  clearInterval(timerId)
  mostrarResultadoFinal()
}

function mostrarResultadoFinal() {
  mostrarPergunta.innerHTML = `<div class="resultado-final"> QUIZ CONCLUÍDO <br> <br> <br>PARABÉNS!! <br> Você acertou ${pontuacao} de ${questoes.length} perguntas em ${tempoPassado} segundos!!  <br> <br> <br> Obrigado por jogar! </div>`
}

document.getElementById('startQuizButton').addEventListener('click', startQuiz)