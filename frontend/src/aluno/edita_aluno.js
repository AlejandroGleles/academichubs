document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        exibirAluno(id);
    } else {
        console.error('ID do aluno não encontrado na URL.');
    }

    const updateForm = document.getElementById('updateAlunoForm');

    if (updateForm) {
        updateForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const updatedNome = document.getElementById('updateNome').value;
            const updatedMatricula = document.getElementById('updateMatricula').value;
            const updatedTurmaID = document.getElementById('updateTurma').value;

            const aluno = {
                Nome: updatedNome,
                Matricula: updatedMatricula,
                TurmaID: updatedTurmaID
            };

            atualizarAluno(aluno, id);
        });
    } else {
        console.error('Formulário de atualização não encontrado no DOM.');
    }
});

function exibirAluno(id) {
    fetch(`http://localhost:8080/api/v1/aluno?id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar aluno');
        }
        return response.json();
    })
    .then(data => {
        console.log('Dados do aluno:', data);
        if (data.error) {
            alert('Erro ao exibir aluno: ' + data.error);
        } else {
            fillAlunoForm(data.data);
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        alert('Erro ao exibir aluno');
    });
}

function fillAlunoForm(aluno) {
    const idField = document.getElementById('updateAlunoId');
    const nomeField = document.getElementById('updateNome');
    const matriculaField = document.getElementById('updateMatricula');
    const turmaField = document.getElementById('updateTurma');

    if (idField) idField.value = aluno.ID || '';
    if (nomeField) nomeField.value = aluno.Nome || '';
    if (matriculaField) matriculaField.value = aluno.Matricula || '';
    if (turmaField) turmaField.value = aluno.TurmaID || '';
}

function atualizarAluno(aluno, id) {
    fetch(`http://localhost:8080/api/v1/aluno?id=${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(aluno)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao atualizar aluno');
        }
        return response.json();
    })
    .then(data => {
        console.log('Resposta do servidor:', data);

        if (data.error) {
            alert('Erro ao atualizar aluno: ' + data.error);
        } else {
            alert('Aluno atualizado com sucesso!');
            window.location.href = 'cad_aluno.html'; // Redireciona para a página de cadastro de alunos
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        alert('Erro ao atualizar aluno');
    });
}
