import { Link } from "react-router-dom";

function BarraNavegacao() {
  return (
    <header>
      <h1>Sistema de Chamados IFRN</h1>

      <nav>
        <Link to="/">Início</Link>
        <Link to="/novo">Abrir chamado</Link>
      </nav>
    </header>
  );
}

export default BarraNavegacao;
