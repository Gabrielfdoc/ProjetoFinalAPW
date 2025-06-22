(() => {
  'use strict';

  // === UTILITÁRIOS DE USUÁRIOS ===

  // Função para recuperar os usuários cadastrados no localStorage
  function pegarUsuarios() {
    const usuariosJSON = localStorage.getItem('usuarios');
    return usuariosJSON ? JSON.parse(usuariosJSON) : [];
  }

  // Função para salvar a lista de usuários atualizada no localStorage
  function salvarUsuarios(usuarios) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  // === ATUALIZAÇÃO DO MENU CONFORME LOGIN ===

  // Função que atualiza os elementos da navbar com base no estado de autenticação
  function atualizarMenuUsuario() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    // Seletores dos itens de menu
    const menuUsuario = document.getElementById('menuUsuario');               // Span do usuário
    const menuSair = document.getElementById('menuSair');                     // Botão "Sair"
    const menuLoginCadastro = document.getElementById('menuLoginCadastro');  // Botões "Login" e "Cadastro"
    const usuarioLogadoInfo = document.getElementById('usuarioLogadoInfo');  // Nome do usuário exibido

    if (usuarioLogado) {
      // Se estiver logado, exibe nome do usuário e botões correspondentes
      if (usuarioLogadoInfo) usuarioLogadoInfo.textContent = usuarioLogado.nome;

      if (menuUsuario) {
        menuUsuario.classList.remove('d-none');
        menuUsuario.classList.add('d-flex');
      }

      if (menuSair) {
        menuSair.classList.remove('d-none');
        menuSair.classList.add('d-flex');
      }

      if (menuLoginCadastro) {
        menuLoginCadastro.classList.add('d-none');
      }
    } else {
      // Se não estiver logado, oculta nome do usuário e mostra login/cadastro
      if (menuUsuario) {
        menuUsuario.classList.remove('d-flex');
        menuUsuario.classList.add('d-none');
      }

      if (menuSair) {
        menuSair.classList.remove('d-flex');
        menuSair.classList.add('d-none');
      }

      if (menuLoginCadastro) {
        menuLoginCadastro.classList.remove('d-none');
      }
    }
  }

  // === LOGOUT ===

  // Função global para logout (removida sessão e redireciona para a home)
  window.logout = function () {
    if (confirm('Deseja realmente sair?')) {
      localStorage.removeItem('usuarioLogado'); // Remove sessão do localStorage
      atualizarMenuUsuario();                   // Atualiza visual do menu
      window.location.href = 'index.html';      // Redireciona à página inicial
    }
  };

  // === CADASTRO DE USUÁRIO ===

  const formularioCadastro = document.getElementById('formCadastro');

  if (formularioCadastro) {
    const inputNome = document.getElementById('nomeCadastro');
    const inputEmailCadastro = document.getElementById('emailCadastro');
    const inputSenhaCadastro = document.getElementById('senhaCadastro');
    const inputConfirmaSenha = document.getElementById('confirmaSenhaCadastro');
    const feedbackSenhaDivergente = document.getElementById('feedbackSenhaDivergente');

    formularioCadastro.addEventListener('submit', evento => {
      evento.preventDefault();      // Evita envio padrão do formulário
      evento.stopPropagation();     // Impede propagação do evento para outros elementos

      // Esconde feedback de erro de senha antes de nova verificação
      feedbackSenhaDivergente.style.display = 'none';

      // Validação HTML5
      if (!formularioCadastro.checkValidity()) {
        formularioCadastro.classList.add('was-validated');
        return;
      }

      // Verifica se as senhas coincidem
      if (inputSenhaCadastro.value !== inputConfirmaSenha.value) {
        feedbackSenhaDivergente.style.display = 'block';
        inputConfirmaSenha.setCustomValidity('As senhas não coincidem');
        formularioCadastro.classList.add('was-validated');
        return;
      } else {
        inputConfirmaSenha.setCustomValidity('');
      }

      // Verifica se e-mail já está cadastrado
      const usuarios = pegarUsuarios();
      const emailExistente = usuarios.some(u => u.email.toLowerCase() === inputEmailCadastro.value.toLowerCase());

      if (emailExistente) {
        alert('Já existe um usuário cadastrado com esse e-mail.');
        return;
      }

      // Cria novo objeto de usuário
      const novoUsuario = {
        nome: inputNome.value.trim(),
        email: inputEmailCadastro.value.trim().toLowerCase(),
        senha: inputSenhaCadastro.value // (em sistemas reais, nunca armazenar senhas em texto plano!)
      };

      // Salva o novo usuário
      usuarios.push(novoUsuario);
      salvarUsuarios(usuarios);

      // Feedback e encerramento do processo
      alert('Cadastro realizado com sucesso! Agora você pode fazer login.');
      formularioCadastro.reset();
      formularioCadastro.classList.remove('was-validated');

      const modalCadastro = bootstrap.Modal.getInstance(document.getElementById('modalCadastro'));
      modalCadastro.hide();
    });
  }

  // === LOGIN DE USUÁRIO ===

  const formularioLogin = document.getElementById('formLogin');

  if (formularioLogin) {
    const inputEmailLogin = document.getElementById('emailLogin');
    const inputSenhaLogin = document.getElementById('senhaLogin');

    formularioLogin.addEventListener('submit', evento => {
      evento.preventDefault();
      evento.stopPropagation();

      // Validação HTML5
      if (!formularioLogin.checkValidity()) {
        formularioLogin.classList.add('was-validated');
        return;
      }

      // Busca usuário pelo e-mail e senha
      const usuarios = pegarUsuarios();
      const usuarioEncontrado = usuarios.find(
        u => u.email.toLowerCase() === inputEmailLogin.value.trim().toLowerCase() &&
             u.senha === inputSenhaLogin.value
      );

      if (!usuarioEncontrado) {
        alert('E-mail ou senha incorretos. Tente novamente.');
        formularioLogin.classList.add('was-validated');
        return;
      }

      // Login bem-sucedido: armazena sessão no localStorage
      alert(`Bem-vindo, ${usuarioEncontrado.nome}!`);
      localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
      atualizarMenuUsuario(); // Atualiza navbar

      // Limpa e fecha modal
      formularioLogin.reset();
      formularioLogin.classList.remove('was-validated');

      const modalLogin = bootstrap.Modal.getInstance(document.getElementById('modalLogin'));
      modalLogin.hide();

      // Recarrega a página para aplicar mudanças na interface
      window.location.reload();
    });
  }

  // === INICIALIZAÇÃO AUTOMÁTICA ===

  // Atualiza o menu automaticamente ao carregar a página
  document.addEventListener('DOMContentLoaded', () => {
    atualizarMenuUsuario();
  });
})();
