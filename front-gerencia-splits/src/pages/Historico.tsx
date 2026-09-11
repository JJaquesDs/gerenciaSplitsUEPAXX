import { useEffect, useMemo, useState } from 'react';
import type { SyntheticEvent } from 'react';
import { Alert, Button, Card, Col, Form, Row, Spinner, Table, InputGroup, Modal } from 'react-bootstrap';
import { hisManService } from '../services/hisManService';
import { splitService } from '../services/splitService';
import type { HisManRequest, HisManResponse } from '../types/Manutencao';
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

    // Estados do Modal de edição
    const [showModal, setShowModal] = useState(false);
    const [histEditando, setHistEditando] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<HisManRequest>>({});

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

    // Função pra preencher e abrir o Modal
    function abrirModalEdicao(hist: HistoricoCompleto) {
        const splitEncontrado = splits.find(s => s.rp === hist.rp);

        setHistEditando(hist.historicoManuId);
        setEditFormData({
            splitId: splitEncontrado ? splitEncontrado.uuid : '',
            dataManu: hist.dataManu || '',
            tecnicoResponsavel: hist.tecnicoResponsavel || '',
            servicoRealizado: hist.servicoRealizado || '',
            tipoManu: (hist.tipoManu as TipoManu) || 'PREVENTIVA',
            observacoes: hist.observacoes || ''
        });

        setShowModal(true);
    }

    async function handleAtualizar(e: SyntheticEvent) {
        e.preventDefault();
        if (!histEditando) return;

        setErro('');
        setSucesso('');

        try {
            setLoading(true);
            await hisManService.atualizar(histEditando, editFormData as HisManRequest);
            setShowModal(false);
            await carregarDados();

            setSucesso("Manutenção atualizada com sucesso!")
            setTimeout(() => setSucesso(''), 3000);
        } catch {
            setErro("Erro ao atualizar dados da manutenção!")
        } finally {
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
            <header className="page-head">
                <h1>Histórico de Manutenções</h1>
                <p>Registro de todas as intervenções realizadas nos equipamentos de climatização.</p>
            </header>

            {erro && <Alert variant="danger" onClose={() => setErro('')} dismissible>{erro}</Alert>}
            {sucesso && <Alert variant="success" onClose={() => setSucesso('')} dismissible>{sucesso}</Alert>}

            {/* Formulário de Registro */}
            <Card className="app-card mb-5">
                <Card.Body style={{ padding: '2rem' }}>
                    <h5 className="mb-4" style={{ color: 'var(--uepa-blue)', fontWeight: 700 }}>Registrar Nova Manutenção</h5>
                    
                    <Form onSubmit={handleRegistrar}>
                        <Row className="mb-3 g-3">
                            <Form.Group as={Col} md={4}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Equipamento (Split)</Form.Label>
                                <Form.Select 
                                    value={formData.splitId}
                                    onChange={(e) => setFormData({...formData, splitId: e.target.value})}
                                    required disabled={loading} className="p-2"
                                >
                                    <option value="">Selecione o Split...</option>
                                    {splits.map(split => (
                                        <option key={split.uuid} value={split.uuid}>
                                            RP: {split.rp} - {split.marca}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group as={Col} md={4}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Data da Manutenção</Form.Label>
                                <Form.Control 
                                    type="date" value={formData.dataManu}
                                    onChange={(e) => setFormData({...formData, dataManu: e.target.value})}
                                    required disabled={loading} className="p-2"
                                />
                            </Form.Group>

                            <Form.Group as={Col} md={4}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Tipo de Manutenção</Form.Label>
                                <Form.Select 
                                    value={formData.tipoManu}
                                    onChange={(e) => setFormData({...formData, tipoManu: e.target.value as TipoManu})}
                                    disabled={loading} className="p-2"
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
                            <Form.Group as={Col} md={6}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Técnico Responsável</Form.Label>
                                <Form.Control 
                                    type="text" placeholder="Ex: João Silva" value={formData.tecnicoResponsavel}
                                    onChange={(e) => setFormData({...formData, tecnicoResponsavel: e.target.value})}
                                    required disabled={loading} className="p-2"
                                />
                            </Form.Group>

                            <Form.Group as={Col} md={6}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Serviço Realizado</Form.Label>
                                <Form.Control 
                                    type="text" placeholder="Ex: Troca de compressor" value={formData.servicoRealizado}
                                    onChange={(e) => setFormData({...formData, servicoRealizado: e.target.value})}
                                    required disabled={loading} className="p-2"
                                />
                            </Form.Group>
                        </Row>

                        <Row className="align-items-end g-3">
                            <Form.Group as={Col} md={9}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Observações (Opcional)</Form.Label>
                                <Form.Control 
                                    type="text" placeholder="Detalhes adicionais..." value={formData.observacoes}
                                    onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                                    disabled={loading} className="p-2"
                                />
                            </Form.Group>

                            <Col md={3} className="d-grid mt-3 mt-md-0">
                                <Button type="submit" disabled={loading} style={{ backgroundColor: 'var(--uepa-blue)', border: 'none', padding: '0.65rem' }}>
                                    {loading ? <Spinner size="sm" animation="border" /> : 'Registrar Serviço'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

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

            <div className="table-shell">
                <Table responsive hover className="app-table">
                    <thead>
                        <tr>
                            <th onClick={() => setOrdemData(prev => prev === 'desc' ? 'asc' : 'desc')} style={{ cursor: 'pointer', userSelect: 'none' }} title="Clique para inverter a ordem">
                                <div className="d-flex align-items-center gap-2">
                                    Data
                                    {ordemData === 'desc' ? (
                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                                    ) : (
                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"></path></svg>
                                    )}
                                </div>
                            </th>
                            <th>Split (RP)</th>
                            <th>Local</th>
                            <th>Técnico</th>
                            <th>Serviço</th>
                            <th>Tipo</th>
                            <th>Observações</th>
                            <th className="text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && historico.length === 0 && (
                            <tr>
                                <td colSpan={8} className="text-center py-5">
                                    <Spinner size="sm" animation="border" className="me-2" style={{ color: 'var(--uepa-blue)' }} />
                                    Carregando registros...
                                </td>
                            </tr>
                        )}
                        
                        {!loading && registrosFiltrados.length === 0 && (
                            <tr>
                                <td colSpan={8} className="text-center py-5 text-muted-custom">
                                    {busca ? 'Nenhum registro encontrado para o termo buscado.' : 'Nenhum registro de manutenção encontrado.'}
                                </td>
                            </tr>
                        )}
                        
                        {registrosFiltrados.map((hist, index) => (
                            <tr key={hist.historicoManuId || index}>
                                <td>{hist.dataManu ? hist.dataManu.split('-').reverse().join('/') : '-'}</td>
                                <td style={{ color: 'var(--uepa-blue)', fontWeight: 700 }}>{hist.rp}</td>
                                <td>{hist.local}</td>
                                <td>{hist.tecnicoResponsavel}</td>
                                <td>{hist.servicoRealizado}</td>
                                <td>{renderBadgeTipo(hist.tipoManu)}</td>
                                <td className={!hist.observacoes ? 'text-muted-custom' : ''}>
                                    {hist.observacoes || 'Sem observações'}
                                </td>
                                <td className='text-center'>
                                    <button 
                                        onClick={() => abrirModalEdicao(hist)}
                                        title='Editar manutenção'
                                        disabled={loading}
                                        style={{background: 'transparent', border: 'none', color: 'var(--uepa-blue)', padding: '0.25rem', transition: 'color 0.2s'}}
                                    >
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Modal de Edição */}
            <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" size="lg">
                <Form onSubmit={handleAtualizar}>
                    <Modal.Header closeButton style={{ borderBottom: '2px solid var(--uepa-red)' }}>
                        <Modal.Title style={{ color: 'var(--uepa-blue)', fontWeight: 700 }}>Editar Manutenção</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: '2rem' }}>
                        
                        <Row className="mb-3 g-3">
                            <Form.Group as={Col} md={6}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Equipamento (Split)</Form.Label>
                                <Form.Select 
                                    value={editFormData.splitId || ''}
                                    onChange={(e) => setEditFormData({...editFormData, splitId: e.target.value})}
                                    required className="p-2"
                                >
                                    <option value="">Selecione o Split...</option>
                                    {splits.map(split => (
                                        <option key={split.uuid} value={split.uuid}>
                                            RP: {split.rp} - {split.marca}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group as={Col} md={6}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Data da Manutenção</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    value={editFormData.dataManu || ''}
                                    onChange={(e) => setEditFormData({...editFormData, dataManu: e.target.value})}
                                    required className="p-2"
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3 g-3">
                            <Form.Group as={Col} md={6}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Técnico Responsável</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={editFormData.tecnicoResponsavel || ''}
                                    onChange={(e) => setEditFormData({...editFormData, tecnicoResponsavel: e.target.value})}
                                    required className="p-2"
                                />
                            </Form.Group>

                            <Form.Group as={Col} md={6}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Serviço Realizado</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={editFormData.servicoRealizado || ''}
                                    onChange={(e) => setEditFormData({...editFormData, servicoRealizado: e.target.value})}
                                    required className="p-2"
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3 g-3">
                            <Form.Group as={Col} md={4}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Tipo de Manutenção</Form.Label>
                                <Form.Select 
                                    value={editFormData.tipoManu || ''}
                                    onChange={(e) => setEditFormData({...editFormData, tipoManu: e.target.value as TipoManu})}
                                    required className="p-2"
                                >
                                    <option value="PREVENTIVA">Preventiva</option>
                                    <option value="CORRETIVA">Corretiva</option>
                                    <option value="INSTALACAO">Instalação</option>
                                    <option value="DESINSTALACAO">Desinstalação</option>
                                    <option value="INSTALACAO_PREVENTIVA">Instal. + Preventiva</option>
                                </Form.Select>
                            </Form.Group>
                            
                            <Form.Group as={Col} md={8}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Observações (Opcional)</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={editFormData.observacoes || ''}
                                    onChange={(e) => setEditFormData({...editFormData, observacoes: e.target.value})}
                                    className="p-2"
                                />
                            </Form.Group>
                        </Row>

                    </Modal.Body>
                    <Modal.Footer style={{ borderTop: 'none', padding: '1rem 2rem 2rem' }}>
                        <Button variant="light" onClick={() => setShowModal(false)} style={{ color: 'var(--muted)', fontWeight: 600 }}>
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            style={{ backgroundColor: 'var(--uepa-blue)', border: 'none' }}
                        >
                            {loading ? <Spinner size="sm" animation="border" /> : 'Salvar Alterações'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}