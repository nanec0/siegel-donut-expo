import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import FOHScreen from "./pages/FOHScreen";
import ExpoScreen from "./pages/ExpoScreen";
import DonutKDS from "./pages/DonutKDS";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"      element={<Navigate to="/foh" replace />} />
        <Route path="/foh"   element={<FOHScreen />} />
        <Route path="/expo"  element={<ExpoScreen />} />
        <Route path="/kds"   element={<DonutKDS />} />
      </Routes>
    </BrowserRouter>
  );
}
