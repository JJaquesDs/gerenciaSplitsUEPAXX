import { useEffect, useMemo, useState } from 'react';
import type { SyntheticEvent } from 'react';
import { Alert, Button, Card, Col, Form, Row, Spinner, Table, Modal, InputGroup } from 'react-bootstrap';
import { splitService } from '../services/splitService';
import { localService } from '../services/localService';
import type { SplitRequest, SplitResponse } from '../types/Split';
import type { LocalResponse } from '../types/Local';
import type { PeriodoManutencao } from '../types/Enums';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WEBSOCKET_URL } from '../config/websocket';

export function Splits() {
    const [splits, setSplits] = useState<SplitResponse[]>([]);
    const [locais, setLocais] = useState<LocalResponse[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados para alertas e busca
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [busca, setBusca] = useState('');
    const [ordemData, setOrdemData] = useState<'desc' | 'asc'>('desc');

    const [formData, setFormData] = useState({
        rp: '',
        marca: '',
        capacidadeBtu: '',
        dataEntrada: '',
        periodoManMes: 'MENSAL' as PeriodoManutencao,
        localId: ''
    });

    // Estados do Modal
    const [showModal, setShowModal] = useState(false);
    const [splitEditando, setSplitEditando] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<SplitRequest>>({});

    useEffect(() => {
        // Carrega os dados normalmente na primeira vez
        carregarDados();

        // Configura a conexão com o túnel do Spring Boot
        const stompClient = new Client({
            webSocketFactory: () => new SockJS(WEBSOCKET_URL),
            onConnect: () => {
                // Sintoniza no canal de atualizações
                stompClient.subscribe('/topic/atualizacoes', () => {
                    // Se o Java gritar que teve mudança, recarrega a tabela silenciosamente
                    carregarDados();
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

    async function carregarDados() {
        setLoading(true);
        Promise.all([splitService.listar(), localService.listar()])
            .then(([dadosSplits, dadosLocais]) => {
                setSplits(dadosSplits);
                setLocais(dadosLocais);
            })
            .catch(() => setErro("Erro ao carregar os dados. Verifique a conexão com a API."))
            .finally(() => setLoading(false));
    }

    // Filtro inteligente e ordenação
    const splitsFiltrados = useMemo(() => {
        const removerAcentos = (texto: string) => {
            return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        };

        const termo = removerAcentos(busca.trim().toLowerCase());
        
        let resultado = splits;

        // filtro de pesquisa
        if (termo) {
            resultado = splits.filter((split) => {
                const dataFormatada = split.dataEntrada ? split.dataEntrada.split('-').reverse().join('/') : '';
                
                return [
                    split.rp, split.marca, split.capacidadeBtu, split.local, dataFormatada, split.periodoManMes
                ]
                .filter(Boolean)
                .some((campo) => {
                    const campoLimpo = removerAcentos(String(campo).toLowerCase());
                    return campoLimpo.includes(termo);
                });
            });
        }

        // ordenação por Data de Entrada
        return resultado.sort((a, b) => {
            const dataA = a.dataEntrada || '';
            const dataB = b.dataEntrada || '';
            
            if (dataA < dataB) return ordemData === 'asc' ? -1 : 1;
            if (dataA > dataB) return ordemData === 'asc' ? 1 : -1;
            return 0;
        });
    }, [splits, busca, ordemData]);

    async function handleCriar(e: SyntheticEvent) {
        e.preventDefault();
        setErro('');
        setSucesso('');
        
        if (!formData.localId) {
            setErro("Por favor, selecione um Local válido para alocar o equipamento.");
            return;
        }

        try {
            setLoading(true);
            await splitService.criar(formData);
            
            setFormData({
                rp: '',
                marca: '',
                capacidadeBtu: '',
                dataEntrada: '',
                periodoManMes: 'MENSAL',
                localId: ''
            });
            
            await carregarDados();
            
            setSucesso("Equipamento cadastrado com sucesso!");
            setTimeout(() => setSucesso(''), 3000);
            
        } catch {
            setErro("Erro ao cadastrar. Verifique se o RP já existe no sistema.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDeletar(uuid: string) {
        const confirmar = window.confirm("Tem certeza que deseja deletar este equipamento?");
        if (!confirmar) return;

        setErro('');
        setSucesso('');

        try {
            setLoading(true);
            await splitService.deletar(uuid);
            setSplits(prev => prev.filter(s => s.uuid !== uuid));
            
            setSucesso("Equipamento excluído com sucesso!");
            setTimeout(() => setSucesso(''), 3000);
            
        } catch {
            setErro("Não é possível excluir este equipamento pois existem manutenções vinculadas a ele.");
        } finally {
            setLoading(false);
        }
    }

    function abrirModalEdicao(split: SplitResponse) {
        const localEncontrado = locais.find(l => l.nomeLocal === split.local);

        setSplitEditando(split.uuid);
        setEditFormData({
            rp: split.rp,
            marca: split.marca,
            capacidadeBtu: split.capacidadeBtu,
            dataEntrada: split.dataEntrada,
            periodoManMes: split.periodoManMes as PeriodoManutencao,
            localId: localEncontrado ? localEncontrado.localId : ''
        });
        
        setShowModal(true);
    }

    async function handleAtualizar(e: SyntheticEvent) {
        e.preventDefault();
        if (!splitEditando) return;
        setErro('');
        setSucesso('');

        try {
            setLoading(true);
            await splitService.atualizar(splitEditando, editFormData);
            setShowModal(false); 
            await carregarDados(); 
            
            setSucesso("Equipamento atualizado com sucesso!");
            setTimeout(() => setSucesso(''), 3000);
            
        } catch {
            setErro("Erro ao atualizar os dados do equipamento.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {/* Cabeçalho */}
            <header className="page-head">
                <h1>Gerenciar Splits</h1>
                <p>Inventário completo e cadastro de novos aparelhos de ar-condicionado.</p>
            </header>

            {/* Alertas de Feedback */}
            {erro && <Alert variant="danger" onClose={() => setErro('')} dismissible>{erro}</Alert>}
            {sucesso && <Alert variant="success" onClose={() => setSucesso('')} dismissible>{sucesso}</Alert>}

            {/* Formulário de Registro */}
            <Card className="app-card mb-5">
                <Card.Body style={{ padding: '2rem' }}>
                    <h5 className="mb-4" style={{ color: 'var(--uepa-blue)', fontWeight: 700 }}>Cadastrar Novo Equipamento</h5>
                    
                    <Form onSubmit={handleCriar}>
                        <Row className="mb-3 g-3">
                            <Form.Group as={Col} md={3} controlId="formRp">
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Registro Patrimonial (RP)</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Ex: 00.001" 
                                    value={formData.rp}
                                    onChange={(e) => setFormData({...formData, rp: e.target.value})}
                                    required disabled={loading} 
                                    className="p-2"
                                />
                            </Form.Group>

                            <Form.Group as={Col} md={3} controlId="formMarca">
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Marca</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Ex: LG, Midea..." 
                                    value={formData.marca}
                                    onChange={(e) => setFormData({...formData, marca: e.target.value})}
                                    required disabled={loading} 
                                    className="p-2"
                                />
                            </Form.Group>

                            <Form.Group as={Col} md={3} controlId="formBtu">
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Capacidade (BTUs)</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Ex: 12.000" 
                                    value={formData.capacidadeBtu}
                                    onChange={(e) => setFormData({...formData, capacidadeBtu: e.target.value})}
                                    required disabled={loading} 
                                    className="p-2"
                                />
                            </Form.Group>

                            <Form.Group as={Col} md={3} controlId="formDataEntrada">
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Data de Entrada</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    value={formData.dataEntrada}
                                    onChange={(e) => setFormData({...formData, dataEntrada: e.target.value})}
                                    required disabled={loading} 
                                    className="p-2"
                                />
                            </Form.Group>
                        </Row>

                        <Row className="align-items-end g-3">
                            <Form.Group as={Col} md={4} controlId="formPeriodo">
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Período de Manutenção</Form.Label>
                                <Form.Select 
                                    value={formData.periodoManMes}
                                    onChange={(e) => setFormData({...formData, periodoManMes: e.target.value as PeriodoManutencao})}
                                    disabled={loading}
                                    className="p-2"
                                >
                                    <option value="MENSAL">Mensal</option>
                                    <option value="BIMESTRAL">Bimestral</option>
                                    <option value="TRIMESTRAL">Trimestral</option>
                                    <option value="SEMESTRAL">Semestral</option>
                                    <option value="ANUAL">Anual</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group as={Col} md={5} controlId="formLocal">
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Alocar no Local</Form.Label>
                                <Form.Select 
                                    value={formData.localId}
                                    onChange={(e) => setFormData({...formData, localId: e.target.value})}
                                    required disabled={loading}
                                    className="p-2"
                                >
                                    <option value="">Selecione um local...</option>
                                    {locais.map(local => (
                                        <option key={local.localId} value={local.localId}>
                                            {local.nomeLocal}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Col md={3} className="d-grid mt-3 mt-md-0">
                                <Button 
                                    type="submit" 
                                    disabled={loading}
                                    style={{ backgroundColor: 'var(--uepa-blue)', border: 'none', padding: '0.65rem' }}
                                >
                                    {loading ? <Spinner size="sm" animation="border" /> : 'Salvar Equipamento'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* Barra de Pesquisa */}
            <div className="search-container">
                <label className="search-label">Pesquisar equipamentos</label>
                <InputGroup className="search-premium">
                    <InputGroup.Text>
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                    </InputGroup.Text>
                    <Form.Control
                        type="search"
                        placeholder="Buscar por RP, marca, local, capacidade..."
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
                            <th>RP</th>
                            <th>Marca</th>
                            <th>Capacidade</th>
                            <th>Local</th>
                            
                            {/* Coluna de Data Clicável */}
                            <th 
                                onClick={() => setOrdemData(prev => prev === 'desc' ? 'asc' : 'desc')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                title="Clique para inverter a ordem"
                            >
                                <div className="d-flex align-items-center gap-2">
                                    Data Entrada
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
                            
                            <th>Período</th>
                            <th className="text-center" style={{ minWidth: '120px' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && splits.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-5">
                                    <Spinner size="sm" animation="border" className="me-2" style={{ color: 'var(--uepa-blue)' }} />
                                    Carregando equipamentos...
                                </td>
                            </tr>
                        )}
                        
                        {!loading && splitsFiltrados.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-5 text-muted-custom">
                                    {busca 
                                        ? 'Nenhum equipamento encontrado para o termo buscado.' 
                                        : 'Nenhum equipamento cadastrado.'}
                                </td>
                            </tr>
                        )}
                        
                        {splitsFiltrados.map((split) => (
                            <tr key={split.uuid}>
                                <td style={{ color: 'var(--uepa-blue)', fontWeight: 700 }}>{split.rp}</td>
                                <td>{split.marca}</td>
                                <td>{split.capacidadeBtu}</td>
                                <td>{split.local}</td>
                                <td>{split.dataEntrada ? split.dataEntrada.split('-').reverse().join('/') : '-'}</td>
                                <td><span className="status-tag status-grey">{split.periodoManMes}</span></td>
                                <td className="text-center">
                                    <button 
                                        onClick={() => abrirModalEdicao(split)}
                                        title="Editar equipamento"
                                        disabled={loading}
                                        style={{ background: 'transparent', border: 'none', color: 'var(--uepa-blue)', padding: '0.25rem', transition: 'color 0.2s', marginRight: '8px' }}
                                    >
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                        </svg>
                                    </button>

                                    <button 
                                        className="btn-icon-danger" 
                                        onClick={() => handleDeletar(split.uuid)}
                                        title="Excluir equipamento"
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

            {/* Modal de Edição */}
            <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" size="lg">
                <Form onSubmit={handleAtualizar}>
                    <Modal.Header closeButton style={{ borderBottom: '2px solid var(--uepa-red)' }}>
                        <Modal.Title style={{ color: 'var(--uepa-blue)', fontWeight: 700 }}>Editar Equipamento</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: '2rem' }}>
                        <Row className="mb-3 g-3">
                            <Form.Group as={Col} md={6}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Registro Patrimonial (RP)</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={editFormData.rp || ''}
                                    onChange={(e) => setEditFormData({...editFormData, rp: e.target.value})}
                                    required className="p-2"
                                />
                            </Form.Group>
                            <Form.Group as={Col} md={6}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Marca</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={editFormData.marca || ''}
                                    onChange={(e) => setEditFormData({...editFormData, marca: e.target.value})}
                                    required className="p-2"
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3 g-3">
                            <Form.Group as={Col} md={6}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Capacidade (BTUs)</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={editFormData.capacidadeBtu || ''}
                                    onChange={(e) => setEditFormData({...editFormData, capacidadeBtu: e.target.value})}
                                    required className="p-2"
                                />
                            </Form.Group>
                            <Form.Group as={Col} md={6}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Local</Form.Label>
                                <Form.Select 
                                    value={editFormData.localId || ''}
                                    onChange={(e) => setEditFormData({...editFormData, localId: e.target.value})}
                                    required className="p-2"
                                >
                                    <option value="">Selecione um local...</option>
                                    {locais.map(local => (
                                        <option key={local.localId} value={local.localId}>
                                            {local.nomeLocal}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Row>
                    
                        <Row className="g-3">
                            <Form.Group as={Col} md={6}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Data de Entrada</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    value={editFormData.dataEntrada || ''}
                                    onChange={(e) => setEditFormData({...editFormData, dataEntrada: e.target.value})}
                                    required className="p-2"
                                />
                            </Form.Group>
                            <Form.Group as={Col} md={6}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Período de Manutenção</Form.Label>
                                <Form.Select 
                                    value={editFormData.periodoManMes || ''}
                                    onChange={(e) => setEditFormData({...editFormData, periodoManMes: e.target.value as PeriodoManutencao})}
                                    required className="p-2"
                                >
                                    <option value="MENSAL">Mensal</option>
                                    <option value="BIMESTRAL">Bimestral</option>
                                    <option value="TRIMESTRAL">Trimestral</option>
                                    <option value="SEMESTRAL">Semestral</option>
                                    <option value="ANUAL">Anual</option>
                                </Form.Select>
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