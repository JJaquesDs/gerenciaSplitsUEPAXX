import { useEffect, useMemo, useState } from 'react'
import type { SyntheticEvent } from 'react'
import { Alert, Button, Card, Col, Form, InputGroup, Modal, Row, Spinner, Table } from 'react-bootstrap'
import { Client } from '@stomp/stompjs'
import { WEBSOCKET_URL } from '../config/websocket'
import { defeitoService } from '../services/defeitoService'
import { splitService } from '../services/splitService'
import type { DefeitoRequest, DefeitoResponse, StatusDefeito } from '../types/Defeito'
import type { SplitResponse } from '../types/Split'

const dataDeHoje = () => {
    const hoje = new Date()
    const ano = hoje.getFullYear()
    const mes = String(hoje.getMonth() + 1).padStart(2, '0')
    const dia = String(hoje.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
}

const formInicial = (): DefeitoRequest => ({
    splitId: '',
    dataRegistro: dataDeHoje(),
    descricao: '',
    status: 'ABERTO',
    observacoes: ''
})

const textoStatus: Record<StatusDefeito, string> = {
    ABERTO: 'Aberto',
    EM_MANUTENCAO: 'Em manutenção',
    RESOLVIDO: 'Resolvido'
}

export function Defeito() {
    const [defeitos, setDefeitos] = useState<DefeitoResponse[]>([])
    const [splits, setSplits] = useState<SplitResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('')
    const [busca, setBusca] = useState('')
    const [ordemData, setOrdemData] = useState<'desc' | 'asc'>('desc')
    const [formData, setFormData] = useState<DefeitoRequest>(formInicial)
    const [showModal, setShowModal] = useState(false)
    const [defeitoEditando, setDefeitoEditando] = useState<string | null>(null)
    const [editFormData, setEditFormData] = useState<DefeitoRequest>(formInicial)

    useEffect(() => {
        carregarDados()

        const stompClient = new Client({
            brokerURL: WEBSOCKET_URL,
            onConnect: () => {
                stompClient.subscribe('/topic/atualizacoes', carregarDados)
            },
            onStompError: (frame) => console.error('Erro STOMP:', frame),
            onWebSocketError: (frame) => console.error('Erro WebSocket:', frame)
        })

        stompClient.activate()
        return () => {
            stompClient.deactivate()
        }
    }, [])

    async function carregarDados() {
        setLoading(true)
        try {
            const [dadosDefeitos, dadosSplits] = await Promise.all([
                defeitoService.listar(),
                splitService.listar()
            ])
            setDefeitos(dadosDefeitos)
            setSplits(dadosSplits)
        } catch {
            setErro('Não foi possível carregar os registros de defeitos.')
        } finally {
            setLoading(false)
        }
    }

    const defeitosFiltrados = useMemo(() => {
        const removerAcentos = (texto: string) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        const termo = removerAcentos(busca.trim().toLowerCase())

        const resultado = termo
            ? defeitos.filter((defeito) => {
                const dataFormatada = defeito.dataRegistro?.split('-').reverse().join('/') ?? ''
                return [
                    defeito.rp,
                    defeito.marca,
                    defeito.local,
                    defeito.descricao,
                    defeito.observacoes,
                    dataFormatada,
                    textoStatus[defeito.status]
                ]
                    .filter(Boolean)
                    .some((campo) => removerAcentos(String(campo).toLowerCase()).includes(termo))
            })
            : defeitos

        return [...resultado].sort((a, b) => {
            if (a.dataRegistro < b.dataRegistro) return ordemData === 'asc' ? -1 : 1
            if (a.dataRegistro > b.dataRegistro) return ordemData === 'asc' ? 1 : -1
            return 0
        })
    }, [defeitos, busca, ordemData])

    async function handleRegistrar(event: SyntheticEvent) {
        event.preventDefault()
        setErro('')
        setSucesso('')

        if (!formData.splitId) {
            setErro('Selecione o equipamento com defeito.')
            return
        }

        try {
            setLoading(true)
            await defeitoService.criar(formData)
            setFormData(formInicial())
            await carregarDados()
            exibirSucesso('Defeito registrado com sucesso!')
        } catch {
            setErro('Não foi possível registrar o defeito. Verifique os dados informados.')
        } finally {
            setLoading(false)
        }
    }

    function abrirModalEdicao(defeito: DefeitoResponse) {
        const split = splits.find((item) => item.rp === defeito.rp)
        if (!split) {
            setErro('O equipamento deste registro não foi encontrado.')
            return
        }

        setDefeitoEditando(defeito.defeitoId)
        setEditFormData({
            splitId: split.uuid,
            dataRegistro: defeito.dataRegistro,
            descricao: defeito.descricao,
            status: defeito.status,
            observacoes: defeito.observacoes ?? ''
        })
        setShowModal(true)
    }

    async function handleAtualizar(event: SyntheticEvent) {
        event.preventDefault()
        if (!defeitoEditando) return

        setErro('')
        setSucesso('')
        try {
            setLoading(true)
            await defeitoService.atualizar(defeitoEditando, editFormData)
            setShowModal(false)
            await carregarDados()
            exibirSucesso('Registro de defeito atualizado com sucesso!')
        } catch {
            setErro('Não foi possível atualizar o registro de defeito.')
        } finally {
            setLoading(false)
        }
    }

    async function handleDeletar(uuid: string) {
        if (!window.confirm('Tem certeza que deseja excluir este registro de defeito?')) return

        setErro('')
        setSucesso('')
        try {
            setLoading(true)
            await defeitoService.deletar(uuid)
            setDefeitos((atual) => atual.filter((defeito) => defeito.defeitoId !== uuid))
            exibirSucesso('Registro de defeito excluído com sucesso!')
        } catch {
            setErro('Não foi possível excluir o registro de defeito.')
        } finally {
            setLoading(false)
        }
    }

    function exibirSucesso(mensagem: string) {
        setSucesso(mensagem)
        window.setTimeout(() => setSucesso(''), 3000)
    }

    function badgeStatus(status: StatusDefeito) {
        const classe = status === 'ABERTO'
            ? 'status-red'
            : status === 'EM_MANUTENCAO'
                ? 'status-grey'
                : 'status-green'
        return <span className={`status-tag ${classe}`}>{textoStatus[status]}</span>
    }

    return (
        <div>
            <header className="page-head">
                <h1>Registro de Defeitos</h1>
                <p>Controle de aparelhos com defeito e acompanhamento da situação de cada ocorrência.</p>
            </header>

            {erro && <Alert variant="danger" onClose={() => setErro('')} dismissible>{erro}</Alert>}
            {sucesso && <Alert variant="success" onClose={() => setSucesso('')} dismissible>{sucesso}</Alert>}

            <Card className="app-card mb-5">
                <Card.Body style={{ padding: '2rem' }}>
                    <h5 className="mb-4" style={{ color: 'var(--uepa-blue)', fontWeight: 700 }}>Registrar Novo Defeito</h5>
                    <Form onSubmit={handleRegistrar}>
                        <Row className="mb-3 g-3">
                            <Form.Group as={Col} md={5}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Equipamento (Split)</Form.Label>
                                <Form.Select
                                    value={formData.splitId}
                                    onChange={(event) => setFormData({ ...formData, splitId: event.target.value })}
                                    required
                                    disabled={loading}
                                    className="p-2"
                                >
                                    <option value="">Selecione o Split...</option>
                                    {splits.map((split) => (
                                        <option key={split.uuid} value={split.uuid}>
                                            RP: {split.rp} — {split.marca} ({split.local})
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} md={3}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Data do Registro</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={formData.dataRegistro}
                                    onChange={(event) => setFormData({ ...formData, dataRegistro: event.target.value })}
                                    required
                                    disabled={loading}
                                    className="p-2"
                                />
                            </Form.Group>
                            <Form.Group as={Col} md={4}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Situação</Form.Label>
                                <Form.Select
                                    value={formData.status}
                                    onChange={(event) => setFormData({ ...formData, status: event.target.value as StatusDefeito })}
                                    disabled={loading}
                                    className="p-2"
                                >
                                    <option value="ABERTO">Aberto</option>
                                    <option value="EM_MANUTENCAO">Em manutenção</option>
                                    <option value="RESOLVIDO">Resolvido</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        <Row className="align-items-end g-3">
                            <Form.Group as={Col} md={8}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Descrição do Defeito</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ex: Aparelho não liga, vazamento de água..."
                                    value={formData.descricao}
                                    onChange={(event) => setFormData({ ...formData, descricao: event.target.value })}
                                    required
                                    disabled={loading}
                                    className="p-2"
                                />
                            </Form.Group>
                            <Col md={4} className="d-grid mt-3 mt-md-0">
                                <Button type="submit" disabled={loading} style={{ backgroundColor: 'var(--uepa-blue)', border: 'none', padding: '0.65rem' }}>
                                    {loading ? <Spinner size="sm" animation="border" /> : 'Registrar Defeito'}
                                </Button>
                            </Col>
                        </Row>
                        <Form.Group className="mt-3">
                            <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Observações (opcional)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="Inclua detalhes adicionais sobre o problema..."
                                value={formData.observacoes}
                                onChange={(event) => setFormData({ ...formData, observacoes: event.target.value })}
                                disabled={loading}
                            />
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>

            <div className="search-container">
                <label className="search-label">Pesquisar defeitos</label>
                <InputGroup className="search-premium">
                    <InputGroup.Text>
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                        </svg>
                    </InputGroup.Text>
                    <Form.Control
                        type="search"
                        placeholder="Buscar por RP, local, descrição ou situação..."
                        value={busca}
                        onChange={(event) => setBusca(event.target.value)}
                    />
                </InputGroup>
            </div>

            <div className="table-shell">
                <Table responsive hover className="app-table">
                    <thead>
                        <tr>
                            <th>Equipamento</th>
                            <th>Local</th>
                            <th>Descrição</th>
                            <th
                                onClick={() => setOrdemData((atual) => atual === 'desc' ? 'asc' : 'desc')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                title="Clique para inverter a ordem"
                            >
                                Data {ordemData === 'desc' ? '↓' : '↑'}
                            </th>
                            <th>Situação</th>
                            <th className="text-center" style={{ minWidth: '120px' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && defeitos.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-5">
                                    <Spinner size="sm" animation="border" className="me-2" style={{ color: 'var(--uepa-blue)' }} />
                                    Carregando registros...
                                </td>
                            </tr>
                        )}
                        {!loading && defeitosFiltrados.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-5 text-muted-custom">
                                    {busca ? 'Nenhum defeito encontrado para o termo buscado.' : 'Nenhum defeito registrado ainda.'}
                                </td>
                            </tr>
                        )}
                        {defeitosFiltrados.map((defeito) => (
                            <tr key={defeito.defeitoId}>
                                <td><strong style={{ color: 'var(--uepa-blue)' }}>RP: {defeito.rp}</strong><br />{defeito.marca}</td>
                                <td>{defeito.local}</td>
                                <td>{defeito.descricao}{defeito.observacoes && <small className="d-block text-muted-custom mt-1">{defeito.observacoes}</small>}</td>
                                <td>{defeito.dataRegistro?.split('-').reverse().join('/')}</td>
                                <td>{badgeStatus(defeito.status)}</td>
                                <td className="text-center">
                                    <button
                                        onClick={() => abrirModalEdicao(defeito)}
                                        title="Editar registro"
                                        disabled={loading}
                                        style={{ background: 'transparent', border: 'none', color: 'var(--uepa-blue)', padding: '0.25rem', marginRight: '8px' }}
                                    >
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                    <button className="btn-icon-danger" onClick={() => handleDeletar(defeito.defeitoId)} title="Excluir registro" disabled={loading}>
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" /></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" size="lg">
                <Form onSubmit={handleAtualizar}>
                    <Modal.Header closeButton style={{ borderBottom: '2px solid var(--uepa-red)' }}>
                        <Modal.Title style={{ color: 'var(--uepa-blue)', fontWeight: 700 }}>Editar Registro de Defeito</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: '2rem' }}>
                        <Row className="mb-3 g-3">
                            <Form.Group as={Col} md={6}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Equipamento (Split)</Form.Label>
                                <Form.Select value={editFormData.splitId} onChange={(event) => setEditFormData({ ...editFormData, splitId: event.target.value })} required>
                                    <option value="">Selecione o Split...</option>
                                    {splits.map((split) => <option key={split.uuid} value={split.uuid}>RP: {split.rp} — {split.marca}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} md={3}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Data do Registro</Form.Label>
                                <Form.Control type="date" value={editFormData.dataRegistro} onChange={(event) => setEditFormData({ ...editFormData, dataRegistro: event.target.value })} required />
                            </Form.Group>
                            <Form.Group as={Col} md={3}>
                                <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Situação</Form.Label>
                                <Form.Select value={editFormData.status} onChange={(event) => setEditFormData({ ...editFormData, status: event.target.value as StatusDefeito })}>
                                    <option value="ABERTO">Aberto</option>
                                    <option value="EM_MANUTENCAO">Em manutenção</option>
                                    <option value="RESOLVIDO">Resolvido</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Descrição do Defeito</Form.Label>
                            <Form.Control type="text" value={editFormData.descricao} onChange={(event) => setEditFormData({ ...editFormData, descricao: event.target.value })} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="search-label" style={{ fontSize: '0.85rem' }}>Observações (opcional)</Form.Label>
                            <Form.Control as="textarea" rows={3} value={editFormData.observacoes} onChange={(event) => setEditFormData({ ...editFormData, observacoes: event.target.value })} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer style={{ borderTop: 'none', padding: '1rem 2rem 2rem' }}>
                        <Button variant="light" onClick={() => setShowModal(false)} style={{ color: 'var(--muted)', fontWeight: 600 }}>Cancelar</Button>
                        <Button type="submit" disabled={loading} style={{ backgroundColor: 'var(--uepa-blue)', border: 'none' }}>
                            {loading ? <Spinner size="sm" animation="border" /> : 'Salvar Alterações'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    )
}
