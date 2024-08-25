document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        exibirAtividade(id);
    } else {
        console.error('ID da atividade não encontrado na URL.');
    }

    const updateForm = document.getElementById('updateAtividadeForm');

    if (updateForm) {
        updateForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const updatedNome = document.getElementById('updateNome').value;
            const updatedPontos = document.getElementById('updatePontos').value;
            const updatedTurmaID = document.getElementById('updateTurma').value;

            const atividade = {
                Nome: updatedNome,
                Pontos: updatedPontos,
                TurmaID: updatedTurmaID
            };

            atualizarAtividade(atividade, id);
        });
    } else {
        console.error('Formulário de atualização não encontrado no DOM.');
    }
});

function exibirAtividade(id) {
    fetch(`http://localhost:8080/api/v1/atividade?id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar atividade');
        }
        return response.json();
    })
    .then(data => {
        console.log('Dados da atividade:', data);
        if (data.error) {
            alert('Erro ao exibir atividade: ' + data.error);
        } else {
            fillAtividadeForm(data.data);
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        alert('Erro ao exibir atividade');
    });
}

function fillAtividadeForm(atividade) {
    const idField = document.getElementById('updateAtividadeId');
    const nomeField = document.getElementById('updateNome');
    const pontosField = document.getElementById('updatePontos');
    const turmaField = document.getElementById('updateTurma');

    if (idField) idField.value = atividade.ID || '';
    if (nomeField) nomeField.value = atividade.Nome || '';
    if (pontosField) pontosField.value = atividade.Pontos || '';
    if (turmaField) turmaField.value = atividade.TurmaID || '';
}

function atualizarAtividade(atividade, id) {
    fetch(`http://localhost:8080/api/v1/atividade?id=${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(atividade)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao atualizar atividade');
        }
        return response.json();
    })
    .then(data => {
        console.log('Resposta do servidor:', data);

        if (data.error) {
            alert('Erro ao atualizar atividade: ' + data.error);
        } else {
            alert('Atividade atualizada com sucesso!');
            window.location.href = 'cad_atividade.html'; // Redireciona para a página de cadastro de atividades
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        alert('Erro ao atualizar atividade');
    });
}
