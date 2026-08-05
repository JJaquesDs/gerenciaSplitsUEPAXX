import { useEffect, useState } from 'react';
import { Card, Table, Spinner, Badge, Button } from 'react-bootstrap';
import { futManService } from '../services/futManService';
import type { DashboardGeralResponse } from '../types/Manutencao';
import { hisManService } from '../services/hisManService';

export function Dashboard() {
    const [tabelaGeral, setTabelaGeral] = useState<DashboardGeralResponse[]>([]);
    const [loading, setLoading] = useState(true);

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
                    // se a máquina não veio na lista de "últimas", criamos ela
                    mapaMesclado.set(fut.rp, {
                        rp: fut.rp,
                        marca: '-', // marca não vem no DTO de futuras
                        local: fut.local,
                        proximaData: fut.dataProxManu,
                        futurasManunId: fut.futurasManunId
                    });
                }
            });

            // converte o Mapa de volta para um Array e salva no estado
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

    // Função que retorna apenas a Badge visual para colocar ao lado da data
    function renderStatusBadge(dataString?: string) {
        if (!dataString) return null;

        try {
            const limpa = dataString.trim(); 
            const partes = limpa.split('-');
            const ano = parseInt(partes[0], 10);
            const mes = parseInt(partes[1], 10) - 1; 
            const dia = parseInt(partes[2], 10);
            
            const dataManutencao = new Date(ano, mes, dia);
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0); 

            const tempoMan = dataManutencao.getTime();
            const tempoHoje = hoje.getTime();

            if (tempoMan < tempoHoje) {
                return <Badge bg="danger" className="ms-2">Atrasada</Badge>;
            } else if (tempoMan === tempoHoje) {
                return <Badge bg="warning" text="dark" className="ms-2">É Hoje!</Badge>;
            } else {
                return <Badge bg="success" className="ms-2">No Prazo</Badge>;
            }
        } catch {
            return null;
        }
    }

    return (
        <div>
            <h2 className="mb-4">DASHBOARD GERAL DE MANUTENÇÕES</h2>

            <Card className="shadow-sm border-0">
                <Card.Body className="p-0">
                    <Table striped hover responsive className="mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th>Split (RP)</th>
                                <th>Marca</th>
                                <th>Local</th>
                                <th>Última Manutenção</th>
                                <th>Próxima Manutenção</th>
                                <th className="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={6} className="text-center py-5">
                                        <Spinner animation="border" variant="dark" />
                                        <p className="mt-2 text-muted">Carregando painel...</p>
                                    </td>
                                </tr>
                            )}

                            {!loading && tabelaGeral.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-5 text-muted">
                                        Nenhuma informação encontrada no sistema.
                                    </td>
                                </tr>
                            )}

                            {!loading && tabelaGeral.map((linha, index) => (
                                <tr key={linha.rp || index} className="align-middle">
                                    <td className="fw-bold">{linha.rp}</td>
                                    <td>{linha.marca}</td>
                                    <td>{linha.local}</td>
                                    
                                    {/* COLUNA: ÚLTIMA MANUTENÇÃO */}
                                    <td className="fw-bold text-secondary">
                                        {linha.ultimaData 
                                            ? linha.ultimaData.split('-').reverse().join('/') 
                                            : 'Nunca realizada'}
                                    </td>
                                    
                                    {/* COLUNA: PRÓXIMA MANUTENÇÃO COM BADGE */}
                                    <td>
                                        {linha.proximaData ? (
                                            <>
                                                <span className="fw-bold">
                                                    {linha.proximaData.split('-').reverse().join('/')}
                                                </span>
                                                {renderStatusBadge(linha.proximaData)}
                                            </>
                                        ) : (
                                            <span className="text-muted">Não agendada</span>
                                        )}
                                    </td>

                                    {/* COLUNA: AÇÕES */}
                                    <td className="text-center">
                                        {linha.futurasManunId && (
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleDeletar(linha.futurasManunId!)}
                                                title="Deletar este agendamento"
                                            >
                                                Excluir
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
}