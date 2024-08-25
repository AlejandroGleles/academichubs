document.addEventListener('DOMContentLoaded', function() {
    listarP(); // Lista os professores
    cProfessor(); // Inicializa o cadastro de professores
});

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

function listarP() {
    fetch('http://localhost:8080/api/v1/professores', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const listaDiv = document.getElementById('lista');
        listaDiv.innerHTML = '';

        if (data.data && Array.isArray(data.data)) {
            data.data.forEach(professor => {
                const professorCard = document.createElement('div');
                professorCard.className = 'col-md-12'; // Ajuste conforme o layout desejado
                professorCard.dataset.id = professor.ID;
                professorCard.innerHTML = `
                    <div class="card mb-3 professor-card">
                        <div class="card-body">
                            <h5 class="card-title">${professor.Nome}</h5>
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
        } else {
            listaDiv.innerHTML = '<p>Nenhum professor encontrado.</p>';
        }
    })
    .catch(error => {
        console.error('Erro ao carregar professores:', error);
        document.getElementById('lista').innerHTML = '<p>Falha ao carregar dados.</p>';
    });
}

function editarProfessor(id, nome, email, cpf) {
    const url = `edita_professor.html?id=${id}&nome=${encodeURIComponent(nome)}&email=${encodeURIComponent(email)}&cpf=${encodeURIComponent(cpf)}`;
    window.location.href = url;
}

function deletarProfessor(id) {
    fetch(`http://localhost:8080/api/v1/professor?id=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao deletar professor');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('Professor deletado com sucesso!');
        listarP(); // Atualiza a lista de professores
    })
    .catch((error) => {
        console.error('Erro ao deletar professor:', error);
        alert('Erro ao deletar professor');
    });
}
