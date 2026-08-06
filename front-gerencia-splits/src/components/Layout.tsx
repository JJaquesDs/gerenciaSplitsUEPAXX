import { Outlet, Link, useLocation } from "react-router-dom";
import logo_uepa from '../assets/logo_uepa.png'

export function Layout() {
    const location = useLocation();

    // verificar se a rota está ativa
    const isActive = (path: string) => {
        return location.pathname === path ? 'topbar-link active' : 'topbar-link';
    };

    return (
        <>
            <header className="topbar-wrapper">
                <div className="topbar-content">
                    
                    <div className="topbar-brand">
                        <img src={logo_uepa} alt="Logo UEPA" className="topbar-logo" />
                        <div className="topbar-divider"></div>
                        <h1 className="topbar-title">Sistema de Gestão de Manutenções</h1>
                    </div>

                    <nav className="topbar-nav">
                        <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
                        <Link to="/locais" className={isActive('/locais')}>Locais</Link>
                        <Link to="/splits" className={isActive('/splits')}>Splits</Link>
                        <Link to="/historico" className={isActive('/historico')}>Histórico</Link>
                    </nav>
                </div>

                <div className="topbar-bottom-line"></div>
            </header>

            {/* Outlet renderiza o conteúdo das páginas*/}
            <main className="page-container">
                <Outlet />
            </main>
        </>
    );
       
}