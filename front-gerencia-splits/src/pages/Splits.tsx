import { useEffect, useState } from 'react';
import type { SyntheticEvent } from 'react';
import { Button, Card, Col, Form, Row, Spinner, Table, Modal } from 'react-bootstrap';
import { splitService } from '../services/splitService';
import { localService } from '../services/localService';
import type { SplitRequest, SplitResponse } from '../types/Split';
import type { LocalResponse } from '../types/Local';
import type { PeriodoManutencao } from '../types/Enums';

export function Splits() {
    const [splits, setSplits] = useState<SplitResponse[]>([]);
    const [locais, setLocais] = useState<LocalResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        rp: '',
        marca: '',
        capacidadeBtu: '',
        dataEntrada: '',
        periodoManMes: 'MENSAL' as PeriodoManutencao,
        localId: ''
    });

    const [showModal, setShowModal] = useState(false);
    const [splitEditando, setSplitEditando] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<SplitRequest>>({});

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        setLoading(true);
        Promise.all([splitService.listar(), localService.listar()])
            .then(([dadosSplits, dadosLocais]) => {
                setSplits(dadosSplits);
                setLocais(dadosLocais);
            })
            .catch(() => {
                alert("Erro ao carregar os dados. Verifique a conexão com a API.");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    async function handleCriar(e: SyntheticEvent) {
        e.preventDefault();
        
        if (!formData.localId) {
            alert("Por favor, selecione um Local válido para alocar o Split!");
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
        } catch {
            alert("Erro ao cadastrar Split. Verifique se o RP já existe (Erro 409).");
        } finally {
            setLoading(false);
        }
    }

    async function handleDeletar(uuid: string) {
        const confirmar = window.confirm("Tem certeza que deseja deletar este Split?");
        if (!confirmar) return;

        try {
            setLoading(true);
            await splitService.deletar(uuid);
            setSplits(prev => prev.filter(s => s.uuid !== uuid));
        } catch {
            alert("Não é possível excluir este Split pois existem Manutenções vinculadas a ele. Exclua as manutenções primeiro.");
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

        try {
            setLoading(true);
            await splitService.atualizar(splitEditando, editFormData);
            setShowModal(false); 
            await carregarDados(); 
        } catch {
            alert("Erro ao atualizar o Split.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h2 className="mb-4">Gerenciar Splits</h2>

            <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white">Cadastrar Novo Split</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleCriar}>
                        <Row className="mb-3">
                            <Form.Group as={Col} md={3} controlId="formRp">
                                <Form.Label>Registro Patrimonial (RP)</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Ex: 00.001" 
                                    value={formData.rp}
                                    onChange={(e) => setFormData({...formData, rp: e.target.value})}
                                    required disabled={loading} 
                                />
                            </Form.Group>

                            <Form.Group as={Col} md={3} controlId="formMarca">
                                <Form.Label>Marca</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Ex: LG, Midea..." 
                                    value={formData.marca}
                                    onChange={(e) => setFormData({...formData, marca: e.target.value})}
                                    required disabled={loading} 
                                />
                            </Form.Group>

                            <Form.Group as={Col} md={3} controlId="formBtu">
                                <Form.Label>Capacidade (BTUs)</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Ex: 12.000" 
                                    value={formData.capacidadeBtu}
                                    onChange={(e) => setFormData({...formData, capacidadeBtu: e.target.value})}
                                    required disabled={loading} 
                                />
                            </Form.Group>

                            <Form.Group as={Col} md={3} controlId="formDataEntrada">
                                <Form.Label>Data de Entrada</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    value={formData.dataEntrada}
                                    onChange={(e) => setFormData({...formData, dataEntrada: e.target.value})}
                                    required disabled={loading} 
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3 align-items-end">
                            <Form.Group as={Col} md={4} controlId="formPeriodo">
                                <Form.Label>Período de Manutenção</Form.Label>
                                <Form.Select 
                                    value={formData.periodoManMes}
                                    onChange={(e) => setFormData({...formData, periodoManMes: e.target.value as PeriodoManutencao})}
                                    disabled={loading}
                                >
                                    <option value="MENSAL">Mensal</option>
                                    <option value="BIMESTRAL">Bimestral</option>
                                    <option value="TRIMESTRAL">Trimestral</option>
                                    <option value="SEMESTRAL">Semestral</option>
                                    <option value="ANUAL">Anual</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group as={Col} md={5} controlId="formLocal">
                                <Form.Label>Alocar no Local</Form.Label>
                                <Form.Select 
                                    value={formData.localId}
                                    onChange={(e) => setFormData({...formData, localId: e.target.value})}
                                    required disabled={loading}
                                >
                                    <option value="">Selecione um local...</option>
                                    {locais.map(local => (
                                        <option key={local.localId} value={local.localId}>
                                            {local.nomeLocal}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Col md={3} className="d-grid">
                                <Button variant="success" type="submit" disabled={loading}>
                                    {loading ? <Spinner size="sm" animation="border" /> : 'Salvar Split'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            <Table striped bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>RP</th>
                        <th>Marca</th>
                        <th>Capacidade</th>
                        <th>Local</th>
                        <th>Data Entrada</th>
                        <th>Manutenção</th>
                        <th className="text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {splits.length === 0 && !loading && (
                        <tr>
                            <td colSpan={7} className="text-center py-4 text-muted">
                                Nenhum split cadastrado.
                            </td>
                        </tr>
                    )}
                    
                    {splits.map((split) => (
                        <tr key={split.uuid} className="align-middle">
                            <td className="fw-bold">{split.rp}</td>
                            <td>{split.marca}</td>
                            <td>{split.capacidadeBtu}</td>
                            <td>{split.local}</td>
                            <td>{split.dataEntrada.split('-').reverse().join('/')}</td>
                            <td>{split.periodoManMes}</td>
                            <td className="text-center">
                                <Button 
                                    variant="warning" 
                                    size="sm"
                                    className="me-2"
                                    onClick={() => abrirModalEdicao(split)}
                                    disabled={loading}
                                >
                                    Editar
                                </Button>
                                <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleDeletar(split.uuid)}
                                    disabled={loading}
                                >
                                    Excluir
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* MODAL DE EDIÇÃO */}
            <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" size="lg">
                <Form onSubmit={handleAtualizar}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Split</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="mb-3">
                            <Form.Group as={Col} md={6}>
                                <Form.Label>Registro Patrimonial (RP)</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={editFormData.rp || ''}
                                    onChange={(e) => setEditFormData({...editFormData, rp: e.target.value})}
                                    required 
                                />
                            </Form.Group>
                            <Form.Group as={Col} md={6}>
                                <Form.Label>Marca</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={editFormData.marca || ''}
                                    onChange={(e) => setEditFormData({...editFormData, marca: e.target.value})}
                                    required 
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} md={6}>
                                <Form.Label>Capacidade (BTUs)</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={editFormData.capacidadeBtu || ''}
                                    onChange={(e) => setEditFormData({...editFormData, capacidadeBtu: e.target.value})}
                                    required 
                                />
                            </Form.Group>
                            <Form.Group as={Col} md={6}>
                                <Form.Label>Local</Form.Label>
                                <Form.Select 
                                    value={editFormData.localId || ''}
                                    onChange={(e) => setEditFormData({...editFormData, localId: e.target.value})}
                                    required
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
                    
                        <Row className="mb-3">
                            <Form.Group as={Col} md={6}>
                                <Form.Label>Data de Entrada</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    value={editFormData.dataEntrada || ''}
                                    onChange={(e) => setEditFormData({...editFormData, dataEntrada: e.target.value})}
                                    required 
                                />
                            </Form.Group>
                            <Form.Group as={Col} md={6}>
                                <Form.Label>Período de Manutenção</Form.Label>
                                <Form.Select 
                                    value={editFormData.periodoManMes || ''}
                                    onChange={(e) => setEditFormData({...editFormData, periodoManMes: e.target.value as PeriodoManutencao})}
                                    required
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
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="success" type="submit" disabled={loading}>
                            {loading ? <Spinner size="sm" animation="border" /> : 'Salvar Alterações'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}