import { useEffect, useState } from 'react';
import type { SyntheticEvent } from 'react';
import { Button, Card, Col, Form, Row, Spinner, Table, Badge } from 'react-bootstrap';
import { hisManService } from '../services/hisManService';
import { splitService } from '../services/splitService';
import type { HisManResponse } from '../types/Manutencao';
import type { SplitResponse } from '../types/Split';
import type { TipoManu } from '../types/Enums';

// o backend manda o rp e o local
type HistoricoCompleto = HisManResponse & { rp?: string; local?: string };

export function Historico() {
    const [historico, setHistorico] = useState<HistoricoCompleto[]>([]);
    const [splits, setSplits] = useState<SplitResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        splitId: '',
        dataManu: '', 
        tecnicoResponsavel: '', 
        servicoRealizado: '',   
        tipoManu: 'PREVENTIVA' as TipoManu,
        observacoes: '' 
    });

    useEffect(() => {
        Promise.all([hisManService.listar(), splitService.listar()])
            .then(([dadosHistorico, dadosSplits]) => {
                setHistorico(dadosHistorico);
                setSplits(dadosSplits);
            })
            .catch(() => alert("Erro ao carregar dados do histórico."))
            .finally(() => setLoading(false));
    }, []);

    async function handleRegistrar(e: SyntheticEvent) {
        e.preventDefault();
        
        if (!formData.splitId) {
            alert("Selecione um Split!");
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
            
            const dadosAtualizados = await hisManService.listar();
            setHistorico(dadosAtualizados);
        } catch {
            alert("Erro ao registrar a manutenção.");
        } finally {
            setLoading(false);
        }
    }

    function renderBadgeTipo(tipo: string) {
        switch (tipo) {
            case 'PREVENTIVA': return <Badge bg="info">Preventiva</Badge>;
            case 'CORRETIVA': return <Badge bg="danger">Corretiva</Badge>;
            case 'INSTALACAO': return <Badge bg="success">Instalação</Badge>;
            case 'DESINSTALACAO': return <Badge bg="secondary">Desinstalação</Badge>;
            default: return <Badge bg="primary">{tipo}</Badge>;
        }
    }

    return (
        <div>
            <h2 className="mb-4">Histórico de Manutenções</h2>

            <Card className="mb-4">
                <Card.Header className="bg-dark text-white">Registrar Nova Manutenção</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleRegistrar}>
                        <Row className="mb-3">
                            <Form.Group as={Col} md={4} controlId="formSplit">
                                <Form.Label>Split</Form.Label>
                                <Form.Select 
                                    value={formData.splitId}
                                    onChange={(e) => setFormData({...formData, splitId: e.target.value})}
                                    required disabled={loading}
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
                                <Form.Label>Data da Manutenção</Form.Label>
                                <Form.Control 
                                    type="date" 
                                    value={formData.dataManu}
                                    onChange={(e) => setFormData({...formData, dataManu: e.target.value})}
                                    required disabled={loading} 
                                />
                            </Form.Group>

                            <Form.Group as={Col} md={4} controlId="formTipo">
                                <Form.Label>Tipo de Manutenção</Form.Label>
                                <Form.Select 
                                    value={formData.tipoManu}
                                    onChange={(e) => setFormData({...formData, tipoManu: e.target.value as TipoManu})}
                                    disabled={loading}
                                >
                                    <option value="PREVENTIVA">Preventiva</option>
                                    <option value="CORRETIVA">Corretiva</option>
                                    <option value="INSTALACAO">Instalação</option>
                                    <option value="DESINSTALACAO">Desinstalação</option>
                                    <option value="INSTALACAO_PREVENTIVA">Instal. + Preventiva</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} md={6} controlId="formTecnico">
                                <Form.Label>Técnico Responsável</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Ex: João Silva" 
                                    value={formData.tecnicoResponsavel}
                                    onChange={(e) => setFormData({...formData, tecnicoResponsavel: e.target.value})}
                                    required disabled={loading} 
                                />
                            </Form.Group>

                            <Form.Group as={Col} md={6} controlId="formServico">
                                <Form.Label>Serviço Realizado</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Ex: Troca de compressor" 
                                    value={formData.servicoRealizado}
                                    onChange={(e) => setFormData({...formData, servicoRealizado: e.target.value})}
                                    required disabled={loading} 
                                />
                            </Form.Group>
                        </Row>

                        <Row className="align-items-end">
                            <Form.Group as={Col} md={9} controlId="formObs">
                                <Form.Label>Observações (Opcional)</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Detalhes adicionais..." 
                                    value={formData.observacoes}
                                    onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                                    disabled={loading} 
                                />
                            </Form.Group>

                            <Col md={3} className="d-grid mt-3 mt-md-0">
                                <Button variant="dark" type="submit" disabled={loading}>
                                    {loading ? <Spinner size="sm" animation="border" /> : 'Registrar'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            <Table striped bordered hover responsive>
                <thead className="table-secondary">
                    <tr>
                        <th>Data</th>
                        <th>Split (RP)</th>
                        <th>Local</th>
                        <th>Técnico</th>
                        <th>Serviço</th>
                        <th>Tipo</th>
                        <th>Observações</th>
                    </tr>
                </thead>
                <tbody>
                    {historico.length === 0 && !loading && (
                        <tr>
                            <td colSpan={7} className="text-center py-4 text-muted">
                                Nenhum registro de manutenção encontrado.
                            </td>
                        </tr>
                    )}
                    
                    {historico.map((hist, index) => (
                        <tr key={index}>
                            <td className="fw-bold">{hist.dataManu}</td>
                            
                            <td className="fw-bold">{hist.rp}</td>
                            <td>{hist.local}</td>
                            
                            <td>{hist.tecnicoResponsavel}</td>
                            <td>{hist.servicoRealizado}</td>
                            <td>{renderBadgeTipo(hist.tipoManu)}</td>
                            <td className="text-muted">{hist.observacoes || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}