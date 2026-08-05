import { useEffect, useState } from 'react'
import type { SyntheticEvent } from 'react';
import { Button, Card, Form, Spinner, Table } from 'react-bootstrap';
import { localService } from '../services/localService';
import type { LocalResponse } from '../types/Local';

export function Locais() {
    // Estados para armazenar a lista, carregamento e erros/sucesso
    const [locais, setLocais] = useState<LocalResponse[]>([]);
    const [nomeLocal, setNomeLocal] = useState('');
    const [loading, setLoading] = useState(true);

    // Carrega a lista automaticamente ao abrir a tela
    useEffect(() => {
        localService.listar()
            .then((dados) => {
                setLocais(dados);
            })
            .catch(() => {
                alert("Não foi possível carregar a lista de locais.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    async function handleCriar(e: SyntheticEvent) {
        e.preventDefault();
        if (!nomeLocal.trim()) return;

        try {
            setLoading(true);
            await localService.criar({ nomeLocal });
            setNomeLocal('');
            
            // Busca a lista atualizada e reflete na tela
            const dadosAtualizados = await localService.listar();
            setLocais(dadosAtualizados);
        } catch {
            alert("Erro ao criar local. Verifique se o nome já existe (Erro 409).");
        } finally {
            setLoading(false);
        }
    }

    async function handleDeletar(uuid: string) {
        const confirmar = window.confirm("Tem certeza que deseja deletar este local?");
        if (!confirmar) return;

        try {
            setLoading(true);
            await localService.deletar(uuid);
            // Remove o local da tabela visualmente sem precisar chamar a API de novo
            setLocais(prevLocais => prevLocais.filter(local => local.localId !== uuid));
        } catch {
            alert("Erro ao deletar o local.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h2 className="mb-4">Gerenciar Locais</h2>

            <Card className="mb-4">
                <Card.Body>
                    <Form onSubmit={handleCriar} className="d-flex gap-3 align-items-end">
                        <Form.Group className="flex-grow-1" controlId="formNomeLocal">
                            <Form.Label>Nome do Novo Local</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Ex: Auditório, Laboratório 1, Biblioteca..." 
                                value={nomeLocal}
                                onChange={(e) => setNomeLocal(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner size="sm" animation="border" /> : 'Adicionar Local'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            <Table striped bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>ID (UUID)</th>
                        <th>Nome do Local</th>
                        <th className="text-center" style={{ width: '150px' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {locais.length === 0 && !loading && (
                        <tr>
                            <td colSpan={3} className="text-center py-4 text-muted">
                                Nenhum local cadastrado ainda.
                            </td>
                        </tr>
                    )}
                    
                    {locais.map((local) => (
                        <tr key={local.localId}>
                            <td className="text-muted" style={{ fontSize: '0.9em' }}>
                                {local.localId}
                            </td>
                            <td className="align-middle fw-bold">
                                {local.nomeLocal}
                            </td>
                            <td className="text-center">
                                <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleDeletar(local.localId)}
                                    disabled={loading}
                                >
                                    Excluir
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );

}