import { Nav, Navbar, Container } from "react-bootstrap";
import { Link, Outlet, useLocation } from "react-router-dom";

export function Layout() {
    const location = useLocation();
    return (
        <>
            {/*Menu Superior (Navbar)*/}
            <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
                <Container>
                    <Navbar.Brand as={Link} to="/">Gestão de Splits</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/" active={location.pathname === '/'}>
                                Dashboard
                            </Nav.Link>
                            <Nav.Link as={Link} to="/locais" active={location.pathname === '/locais'}>
                                Locais
                            </Nav.Link>
                            <Nav.Link as={Link} to="/splits" active={location.pathname === '/splits'}>
                                Splits
                            </Nav.Link>
                            <Nav.Link as={Link} to="/historico" active={location.pathname === '/historico'}>
                                Histórico
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/*O Outlet é onde as páginas (Rotas filhas) serão renderizadas*/}
            <Container>
                <Outlet />
            </Container>
        </>

    )
}