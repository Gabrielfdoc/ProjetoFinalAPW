// Adiciona um ouvinte para o evento de envio (submit) do formulário de nova tarefa
document.getElementById('formTarefa').addEventListener('submit', function (evento) {
  // Previne o comportamento padrão do formulário que recarregaria a página
  evento.preventDefault();

  // Referência ao formulário atual para manipulação
  const formulario = this;

  // Adiciona a classe 'was-validated' para ativar a validação visual do Bootstrap
  formulario.classList.add('was-validated');

  // Verifica se o formulário é válido segundo as regras definidas nos inputs
  if (!formulario.checkValidity()) return; // Se inválido, encerra sem prosseguir

  // Captura os valores dos campos título, descrição e prazo, removendo espaços desnecessários
  const titulo = document.getElementById('titulo').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const prazo = document.getElementById('prazo').value;

  // Cria um objeto para a nova tarefa, atribuindo um id único com base na data/hora atual
  const novaTarefa = {
    id: Date.now(),           // Id único baseado em timestamp (milissegundos desde 1970)
    titulo,                  // Título da tarefa
    descricao,               // Descrição detalhada da tarefa
    prazo,                   // Data limite para conclusão da tarefa
    concluida: false,        // Estado inicial da tarefa: não concluída (pendente)
  };

  // Busca a lista de tarefas salva no armazenamento local (localStorage)
  // Caso não exista, inicializa como array vazio
  const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

  // Adiciona a nova tarefa ao final da lista
  tarefas.push(novaTarefa);

  // Atualiza o armazenamento local salvando a lista completa como string JSON
  localStorage.setItem('tarefas', JSON.stringify(tarefas));

  // Exibe mensagem de confirmação ao usuário para indicar sucesso na operação
  alert('Tarefa adicionada com sucesso!');

  // Limpa os campos do formulário para facilitar o cadastro de uma nova tarefa
  formulario.reset();

  // Remove a classe de validação para evitar conflito visual caso o formulário seja reutilizado
  formulario.classList.remove('was-validated');
});
