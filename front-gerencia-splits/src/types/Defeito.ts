export type StatusDefeito = 'ABERTO' | 'EM_MANUTENCAO' | 'RESOLVIDO'

export interface DefeitoRequest {
    dataRegistro: string
    descricao: string
    status: StatusDefeito
    observacoes: string
    splitId: string
}

export interface DefeitoResponse {
    defeitoId: string
    dataRegistro: string
    descricao: string
    status: StatusDefeito
    observacoes: string
    rp: string
    marca: string
    local: string
}
