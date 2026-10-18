import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  listarChamados,
  buscarTipos,
  buscarLocais,
  buscarPrioridades,
} from "../services/chamadoService";

function PaginaInicial() {
  const [chamados, setChamados] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [locais, setLocais] = useState([]);
  const [prioridades, setPrioridades] = useState([]);

  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  const [tipo, setTipo] = useState("");
  const [local, setLocal] = useState("");
  const [prioridade, setPrioridade] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDados() {
      try {
        const dados = await listarChamados();
        const dadosTipos = await buscarTipos();
        const dadosLocais = await buscarLocais();
        const dadosPrioridades = await buscarPrioridades();

        setChamados(Array.isArray(dados) ? dados : dados.chamados || []);

        setTipos(dadosTipos);
        setLocais(dadosLocais);
        setPrioridades(dadosPrioridades);
      } catch {
        setErro("Não foi possível carregar os chamados.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  const chamadosFiltrados = chamados.filter((chamado) => {
    const titulo = (chamado.titulo || "").toLowerCase();
    const descricao = (chamado.descricao || "").toLowerCase();

    return (
      (titulo.includes(busca.toLowerCase()) ||
        descricao.includes(busca.toLowerCase())) &&
      (status === "" || chamado.status === status) &&
      (tipo === "" || chamado.tipo === tipo) &&
      (local === "" || chamado.local === local) &&
      (prioridade === "" || chamado.prioridade === prioridade)
    );
  });

  if (carregando) {
    return <p>Carregando chamados...</p>;
  }

  if (erro) {
    return <p>{erro}</p>;
  }

  return (
    <main>
      <h2>Meus chamados</h2>

      <p>
        <Link to="/novo">+ Abrir novo chamado</Link>
      </p>

      <input
        type="text"
        placeholder="Buscar por título ou descrição..."
        value={busca}
        onChange={(evento) => setBusca(evento.target.value)}
      />

      <br />
      <br />

      <select
        value={status}
        onChange={(evento) => setStatus(evento.target.value)}
      >
        <option value="">Todos os status</option>
        <option value="aberto">Aberto</option>
        <option value="em andamento">Em andamento</option>
        <option value="resolvido">Resolvido</option>
      </select>

      <select value={tipo} onChange={(evento) => setTipo(evento.target.value)}>
        <option value="">Todos os tipos</option>

        {tipos.map((item, indice) => (
          <option key={indice} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select
        value={local}
        onChange={(evento) => setLocal(evento.target.value)}
      >
        <option value="">Todos os locais</option>

        {locais.map((item, indice) => (
          <option key={indice} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select
        value={prioridade}
        onChange={(evento) => setPrioridade(evento.target.value)}
      >
        <option value="">Todas as prioridades</option>

        {prioridades.map((item, indice) => (
          <option key={indice} value={item}>
            {item}
          </option>
        ))}
      </select>

      {chamadosFiltrados.length === 0 ? (
        <p>Nenhum chamado encontrado.</p>
      ) : (
        chamadosFiltrados.map((chamado) => (
          <div key={chamado.id}>
            <h3>
              <Link to={`/chamado/${chamado.id}`}>{chamado.titulo}</Link>
            </h3>

            <p>Tipo: {chamado.tipo}</p>
            <p>Local: {chamado.local}</p>
            <p>Prioridade: {chamado.prioridade}</p>
            <p>Status: {chamado.status}</p>

            <hr />
          </div>
        ))
      )}
    </main>
  );
}

export default PaginaInicial;
