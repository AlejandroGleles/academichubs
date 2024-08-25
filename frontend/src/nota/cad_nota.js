document.addEventListener('DOMContentLoaded', function() {
    listarTurmas();
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
        console.log('Dados das turmas:', data);
        const turmaSelect = document.getElementById('turma');
        turmaSelect.innerHTML = '<option value="" disabled selected>Selecione a turma</option>';

        if (data.data && Array.isArray(data.data)) {
            data.data.forEach(turma => {
                const option = document.createElement('option');
                option.value = turma.ID;
                option.textContent = `${turma.nome || 'Nome não disponível'} - ${turma.semestre || 'Semestre não disponível'}/${turma.ano || 'Ano não disponível'}`;
                turmaSelect.appendChild(option);
            });

            turmaSelect.addEventListener('change', listarAtividades);
        } else {
            turmaSelect.innerHTML = '<option value="" disabled>Sem turmas disponíveis</option>';
        }
    })
    .catch(error => {
        console.error('Erro ao listar turmas:', error);
    });
}

function listarAtividades() {
    const turmaID = document.getElementById('turma').value;

    if (!turmaID) {
        return;
    }

    fetch(`http://localhost:8080/api/v1/atividades?turmaID=${turmaID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Dados das atividades:', data);
        const atividadeSelect = document.getElementById('atividade');
        atividadeSelect.innerHTML = '<option value="" disabled selected>Selecione a atividade</option>';

        if (data.data && Array.isArray(data.data)) {
            data.data.forEach(atividade => {
                const option = document.createElement('option');
                option.value = atividade.ID;
                option.textContent = `${atividade.Nome || 'Nome não disponível'} - Max Nota: ${atividade.Valor || 'Não definida'}`;
                atividadeSelect.appendChild(option);
            });

            atividadeSelect.addEventListener('change', listarAlunosParaNota);
        } else {
            atividadeSelect.innerHTML = '<option value="" disabled>Sem atividades disponíveis</option>';
        }
    })
    .catch(error => {
        console.error('Erro ao listar atividades:', error);
    });
}

function listarAlunosParaNota() {
    const turmaID = document.getElementById('turma').value;
    const atividadeID = document.getElementById('atividade').value;

    if (!turmaID || !atividadeID) {
        return;
    }

    fetch(`http://localhost:8080/api/v1/alunos?turmaID=${turmaID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Dados dos alunos:', data);
        const alunosNotasDiv = document.getElementById('alunosNotas');
        alunosNotasDiv.innerHTML = '';

        if (data.data && Array.isArray(data.data)) {
            data.data.forEach(aluno => {
                const alunoDiv = document.createElement('div');
                alunoDiv.className = 'nota-card';

                alunoDiv.innerHTML = `
                    <div class="mb-3">
                        <label for="nota_${aluno.id}" class="form-label">${aluno.nome || 'Nome não disponível'} (${aluno.matricula || 'Matrícula não disponível'})</label>
                        <input type="number" class="form-control" id="nota_${aluno.id}" placeholder="Nota (0-100)" min="0" max="100">
                    </div>
                `;

                alunosNotasDiv.appendChild(alunoDiv);
            });
        } else {
            alunosNotasDiv.innerHTML = '<p>Nenhum aluno encontrado.</p>';
        }
    })
    .catch(error => {
        console.error('Erro ao listar alunos:', error);
    });
}

document.getElementById('notaForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const turmaID = document.getElementById('turma').value;
    const atividadeID = document.getElementById('atividade').value;
    const notas = {};

    const inputs = document.querySelectorAll('#alunosNotas input');
    inputs.forEach(input => {
        const alunoID = input.id.split('_')[1];
        const nota = parseInt(input.value.trim(), 10);
        if (!isNaN(nota)) {
            notas[alunoID] = nota;
        }
    });

    if (Object.keys(notas).length === 0) {
        alert('Nenhuma nota informada.');
        return;
    }

    fetch(`http://localhost:8080/api/v1/atividades/${atividadeID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(atividade => {
        const maxNota = atividade.Valor; // Usa o valor máximo da atividade

        for (let alunoID in notas) {
            if (notas[alunoID] < 0 || notas[alunoID] > maxNota) {
                alert(`Nota para o aluno ${alunoID} deve estar entre 0 e ${maxNota}.`);
                return;
            }
        }

        const notaPromises = Object.keys(notas).map(alunoID => {
            return fetch('http://localhost:8080/api/v1/nota', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    AlunoID: alunoID,
                    AtividadeID: atividadeID,
                    Nota: notas[alunoID]
                })
            });
        });

        Promise.all(notaPromises)
            .then(responses => Promise.all(responses.map(response => response.json())))
            .then(results => {
                console.log('Notas cadastradas com sucesso:', results);
                alert('Notas cadastradas com sucesso!');
                window.location.href = 'principal.html'; // Ajuste o nome da página inicial conforme necessário
            })
            .catch(error => {
                console.error('Erro ao cadastrar notas:', error);
                alert('Erro ao cadastrar notas');
            });
    })
    .catch(error => {
        console.error('Erro ao validar atividade:', error);
    });
});