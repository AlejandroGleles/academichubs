document.addEventListener('DOMContentLoaded', function() {
    aDashboard();
    listarP(); // Lista professores na página principal
    listarA(); // Lista alunos na página principal
    cProfessor(); // Inicializa o cadastro de professores
    cAluno(); // Inicializa o cadastro de alunos
    setupUpdateForm(); // Configura o formulário de atualização
    handleEditForm(); // Configura o formulário de edição
});

function aDashboard() {
    fetch('http://localhost:8080/api/v1/dashboard', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('totalProfessores').textContent = data.totalProfessores || 0;
        document.getElementById('totalTurmas').textContent = data.totalTurmas || 0;
        document.getElementById('totalAlunos').textContent = data.totalAlunos || 0;
        document.getElementById('totalAtividades').textContent = data.totalAtividades || 0;
    })
    .catch(error => {
        console.error('Erro ao carregar dados da dashboard:', error);
    });
}

function cProfessor() {
    const professorForm = document.getElementById('professorForm');
    if (professorForm) {
        professorForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const cpf = document.getElementById('cpf').value;

            const professor = {
                Nome: nome,
                Email: email,
                CPF: cpf,
            };

            fetch('http://localhost:8080/api/v1/professor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(professor)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('Professor cadastrado com sucesso!');
                window.location.href = 'principal.html'; // Ajuste o nome da página inicial conforme necessário
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Erro ao cadastrar professor');
            });
        });
    } else {
        console.error('Formulário de cadastro de professores não encontrado');
    }
}

function cAluno() {
    const alunoForm = document.getElementById('alunoForm');
    if (alunoForm) {
        alunoForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nome = document.getElementById('nome').value;
            const matricula = document.getElementById('matricula').value;
            const turma = document.getElementById('turma').value;

            const aluno = {
                Nome: nome,
                Matricula: matricula,
                Turma: turma,
            };

            fetch('http://localhost:8080/api/v1/aluno', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(aluno)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('Aluno cadastrado com sucesso!');
                window.location.href = 'principal.html'; // Ajuste o nome da página inicial conforme necessário
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Erro ao cadastrar aluno');
            });
        });
    } else {
        console.error('Formulário de cadastro de alunos não encontrado');
    }
}

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
                professorCard.className = 'col-md-4';
                professorCard.dataset.id = professor.ID;
                professorCard.innerHTML = `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${professor.Nome}</h5>
                            <p class="card-text"><strong>Identificação:</strong> ${professor.ID}</p>
                            <p class="card-text"><strong>E-mail:</strong> ${professor.Email}</p>
                            <p class="card-text"><strong>CPF:</strong> ${professor.CPF}</p>
                            <div class="card-actions">
                                <button class="btn btn-warning" onclick="editarProfessor(${professor.ID}, '${encodeURIComponent(professor.Nome)}', '${encodeURIComponent(professor.Email)}', '${encodeURIComponent(professor.CPF)}')">Editar</button>
                                <button class="btn btn-danger" onclick="deletarProfessor(${professor.ID})">Deletar</button>
                            </div>
                        </div>
                    </div>
                `;
                listaDiv.appendChild(professorCard);
            });
        } else {
            listaDiv.innerHTML = '<p>No data available.</p>';
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        document.getElementById('professoresLista').innerHTML = '<p>Failed to load data.</p>';
    });
}

function listarA() {
    fetch('http://localhost:8080/api/v1/alunos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const listaDiv = document.getElementById('alunosLista');
        listaDiv.innerHTML = '';

        if (data.data && Array.isArray(data.data)) {
            data.data.forEach(aluno => {
                const alunoCard = document.createElement('div');
                alunoCard.className = 'col-md-4';
                alunoCard.dataset.id = aluno.ID;
                alunoCard.innerHTML = `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${aluno.Nome}</h5>
                            <p class="card-text"><strong>Identificação:</strong> ${aluno.ID}</p>
                            <p class="card-text"><strong>Matrícula:</strong> ${aluno.Matricula}</p>
                            <p class="card-text"><strong>Turma:</strong> ${aluno.Turma}</p>
                            <div class="card-actions">
                                <button class="btn btn-warning" onclick="editarAluno(${aluno.ID}, '${encodeURIComponent(aluno.Nome)}', '${encodeURIComponent(aluno.Matricula)}', '${encodeURIComponent(aluno.Turma)}')">Editar</button>
                                <button class="btn btn-danger" onclick="deletarAluno(${aluno.ID})">Deletar</button>
                            </div>
                        </div>
                    </div>
                `;
                listaDiv.appendChild(alunoCard);
            });
        } else {
            listaDiv.innerHTML = '<p>No data available.</p>';
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        document.getElementById('alunosLista').innerHTML = '<p>Failed to load data.</p>';
    });
}

