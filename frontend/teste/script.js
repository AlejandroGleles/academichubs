// Função para atualizar os totais
function atualizarTotais() {
    fetch('http://localhost:8080/api/v1/dashboard', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            console.log('Dados recebidos:', data); // Verifique os dados recebidos

            // Atualize os elementos com os dados recebidos
            document.getElementById('totalProfessores').textContent = data.totalProfessores || '0';
            document.getElementById('totalTurmas').textContent = data.totalTurmas || '0';
            document.getElementById('totalAlunos').textContent = data.totalAlunos || '0';
            document.getElementById('totalAtividades').textContent = data.totalAtividades || '0';
        })
        .catch(error => console.error('Erro ao carregar dados do dashboard:', error));
}

// Função para mostrar a lista selecionada
function mostrar(tipo) {
    // Oculta todas as listas
    document.getElementById('professoresLista').classList.add('hidden');
    document.getElementById('turmasLista').classList.add('hidden');
    document.getElementById('alunoLista').classList.add('hidden');
    document.getElementById('atividadesLista').classList.add('hidden');
    document.getElementById('notasLista').classList.add('hidden');

    // Mostra a lista selecionada
    const listaDiv = document.getElementById(`${tipo}Lista`);
    if (listaDiv) {
        listaDiv.classList.remove('hidden');
    }

    // Atualiza o total de itens
    atualizarTotais();

    // Chama a função de listagem específica se existir
    if (tipo === 'professores') {
        listarProfessores();
    } else if (tipo === 'turmas') {
        listarTurmas();
    } else if (tipo === 'alunos') {
        listarAlunos();
    } else if (tipo === 'atividades') {
        listarAtividades();
    } else if (tipo === 'notas') {
        listarNotas();
    } else {
        console.warn('Tipo de listagem não reconhecido:', tipo);
    }
}


// Inicializa a página com a exibição padrão
document.addEventListener('DOMContentLoaded', () => {
    atualizarTotais();
    listarP(); // Lista os professores
    listarTurmas(); // Lista as turmas
    listarAlunos();
});


// Função para listar professores
function listarP() {
    fetch('http://localhost:8080/api/v1/professores', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const listaDiv = document.getElementById('professoresLista');
        listaDiv.innerHTML = '';

        if (data.data && Array.isArray(data.data)) {
            data.data.forEach(professor => {
                const professorCard = document.createElement('div');
                professorCard.className = 'col-md-4'; // Define o tamanho do card para que ele não ocupe todo o espaço
                professorCard.dataset.id = professor.ID;
                professorCard.innerHTML = `
                    <div class="card mb-3 professor-card">
                        <div class="card-body">
                            <h5 class="card-title">${professor.Nome}</h5>
                            <p class="card-text"><strong>Identificação:</strong> ${professor.ID}</p>
                            <p class="card-text"><strong>E-mail:</strong> ${professor.Email}</p>
                            <p class="card-text"><strong>CPF:</strong> ${professor.CPF}</p>
                        </div>
                        <div class="card-actions">
                            <button class="btn btn-warning" onclick="editarProfessor(${professor.ID}, '${encodeURIComponent(professor.Nome)}', '${encodeURIComponent(professor.Email)}', '${encodeURIComponent(professor.CPF)}')">Editar</button>
                            <button class="btn btn-danger ms-2" onclick="deletarProfessor(${professor.ID})">Deletar</button>
                        </div>
                    </div>
                `;

                listaDiv.appendChild(professorCard);
            });

            // Adiciona evento aos botões de editar e excluir
            document.querySelectorAll('.editar-professor').forEach(button => {
                button.addEventListener('click', editarProfessor);
            });

            document.querySelectorAll('.excluir-professor').forEach(button => {
                button.addEventListener('click', excluirProfessor);
            });
        } else {
            console.log('Nenhum professor encontrado.');
        }
    })
    .catch(error => {
        console.error('Erro ao listar professores:', error);
    });
}

// Função para editar um professor
function editarProfessor(id, nome, email, cpf) {
    window.location.href = `edita_professor.html?id=${id}&nome=${encodeURIComponent(nome)}&email=${encodeURIComponent(email)}&cpf=${encodeURIComponent(cpf)}`;
}

