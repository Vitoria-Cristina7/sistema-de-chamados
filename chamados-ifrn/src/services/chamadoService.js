import axios from "axios";

const api = axios.create({
  baseURL: "https://api-chamados.jefersonqueiroga.com.br",
  headers: {
    "X-API-Key": import.meta.env.VITE_API_KEY,
  },
});

export async function listarChamados(filtros = {}) {
  const resposta = await api.get("/chamados", {
    params: filtros,
  });

  return resposta.data;
}

export async function buscarTipos() {
  const resposta = await api.get("/tipos");
  return resposta.data;
}

export async function buscarLocais() {
  const resposta = await api.get("/locais");
  return resposta.data;
}

export async function buscarPrioridades() {
  const resposta = await api.get("/prioridades");
  return resposta.data;
}

export async function buscarChamado(id) {
  const resposta = await api.get(`/chamados/${id}`);
  return resposta.data;
}

export async function cadastrarChamado(chamado) {
  const resposta = await api.post("/chamados", chamado);
  return resposta.data;
}

export async function editarChamado(id, chamado) {
  const resposta = await api.put(`/chamados/${id}`, chamado);
  return resposta.data;
}

export async function excluirChamado(id) {
  const resposta = await api.delete(`/chamados/${id}`);
  return resposta.data;
}

export async function iniciarChamado(id, responsavel) {
  const resposta = await api.patch(`/chamados/${id}/iniciar`, {
    responsavel: responsavel,
  });

  return resposta.data;
}

export async function resolverChamado(id, solucao) {
  const resposta = await api.patch(`/chamados/${id}/resolver`, {
    solucao: solucao,
  });

  return resposta.data;
}
