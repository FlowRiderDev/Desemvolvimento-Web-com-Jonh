// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener('DOMContentLoaded', function() {
    // Selecionar elementos do formulário
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const imageInput = document.getElementById('image');
    const submitBtn = document.getElementById('submitBtn');

    // Elementos para exibição em tempo real
    const displayName = document.getElementById('displayName');
    const displayEmail = document.getElementById('displayEmail');
    const displayMessage = document.getElementById('displayMessage');

    // Área de pré-visualização da imagem
    const imagePreview = document.getElementById('imagePreview');

    // Função para verificar se todos os campos obrigatórios estão preenchidos
    function checkInputs() {
        const nome = nameInput.value.trim();
        const email = emailInput.value.trim();
        const telefone = phoneInput.value.trim();
        const assunto = subjectInput.value;
        const mensagem = messageInput.value.trim();

        // Verifica se todos os campos estão preenchidos
        if (nome !== '' && email !== '' && telefone !== '' && assunto !== '' && mensagem !== '') {
            submitBtn.disabled = false; // Habilita o botão de envio
        } else {
            submitBtn.disabled = true; // Desabilita o botão de envio
        }
    }

    // Adiciona o evento 'input' aos campos para monitorar alterações
    [nameInput, emailInput, phoneInput, subjectInput, messageInput].forEach(function(input) {
        input.addEventListener('input', function() {
            checkInputs(); // Verifica os campos sempre que houver uma alteração
            updateLiveDisplay(); // Atualiza a exibição em tempo real
        });
    });

    // Função para atualizar a exibição em tempo real
    function updateLiveDisplay() {
        displayName.textContent = nameInput.value;
        displayEmail.textContent = emailInput.value;
        displayMessage.textContent = messageInput.value;
    }

    // Máscara para o campo de telefone
    phoneInput.addEventListener('input', function(e) {
        let input = e.target.value;

        // Remove caracteres não numéricos
        input = input.replace(/\D/g, '');

        // Aplica a máscara
        if (input.length > 0) {
            input = '(' + input;
        }
        if (input.length > 3) {
            input = input.slice(0, 3) + ') (' + input.slice(3);
        }
        if (input.length > 8) {
            input = input.slice(0, 8) + ') ' + input.slice(8);
        }
        if (input.length > 14) {
            input = input.slice(0, 14) + '-' + input.slice(14, 18);
        }
        if (input.length > 19) {
            input = input.slice(0, 19);
        }

        e.target.value = input; // Atualiza o valor do campo com a máscara aplicada
    });

    // Pré-visualização da imagem selecionada
    imageInput.addEventListener('change', function() {
        const file = this.files[0];

        // Limpa a pré-visualização anterior
        imagePreview.innerHTML = '';

        if (file) {
            const reader = new FileReader();

            reader.addEventListener('load', function() {
                // Cria um elemento de imagem
                const img = document.createElement('img');
                img.src = reader.result;
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.style.borderRadius = '4px';

                // Adiciona a imagem à área de pré-visualização
                imagePreview.appendChild(img);
            });

            reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados
        }
    });

    // Limpa a pré-visualização da imagem ao redefinir o formulário
    form.addEventListener('reset', function() {
        imagePreview.innerHTML = '';
    });

    // Função para exibir mensagens de validação
    function showValidationMessage(input, message) {
        const error = document.createElement('span');
        error.className = 'error-message';
        error.textContent = message;
        input.parentNode.appendChild(error); // Adiciona a mensagem de erro após o campo
        input.classList.add('invalid'); // Adiciona a classe 'invalid' para estilização
    }

    // Função para remover mensagens de validação anteriores
    function removeValidationMessages() {
        const errors = document.querySelectorAll('.error-message');
        errors.forEach(function(error) {
            error.remove(); // Remove a mensagem de erro
        });
        const invalidInputs = document.querySelectorAll('.invalid');
        invalidInputs.forEach(function(input) {
            input.classList.remove('invalid'); // Remove a classe 'invalid'
        });
    }

    // Evento de submissão do formulário
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Obter os valores atualizados e remover espaços em branco
        const nome = nameInput.value.trim();
        const email = emailInput.value.trim();
        const telefone = phoneInput.value.trim();
        const assunto = subjectInput.value;
        const mensagem = messageInput.value.trim();

        let isValid = true; // Variável para rastrear a validade do formulário

        removeValidationMessages(); // Remove mensagens de erro anteriores

        // Validação do Nome
        if (nome === '') {
            isValid = false;
            showValidationMessage(nameInput, 'O campo Nome é obrigatório.');
        }

        // Validação do Email usando expressão regular
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            isValid = false;
            showValidationMessage(emailInput, 'O campo Email é obrigatório.');
        } else if (!emailRegex.test(email)) {
            isValid = false;
            showValidationMessage(emailInput, 'Por favor, insira um email válido.');
        }

        // Validação do Telefone (verifica se todos os dígitos foram inseridos)
        const phoneDigits = telefone.replace(/\D/g, '');
        if (phoneDigits.length < 11) {
            isValid = false;
            showValidationMessage(phoneInput, 'Por favor, insira um telefone válido.');
        }

        // Validação do Assunto
        if (assunto === '') {
            isValid = false;
            showValidationMessage(subjectInput, 'Por favor, selecione um assunto.');
        }

        // Validação da Mensagem
        if (mensagem === '') {
            isValid = false;
            showValidationMessage(messageInput, 'O campo Mensagem é obrigatório.');
        } else if (mensagem.length < 100) {
            isValid = false;
            showValidationMessage(messageInput, 'A mensagem deve ter pelo menos 100 caracteres.');
        }

        // Se o formulário for válido, prossegue com o envio
        if (isValid) {
            // Exibe o spinner de carregamento
            document.getElementById('spinner').style.display = 'block';

            // Simula o envio do formulário com um delay de 2 segundos
            setTimeout(function() {
                alert('Formulário enviado com sucesso!');
                document.getElementById('spinner').style.display = 'none'; // Oculta o spinner
                form.reset(); // Limpa os campos do formulário
                submitBtn.disabled = true; // Desabilita o botão de envio novamente
                imagePreview.innerHTML = ''; // Limpa a pré-visualização da imagem
                // Redirecionar para outra página (opcional)
                // window.location.href = 'outra_pagina.html';
            }, 2000);
        }
    });
});
