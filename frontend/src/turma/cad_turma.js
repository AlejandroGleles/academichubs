document.addEventListener('DOMContentLoaded', function() {
    listarProfessores(); // Preenche o campo de seleção de professores
    listarTurmas(); // Lista as turmas existentes
    cadastrarTurma(); // Inicializa o cadastro de turmas
});

function listarProfessores() {
    fetch('http://localhost:8080/api/v1/professores', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const professorSelect = document.getElementById('professor');
        if (data.data && Array.isArray(data.data)) {
            professorSelect.innerHTML = '<option value="" disabled selected>Selecione o professor</option>';
            data.data.forEach(professor => {
                const option = document.createElement('option');
                option.value = professor.ID;
                option.textContent = professor.Nome;
                professorSelect.appendChild(option);
            });
        } else {
            professorSelect.innerHTML = '<option value="" disabled>Sem professores disponíveis</option>';
        }
    })
    .catch(error => {
        console.error('Erro ao carregar professores:', error);
    });
}

function cadastrarTurma() {
    const turmaForm = document.getElementById('turmaForm');
    if (turmaForm) {
        turmaForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nome = document.getElementById('nome').value;
            const semestre = document.getElementById('semestre').value;
            const ano = document.getElementById('ano').value;
            const professorID = parseInt(document.getElementById('professor').value, 10);

            const turma = {
                Nome: nome,
                Semestre: semestre,
                Ano: ano,
                ProfessorID: professorID
            };

            fetch('http://localhost:8080/api/v1/turma', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(turma)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('Turma cadastrada com sucesso!');
                listarTurmas(); // Atualiza a lista de turmas após o cadastro
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Erro ao cadastrar turma');
            });
        });
    } else {
        console.error('Formulário de cadastro de turmas não encontrado');
    }
}

function listarTurmas() {
    fetch('http://localhost:8080/api/v1/turmas', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Dados recebidos da API de turmas:', data);
        const listaDiv = document.getElementById('lista');
        listaDiv.innerHTML = '';

        if (data.data && Array.isArray(data.data)) {
            data.data.forEach(turma => {
                console.log('Turma:', turma); // Verifica o conteúdo da turma

                // Verifica se professorId está definido
                if (turma.professorId === undefined || turma.professorId === null) {
                    console.error('professorId está indefinido para a turma:', turma);
                    return;
                }

                buscarProfessor(turma.professorId)
                    .then(professorNome => {
                        const turmaCard = document.createElement('div');
                        turmaCard.className = 'col-md-12'; // Ajuste conforme o layout desejado
                        turmaCard.dataset.id = turma.ID;
                        turmaCard.innerHTML = `
                            <div class="card mb-3 turma-card">
                                <div class="card-body">
                                    <h5 class="card-title">${turma.nome || 'Nome não disponível'}</h5>
                                    <p class="card-text"><strong>Semestre:</strong> ${turma.semestre || 'Semestre não disponível'}</p>
                                    <p class="card-text"><strong>Ano:</strong> ${turma.ano || 'Ano não disponível'}</p>
                                    <p class="card-text"><strong>Professor:</strong> ${professorNome}</p>
                                </div>
                                <div class="card-actions">
                                    <button class="btn btn-warning" onclick="editarTurma(${turma.ID}, '${encodeURIComponent(turma.nome || '')}', '${encodeURIComponent(turma.semestre || '')}', '${encodeURIComponent(turma.ano || '')}', ${turma.professorId})">Editar</button>
                                    <button class="btn btn-danger ms-2" onclick="deletarTurma(${turma.ID})">Deletar</button>
                                </div>
                            </div>
                        `;
                        listaDiv.appendChild(turmaCard);
                    })
                    .catch(error => {
                        console.error('Erro ao carregar dados do professor:', error);
                    });
            });
        } else {
            listaDiv.innerHTML = '<p>Nenhuma turma encontrada.</p>';
        }
    })
    .catch(error => {
        console.error('Erro ao carregar turmas:', error);
        const listaDiv = document.getElementById('lista');
        listaDiv.innerHTML = '<p>Falha ao carregar turmas.</p>';
    });
}

function editarTurma(id, nome, semestre, ano, professorId) {
    const url = `edita_turma.html?id=${id}&nome=${encodeURIComponent(nome)}&semestre=${encodeURIComponent(semestre)}&ano=${encodeURIComponent(ano)}&professorId=${professorId}`;
    window.location.href = url;
}

function deletarTurma(id) {
    fetch(`http://localhost:8080/api/v1/turma?id=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao deletar turma');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('Turma deletada com sucesso!');
        listarTurmas(); // Atualiza a lista de turmas
    })
    .catch((error) => {
        console.error('Erro ao deletar turma:', error);
        alert('Erro ao deletar turma');
    });
}

function buscarProfessor(professorID) {
    return fetch(`http://localhost:8080/api/v1/professor?id=${professorID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.data && data.data.Nome) {
            return data.data.Nome;
        } else {
            return 'Professor não encontrado';
        }
    })
    .catch(error => {
        console.error('Erro ao buscar professor:', error);
        return 'Erro ao buscar professor';
    });
}
