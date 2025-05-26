// main.js

(() => {
    'use strict';
  
    // Login Form
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', event => {
      if (!loginForm.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      loginForm.classList.add('was-validated');
    });
  
    // Register Form
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('registerPassword');
    const passwordConfirmInput = document.getElementById('registerPasswordConfirm');
    const passwordMismatchFeedback = document.getElementById('passwordMismatchFeedback');
  
    registerForm.addEventListener('submit', event => {
      event.preventDefault();
      event.stopPropagation();
  
      // Reset feedback
      passwordMismatchFeedback.style.display = 'none';
  
      if (!registerForm.checkValidity()) {
        registerForm.classList.add('was-validated');
        return;
      }
  
      // Verifica se as senhas são iguais
      if (passwordInput.value !== passwordConfirmInput.value) {
        passwordMismatchFeedback.style.display = 'block';
        passwordConfirmInput.setCustomValidity('As senhas não coincidem');
        registerForm.classList.add('was-validated');
        return;
      } else {
        passwordConfirmInput.setCustomValidity('');
      }
  
      // Se chegou aqui, formulário válido
      alert('Cadastro realizado com sucesso! (Aqui você deve implementar o backend)');
      registerForm.reset();
      registerForm.classList.remove('was-validated');
      const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
      registerModal.hide();
    });
  })();
  