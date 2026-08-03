import type { PeriodoManutencao } from './Enums'

export interface SplitRequest {
    rp: string
    marca: string
    capacidadeBtu: string
    dataEntrada: string
    periodoManMes: PeriodoManutencao
    localId: string
}

export interface SplitResponse {
    uuid: string
    rp: string
    marca: string
    capacidadeBtu: string
    dataEntrada: string
    periodoManMes: PeriodoManutencao
    local: string
}