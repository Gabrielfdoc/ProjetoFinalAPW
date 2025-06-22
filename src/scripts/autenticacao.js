// Função para lidar com o logout do usuário
function logout() {
    // Exibe uma confirmação antes de sair
    if (confirm('Deseja realmente sair?')) {
      // Remove o usuário logado do localStorage, encerrando a "sessão"
      localStorage.removeItem('usuarioLogado');
  
      // Redireciona para a página inicial após logout
      window.location.href = 'index.html';
    }
  }
  
  // Função que ajusta dinamicamente os elementos da navbar com base no estado de login
  function atualizarNavbar() {
    // Recupera o usuário logado (se houver) do localStorage
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
  
    // Elementos da navegação
    const menuUsuario = document.getElementById('menuUsuario');     // Container com o nome do usuário
    const menuSair = document.getElementById('menuSair');           // Botão "Sair"
    const menuLogin = document.getElementById('menuLogin');         // Botão "Login"
    const menuCadastro = document.getElementById('menuCadastro');   // Botão "Cadastro"
    const userSpan = document.getElementById('usuarioLogadoInfo');  // Span onde o nome do usuário é exibido
  
    if (usuario) {
      // Se estiver logado, mostra o nome do usuário e botão de sair
      if (menuUsuario) menuUsuario.classList.remove('d-none');
      if (menuSair) menuSair.classList.remove('d-none');
  
      // Esconde opções de login e cadastro
      if (menuLogin) menuLogin.classList.add('d-none');
      if (menuCadastro) menuCadastro.classList.add('d-none');
  
      // Exibe o nome do usuário logado na interface
      if (userSpan) userSpan.textContent = usuario.nome;
    } else {
      // Se não estiver logado, mostra opções de login e cadastro
      if (menuUsuario) menuUsuario.classList.add('d-none');
      if (menuSair) menuSair.classList.add('d-none');
      if (menuLogin) menuLogin.classList.remove('d-none');
      if (menuCadastro) menuCadastro.classList.remove('d-none');
    }
  }
  
  // Função que restringe o acesso a páginas que requerem autenticação
  function protegerPagina() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
  
    // Verifica se a página atual NÃO é a index.html
    const isPaginaProtegida = !window.location.pathname.includes('index.html');
  
    // Se o usuário não estiver logado e a página for protegida, bloqueia o acesso
    if (!usuario && isPaginaProtegida) {
      alert('Você precisa estar logado para acessar esta página.');
      window.location.href = 'index.html'; // Redireciona para login
    }
  }
  
  // Quando o DOM (estrutura da página) estiver totalmente carregado, executa:
  document.addEventListener('DOMContentLoaded', () => {
    atualizarNavbar();  // Atualiza a navbar com base no login
    protegerPagina();   // Impede acesso não autorizado a páginas restritas
  });
  