# Documentação do Projeto de Gerenciamento de Tarefas

## Visão Geral

Este projeto é uma aplicação web para gerenciamento de tarefas pessoais, com funcionalidades para criação, edição, conclusão e exclusão de tarefas, além de agrupá-las por objetivos com prazos específicos. Ele utiliza armazenamento local (`localStorage`) para persistir dados no navegador.

---

## Estrutura Geral

- **exibir.js**: Responsável por carregar e exibir as tarefas do usuário logado, manipular a conclusão, remoção de tarefas e objetivos, além de aplicar estilos dinâmicos conforme o status da tarefa.
- **CSS**: Estilos visuais para a aplicação, incluindo cores e bordas diferenciadas para tarefas atrasadas, do dia e concluídas.
- **HTML**: Estrutura básica da página onde o JavaScript injeta os elementos dinâmicos.

---

## Funcionamento Detalhado

### 1. Autenticação Simples

- Ao carregar a página, o script verifica se há um usuário logado no `localStorage` (`usuarioLogado`).
- Caso não exista, exibe alerta e redireciona para a tela inicial (`index.html`).

### 2. Estrutura de Dados

- As tarefas são armazenadas em `localStorage` sob a chave `tarefas`.
- Cada tarefa contém propriedades como:
  - `id`: identificador único,
  - `titulo`: nome da tarefa,
  - `descricao`: detalhes da tarefa,
  - `prazo`: data limite (string `YYYY-MM-DD`),
  - `concluida`: boolean indicando se está concluída,
  - `usuarioEmail`: email do usuário dono da tarefa,
  - `objetivo`: objeto opcional com título e prazo do objetivo relacionado.

### 3. Exibição das Tarefas

- As tarefas do usuário atual são filtradas.
- São agrupadas por objetivos, onde cada grupo possui um título e prazo.
- Caso a tarefa não pertença a nenhum objetivo, é agrupada em "Tarefas Avulsas".
- Para cada objetivo, são exibidas as tarefas divididas em:
  - **Pendentes**
  - **Concluídas**

### 4. Ordenação e Estilos

- As tarefas são ordenadas pelo prazo, da mais próxima para a mais distante.
- Cada card de tarefa recebe estilos conforme seu estado:
  - **Atrasada:** data de prazo anterior ao dia atual e não concluída → borda vermelha + fundo vermelho claro.
  - **Do dia:** prazo igual ao dia atual e não concluída → borda amarela + fundo amarelo claro.
  - **Concluída:** tarefa marcada como concluída → apenas borda verde, sem fundo amarelo ou vermelho.
- Botões para concluir/desmarcar e remover a tarefa ficam disponíveis em cada card.

### 5. Manipulação de Tarefas

- **ToggleConclusao(id):** alterna o estado de conclusão da tarefa, atualizando o `localStorage` e a interface.
- **RemoverTarefa(id):** remove uma tarefa após confirmação do usuário.
- **RemoverObjetivo(titulo, prazo):** remove todas as tarefas associadas a um objetivo específico, também com confirmação.

---

## Tecnologias e Métodos Utilizados

- **JavaScript Vanilla** para manipulação do DOM e controle da lógica da aplicação.
- **localStorage** para persistência simples dos dados.
- Manipulação de datas via objeto `Date` do JavaScript, ajustando horas para garantir comparação correta de dias.
- **CSS Customizado** para diferenciação visual dos estados das tarefas.
- Organização do código em funções reutilizáveis e clara separação de responsabilidades.

---

## Pontos de Destaque

- Ao marcar uma tarefa como concluída, ela perde os estilos de "atrasada" ou "do dia" e passa a ter somente a borda verde.
- Tarefas são agrupadas automaticamente, facilitando a visualização por objetivos.
- A aplicação garante que o usuário só veja suas próprias tarefas.
- Interface responsiva, com cards dispostos em grades adaptáveis (col-md-6 col-lg-4).

---

## Como Utilizar

1. Faça login ou registre-se na página inicial.
2. Adicione objetivos, atribuindo títulos, descrições e prazos.
3. Visualize suas tarefas agrupadas por objetivos.
4. Utilize os botões para concluir, desmarcar ou remover tarefas.
5. Remova objetivos inteiros junto com suas tarefas, se desejar.
6. As alterações são salvas automaticamente no navegador.

---

## Observações

- Este projeto foi desenvolvido para uso local, sem backend.
- A persistência depende do armazenamento local do navegador; limpar dados do navegador apagará as tarefas.
