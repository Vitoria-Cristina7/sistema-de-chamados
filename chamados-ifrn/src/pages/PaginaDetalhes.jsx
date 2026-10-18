import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import {
  buscarChamado,
  excluirChamado,
  iniciarChamado,
  resolverChamado,
} from "../services/chamadoService";

function PaginaDetalhes() {
  const { id } = useParams();
  const navegar = useNavigate();

  const [chamado, setChamado] = useState(null);
  const [erro, setErro] = useState("");
  const [excluindo, setExcluindo] = useState(false);

  const [responsavel, setResponsavel] = useState("");
  const [solucao, setSolucao] = useState("");
  const [processando, setProcessando] = useState(false);

  const carregarChamado = useCallback(async () => {
    try {
      const dados = await buscarChamado(id);
      setChamado(dados);
      setErro("");
    } catch {
      setErro("Não foi possível carregar o chamado.");
    }
  }, [id]);

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        const dados = await buscarChamado(id);

        if (ativo) {
          setChamado(dados);
          setErro("");
        }
      } catch {
        if (ativo) {
          setErro("Não foi possível carregar o chamado.");
        }
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, [id]);

  async function apagarChamado() {
    const confirmar = window.confirm(
      "Tem certeza de que deseja excluir este chamado?",
    );

    if (!confirmar) {
      return;
    }

    setExcluindo(true);
    setErro("");

    try {
      await excluirChamado(id);
      alert("Chamado excluído com sucesso!");
      navegar("/");
    } catch {
      setErro("Não foi possível excluir o chamado.");
      setExcluindo(false);
    }
  }

  async function iniciarAtendimento(evento) {
    evento.preventDefault();
    setErro("");

    if (!responsavel.trim()) {
      setErro("Informe o nome do responsável.");
      return;
    }

    setProcessando(true);

    try {
      await iniciarChamado(id, responsavel);
      await carregarChamado();
      setResponsavel("");
    } catch {
      setErro("Não foi possível iniciar o atendimento.");
    } finally {
      setProcessando(false);
    }
  }

  async function finalizarChamado(evento) {
    evento.preventDefault();
    setErro("");

    if (!solucao.trim()) {
      setErro("Descreva a solução do chamado.");
      return;
    }

    setProcessando(true);

    try {
      await resolverChamado(id, solucao);
      await carregarChamado();
      setSolucao("");
    } catch {
      setErro("Não foi possível resolver o chamado.");
    } finally {
      setProcessando(false);
    }
  }

  if (!chamado && erro) {
    return (
      <main>
        <h2>Erro</h2>
        <p role="alert">{erro}</p>
        <Link to="/">Voltar para o início</Link>
      </main>
    );
  }

  if (!chamado) {
    return <p>Carregando chamado...</p>;
  }

  return (
    <main>
      <Link to="/">Voltar para o início</Link>

      <h2>{chamado.titulo}</h2>

      <p>
        <strong>Descrição:</strong> {chamado.descricao}
      </p>

      <p>
        <strong>Tipo:</strong> {chamado.tipo}
      </p>

      <p>
        <strong>Local:</strong> {chamado.local}
      </p>

      <p>
        <strong>Prioridade:</strong> {chamado.prioridade}
      </p>

      <p>
        <strong>Status:</strong> {chamado.status}
      </p>

      <p>
        <strong>Data de abertura:</strong> {chamado.data_abertura}
      </p>

      <p>
        <strong>Responsável:</strong> {chamado.responsavel || "Não definido"}
      </p>

      <p>
        <strong>Solução:</strong> {chamado.solucao || "Ainda não resolvido"}
      </p>

      {erro && <p role="alert">{erro}</p>}

      {chamado.status === "aberto" && (
        <form onSubmit={iniciarAtendimento}>
          <h3>Iniciar atendimento</h3>

          <label htmlFor="responsavel">Nome do responsável:</label>

          <input
            id="responsavel"
            type="text"
            value={responsavel}
            onChange={(evento) => setResponsavel(evento.target.value)}
            required
          />

          <button type="submit" disabled={processando}>
            {processando ? "Iniciando..." : "Iniciar atendimento"}
          </button>
        </form>
      )}

      {chamado.status === "em andamento" && (
        <form onSubmit={finalizarChamado}>
          <h3>Resolver chamado</h3>

          <label htmlFor="solucao">Descreva a solução:</label>

          <textarea
            id="solucao"
            value={solucao}
            onChange={(evento) => setSolucao(evento.target.value)}
            required
          />

          <button type="submit" disabled={processando}>
            {processando ? "Resolvendo..." : "Resolver chamado"}
          </button>
        </form>
      )}

      <div>
        {chamado.status !== "resolvido" && (
          <button
            type="button"
            onClick={() => navegar(`/chamado/${id}/editar`)}
          >
            Editar chamado
          </button>
        )}

        <button type="button" onClick={apagarChamado} disabled={excluindo}>
          {excluindo ? "Excluindo..." : "Excluir chamado"}
        </button>
      </div>
    </main>
  );
}

export default PaginaDetalhes;
