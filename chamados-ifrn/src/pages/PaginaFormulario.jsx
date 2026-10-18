import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  cadastrarChamado,
  editarChamado,
  buscarChamado,
  buscarTipos,
  buscarLocais,
  buscarPrioridades,
} from "../services/chamadoService";

function PaginaFormulario() {
  const navegar = useNavigate();
  const { id } = useParams();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("");
  const [local, setLocal] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [dataAbertura, setDataAbertura] = useState("");

  const [tipos, setTipos] = useState([]);
  const [locais, setLocais] = useState([]);
  const [prioridades, setPrioridades] = useState([]);

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [resolvido, setResolvido] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        const dadosTipos = await buscarTipos();
        const dadosLocais = await buscarLocais();
        const dadosPrioridades = await buscarPrioridades();

        setTipos(dadosTipos);
        setLocais(dadosLocais);
        setPrioridades(dadosPrioridades);

        if (id) {
          const chamado = await buscarChamado(id);

          setTitulo(chamado.titulo);
          setDescricao(chamado.descricao);
          setTipo(chamado.tipo);
          setLocal(chamado.local);
          setPrioridade(chamado.prioridade);
          setDataAbertura(chamado.data_abertura);
          setResolvido(chamado.status === "resolvido");
        }
      } catch {
        setErro("Não foi possível carregar os dados.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [id]);

  async function salvarChamado(evento) {
    evento.preventDefault();
    setErro("");

    const dados = {
      titulo: titulo,
      descricao: descricao,
      tipo: tipo,
      local: local,
      prioridade: prioridade,
      data_abertura: dataAbertura,
    };

    try {
      if (id) {
        await editarChamado(id, dados);
        alert("Chamado atualizado com sucesso!");
      } else {
        await cadastrarChamado(dados);
        alert("Chamado cadastrado com sucesso!");
      }

      navegar("/");
    } catch {
      setErro("Não foi possível salvar o chamado. Verifique os dados.");
    }
  }

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (resolvido) {
    return (
      <main>
        <h2>Chamado resolvido</h2>
        <p>Não é possível editar um chamado que já foi resolvido.</p>
        <button onClick={() => navegar(`/chamado/${id}`)}>
          Voltar aos detalhes
        </button>
      </main>
    );
  }

  return (
    <main>
      <h2>{id ? "Editar chamado" : "Abrir chamado"}</h2>

      {erro && <p>{erro}</p>}

      <form onSubmit={salvarChamado}>
        <label htmlFor="titulo">Título:</label>
        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(evento) => setTitulo(evento.target.value)}
          required
        />

        <label htmlFor="descricao">Descrição:</label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(evento) => setDescricao(evento.target.value)}
          required
        />

        <label htmlFor="tipo">Tipo:</label>
        <select
          id="tipo"
          value={tipo}
          onChange={(evento) => setTipo(evento.target.value)}
          required
        >
          <option value="">Selecione o tipo</option>
          {tipos.map((item, indice) => (
            <option key={indice} value={item}>
              {item}
            </option>
          ))}
        </select>

        <label htmlFor="local">Local:</label>
        <select
          id="local"
          value={local}
          onChange={(evento) => setLocal(evento.target.value)}
          required
        >
          <option value="">Selecione o local</option>
          {locais.map((item, indice) => (
            <option key={indice} value={item}>
              {item}
            </option>
          ))}
        </select>

        <label htmlFor="prioridade">Prioridade:</label>
        <select
          id="prioridade"
          value={prioridade}
          onChange={(evento) => setPrioridade(evento.target.value)}
          required
        >
          <option value="">Selecione a prioridade</option>
          {prioridades.map((item, indice) => (
            <option key={indice} value={item}>
              {item}
            </option>
          ))}
        </select>

        <label htmlFor="dataAbertura">Data de abertura:</label>
        <input
          id="dataAbertura"
          type="date"
          value={dataAbertura}
          onChange={(evento) => setDataAbertura(evento.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit">
          {id ? "Salvar alterações" : "Salvar chamado"}
        </button>

        <button type="button" onClick={() => navegar("/")}>
          Cancelar
        </button>
      </form>
    </main>
  );
}

export default PaginaFormulario;
