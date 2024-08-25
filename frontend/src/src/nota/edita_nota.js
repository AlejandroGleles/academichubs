document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        exibirNota(id);
    } else {
        console.error('ID da nota não encontrado na URL.');
    }

    listarAlunos();
    listarAtividades();

    const updateForm = document.getElementById('updateNotaForm');

    if (updateForm) {
        updateForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const updatedAlunoID = document.getElementById('updateAluno').value;
            const updatedAtividadeID = document.getElementById('updateAtividade').value;
            const updatedNota = document.getElementById('updateNota').value;

            const nota = {
                AlunoID: updatedAlunoID,
                AtividadeID: updatedAtividadeID,
                Nota: updatedNota
            };

            atualizarNota(nota, id);
        });
    } else {
        console.error('Formulário de atualização não encontrado no DOM.');
    }
});

function exibirNota(id) {
    fetch(`http://localhost:8080/api/v1/nota?id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar nota');
        }
        return response.json();
    })
    .then(data => {
        console.log('Dados da nota:', data);
        if (data.error) {
            alert('Erro ao exibir nota: ' + data.error);
        } else {
            fillNotaForm(data.data);
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        alert('Erro ao exibir nota');
    });
}

function fillNotaForm(nota) {
    const idField = document.getElementById('updateNotaId');
    const alunoField = document.getElementById('updateAluno');
    const atividadeField = document.getElementById('updateAtividade');
    const notaField = document.getElementById('updateNota');

    if (idField) idField.value = nota.ID || '';
    if (alunoField) alunoField.value = nota.AlunoID || '';
    if (atividadeField) atividadeField.value = nota.AtividadeID || '';
    if (notaField) notaField.value = nota.Nota || '';
}

function listarAlunos() {
    fetch('http://localhost:8080/api/v1/alunos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const alunoSelect = document.getElementById('updateAluno');
        alunoSelect.innerHTML = '';

        if (data.data && Array.isArray(data.data)) {
            data.data.forEach(aluno => {
                const option = document.createElement('option');
                option.value = aluno.ID;
                option.textContent = `${aluno.Nome} (${aluno.Matricula})`;
                alunoSelect.appendChild(option);
            });
        }
    })
    .catch(error => {
        console.error('Erro ao listar alunos:', error);
    });
}

function listarAtividades() {
    fetch('http://localhost:8080/api/v1/atividades', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const atividadeSelect = document.getElementById('updateAtividade');
        atividadeSelect.innerHTML = '';

        if (data.data && Array.isArray(data.data)) {
            data.data.forEach(atividade => {
                const option = document.createElement('option');
                option.value = atividade.ID;
                option.textContent = atividade.Nome;
                atividadeSelect.appendChild(option);
            });
        }
    })
    .catch(error => {
        console.error('Erro ao listar atividades:', error);
    });
}

function atualizarNota(nota, id) {
    fetch(`http://localhost:8080/api/v1/nota?id=${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nota)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao atualizar nota');
        }
        return response.json();
    })
    .then(data => {
        console.log('Resposta do servidor:', data);

        if (data.error) {
            alert('Erro ao atualizar nota: ' + data.error);
        } else {
            alert('Nota atualizada com sucesso!');
            window.location.href = 'cad_nota.html'; // Redireciona para a página de cadastro de notas
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        alert('Erro ao atualizar nota');
    });
}
