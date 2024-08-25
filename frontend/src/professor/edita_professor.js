




document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        // Busca os dados do professor quando a página é carregada
        exibirProfessor(id);
    } else {
        console.error('ID do professor não encontrado na URL.');
    }

    const updateForm = document.getElementById('updateProfessorForm');

    if (updateForm) {
        updateForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede a submissão do formulário

            // Obtém os valores atualizados dos campos do formulário
            const updatedNome = document.getElementById('updateNome').value;
            const updatedEmail = document.getElementById('updateEmail').value;
            const updatedCPF = document.getElementById('updateCPF').value;

            const professor = {
                Nome: updatedNome,
                Email: updatedEmail,
                CPF: updatedCPF
            };

            // Chama a função de atualização
            atualizarProfessor(professor, id);
        });
    } else {
        console.error('Formulário de atualização não encontrado no DOM.');
    }
});

function exibirProfessor(id) {
    fetch(`http://localhost:8080/api/v1/professor?id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar professor');
        }
        return response.json();
    })
    .then(data => {
        console.log('Dados do professor:', data);
        if (data.error) {
            alert('Erro ao exibir professor: ' + data.error);
        } else {
            // Preenche o formulário com os dados do professor
            fillProfessorForm(data.data);
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        alert('Erro ao exibir professor');
    });
}

function fillProfessorForm(professor) {
    const idField = document.getElementById('updateProfessorId');
    const nomeField = document.getElementById('updateNome');
    const emailField = document.getElementById('updateEmail');
    const cpfField = document.getElementById('updateCPF');

    if (idField) idField.value = professor.ID || '';
    if (nomeField) nomeField.value = professor.Nome || '';
    if (emailField) emailField.value = professor.Email || '';
    if (cpfField) cpfField.value = professor.CPF || '';
}

function atualizarProfessor(professor, id) {
    fetch(`http://localhost:8080/api/v1/professor?id=${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(professor)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao atualizar professor');
        }
        return response.json(); // Retorna os dados atualizados do servidor
    })
    .then(data => {
        console.log('Resposta do servidor:', data);

        if (data.error) {
            alert('Erro ao atualizar professor: ' + data.error);
        } else {
            alert('Professor atualizado com sucesso!');

            // Atualiza os dados exibidos no formulário após a atualização
            fillProfessorForm(data.data);

            // Atualiza o cartão do professor na página de listagem, se existir
            atualizarCardProfessor(id, data.data);
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        alert('Erro ao atualizar professor');
    });
}

function atualizarCardProfessor(id, dadosAtualizados) {
    // Encontra o cartão do professor pelo ID
    const professorCard = document.querySelector(`.card[data-id='${id}']`);
    if (professorCard) {
        const cardTitle = professorCard.querySelector('.card-title');
        const cardEmail = professorCard.querySelector('.card-text:nth-of-type(2)');
        const cardCPF = professorCard.querySelector('.card-text:nth-of-type(3)');

        if (cardTitle) cardTitle.textContent = dadosAtualizados.Nome || '';
        if (cardEmail) cardEmail.innerHTML = `<strong>E-mail:</strong> ${dadosAtualizados.Email || ''}`;
        if (cardCPF) cardCPF.innerHTML = `<strong>CPF:</strong> ${dadosAtualizados.CPF || ''}`;
    } else {
        console.error('Card do professor não encontrado!');
    }
}
