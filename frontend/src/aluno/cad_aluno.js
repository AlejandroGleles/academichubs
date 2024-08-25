document.addEventListener('DOMContentLoaded', function() {
    listarTurmas(); // Preenche o campo de seleção de turmas
    listarAlunos(); // Lista os alunos existentes
    inicializarCadastro(); // Inicializa o cadastro de alunos
});

function listarTurmas() {
    fetch('http://localhost:8080/api/v1/turmas', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const turmasContainer = document.getElementById('turmas-container');
        turmasContainer.innerHTML = ''; // Limpa o conteúdo atual

        if (data.data && Array.isArray(data.data)) {
            data.data.forEach(turma => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = turma.ID;
                checkbox.id = `turma-${turma.ID}`;

                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.textContent = `${turma.nome} - ${turma.semestre}/${turma.ano}`;

                const div = document.createElement('div');
                div.className = 'form-check';
                div.appendChild(checkbox);
                div.appendChild(label);

                turmasContainer.appendChild(div);
            });
        } else {
            turmasContainer.innerHTML = '<p>Sem turmas disponíveis</p>';
        }
    })
    .catch(error => {
        console.error('Erro ao carregar turmas:', error);
    });
}

function inicializarCadastro() {
    const alunoForm = document.getElementById('alunoForm');
    if (alunoForm) {
        alunoForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nome = document.getElementById('nome').value;
            const matricula = parseFloat(document.getElementById('matricula').value);

            const turmaCheckboxes = document.querySelectorAll('#turmas-container input[type="checkbox"]:checked');
            const turmaIDs = Array.from(turmaCheckboxes).map(checkbox => parseInt(checkbox.value, 10));

            if (!nome || isNaN(matricula) || matricula <= 0 || turmaIDs.length === 0) {
                alert('Por favor, preencha todos os campos corretamente e selecione pelo menos uma turma.');
                return;
            }

            const aluno = {
                nome: nome,
                matricula: matricula,
                turmas: turmaIDs
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
                if (data.error) {
                    console.error('Erro ao cadastrar aluno:', data.error);
                    alert('Erro ao cadastrar aluno: ' + data.error);
                } else {
                    alert('Aluno cadastrado com sucesso!');
                    listarAlunos(); // Atualiza a lista de alunos após o cadastro
                    alunoForm.reset(); // Limpa o formulário após o cadastro
                }
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
        const listaDiv = document.getElementById('lista');
        listaDiv.innerHTML = '';

        if (data.data && Array.isArray(data.data)) {
            data.data.forEach(aluno => {
                console.log('Aluno:', aluno);

                const alunoCard = document.createElement('div');
                alunoCard.className = 'aluno-card';
                alunoCard.innerHTML = `
                    <h5>${aluno.nome}</h5>
                    <p><strong>Matrícula:</strong> ${aluno.matricula}</p>
                    <p><strong>Turmas:</strong> ${aluno.turmaNames}</p>
                    <div class="card-actions">
                        <button class="btn btn-warning" onclick="editarAluno(${aluno.id})">Editar</button>
                        <button class="btn btn-danger" onclick="deletarAluno(${aluno.id})">Deletar</button>
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
        const listaDiv = document.getElementById('lista');
        listaDiv.innerHTML = '<p>Erro ao carregar alunos.</p>';
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
        if (!response.ok) {
            throw new Error('Erro ao deletar aluno');
        }
        return response.json(); // Pode não ser necessário retornar JSON se o backend não estiver enviando resposta
    })
    .then(data => {
        alert('Aluno deletado com sucesso!');
        listarAlunos(); // Atualiza a lista de alunos
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Erro ao deletar aluno');
    });
}
