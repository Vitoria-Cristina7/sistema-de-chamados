import { BrowserRouter, Routes, Route } from "react-router-dom";

import BarraNavegacao from "./components/BarraNavegacao";
import PaginaInicial from "./pages/PaginaInicial";
import PaginaDetalhes from "./pages/PaginaDetalhes";
import PaginaFormulario from "./pages/PaginaFormulario";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <BarraNavegacao />

      <Routes>
        <Route path="/" element={<PaginaInicial />} />

        <Route path="/novo" element={<PaginaFormulario />} />

        <Route path="/chamado/:id" element={<PaginaDetalhes />} />

        <Route path="/chamado/:id/editar" element={<PaginaFormulario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
