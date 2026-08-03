import type { TipoManu } from './Enums'

export interface HisManRequest {
    dataManu: string // YYYY-MM-DD
    tipoManu: TipoManu
    tecnicoResponsavel: string
    servicoRealizado: string
    observacoes?: string
    splitId: string // UUID
}

export interface HisManResponse {
    historicoManuId: string
    dataManu: string
    tipoManu: TipoManu
    tecnicoResponsavel: string
    servicoRealizado: string
    observacoes: string | null
    rp: string
    local: string
}

export interface HisUltimasManResponse {
    splitId: string
    rp: string
    marca: string
    nomeLocal: string
    dataUltimaMan: string
}

export interface FutManResponse {
    futurasManunId: string
    dataProxManu: string
    rp: string
    local: string
}