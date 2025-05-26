document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('listaTarefas');
  const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

  if (tarefas.length === 0) {
    container.innerHTML = '<p class="text-center">Nenhuma tarefa cadastrada.</p>';
    return;
  }

  tarefas.forEach(tarefa => {
    const prazoFormatado = new Date(tarefa.prazo).toLocaleDateString('pt-BR');

    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';

    col.innerHTML = `
      <div class="card shadow-sm ${tarefa.concluida ? 'border-success' : ''}">
        <div class="card-body">
          <h5 class="card-title">${tarefa.titulo}</h5>
          <p class="card-text">${tarefa.descricao}</p>
          <p class="card-text"><small class="text-muted">Prazo: ${prazoFormatado}</small></p>
          <div class="d-flex justify-content-between align-items-center">
            <button class="btn btn-sm btn-outline-${tarefa.concluida ? 'secondary' : 'success'}" onclick="toggleConclusao(${tarefa.id})">
              ${tarefa.concluida ? 'Desmarcar' : 'Concluir'}
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="removerTarefa(${tarefa.id})">
              Remover
            </button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
});
