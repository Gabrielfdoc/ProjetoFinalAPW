// Chave de API da OpenAI — usada para autenticar requisições ao modelo GPT.
const OPENAI_API_KEY = 'XXX';

// Verifica se há um usuário logado no localStorage.
// Caso não haja, exibe um alerta e redireciona o usuário para a tela inicial.
const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
if (!usuarioLogado) {
  alert('Você precisa estar logado para adicionar tarefas.');
  window.location.href = 'index.html';
}

// Seleciona os elementos do formulário no DOM (interface HTML)
const form = document.getElementById('formObjetivo');
const nomeInput = document.getElementById('nomeObjetivo');
const descricaoInput = document.getElementById('descricao');
const prazoInput = document.getElementById('prazo');
const carregandoDiv = document.getElementById('carregando'); // Div de "carregando" exibida enquanto a IA gera as tarefas

// Listener para envio do formulário
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Evita o recarregamento da página
  form.classList.add('was-validated'); // Ativa estilos de validação do Bootstrap

  if (!form.checkValidity()) return; // Se campos inválidos, interrompe o envio

  // Coleta os dados inseridos no formulário
  const nome = nomeInput.value.trim();
  const descricao = descricaoInput.value.trim();
  const prazo = prazoInput.value;

  carregandoDiv.style.display = 'block'; // Mostra o carregamento enquanto a IA responde

  // Prompt enviado à IA com instruções específicas para gerar as tarefas
  const prompt = `
  Você é um especialista em planejamento de aprendizado.

  Seu trabalho é transformar a seguinte descrição de objetivo em um plano de estudo prático e sequencial:
  Objetivo: "${descricao}"
  Prazo para alcançar: "${prazo}"

  Instruções:
  - Gere exatamente 10 tarefas numeradas.
  - Cada tarefa deve ser específica, prática e representar uma etapa real do aprendizado do assunto.
  - Comece com fundamentos básicos e progrida até aplicações mais complexas.
  - Evite tarefas genéricas como "praticar todos os dias" ou "seguir o cronograma".
  - Não repita a descrição do objetivo nas tarefas.
  - Use títulos curtos para cada tarefa e uma descrição prática para execução.

  Formato da resposta:
  1. TÍTULO DA TAREFA: Descrição prática e objetiva da tarefa.
  2. ...
  `;

  try {
    // Chama a função que faz a requisição à API da OpenAI
    const respostaTexto = await gerarTarefasDoGPT(prompt);
    if (!respostaTexto) throw new Error('Resposta vazia da IA.');

    // Processa o texto retornado e transforma em tarefas organizadas com prazos
    const tarefas = processarRespostaGPT(respostaTexto, prazo, nome);

    // Salva essas tarefas no localStorage
    salvarTarefasNoLocalStorage(tarefas);

    alert('Tarefas geradas com sucesso!');
    form.reset(); // Limpa o formulário
    form.classList.remove('was-validated');
  } catch (erro) {
    console.error(erro);
    alert('Erro ao gerar tarefas com a IA.');
  } finally {
    carregandoDiv.style.display = 'none'; // Esconde o carregamento
  }
});

// Envia a requisição para a API da OpenAI usando o modelo GPT-4
async function gerarTarefasDoGPT(prompt) {
  const resposta = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`, // Autenticação via chave de API
    },
    body: JSON.stringify({
      model: 'gpt-4', // Define o modelo da OpenAI a ser usado
      messages: [
        { role: 'system', content: 'Você é um assistente que cria planos de ação detalhados.' }, //Dá um "papel" para que a IA utilize como contexto
        { role: 'user', content: prompt }
      ],
      max_tokens: 700, // Define quantos tokens serão utilizados para gerar a lista, quanto mais tokens maior o nível de complexidade que poderá ser trabalhado
      temperature: 0.6, // Controla a criatividade da IA (0 = mais precisa, 1 = mais criativa)
    }),
  });

  const dados = await resposta.json(); // Converte a resposta JSON

  if (dados.error) {
    console.error(dados.error.message); // Exibe erro, se houver
    return null;
  }

  return dados.choices[0].message.content; // Retorna o texto da resposta da IA
}

// Converte a resposta textual da IA em um array de objetos "tarefa"
function processarRespostaGPT(texto, prazoFinal, nomeObjetivo) {
  const tarefas = [];
  const linhas = texto.split('\n').filter(l => /^\d+\.\s*/.test(l.trim())); // Filtra apenas linhas numeradas (1. ..., 2. ..., etc.)
  const total = linhas.length; // Total de tarefas (deve ser 10)

  linhas.forEach((linha, index) => {
    const match = linha.match(/^\d+\.\s*(.*?):\s*(.*)$/); // Separa título e descrição de cada tarefa
    if (!match) return;

    const titulo = match[1].trim();
    const descricao = match[2].trim();
    const prazo = calcularPrazoIntermediario(index, total, prazoFinal); // Distribui o prazo entre hoje e a data final

    tarefas.push({
      id: Date.now() + index, // Gera um ID único para a tarefa
      titulo,
      descricao,
      prazo,
      objetivo: {
        titulo: nomeObjetivo,
        prazo: prazoFinal
      },
      concluida: false, // Inicialmente, nenhuma tarefa está concluída
      usuarioEmail: usuarioLogado.email // Vincula a tarefa ao usuário logado
    });
  });

  return tarefas;
}

// Calcula prazos intermediários distribuídos igualmente entre hoje e a data final
function calcularPrazoIntermediario(index, total, prazoFinal) {
  const dataFinal = new Date(prazoFinal);
  const hoje = new Date();
  const diasTotais = (dataFinal - hoje) / (1000 * 60 * 60 * 24); // Calcula diferença em dias
  const diasParaAdicionar = Math.round((diasTotais / total) * index); // Distribui dias proporcionalmente ao número de tarefas

  const novaData = new Date(hoje);
  novaData.setDate(hoje.getDate() + diasParaAdicionar); // Soma os dias calculados à data atual
  return novaData.toISOString().split('T')[0]; // Retorna a data no formato "YYYY-MM-DD"
}

// Salva as tarefas no localStorage (de forma acumulativa)
function salvarTarefasNoLocalStorage(novasTarefas) {
  const tarefasAntigas = JSON.parse(localStorage.getItem('tarefas')) || [];
  localStorage.setItem('tarefas', JSON.stringify([...tarefasAntigas, ...novasTarefas]));
}
