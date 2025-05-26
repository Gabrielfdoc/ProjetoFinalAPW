// adicionar.js

document.getElementById('formTarefa').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const form = this;
    form.classList.add('was-validated');
  
    if (!form.checkValidity()) return;
  
    const titulo = document.getElementById('titulo').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const prazo = document.getElementById('prazo').value;
  
    const novaTarefa = {
      id: Date.now(),
      titulo,
      descricao,
      prazo,
      concluida: false,
    };
  
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.push(novaTarefa);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
  
    alert('Tarefa adicionada com sucesso!');
    form.reset();
    form.classList.remove('was-validated');
  });
  