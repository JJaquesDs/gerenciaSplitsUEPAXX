import { useEffect, useMemo, useState } from 'react';
import { Form, Spinner, Table, Row, Col, Card, InputGroup, Dropdown } from 'react-bootstrap';
import { futManService } from '../services/futManService';
import { hisManService } from '../services/hisManService';
import type { DashboardGeralResponse } from '../types/Manutencao';
import { relatoriosService } from '../services/relatoriosService';

function calcularStatus(dataString?: string) {
    if (!dataString) return 'NONE';
    try {
        const limpa = dataString.trim(); 
        const partes = limpa.split('-');
        const dataManutencao = new Date(parseInt(partes[0], 10), parseInt(partes[1], 10) - 1, parseInt(partes[2], 10));
        
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); 

        const tempoMan = dataManutencao.getTime();
        const tempoHoje = hoje.getTime();

        if (tempoMan < tempoHoje) return 'ATRASADA';
        if (tempoMan === tempoHoje) return 'HOJE';
        return 'PRAZO';
    } catch {
        return 'NONE';
    }
}

export function Dashboard() {
    const [tabelaGeral, setTabelaGeral] = useState<DashboardGeralResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');
    const [loadingExport, setLoadingExport] = useState(false);

    function carregarDashboard() {
        Promise.all([
            futManService.listar(),
            hisManService.listarUltimasMan()
        ])
        .then(([dadosFuturas, dadosUltimas]) => {
            const mapaMesclado = new Map<string, DashboardGeralResponse>();

            dadosUltimas.forEach(ult => {
                mapaMesclado.set(ult.rp, {
                    rp: ult.rp,
                    marca: ult.marca,
                    local: ult.nomeLocal,
                    ultimaData: ult.dataUltimaMan
                });
            });

            dadosFuturas.forEach(fut => {
                if (mapaMesclado.has(fut.rp)) {
                    const linhaExistente = mapaMesclado.get(fut.rp)!;
                    linhaExistente.proximaData = fut.dataProxManu;
                    linhaExistente.futurasManunId = fut.futurasManunId;
                } else {
                    mapaMesclado.set(fut.rp, {
                        rp: fut.rp,
                        marca: '-', 
                        local: fut.local,
                        proximaData: fut.dataProxManu,
                        futurasManunId: fut.futurasManunId
                    });
                }
            });

            setTabelaGeral(Array.from(mapaMesclado.values()));
        })
        .catch(() => {
            alert("Erro ao carregar dados do Dashboard.");
        })
        .finally(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        carregarDashboard();
    }, []);

    // Filtro inteligente => rp, marca, local, data (última manutenção e próxima manutenção) e status
    const linhasFiltradas = useMemo(() => {
        const removerAcentos = (texto: string) => {
            return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        };

        const termo = removerAcentos(busca.trim().toLowerCase());
        if (!termo) return tabelaGeral;

        return tabelaGeral.filter((linha) => {
            // Formata as datas para o formato que o usuário vê (DD/MM/AAAA)
            const ultimaFormatada = linha.ultimaData ? linha.ultimaData.split('-').reverse().join('/') : 'nunca realizada';
            const proximaFormatada = linha.proximaData ? linha.proximaData.split('-').reverse().join('/') : 'nao agendada';
            
            // Pega o código de status matemático e converte para o texto da badge
            const statusCodigo = calcularStatus(linha.proximaData);
            let statusTexto = 'nao agendada';
            if (statusCodigo === 'ATRASADA') statusTexto = 'atrasada';
            if (statusCodigo === 'HOJE') statusTexto = 'e hoje';
            if (statusCodigo === 'PRAZO') statusTexto = 'no prazo';

            return [
                linha.rp, 
                linha.marca, 
                linha.local,
                ultimaFormatada,
                proximaFormatada,
                statusTexto
            ]
            .filter(Boolean)
            .some((campo) => {
                const campoLimpo = removerAcentos(String(campo).toLowerCase());
                return campoLimpo.includes(termo);
            });
        });
    }, [tabelaGeral, busca]);

    async function handleExportar(tipo: 'cadastro' | 'historico' | 'ultimas' | 'datas') {
        try {
            setLoadingExport(true);
            if (tipo === 'cadastro') await relatoriosService.gerarCadastroSplits();
            else if (tipo === 'historico') await relatoriosService.gerarHistoricoDescricao();
            else if (tipo === 'ultimas') await relatoriosService.gerarUltimasManutencoes();
            else if (tipo === 'datas') await relatoriosService.gerarDatasUltimasManutencoes();
        } catch {
            alert("Erro ao exportar a planilha. Verifique a conexão.");
        } finally {
            setLoadingExport(false);
        }
    }

    async function handleDeletar(id: string) {
        const confirmar = window.confirm("Tem certeza que deseja deletar este agendamento futuro?");
        if (!confirmar) return;

        try {
            setLoading(true);
            await futManService.deletar(id);
            carregarDashboard(); 
        } catch {
            alert("Erro ao deletar o agendamento.");
            setLoading(false);
        }
    }

    function renderStatusBadge(dataString?: string) {
        const status = calcularStatus(dataString);
        if (status === 'ATRASADA') return <span className="status-tag status-red">Atrasada</span>;
        if (status === 'HOJE') return <span className="status-tag status-green">É Hoje</span>;
        if (status === 'PRAZO') return <span className="status-tag status-green">No prazo</span>;
        return <span className="status-tag status-grey">Não agendada</span>;
    }

    const totalMaquinas = tabelaGeral.length;
    const totalAtrasadas = tabelaGeral.filter(m => calcularStatus(m.proximaData) === 'ATRASADA').length;
    const totalNoPrazo = tabelaGeral.filter(m => ['PRAZO', 'HOJE'].includes(calcularStatus(m.proximaData))).length;

    return (
        <div>
            {/* Cabeçalho */}
            <header className="page-head">
                <h1>Dashboard de Manutenções</h1>
                <p>Monitoramento dos aparelhos de ar-condicionado da universidade.</p>
            </header>

            {/* Cartões */}
            <Row className="mb-4 g-4">
                <Col md={4}>
                    <Card className="app-card h-100">
                        <Card.Body className="d-flex align-items-center gap-4">
                            <div className="kpi-icon-wrapper kpi-blue">
                                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path>
                                    <polyline strokeLinecap="round" strokeLinejoin="round" points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                    <line x1="12" y1="22.08" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round"></line>
                                </svg>
                            </div>
                            <div>
                                <div className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Total de Equipamentos</div>
                                <div className="fs-2 fw-bolder" style={{ color: 'var(--uepa-blue)' }}>{totalMaquinas}</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={4}>
                    <Card className="app-card h-100">
                        <Card.Body className="d-flex align-items-center gap-4">
                            <div className="kpi-icon-wrapper kpi-red">
                                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                </svg>
                            </div>
                            <div>
                                <div className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Manutenções Atrasadas</div>
                                <div className="fs-2 fw-bolder" style={{ color: 'var(--uepa-red)' }}>{totalAtrasadas}</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={4}>
                    <Card className="app-card h-100">
                        <Card.Body className="d-flex align-items-center gap-4">
                            <div className="kpi-icon-wrapper kpi-green">
                                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div>
                                <div className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Operando no Prazo</div>
                                <div className="fs-2 fw-bolder text-success">{totalNoPrazo}</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Barra de Pesquisa */}
            <div className="search-container d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
                <div className="flex-grow-1">
                    <label className="search-label">Pesquisar equipamento</label>
                    <InputGroup className="search-premium">
                        <InputGroup.Text>
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg>
                        </InputGroup.Text>
                        <Form.Control
                            type="search"
                            placeholder="Buscar por RP, marca, local, data ou status..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </InputGroup>
                </div>

                {/* Botão de Exportar para Excel */}
                <Dropdown>
                    <Dropdown.Toggle 
                        disabled={loadingExport}
                        style={{ backgroundColor: 'var(--status-green)', border: 'none', padding: '0.70rem 1.25rem', borderRadius: '8px', fontWeight: 600 }}
                        className="d-flex align-items-center gap-2"
                    >
                        {loadingExport ? (
                            <Spinner size="sm" animation="border" />
                        ) : (
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M5.884 6.68a.5.5 0 1 0-.768.64L7.349 10l-2.233 2.68a.5.5 0 0 0 .768.64L8 10.781l2.116 2.54a.5.5 0 0 0 .768-.641L8.651 10l2.233-2.68a.5.5 0 0 0-.768-.64L8 9.219l-2.116-2.54z"/>
                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                            </svg>
                        )}
                        Exportar Relatórios
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="shadow-sm border-0 mt-2">
                        <Dropdown.Item onClick={() => handleExportar('cadastro')} className="py-2 d-flex align-items-center gap-2 dropdown-relatorio-item">
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                            Cadastro de Splits
                        </Dropdown.Item>
                        
                        <Dropdown.Item onClick={() => handleExportar('historico')} className="py-2 d-flex align-items-center gap-2 dropdown-relatorio-item">
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 9.36l-7.19 7.19a2 2 0 01-2.83-2.83l7.19-7.19a6 6 0 019.36-7.94l-3.77 3.77z"></path>
                            </svg>
                            Histórico Completo
                        </Dropdown.Item>
                        
                        <Dropdown.Item onClick={() => handleExportar('ultimas')} className="py-2 d-flex align-items-center gap-2 dropdown-relatorio-item">
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Últimas Manutenções
                        </Dropdown.Item>
                        
                        <Dropdown.Item onClick={() => handleExportar('datas')} className="py-2 d-flex align-items-center gap-2 dropdown-relatorio-item">
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            Datas das Manutenções
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {/* Tabela Principal */}
            <div className="table-shell">
                <Table responsive hover className="app-table">
                    <thead>
                        <tr>
                            <th>RP</th>
                            <th>Marca</th>
                            <th>Local</th>
                            <th>Última Manutenção</th>
                            <th>Próxima Manutenção</th>
                            <th>Status</th>
                            <th className="text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && tabelaGeral.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-5">
                                    <Spinner size="sm" animation="border" className="me-2" style={{ color: 'var(--uepa-blue)' }} />
                                    Processando dados...
                                </td>
                            </tr>
                        )}

                        {!loading && linhasFiltradas.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-5 text-muted">
                                    {busca 
                                        ? 'Nenhum equipamento encontrado com base no seu filtro.' 
                                        : 'Nenhum equipamento registrado.'}
                                </td>
                            </tr>
                        )}

                        {linhasFiltradas.map((linha, index) => (
                            <tr key={linha.rp || index}>
                                <td>{linha.rp}</td>
                                <td>{linha.marca}</td>
                                <td>{linha.local}</td>
                                
                                <td className={linha.ultimaData ? '' : 'text-muted-custom'}>
                                    {linha.ultimaData 
                                        ? linha.ultimaData.split('-').reverse().join('/') 
                                        : 'Nunca realizada'}
                                </td>
                                
                                <td className={linha.proximaData ? '' : 'text-muted-custom'}>
                                    {linha.proximaData 
                                        ? linha.proximaData.split('-').reverse().join('/') 
                                        : 'Não agendada'}
                                </td>

                                <td>{renderStatusBadge(linha.proximaData)}</td>

                                <td className="text-center">
                                    {linha.futurasManunId && (
                                        <button 
                                            className="btn-icon-danger" 
                                            onClick={() => handleDeletar(linha.futurasManunId!)}
                                            title="Excluir agendamento"
                                        >
                                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}