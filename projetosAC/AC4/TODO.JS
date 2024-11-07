let tasks = [];

while (true) {
  let choice = prompt(
    "Gerenciador de Lista de Tarefas\n" +
    "1. Adicionar uma nova tarefa\n" +
    "2. Remover uma tarefa\n" +
    "3. Listar todas as tarefas\n" +
    "4. Sair\n" +
    "Escolha uma opção:"
  );

  if (choice === null) {
    break; // Usuário cancelou o prompt
  }

  choice = Number(choice);

  switch (choice) {
    case 1:
      const newTask = prompt("Digite a nova tarefa:");
      if (newTask) {
        tasks.push(newTask);
        alert(`Tarefa "${newTask}" adicionada com sucesso!`);
      } else {
        alert("Nenhuma tarefa adicionada.");
      }
      break;

    case 2:
      if (tasks.length === 0) {
        alert("A lista de tarefas está vazia.");
      } else {
        const taskNumber = prompt(
          "Digite o número da tarefa que deseja remover:\n" +
            tasks.map((task, index) => `${index + 1}. ${task}`).join("\n")
        );
        const index = Number(taskNumber) - 1;
        if (index >= 0 && index < tasks.length) {
          const removedTask = tasks.splice(index, 1);
          alert(`Tarefa "${removedTask}" removida com sucesso!`);
        } else {
          alert("Número de tarefa inválido.");
        }
      }
      break;

    case 3:
      if (tasks.length === 0) {
        alert("Nenhuma tarefa para mostrar.");
      } else {
        alert(
          "Lista de Tarefas:\n" +
            tasks.map((task, index) => `${index + 1}. ${task}`).join("\n")
        );
      }
      break;

    case 4:
      alert("Saindo do gerenciador de tarefas.");
      break;

    default:
      alert("Opção inválida. Por favor, escolha entre 1 e 4.");
  }

  if (choice === 4) {
    break;
  }
}
