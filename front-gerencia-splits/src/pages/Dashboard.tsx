import { useEffect, useState } from 'react';
import { Card, Table, Spinner, Badge, Button } from 'react-bootstrap';
import { futManService } from '../services/futManService';
import type { FutManResponse } from '../types/Manutencao';

export function Dashboard() {
    const [futuras, setFuturas] = useState<FutManResponse[]>([]);
    const [loading, setLoading] = useState(true);

    async function carregarFuturas() {
        futManService.listar()
            .then((dados) => {
                setFuturas(dados);
            })
            .catch(() => {
                alert("Erro ao carregar as manutenções futuras.");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        carregarFuturas();
    }, []);

    async function handleDeletar(id: string) {
        const confirmar = window.confirm("Tem certeza que deseja deletar este agendamento?");
        if (!confirmar) return;

        try {
            setLoading(true);
            await futManService.deletar(id);
            await carregarFuturas(); 
        } catch {
            alert("Erro ao deletar o agendamento.");
        } finally {
            setLoading(false);
        }
    }

    function verificarStatus(dataString: string) {
        if (!dataString) return <Badge bg="secondary">Desconhecido</Badge>;

        try {
            // O trim() remove qualquer espaço em branco invisível que o Java possa ter mandado
            const limpa = dataString.trim(); 
            const partes = limpa.split('-');
            
            const ano = parseInt(partes[0], 10);
            const mes = parseInt(partes[1], 10) - 1; 
            const dia = parseInt(partes[2], 10);
            
            const dataManutencao = new Date(ano, mes, dia);
            
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0); 

            // Convertendo para milissegundos
            const tempoMan = dataManutencao.getTime();
            const tempoHoje = hoje.getTime();

            if (tempoMan < tempoHoje) {
                return <Badge bg="danger">Atrasada</Badge>;
            } else if (tempoMan === tempoHoje) {
                return <Badge bg="warning" text="dark">É Hoje!</Badge>;
            } else {
                return <Badge bg="success">No Prazo</Badge>;
            }
        } catch {
            return <Badge bg="secondary">Erro na Data</Badge>;
        }
    }

    return (
        <div>
            <h2 className="mb-4">Dashboard - Manutenções Futuras</h2>

            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white py-3">
                    <h5 className="mb-0">Próximas Manutenções Agendadas</h5>
                </Card.Header>
                <Card.Body className="p-0">
                    <Table striped hover responsive className="mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="px-4">Status</th>
                                <th>Data Prevista</th>
                                <th>Split (RP)</th>
                                <th>Local</th>
                                <th className="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={5} className="text-center py-5">
                                        <Spinner animation="border" variant="primary" />
                                        <p className="mt-2 text-muted">Carregando agendamentos...</p>
                                    </td>
                                </tr>
                            )}

                            {!loading && futuras.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-5 text-muted">
                                        Nenhuma manutenção futura agendada no momento.
                                    </td>
                                </tr>
                            )}

                            {!loading && futuras.map((futura) => {
                                return (
                                    <tr key={futura.futurasManunId} className="align-middle">
                                        <td className="px-4">{verificarStatus(futura.dataProxManu)}</td>
                                        <td className="fw-bold">
                                            {/* Formata a data de YYYY-MM-DD para DD/MM/YYYY (padrão brasileiro) */}
                                            {futura.dataProxManu.split('-').reverse().join('/')}
                                        </td>
                                        <td className="fw-bold">{futura.rp}</td>
                                        <td>{futura.local}</td>
                                        <td className="text-center">
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleDeletar(futura.futurasManunId)}
                                                title="Deletar este agendamento"
                                            >
                                                Excluir
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
}