import { useEffect, useMemo, useState } from 'react';
import type { SyntheticEvent } from 'react';
import { Alert, Button, Card, Form, Spinner, Table, InputGroup } from 'react-bootstrap';
import { localService } from '../services/localService';
import type { LocalResponse } from '../types/Local';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function Locais() {
    const [locais, setLocais] = useState<LocalResponse[]>([]);
    const [nomeLocal, setNomeLocal] = useState('');
    const [loading, setLoading] = useState(true);

    // Estados para alertas e busca
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [busca, setBusca] = useState('');

    useEffect(() => {
        // Carrega os dados normalmente na primeira vez
        carregarLocais();

        // Configura a conexão com o túnel do Spring Boot
        const stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            onConnect: () => {
                // Sintoniza no canal de atualizações
                stompClient.subscribe('/topic/atualizacoes', () => {
                    // Se o Java gritar que teve mudança, recarrega a tabela silenciosamente
                    carregarLocais();
                });
            }
        });

        // Liga o túnel
        stompClient.activate();

        // Limpeza: desliga o túnel quando o usuário mudar de tela
        return () => {
            stompClient.deactivate();
        };
    }, []);

    function carregarLocais() {
        setLoading(true);
        localService.listar()
            .then((dados) => {
                setLocais(dados);
            })
            .catch(() => {
                setErro("Não foi possível carregar a lista de locais.");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    // Lógica de filtro para a barra de pesquisa
    const locaisFiltrados = useMemo(() => {
        const removerAcentos = (texto: string) => {
            return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        };

        const termo = removerAcentos(busca.trim().toLowerCase());
        
        if (!termo) return locais;

        return locais.filter((local) => {
            return [local.nomeLocal, local.localId]
                .filter(Boolean)
                .some((campo) => {
                    const campoLimpo = removerAcentos(String(campo).toLowerCase());
                    return campoLimpo.includes(termo);
                });
        });
    }, [locais, busca]);

    async function handleCriar(e: SyntheticEvent) {
        e.preventDefault();
        if (!nomeLocal.trim()) return;

        setErro('');
        setSucesso('');

        try {
            setLoading(true);
            await localService.criar({ nomeLocal });
            setNomeLocal('');
            
            await carregarLocais();
            
            // Mensagem aparece e o setTimeout limpa ela após 3 segundos
            setSucesso("Local cadastrado com sucesso!");
            setTimeout(() => {
                setSucesso('');
            }, 3000);
            
        } catch {
            setErro("Erro ao criar local. Verifique se o nome já existe.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDeletar(uuid: string) {
        const confirmar = window.confirm("Tem certeza que deseja deletar este local?");
        if (!confirmar) return;

        setErro('');
        setSucesso('');

        try {
            setLoading(true);
            await localService.deletar(uuid);
            
            setLocais(prevLocais => prevLocais.filter(local => local.localId !== uuid));
            
            // Mensagem de sucesso ao deletar
            setSucesso("Local excluído com sucesso!");
            setTimeout(() => {
                setSucesso('');
            }, 3000);

        } catch {
            setErro("Erro ao deletar o local. Pode haver equipamentos vinculados a ele.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {/* Cabeçalho */}
            <header className="page-head">
                <h1>Gerenciar Locais</h1>
                <p>Ambientes da instituição onde os equipamentos de climatização podem ser instalados.</p>
            </header>

            {/* Alertas de Feedback */}
            {erro && <Alert variant="danger" onClose={() => setErro('')} dismissible>{erro}</Alert>}
            {sucesso && <Alert variant="success" onClose={() => setSucesso('')} dismissible>{sucesso}</Alert>}

            {/* Formulário de Registro */}
            <Card className="app-card mb-5">
                <Card.Body style={{ padding: '2rem' }}>
                    <h5 className="mb-4" style={{ color: 'var(--uepa-blue)', fontWeight: 700 }}>Cadastrar Novo Local</h5>
                    
                    <Form onSubmit={handleCriar} className="d-flex flex-column flex-md-row gap-3 align-items-md-end">
                        <Form.Group className="flex-grow-1" controlId="formNomeLocal">
                            <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Nome do Ambiente</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Ex: Auditório Central, Laboratório 1, Biblioteca..." 
                                value={nomeLocal}
                                onChange={(e) => setNomeLocal(e.target.value)}
                                disabled={loading}
                                required
                                className="p-2"
                            />
                        </Form.Group>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            style={{ backgroundColor: 'var(--uepa-blue)', border: 'none', padding: '0.65rem 1.5rem' }}
                        >
                            {loading ? <Spinner size="sm" animation="border" /> : 'Adicionar Local'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            {/* Barra de Pesquisa */}
            <div className="search-container">
                <label className="search-label">Pesquisar ambientes</label>
                <InputGroup className="search-premium">
                    <InputGroup.Text>
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                    </InputGroup.Text>
                    <Form.Control
                        type="search"
                        placeholder="Buscar por nome ou ID..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </InputGroup>
            </div>

            {/* Tabela Principal */}
            <div className="table-shell">
                <Table responsive hover className="app-table">
                    <thead>
                        <tr>
                            <th style={{ width: '35%' }}>ID (Identificador Único)</th>
                            <th>Nome do Local</th>
                            <th className="text-center" style={{ width: '120px' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && locais.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center py-5">
                                    <Spinner size="sm" animation="border" className="me-2" style={{ color: 'var(--uepa-blue)' }} />
                                    Carregando ambientes...
                                </td>
                            </tr>
                        )}
                        
                        {!loading && locaisFiltrados.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center py-5 text-muted-custom">
                                    {busca 
                                        ? 'Nenhum local encontrado para o termo buscado.' 
                                        : 'Nenhum local cadastrado ainda.'}
                                </td>
                            </tr>
                        )}
                        
                        {locaisFiltrados.map((local) => (
                            <tr key={local.localId}>
                                <td className="text-muted-custom" style={{ fontSize: '0.85rem' }}>
                                    {local.localId}
                                </td>
                                <td style={{ color: 'var(--uepa-blue)', fontWeight: 700 }}>
                                    {local.nomeLocal}
                                </td>
                                <td className="text-center">
                                    <button 
                                        className="btn-icon-danger" 
                                        onClick={() => handleDeletar(local.localId)}
                                        title="Excluir local"
                                        disabled={loading}
                                    >
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}