// Função para deletar um professor
function deletarProfessor(id) {
    fetch(`http://localhost:8080/api/v1/professor?id=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        alert('Professor excluído com sucesso!');
        listarP(); // Atualiza a lista após a exclusão
    })
    .catch(error => {
        console.error('Erro ao excluir professor:', error);
        alert('Erro ao excluir professor');
    });
}

// Função para listar turmas
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
        const listaDiv = document.getElementById('turmasLista');
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
                        turmaCard.className = 'col-md-4'; // Define o tamanho do card
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
                    .catch(error => console.error('Erro ao buscar nome do professor:', error));
            });
        } else {
            console.log('Nenhuma turma encontrada.');
        }
    })
    .catch(error => {
        console.error('Erro ao listar turmas:', error);
    });
}

// Função para buscar o nome do professor
function buscarProfessor(professorId) {
    return fetch(`http://localhost:8080/api/v1/professor?id=${professorId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Dados recebidos da API de professor:', data);
        if (data.data && data.data.Nome) {
            return data.data.Nome;
        } else {
            return 'Nome não disponível';
        }
    });
}

// Função para editar uma turma
function editarTurma(id, nome, semestre, ano, professorId) {
    window.location.href = `edita_turma.html?id=${id}&nome=${encodeURIComponent(nome)}&semestre=${encodeURIComponent(semestre)}&ano=${encodeURIComponent(ano)}&professorId=${professorId}`;
}

// Função para deletar uma turma
function deletarTurma(id) {
    fetch(`http://localhost:8080/api/v1/turma?id=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        alert('Turma excluída com sucesso!');
        listarTurmas(); // Atualiza a lista após a exclusão
    })
    .catch(error => {
        console.error('Erro ao excluir turma:', error);
        alert('Erro ao excluir turma');
    });
}

// Função para listar alunos
function listarAlunos() {
    fetch('http://localhost:8080/api/v1/alunos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na resposta da API: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Dados recebidos da API de alunos:', data);
        const listaDiv = document.getElementById('alunoLista');
        listaDiv.innerHTML = '';

        // Verifica se 'data.data' é um array
        if (data.data && Array.isArray(data.data)) {
            data.data.forEach(aluno => {
                console.log('Aluno:', aluno); // Verifique os dados individuais dos alunos

                // Crie um elemento card para cada aluno
                const alunoCard = document.createElement('div');
                alunoCard.className = 'col-md-4'; // Define o tamanho do card
                alunoCard.dataset.id = aluno.id; // Use o ID do aluno

                alunoCard.innerHTML = `
                    <div class="card mb-3 aluno-card">
                        <div class="card-body">
                            <h5 class="card-title">${aluno.nome || 'Nome não disponível'}</h5>
                            <p class="card-text"><strong>Matrícula:</strong> ${aluno.matricula || 'Matrícula não disponível'}</p>
                            <p class="card-text"><strong>Turmas:</strong> ${aluno.turmaNames || 'Nenhuma turma associada'}</p>
                        </div>
                        <div class="card-actions">
                            <button class="btn btn-warning" onclick="editarAluno(${aluno.id})">Editar</button>
                            <button class="btn btn-danger ms-2" onclick="deletarAluno(${aluno.id})">Deletar</button>
                        </div>
                    </div>
                `;
                listaDiv.appendChild(alunoCard);
            });
        } else {
            listaDiv.innerHTML = '<p>Nenhum aluno cadastrado.</p>';
        }
    })
    .catch(error => {
        console.error('Erro ao carregar alunos:', error);
        const listaDiv = document.getElementById('alunoLista');
        listaDiv.innerHTML = '<p>Erro ao carregar alunos.</p>';
    });
}

// Função para editar um aluno
function editarAluno(id) {
    window.location.href = `edita_aluno.html?id=${id}`;
}

// Função para deletar um aluno
function deletarAluno(id) {
    fetch(`http://localhost:8080/api/v1/aluno?id=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        alert('Aluno excluído com sucesso!');
        listarAlunos(); // Atualiza a lista após a exclusão
    })
    .catch(error => {
        console.error('Erro ao excluir aluno:', error);
        alert('Erro ao excluir aluno');
    });
}
