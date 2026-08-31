import { useEffect, useMemo, useState } from 'react';
import type { SyntheticEvent } from 'react';
import { Alert, Button, Card, Col, Form, Row, Spinner, Table, InputGroup } from 'react-bootstrap';
import { hisManService } from '../services/hisManService';
import { splitService } from '../services/splitService';
import type { HisManResponse } from '../types/Manutencao';
import type { SplitResponse } from '../types/Split';
import type { TipoManu } from '../types/Enums';
import { Client } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';
import { WEBSOCKET_URL } from '../config/websocket';


// O backend manda o rp e o local
type HistoricoCompleto = HisManResponse & { rp?: string; local?: string };

export function Historico() {
    const [historico, setHistorico] = useState<HistoricoCompleto[]>([]);
    const [splits, setSplits] = useState<SplitResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [ordemData, setOrdemData] = useState<'desc' | 'asc'>('desc');
    
    // Estados para alertas e busca
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [busca, setBusca] = useState('');

    const [formData, setFormData] = useState({
        splitId: '',
        dataManu: '', 
        tecnicoResponsavel: '', 
        servicoRealizado: '',   
        tipoManu: 'PREVENTIVA' as TipoManu,
        observacoes: '' 
    });

    useEffect(() => {
        // Carrega os dados normalmente na primeira vez
        carregarDados();

//         // Configura a conexão com o túnel do Spring Boot
//         const stompClient = new Client({
//             webSocketFactory: () => new SockJS(WEBSOCKET_URL),
//             onConnect: () => {
//                 // Sintoniza no canal de atualizações
//                 stompClient.subscribe('/topic/atualizacoes', () => {
//                     // Se o Java gritar que teve mudança, recarrega a tabela silenciosamente
//                     carregarDados();
//                 });
//             }
//         });

        const stompClient = new Client({
            brokerURL: WEBSOCKET_URL,
            onConnect: () => {
                // Sintoniza no canal de atualizações
                stompClient.subscribe('/topic/atualizacoes', () => {
                    // Se o Java gritar que teve mudança, recarrega a tabela silenciosamente
                    carregarDados();
                });
            },

            onStompError: (frame) => {
                console.error('Erro STOMP: ', frame)
            },

            onWebSocketError: (frame) => {
                console.error('Erro WebSocket: ', frame)
            }
        });

        // Liga o túnel
        stompClient.activate();

        // Limpeza: desliga o túnel quando o usuário mudar de tela
        return () => {
            stompClient.deactivate();
        };
    }, []);

    function carregarDados() {
        setLoading(true);
        Promise.all([hisManService.listar(), splitService.listar()])
            .then(([dadosHistorico, dadosSplits]) => {
                setHistorico(dadosHistorico);
                setSplits(dadosSplits);
            })
            .catch(() => setErro("Erro ao carregar dados do histórico."))
            .finally(() => setLoading(false));
    }

    // Lógica de filtro para a barra de pesquisa
    const registrosFiltrados = useMemo(() => {
        const removerAcentos = (texto: string) => {
            return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        };

        const termo = removerAcentos(busca.trim().toLowerCase());

        let resultado = historico;
        
        if (termo) {
            resultado = historico.filter((h) => {
                const dataFormatada = h.dataManu ? h.dataManu.split('-').reverse().join('/') : '';
                const tipoFormatado = h.tipoManu ? h.tipoManu.replace('_', ' ') : '';

                return [
                    h.rp, h.local, h.tecnicoResponsavel, h.servicoRealizado, dataFormatada, tipoFormatado
                ]
                .filter(Boolean)
                .some((campo) => {
                    const campoLimpo = removerAcentos(String(campo).toLowerCase());
                    return campoLimpo.includes(termo);
                });
            });
        }

        // ordenação por data
        return resultado.sort((a, b) => {
            const dataA = a.dataManu || '';
            const dataB = b.dataManu || '';
            
            if (dataA < dataB) return ordemData === 'asc' ? -1 : 1;
            if (dataA > dataB) return ordemData === 'asc' ? 1 : -1;
            return 0;
        });
    }, [historico, busca, ordemData]);

    async function handleRegistrar(e: SyntheticEvent) {
        e.preventDefault();
        setErro('');
        setSucesso('');
        
        if (!formData.splitId) {
            setErro("Selecione um Split!");
            return;
        }

        try {
            setLoading(true);
            await hisManService.criar(formData);
            
            setFormData({
                splitId: '',
                dataManu: '',
                tecnicoResponsavel: '',
                servicoRealizado: '',
                tipoManu: 'PREVENTIVA',
                observacoes: ''
            });
            
            await carregarDados();
            setSucesso("Manutenção registrada com sucesso!");
            setTimeout(() => setSucesso(''), 3000);

        } catch {
            setErro("Erro ao registrar a manutenção.");
            setLoading(false);
        }
    }

    function renderBadgeTipo(tipo: string) {
        switch (tipo) {
            case 'PREVENTIVA': return <span className="status-tag status-green">Preventiva</span>;
            case 'CORRETIVA': return <span className="status-tag status-red">Corretiva</span>;
            case 'INSTALACAO': return <span className="status-tag status-green">Instalação</span>;
            case 'DESINSTALACAO': return <span className="status-tag status-grey">Desinstalação</span>;
            case 'INSTALACAO_PREVENTIVA': return <span className="status-tag status-green">Instal. + Preventiva</span>;
            default: return <span className="status-tag status-grey">{tipo}</span>;
        }
    }

    return (
        <div>
            {/* Cabeçalho*/}
            <header className="page-head">
                <h1>Histórico de Manutenções</h1>
                <p>Registro de todas as intervenções realizadas nos equipamentos de climatização.</p>
            </header>

            {/* Alertas de Feedback */}
            {erro && <Alert variant="danger" onClose={() => setErro('')} dismissible>{erro}</Alert>}
            {sucesso && <Alert variant="success" onClose={() => setSucesso('')} dismissible>{sucesso}</Alert>}

            {/* Formulário de Registro */}
            <Card className="app-card mb-5">
                <Card.Body style={{ padding: '2rem' }}>
                    <h5 className="mb-4" style={{ color: 'var(--uepa-blue)', fontWeight: 700 }}>Registrar Nova Manutenção</h5>
                    
                    <Form onSubmit={handleRegistrar}>
                        <Row className="mb-3 g-3">
                            <Form.Group as={Col} md={4} controlId="formSplit">
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Equipamento (Split)</Form.Label>
                                <Form.Select 
                                    value={formData.splitId}
                                    onChange={(e) => setFormData({...formData, splitId: e.target.value})}
                                    required disabled={loading}
                                    className="p-2"
                                >
                                    <option value="">Selecione o Split...</option>
                                    {splits.map(split => (
                                        <option key={split.uuid} value={split.uuid}>
                                            RP: {split.rp} - {split.marca}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group as={Col} md={4} controlId="formDataMan">
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Data da Manutenção</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    value={formData.dataManu}
                                    onChange={(e) => setFormData({...formData, dataManu: e.target.value})}
                                    required disabled={loading} 
                                    className="p-2"
                                />
                            </Form.Group>

                            <Form.Group as={Col} md={4} controlId="formTipo">
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Tipo de Manutenção</Form.Label>
                                <Form.Select 
                                    value={formData.tipoManu}
                                    onChange={(e) => setFormData({...formData, tipoManu: e.target.value as TipoManu})}
                                    disabled={loading}
                                    className="p-2"
                                >
                                    <option value="PREVENTIVA">Preventiva</option>
                                    <option value="CORRETIVA">Corretiva</option>
                                    <option value="INSTALACAO">Instalação</option>
                                    <option value="DESINSTALACAO">Desinstalação</option>
                                    <option value="INSTALACAO_PREVENTIVA">Instal. + Preventiva</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3 g-3">
                            <Form.Group as={Col} md={6} controlId="formTecnico">
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Técnico Responsável</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Ex: João Silva" 
                                    value={formData.tecnicoResponsavel}
                                    onChange={(e) => setFormData({...formData, tecnicoResponsavel: e.target.value})}
                                    required disabled={loading} 
                                    className="p-2"
                                />
                            </Form.Group>

                            <Form.Group as={Col} md={6} controlId="formServico">
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Serviço Realizado</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Ex: Troca de compressor" 
                                    value={formData.servicoRealizado}
                                    onChange={(e) => setFormData({...formData, servicoRealizado: e.target.value})}
                                    required disabled={loading} 
                                    className="p-2"
                                />
                            </Form.Group>
                        </Row>

                        <Row className="align-items-end g-3">
                            <Form.Group as={Col} md={9} controlId="formObs">
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Observações (Opcional)</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Detalhes adicionais..." 
                                    value={formData.observacoes}
                                    onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                                    disabled={loading} 
                                    className="p-2"
                                />
                            </Form.Group>

                            <Col md={3} className="d-grid mt-3 mt-md-0">
                                <Button 
                                    type="submit" 
                                    disabled={loading}
                                    style={{ backgroundColor: 'var(--uepa-blue)', border: 'none', padding: '0.65rem' }}
                                >
                                    {loading ? <Spinner size="sm" animation="border" /> : 'Registrar Serviço'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* Barra de Pesquisa */}
            <div className="search-container">
                <label className="search-label">Pesquisar registros</label>
                <InputGroup className="search-premium">
                    <InputGroup.Text>
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                    </InputGroup.Text>
                    <Form.Control
                        type="search"
                        placeholder="Buscar por data, RP, local, técnico, serviço ou tipo..."
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
                            {/* Coluna de Data Clicável */}
                            <th 
                                onClick={() => setOrdemData(prev => prev === 'desc' ? 'asc' : 'desc')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                title="Clique para inverter a ordem"
                            >
                                <div className="d-flex align-items-center gap-2">
                                    Data
                                    {ordemData === 'desc' ? (
                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    ) : (
                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"></path>
                                        </svg>
                                    )}
                                </div>
                            </th>
                            <th>Split (RP)</th>
                            <th>Local</th>
                            <th>Técnico</th>
                            <th>Serviço</th>
                            <th>Tipo</th>
                            <th>Observações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && historico.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-5">
                                    <Spinner size="sm" animation="border" className="me-2" style={{ color: 'var(--uepa-blue)' }} />
                                    Carregando registros...
                                </td>
                            </tr>
                        )}
                        
                        {!loading && registrosFiltrados.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-5 text-muted-custom">
                                    {busca 
                                        ? 'Nenhum registro encontrado para o termo buscado.' 
                                        : 'Nenhum registro de manutenção encontrado.'}
                                </td>
                            </tr>
                        )}
                        
                        {registrosFiltrados.map((hist, index) => (
                            <tr key={index}>
                                <td>
                                    {hist.dataManu ? hist.dataManu.split('-').reverse().join('/') : '-'}
                                </td>
                                <td style={{ color: 'var(--uepa-blue)', fontWeight: 700 }}>{hist.rp}</td>
                                <td>{hist.local}</td>
                                <td>{hist.tecnicoResponsavel}</td>
                                <td>{hist.servicoRealizado}</td>
                                <td>{renderBadgeTipo(hist.tipoManu)}</td>
                                <td className={!hist.observacoes ? 'text-muted-custom' : ''}>
                                    {hist.observacoes || 'Sem observações'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}