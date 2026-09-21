import { api } from './api'
import type { DefeitoRequest, DefeitoResponse } from '../types/Defeito'

export const defeitoService = {
    criar: async (data: DefeitoRequest): Promise<DefeitoResponse> => {
        const response = await api.post('defeitos/criar', data)
        return response.data
    },

    listar: async (): Promise<DefeitoResponse[]> => {
        const response = await api.get('defeitos/listar')
        return response.data
    },

    atualizar: async (uuid: string, data: DefeitoRequest): Promise<DefeitoResponse> => {
        const response = await api.patch(`defeitos/atualizar/${uuid}`, data)
        return response.data
    },

    deletar: async (uuid: string): Promise<void> => {
        await api.delete(`defeitos/deletar/${uuid}`)
    }
}
