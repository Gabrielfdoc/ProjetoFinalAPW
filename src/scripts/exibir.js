// Recupera o usuário logado do localStorage
const usuarioAtual = JSON.parse(localStorage.getItem('usuarioLogado'));

// Se não houver usuário logado, exibe alerta e redireciona para a tela inicial
if (!usuarioAtual) {
  alert('Usuário não autenticado.');
  window.location.href = 'index.html';
}

// Função utilitária para converter uma string de data (YYYY-MM-DD) em um objeto Date
function criarDataLocal(dataStr) {
  if (!dataStr) return null;
  const [ano, mes, dia] = dataStr.split('-').map(Number);
  return new Date(ano, mes - 1, dia); // Meses em JavaScript começam do zero
}

// Alterna o status de uma tarefa (concluir ou desmarcar)
function toggleConclusao(id) {
  const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  const index = tarefas.findIndex(t => t.id == id);

  if (index !== -1) {
    tarefas[index].concluida = !tarefas[index].concluida; // Inverte o status
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    atualizarListaTarefas(); // Atualiza a exibição
  }
}

// Remove uma tarefa individual após confirmação do usuário
function removerTarefa(id) {
  if (!confirm('Deseja remover esta tarefa?')) return;

  let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  tarefas = tarefas.filter(t => t.id != id); // Remove a tarefa selecionada
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
  atualizarListaTarefas(); // Atualiza a exibição
}

// Remove todas as tarefas associadas a um objetivo (por título e prazo)
function removerObjetivo(titulo, prazo) {
  if (!confirm(`Deseja remover o objetivo "${titulo}" e todas as suas tarefas?`)) return;

  let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

  tarefas = tarefas.filter(tarefa => {
    if (!tarefa.objetivo) return true;
    return (
      tarefa.objetivo.titulo !== titulo ||
      tarefa.objetivo.prazo !== prazo
    );
  });

  localStorage.setItem('tarefas', JSON.stringify(tarefas));
  atualizarListaTarefas(); // Atualiza a exibição
}

// Atualiza a interface agrupando tarefas por objetivo
function atualizarListaTarefas() {
  const container = document.getElementById('listaTarefas');

  // Filtra apenas tarefas do usuário logado
  const tarefas = (JSON.parse(localStorage.getItem('tarefas')) || []).filter(t => {
    return t.usuarioEmail === usuarioAtual.email;
  });

  container.innerHTML = ''; // Limpa o conteúdo atual

  if (tarefas.length === 0) {
    container.innerHTML = '<p class="text-center">Nenhuma tarefa cadastrada.</p>';
    return;
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); // Zera horas para comparação de datas

  // Agrupa tarefas por objetivo (chave: título + prazo)
  const objetivos = {};

  tarefas.forEach(tarefa => {
    const objetivo = tarefa.objetivo || { titulo: 'Tarefas Avulsas', prazo: null };
    const chave = `${objetivo?.titulo || 'Objetivo sem nome'}||${objetivo?.prazo || ''}`;

    if (!objetivos[chave]) {
      objetivos[chave] = {
        objetivo,
        tarefas: []
      };
    }

    objetivos[chave].tarefas.push(tarefa);
  });

  // Para cada objetivo, cria seu bloco de tarefas
  Object.values(objetivos).forEach(({ objetivo, tarefas }) => {
    const objetivoDiv = document.createElement('div');
    objetivoDiv.className = 'mb-5 p-3 border rounded shadow-sm bg-light';

    // Cabeçalho do objetivo (título e botão excluir)
    const header = document.createElement('div');
    header.className = 'd-flex justify-content-between align-items-center mb-3';

    const titulo = document.createElement('h4');
    const nomeObjetivo = objetivo?.titulo || 'Objetivo sem nome';
    const prazoObjetivo = objetivo?.prazo
      ? ` (Prazo: ${criarDataLocal(objetivo.prazo).toLocaleDateString('pt-BR')})`
      : '';
    titulo.textContent = `${nomeObjetivo}${prazoObjetivo}`;

    const btnExcluir = document.createElement('button');
    btnExcluir.className = 'btn btn-outline-danger btn-sm';
    btnExcluir.textContent = 'Excluir Objetivo';
    btnExcluir.onclick = () => removerObjetivo(objetivo.titulo, objetivo.prazo);

    header.appendChild(titulo);
    header.appendChild(btnExcluir);
    objetivoDiv.appendChild(header);

    // Containers de tarefas pendentes e concluídas
    const tarefasPendentesRow = document.createElement('div');
    tarefasPendentesRow.className = 'row gy-3 mb-4';

    const tarefasConcluidasRow = document.createElement('div');
    tarefasConcluidasRow.className = 'row gy-3';

    // Ordena tarefas pelo prazo crescente
    tarefas.sort((a, b) => {
      const dataA = criarDataLocal(a.prazo) || new Date(2100, 0, 1);
      const dataB = criarDataLocal(b.prazo) || new Date(2100, 0, 1);
      return dataA - dataB;
    });

    // Cria os cards de tarefa
    tarefas.forEach(tarefa => {
      const prazoTarefa = criarDataLocal(tarefa.prazo);
      if (!prazoTarefa) return;

      prazoTarefa.setHours(0, 0, 0, 0);

      const estaAtrasada = !tarefa.concluida && prazoTarefa < hoje;
      const ehHoje = prazoTarefa.getTime() === hoje.getTime();
      const prazoFormatado = prazoTarefa.toLocaleDateString('pt-BR');

      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-4';

      const classesCard = ['card', 'shadow-sm'];

      if (tarefa.concluida) {
        classesCard.push('border-success');
      } else {
        if (estaAtrasada) classesCard.push('atrasada');
        if (ehHoje) classesCard.push('hoje');
      }

      col.innerHTML = `
        <div class="${classesCard.join(' ')}">
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

      // Adiciona ao grupo certo: pendente ou concluída
      if (tarefa.concluida) {
        tarefasConcluidasRow.appendChild(col);
      } else {
        tarefasPendentesRow.appendChild(col);
      }
    });

    // Adiciona seções à div do objetivo
    objetivoDiv.appendChild(tarefasPendentesRow);

    if (tarefasConcluidasRow.children.length > 0) {
      const tituloConcluidas = document.createElement('h5');
      tituloConcluidas.textContent = 'Concluídas';
      tituloConcluidas.className = 'mt-4 mb-3 text-success';
      objetivoDiv.appendChild(tituloConcluidas);
      objetivoDiv.appendChild(tarefasConcluidasRow);
    }

    // Adiciona o objetivo à página
    container.appendChild(objetivoDiv);
  });
}

// Executa a função de atualização assim que a página estiver carregada
document.addEventListener('DOMContentLoaded', atualizarListaTarefas);
