package handler

import (
	"errors"
	"fmt"
	"time"
)

func errParamIsRequired(name, typ string) error {
	return fmt.Errorf("param: %s (type: %s) is required", name, typ)
}

// create professor

type CreateAlunoRequest struct {
	Nome      string `json:"nome"`
	Matricula int    `json:"matricula"`
	Turmas    []uint `json:"turmas"` // IDs das turmas associadas
}

// Validate valida os dados da solicitação para criar um aluno.
func (req *CreateAlunoRequest) Validate() error {
	if req.Nome == "" {
		return errors.New("nome é obrigatório")
	}
	if req.Matricula <= 0 {
		return errors.New("matricula deve ser maior que zero")
	}
	return nil
}

// Validate valida os dados da solicitação para atualizar um aluno.

// update aluno
type UpdateAlunoRequest struct {
	Nome      string `Json:"nome"`
	Matricula int    `Json:"matricula"`
	Turmas    []uint `json:"turmas"`
}

func (req *UpdateAlunoRequest) Validate() error {
	if req.Nome == "" && req.Matricula <= 0 && len(req.Turmas) == 0 {
		return errors.New("pelo menos um dos campos nome, matricula ou turmas deve ser fornecido")
	}
	return nil
}

type CreateTurmaRequest struct {
	Nome        string `json:"nome"`
	Semestre    string `json:"semestre"`
	Ano         string `json:"ano"`
	ProfessorID uint   `json:"professorId"` // Corrigido para usar camelCase
}

func (r *CreateTurmaRequest) Validate() error {
	if r.Nome == "" || r.Semestre == "" || r.Ano == "" || r.ProfessorID == 0 {
		return fmt.Errorf("malformed request body")
	}
	if r.Nome == "" {
		return errParamIsRequired("nome", "string")
	}
	if r.Semestre == "" {
		return errParamIsRequired("semestre", "string")
	}
	if r.Ano == "" {
		return errParamIsRequired("ano", "string")
	}
	if r.ProfessorID == 0 {
		return errParamIsRequired("professorId", "uint")
	}

	return nil
}

type CreateOpenigRequest struct {
	Nome  string `Json:"nome"`
	Email string `Json:"email"`
	CPF   string `Json:"cpf"`
}

func (r *CreateOpenigRequest) Validate() error {
	if r.Nome == "" && r.Email == "" && r.CPF == "" {
		return fmt.Errorf("malformed request body")
	}
	if r.Nome == "" {
		return errParamIsRequired("nome", "string")
	}
	if r.Email == "" {
		return errParamIsRequired("email", "string")
	}
	if r.CPF == "" {
		return errParamIsRequired("cpf", "string")
	}

	return nil
}

// update professor
type UpdateOpenigRequest struct {
	Nome  string `Json:"nome"`
	Email string `Json:"email"`
	CPF   string `Json:"cpf"`
}

func (r *UpdateOpenigRequest) Validate() error {
	//if any field is provided, validation is truthy
	if r.Nome != "" || r.Email != "" || r.CPF != "" {
		return nil
	}
	//if none of the fields were providad return false
	return fmt.Errorf("at least one valid field must be provided")
}

type CreateAtividadeRequest struct {
	TurmaID uint   `json:"turmaId"`
	Valor   int    `json:"valor"`
	Data    string `json:"data"` // Esperado no formato dd/mm/yyyy
}

func (r *CreateAtividadeRequest) Validate() error {
	if r.TurmaID == 0 {
		return errParamIsRequired("TurmaID", "uint")
	}
	if r.Valor <= 0 {
		return errParamIsRequired("valor", "int")
	}
	if r.Data == "" {
		return errParamIsRequired("data", "string")
	}

	// Validação do formato da data
	_, err := time.Parse("02/01/2006", r.Data)
	if err != nil {
		return fmt.Errorf("invalid date format: %s", err.Error())
	}

	return nil
}

// update atividade
type UpdateAtividadeRequest struct {
	Turma string `Json:"turma"`
	Valor int    `Json:"valor"`
	Data  string `Json:"data"`
}

func (r *UpdateAtividadeRequest) Validate() error {
	//if any field is provided, validation is truthy
	if r.Turma != "" || r.Valor <= 0 || r.Data != "" {
		return nil
	}
	//if none of the fields were providad return false
	return fmt.Errorf("at least one valid field must be provided")
}

type CreatNotaRequest struct {
	AlunoID     uint `json:"aluno_id"`
	AtividadeID uint `json:"atividade_id"`
	Valor       int  `json:"valor"`
}

// Valida os campos da solicitação de criação de nota.
func (r *CreatNotaRequest) Validate() error {
	if r.AlunoID == 0 || r.AtividadeID == 0 {
		return fmt.Errorf("AlunoID e AtividadeID são obrigatórios")
	}
	if r.Valor < 0 || r.Valor > 100 {
		return errors.New("invalid request payload")

	}
	return nil
}

// UpdateNotaRequest é a estrutura para atualizar uma nota existente.
type UpdatNotaRequest struct {
	AlunoID     uint `json:"aluno_id"`
	AtividadeID uint `json:"atividade_id"`
	Valor       int  `json:"valor"`
}

// Valida os campos da solicitação de atualização de nota.
func (r *UpdatNotaRequest) Validate() error {
	if r.AlunoID == 0 && r.AtividadeID == 0 && r.Valor <= 0 {
		return fmt.Errorf("pelo menos um campo válido deve ser fornecido")
	}
	if r.Valor < 0 || r.Valor > 100 {
		return errors.New("invalid request payload")
	}
	return nil
}