function editarProfessor(id, nome, email, cpf) {
    const url = `edita_professor.html?id=${id}&nome=${nome}&email=${email}&cpf=${cpf}`;
    window.location.href = url;
}

function editarAluno(id, nome, matricula, turma) {
    const url = `edita_aluno.html?id=${id}&nome=${nome}&matricula=${matricula}&turma=${turma}`;
    window.location.href = url;
}

function visualizarProfessor(id) {
    fetch(`http://localhost:8080/api/v1/professor?id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        fillProfessorForm(data.data);
    })
    .catch(error => {
        console.error('Erro ao carregar dados do professor para edição:', error);
        alert('Erro ao carregar dados do professor para edição');
    });
}

function visualizarAluno(id) {
    fetch(`http://localhost:8080/api/v1/aluno?id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        fillAlunoForm(data.data);
    })
    .catch(error => {
        console.error('Erro ao carregar dados do aluno para edição:', error);
        alert('Erro ao carregar dados do aluno para edição');
    });
}

function deletarProfessor(id) {
    fetch(`http://localhost:8080/api/v1/professor?id=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('Professor deletado com sucesso!');
            alert('Professor deletado com sucesso!');
            listarP();
        } else {
            throw new Error('Erro ao deletar professor');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao deletar professor');
    });
}

function deletarAluno(id) {
    fetch(`http://localhost:8080/api/v1/aluno?id=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('Aluno deletado com sucesso!');
            alert('Aluno deletado com sucesso!');
            listarA();
        } else {
            throw new Error('Erro ao deletar aluno');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao deletar aluno');
    });
}

function setupUpdateForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const nome = decodeURIComponent(urlParams.get('nome'));
    const email = decodeURIComponent(urlParams.get('email'));
    const cpf = decodeURIComponent(urlParams.get('cpf'));

    if (id) {
        document.getElementById('editNome').value = nome;
        document.getElementById('editEmail').value = email;
        document.getElementById('editCpf').value = cpf;

        const updateButton = document.getElementById('updateButton');
        updateButton.addEventListener('click', function(e) {
            e.preventDefault();

            const updatedNome = document.getElementById('editNome').value;
            const updatedEmail = document.getElementById('editEmail').value;
            const updatedCpf = document.getElementById('editCpf').value;

            fetch(`http://localhost:8080/api/v1/professor?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Nome: updatedNome,
                    Email: updatedEmail,
                    CPF: updatedCpf
                })
            })
            .then(response => {
                if (response.ok) {
                    console.log('Professor atualizado com sucesso!');
                    alert('Professor atualizado com sucesso!');
                    window.location.href = 'principal.html'; // Ajuste o nome da página inicial conforme necessário
                } else {
                    throw new Error('Erro ao atualizar professor');
                }
            })
            .catch(error => {
                console.error('Erro ao atualizar professor:', error);
                alert('Erro ao atualizar professor');
            });
        });
    }
}

function handleEditForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const nome = decodeURIComponent(urlParams.get('nome'));
    const matricula = decodeURIComponent(urlParams.get('matricula'));
    const turma = decodeURIComponent(urlParams.get('turma'));

    if (id) {
        document.getElementById('editNome').value = nome;
        document.getElementById('editMatricula').value = matricula;
        document.getElementById('editTurma').value = turma;

        const updateButton = document.getElementById('updateButton');
        updateButton.addEventListener('click', function(e) {
            e.preventDefault();

            const updatedNome = document.getElementById('editNome').value;
            const updatedMatricula = document.getElementById('editMatricula').value;
            const updatedTurma = document.getElementById('editTurma').value;

            fetch(`http://localhost:8080/api/v1/aluno?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Nome: updatedNome,
                    Matricula: updatedMatricula,
                    Turma: updatedTurma
                })
            })
            .then(response => {
                if (response.ok) {
                    console.log('Aluno atualizado com sucesso!');
                    alert('Aluno atualizado com sucesso!');
                    window.location.href = 'principal.html'; // Ajuste o nome da página inicial conforme necessário
                } else {
                    throw new Error('Erro ao atualizar aluno');
                }
            })
            .catch(error => {
                console.error('Erro ao atualizar aluno:', error);
                alert('Erro ao atualizar aluno');
            });
        });
    }
}
