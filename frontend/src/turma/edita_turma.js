document.addEventListener('DOMContentLoaded', () => {
    // Obtém os parâmetros da URL e decodifica
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const nome = decodeURIComponent(urlParams.get('nome'));
    const semestre = decodeURIComponent(urlParams.get('semestre'));
    const ano = decodeURIComponent(urlParams.get('ano'));
    const professorId = parseInt(urlParams.get('professorId'), 10);

    console.log('Parâmetros obtidos da URL:', { id, nome, semestre, ano, professorId });

    if (id) {
        // Preenche o formulário com os dados da turma e carrega a lista de professores
        fillTurmaForm({ ID: id, Nome: nome, Semestre: semestre, Ano: ano, ProfessorID: professorId });
        listarProfessores(professorId);
    } else {
        console.error('ID da turma não encontrado na URL.');
    }

    const updateForm = document.getElementById('updateTurmaForm');

    if (updateForm) {
        updateForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede a submissão do formulário

            // Obtém os valores atualizados dos campos do formulário
            const updatedNome = document.getElementById('updateNome').value;
            const updatedSemestre = document.getElementById('updateSemestre').value;
            const updatedAno = document.getElementById('updateAno').value;
            const updatedProfessorID = parseInt(document.getElementById('updateProfessor').value, 10); // Converte para número

            const turma = {
                Nome: updatedNome,
                Semestre: updatedSemestre,
                Ano: updatedAno,
                ProfessorID: updatedProfessorID
            };

            console.log('Dados da turma para atualização:', turma);

            // Chama a função de atualização
            atualizarTurma(id, turma);
        });
    } else {
        console.error('Formulário de atualização não encontrado no DOM.');
    }
});

function exibirTurma(id) {
    fetch(`http://localhost:8080/api/v1/turma?id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorText => {
                console.error(`Erro ${response.status}: ${errorText}`);
                alert(`Erro ${response.status}: ${errorText}`);
                throw new Error(`Erro ${response.status}: ${errorText}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Dados da turma recebidos do servidor:', data);
        if (data.error) {
            alert('Erro ao exibir turma: ' + data.error);
        } else {
            // Preenche o formulário com os dados da turma
            fillTurmaForm(data.data);
            // Carrega a lista de professores
            listarProfessores(data.data.ProfessorID);
            // Atualiza o card da turma
            atualizarCardTurma(id, data.data);
        }
    })
    .catch(error => {
        console.error('Erro na requisição ao exibir turma:', error);
        alert('Erro ao exibir turma: ' + error.message);
    });
}

function fillTurmaForm(turma) {
    console.log('Preenchendo formulário com dados da turma:', turma);

    const nomeField = document.getElementById('updateNome');
    const semestreField = document.getElementById('updateSemestre');
    const anoField = document.getElementById('updateAno');
    const turmaIdField = document.getElementById('updateTurmaId');

    if (nomeField) nomeField.value = turma.Nome || '';
    if (semestreField) semestreField.value = turma.Semestre || '';
    if (anoField) anoField.value = turma.Ano || '';
    if (turmaIdField) turmaIdField.value = turma.ID || '';
}

function listarProfessores(selectedProfessorID) {
    fetch('http://localhost:8080/api/v1/professores', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Dados dos professores recebidos do servidor:', data);
        const professorSelect = document.getElementById('updateProfessor');
        if (data.data && Array.isArray(data.data)) {
            professorSelect.innerHTML = '<option value="" disabled>Selecione o professor</option>';
            data.data.forEach(professor => {
                const option = document.createElement('option');
                option.value = professor.ID;
                option.textContent = professor.Nome;
                professorSelect.appendChild(option);
            });
            // Seleciona o professor atual
            if (selectedProfessorID) {
                professorSelect.value = selectedProfessorID;
            }
        } else {
            professorSelect.innerHTML = '<option value="" disabled>Sem professores disponíveis</option>';
        }
    })
    .catch(error => {
        console.error('Erro ao carregar professores:', error);
    });
}

function atualizarTurma(id, turma) {
    fetch(`http://localhost:8080/api/v1/turma?id=${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(turma),
        cache: 'no-store' // Garante que não há cache
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorText => {
                console.error(`Erro ${response.status}: ${errorText}`);
                alert(`Erro ${response.status}: ${errorText}`);
                throw new Error(`Erro ${response.status}: ${errorText}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Resposta do servidor após atualização:', data);

        if (data.error) {
            alert('Erro ao atualizar turma: ' + data.error);
        } else {
            alert('Turma atualizada com sucesso!');
            // Atualiza o formulário com os dados atualizados
            fillTurmaForm(data.data);
            // Atualiza a lista de professores
            listarProfessores(data.data.ProfessorID);
            // Atualiza o card da turma
            atualizarCardTurma(id, data.data);
        }
    })
    .catch(error => {
        console.error('Erro na requisição ao atualizar turma:', error);
        alert('Erro ao atualizar turma: ' + error.message);
    });
}

function atualizarCardTurma(id, dadosAtualizados) {
    // Aqui estamos assumindo que você tem um elemento com a classe 'card' e um atributo 'data-id' no HTML
    const turmaCard = document.querySelector(`.card[data-id='${id}']`);

    if (turmaCard) {
        const cardNome = turmaCard.querySelector('.card-title');
        const cardSemestre = turmaCard.querySelector('.card-text.semestre');
        const cardAno = turmaCard.querySelector('.card-text.ano');
        const cardProfessor = turmaCard.querySelector('.card-text.professor');

        // Atualiza o conteúdo do card com os dados atualizados
        if (cardNome) cardNome.textContent = dadosAtualizados.Nome || '';
        if (cardSemestre) cardSemestre.innerHTML = `<strong>Semestre:</strong> ${dadosAtualizados.Semestre || ''}`;
        if (cardAno) cardAno.innerHTML = `<strong>Ano:</strong> ${dadosAtualizados.Ano || ''}`;
        if (cardProfessor) cardProfessor.innerHTML = `<strong>Professor:</strong> ${dadosAtualizados.ProfessorNome || ''}`;
    } else {
        console.error('Card da turma não encontrado!');
    }
}
