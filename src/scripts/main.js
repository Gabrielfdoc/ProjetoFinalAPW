(() => {
  'use strict';

  // Captura o formulário de login pelo ID para manipular seu envio
  const formularioLogin = document.getElementById('formLogin');

  // Adiciona um ouvinte para o evento de envio (submit) do formulário de login
  formularioLogin.addEventListener('submit', evento => {
    // Verifica se o formulário está válido segundo as regras HTML e Bootstrap
    if (!formularioLogin.checkValidity()) {
      // Se inválido, impede o envio do formulário e bloqueia a propagação do evento
      evento.preventDefault();
      evento.stopPropagation();
    }

    // Adiciona a classe para ativar o feedback visual das validações no Bootstrap
    formularioLogin.classList.add('was-validated');
  });

  // Captura o formulário de cadastro e os campos de senha e confirmação de senha
  const formularioCadastro = document.getElementById('formCadastro');
  const inputSenha = document.getElementById('senhaCadastro');
  const inputConfirmaSenha = document.getElementById('confirmaSenhaCadastro');
  const feedbackSenhaDivergente = document.getElementById('feedbackSenhaDivergente');

  // Adiciona ouvinte para submissão do formulário de cadastro
  formularioCadastro.addEventListener('submit', evento => {
    // Previne o comportamento padrão de recarregar a página e evita propagação do evento
    evento.preventDefault();
    evento.stopPropagation();

    // Inicialmente esconde a mensagem de erro de senhas divergentes
    feedbackSenhaDivergente.style.display = 'none';

    // Verifica se o formulário é válido conforme regras definidas (ex.: campos obrigatórios)
    if (!formularioCadastro.checkValidity()) {
      // Se inválido, ativa o feedback visual de erro e encerra a função
      formularioCadastro.classList.add('was-validated');
      return;
    }

    // Compara os valores das senhas para garantir que são iguais
    if (inputSenha.value !== inputConfirmaSenha.value) {
      // Se forem diferentes, exibe a mensagem de erro específica e seta validade customizada
      feedbackSenhaDivergente.style.display = 'block';
      inputConfirmaSenha.setCustomValidity('As senhas não coincidem');

      // Ativa feedback visual para o usuário corrigir o erro
      formularioCadastro.classList.add('was-validated');
      return;
    } else {
      // Se senhas coincidem, remove a validade customizada para permitir envio
      inputConfirmaSenha.setCustomValidity('');
    }

    // Aqui normalmente ocorreria o envio dos dados para um servidor/backend
    // Como não há backend implementado, apenas exibe um alerta de sucesso
    alert('Cadastro realizado com sucesso! (Aqui seria implementado o backend)');

    // Reseta o formulário para limpar os campos após o envio
    formularioCadastro.reset();

    // Remove a classe de validação para evitar efeitos visuais persistentes
    formularioCadastro.classList.remove('was-validated');

    // Fecha o modal de cadastro usando a API do Bootstrap para modais
    const modalCadastro = bootstrap.Modal.getInstance(document.getElementById('modalCadastro'));
    modalCadastro.hide();
  });
})();