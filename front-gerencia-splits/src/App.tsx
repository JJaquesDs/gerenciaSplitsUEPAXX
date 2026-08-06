import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard'
import { Historico } from './pages/Historico'
import { Locais } from './pages/Locais'
import { Splits } from './pages/Splits'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* elemento Rota Pai */}
                <Route path="/" element={<Layout />}>
                    
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    
                    {/* Rotas Filhas vão ser injetadas no Outlet */}
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="locais" element={<Locais />} />
                    <Route path="splits" element={<Splits />} />
                    <Route path="historico" element={<Historico />} />
                    
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App
