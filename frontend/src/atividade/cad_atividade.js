document.addEventListener('DOMContentLoaded', function() {
    listarTurmas(); // Função para listar as turmas
    listarAtividades(); // Função para listar as atividades
    cAtividade(); // Inicializa o cadastro de atividades
});

function cAtividade() {
    const atividadeForm = document.getElementById('atividadeForm');
    if (atividadeForm) {
        atividadeForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const turmaID = document.getElementById('turma').value;
            const valor = parseInt(document.getElementById('valor').value.trim(), 10);
            const dataISO = document.getElementById('data').value; // Data no formato yyyy-mm-dd

            // Verifique se os campos foram encontrados e têm valores
            if (isNaN(valor) || !turmaID || !dataISO) {
                alert('Todos os campos são obrigatórios.');
                return;
            }

            // Converte a data do formato yyyy-mm-dd para dd/mm/yyyy
            const [year, month, day] = dataISO.split('-');
            const dataFormatada = `${day}/${month}/${year}`;

            // Criação do objeto atividade no formato esperado
            const atividade = {
                turmaId: parseInt(turmaID, 10),
                valor: valor,
                data: dataFormatada // Data no formato dd/mm/yyyy
            };

            // Exibe o objeto que será enviado para o servidor no console
            console.log('Payload sendo enviado:', atividade);

            fetch('http://localhost:8080/api/v1/atividade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(atividade)
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text || 'Network response was not ok');
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                alert('Atividade cadastrada com sucesso!');
                window.location.href = 'principal.html'; // Ajuste o nome da página inicial conforme necessário
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Erro ao cadastrar atividade: ' + error.message);
            });
        });
    } else {
        console.error('Formulário de cadastro de atividades não encontrado');
    }
}

// Função para listar turmas e preencher o <select>
function listarTurmas() {
    fetch('http://localhost:8080/api/v1/turmas', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const turmaSelect = document.getElementById('turma');
        turmaSelect.innerHTML = '<option value="" disabled selected>Selecione a turma</option>'; // Adiciona uma opção padrão

        if (data.data && Array.isArray(data.data)) {
            data.data.forEach(turma => {
                const option = document.createElement('option');
                option.value = turma.ID; // ID da turma
                option.textContent = `${turma.nome} - ${turma.semestre}/${turma.ano}`; // Nome e detalhes da turma
                turmaSelect.appendChild(option);
            });
        } else {
            turmaSelect.innerHTML = '<option value="" disabled>Sem turmas disponíveis</option>';
        }
    })
    .catch(error => {
        console.error('Erro ao carregar turmas:', error);
        const turmaSelect = document.getElementById('turma');
        turmaSelect.innerHTML = '<option value="" disabled>Erro ao carregar turmas</option>';
    });
}

// Função para buscar o nome da turma
function buscarTurmaNome(turmaID) {
    return fetch(`http://localhost:8080/api/v1/turma?id=${turmaID}`, { // Corrigido para parâmetros de consulta
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(text || 'Network response was not ok');
            });
        }
        return response.json();
    })
    .then(data => {
        // Ajustar de acordo com a estrutura dos dados
        const turma = data.data;  // Verifica se data e o primeiro item existem
        if (turma && turma.nome) {
            return turma.nome; // Retorna o nome da turma
        } else {
            return 'Desconhecido'; // Retorna um valor padrão se não houver nome
        }
    })
    .catch(error => {
        console.error('Erro ao buscar turma:', error);
        return 'Desconhecido'; // Retorna um valor padrão se houver um erro
    });
}

function listarAtividades() {
    fetch('http://localhost:8080/api/v1/atividades', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(text || 'Network response was not ok');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Dados recebidos:', data);

        // Assumindo que os dados estão dentro da propriedade 'data'
        const atividades = data.data || []; 

        const listaDiv = document.getElementById('lista');
        listaDiv.innerHTML = '';

        if (Array.isArray(atividades) && atividades.length > 0) {
            Promise.all(atividades.map(atividade => 
                buscarTurmaNome(atividade.TurmaID)
                .then(turmaNome => ({
                    ...atividade,
                    turmaNome
                }))
            ))
            .then(atividadesComTurmas => {
                atividadesComTurmas.forEach(atividade => {
                    const atividadeCard = document.createElement('div');
                    atividadeCard.className = 'col-md-4';
                    atividadeCard.dataset.id = atividade.ID; // ID da atividade

                    atividadeCard.innerHTML = `
                        <div class="card mb-3 atividade-card">
                            <div class="card-body">
                               <p class="card-text"><strong>Turma:</strong> ${atividade.turmaNome || 'Não especificado'}</p>
                                <p class="card-text"><strong>Pontos:</strong> ${atividade.Valor || 'Não especificado'}</p>
                                <p class="card-text"><strong>Data:</strong> ${atividade.Data ? new Date(atividade.Data).toLocaleDateString('pt-BR') : 'Não especificado'}</p>
                                <div class="card-actions">
                                    <button class="btn btn-warning" onclick="editarAtividade(${atividade.ID}, ${atividade.Valor}, ${atividade.TurmaID}, '${atividade.Data}')">Editar</button>
                                    <button class="btn btn-danger" onclick="deletarAtividade(${atividade.ID})">Deletar</button>
                                </div>
                            </div>
                        </div>
                    `;
                    listaDiv.appendChild(atividadeCard);
                });
            });
        } else {
            listaDiv.innerHTML = '<p>Nenhuma atividade disponível.</p>';
        }
    })
    .catch(error => {
        console.error('Houve um problema com a operação fetch:', error);
        document.getElementById('lista').innerHTML = '<p>Falha ao carregar dados.</p>';
    });
}

// Função para editar uma atividade
function editarAtividade(id, valor, turmaId, data) {
    // Redireciona para a página de edição com os parâmetros necessários
    window.location.href = `edita_atividade.html?id=${id}&valor=${valor}&turmaId=${turmaId}&data=${data}`;
}

// Função para deletar uma atividade
function deletarAtividade(id) {
    if (confirm('Você tem certeza de que deseja deletar esta atividade?')) {
        fetch(`http://localhost:8080/api/v1/atividade?id=${id}`, { // Corrigido para parâmetros de consulta
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text || 'Network response was not ok');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            alert('Atividade deletada com sucesso!');
            listarAtividades(); // Atualiza a lista de atividades
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Erro ao deletar atividade: ' + error.message);
        });
    }
}
