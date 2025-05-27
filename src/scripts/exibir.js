// Função para alternar o status de conclusão de uma tarefa
function toggleConclusao(id) {
  // Recupera a lista de tarefas do localStorage e converte de JSON para array de objetos
  const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

  // Procura o índice da tarefa que tem o id correspondente (comparação flexível com ==)
  const index = tarefas.findIndex(tarefa => tarefa.id == id);

  // Se a tarefa foi encontrada
  if (index !== -1) {
    // Inverte o valor booleano da propriedade 'concluida' da tarefa selecionada
    tarefas[index].concluida = !tarefas[index].concluida;

    // Atualiza o localStorage com a lista modificada convertida para JSON
    localStorage.setItem('tarefas', JSON.stringify(tarefas));

    // Atualiza a lista de tarefas exibida na página para refletir a mudança
    atualizarListaTarefas();
  }
}

// Função para remover uma tarefa a partir do seu ID
function removerTarefa(id) {
  // Exibe um diálogo de confirmação para o usuário antes de remover
  if (!confirm('Tem certeza que deseja remover esta tarefa?')) {
    return; // Se o usuário cancelar, sai da função sem fazer nada
  }

  // Recupera a lista de tarefas do localStorage
  let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

  // Filtra a lista removendo a tarefa com o ID informado
  tarefas = tarefas.filter(tarefa => tarefa.id != id);

  // Atualiza o localStorage com a lista atualizada (sem a tarefa removida)
  localStorage.setItem('tarefas', JSON.stringify(tarefas));

  // Atualiza a lista exibida na página
  atualizarListaTarefas();
}

// Função auxiliar para criar um objeto Date no horário local, evitando problemas com fuso horário
function criarDataLocal(yyyy_mm_dd) {
  // Divide a string de data no formato "AAAA-MM-DD" em partes: [ano, mês, dia]
  const partes = yyyy_mm_dd.split('-');

  // Cria e retorna um objeto Date usando ano, mês (0-indexado), e dia
  return new Date(partes[0], partes[1] - 1, partes[2]);
}

// Função principal para atualizar a lista de tarefas na interface do usuário
function atualizarListaTarefas() {
  // Seleciona o container HTML onde as tarefas serão exibidas
  const container = document.getElementById('listaTarefas');

  // Recupera as tarefas armazenadas no localStorage
  const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

  // Limpa o conteúdo atual do container para reconstruir a lista
  container.innerHTML = '';

  // Caso não existam tarefas, exibe mensagem informativa e encerra a função
  if (tarefas.length === 0) {
    container.innerHTML = '<p class="text-center">Nenhuma tarefa cadastrada.</p>';
    return;
  }

  // Ordena as tarefas pela data do prazo em ordem crescente
  tarefas.sort((a, b) => {
    const dataA = criarDataLocal(a.prazo);
    const dataB = criarDataLocal(b.prazo);
    return dataA - dataB;
  });

  // Separa as tarefas em duas listas: pendentes e concluídas
  const pendentes = tarefas.filter(t => !t.concluida);
  const concluidas = tarefas.filter(t => t.concluida);

  // Cria um objeto Date representando o dia atual, com hora zerada para comparação exata
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Função que recebe uma lista de tarefas e retorna um array de elementos DOM contendo os cards
  function criarCards(lista) {
    return lista.map(tarefa => {
      // Formata a data de prazo da tarefa para o formato brasileiro "DD/MM/AAAA"
      const prazoFormatado = criarDataLocal(tarefa.prazo).toLocaleDateString('pt-BR');

      // Cria objeto Date para a data de prazo da tarefa, com hora zerada para comparação
      const prazoTarefa = criarDataLocal(tarefa.prazo);
      prazoTarefa.setHours(0, 0, 0, 0);

      // Define se a tarefa está atrasada (prazo menor que hoje e não concluída)
      const estaAtrasada = !tarefa.concluida && prazoTarefa < hoje;

      // Define se o prazo da tarefa é hoje (comparação de timestamps)
      const ehHoje = prazoTarefa.getTime() === hoje.getTime();

      // Cria um elemento div para o card da tarefa, com classes responsivas do Bootstrap
      const div = document.createElement('div');
      div.className = 'col-md-6 col-lg-4';

      // Define o HTML interno do card, incluindo título, descrição, prazo e botões de ação
      // Aplica classes condicionais para destacar tarefas concluídas, atrasadas e do dia atual
      div.innerHTML = `
        <div class="card shadow-sm
          ${tarefa.concluida ? 'border-success' : ''}
          ${estaAtrasada ? 'atrasada' : ''}
          ${ehHoje ? 'hoje' : ''}">
          <div class="card-body">
            <h5 class="card-title">${tarefa.titulo}</h5>
            <p class="card-text">${tarefa.descricao}</p>
            <p class="card-text"><small class="text-muted">Prazo: ${prazoFormatado}</small></p>
            <div class="d-flex justify-content-between align-items-center">
              <button class="btn btn-sm btn-outline-${tarefa.concluida ? 'secondary' : 'success'}" onclick="toggleConclusao('${tarefa.id}')">
                ${tarefa.concluida ? 'Desmarcar' : 'Concluir'}
              </button>
              <button class="btn btn-sm btn-outline-danger" onclick="removerTarefa('${tarefa.id}')">
                Remover
              </button>
            </div>
          </div>
        </div>
      `;

      // Retorna o elemento div criado para ser inserido no DOM
      return div;
    });
  }

  // Se houver tarefas pendentes, cria um título e adiciona os cards na lista
  if (pendentes.length > 0) {
    const tituloPendentes = document.createElement('h3');
    tituloPendentes.textContent = 'Tarefas Pendentes';
    container.appendChild(tituloPendentes);
    criarCards(pendentes).forEach(card => container.appendChild(card));
  }

  // Se houver tarefas concluídas, cria um título e adiciona os cards correspondentes
  if (concluidas.length > 0) {
    const tituloConcluidas = document.createElement('h3');
    tituloConcluidas.textContent = 'Tarefas Concluídas';
    container.appendChild(tituloConcluidas);
    criarCards(concluidas).forEach(card => container.appendChild(card));
  }

  // Caso não haja nenhuma tarefa em ambas listas, exibe mensagem padrão
  if (pendentes.length === 0 && concluidas.length === 0) {
    container.innerHTML = '<p class="text-center">Nenhuma tarefa cadastrada.</p>';
  }
}

// Adiciona um listener para o evento DOMContentLoaded que executa a função de atualizar a lista
// Isso garante que a lista de tarefas seja carregada assim que a página terminar de carregar
document.addEventListener('DOMContentLoaded', atualizarListaTarefas);
