import { api } from "./api";
import type { SplitRequest, SplitResponse } from "../types/Split";

export const splitService = {
    criar: async (data: SplitRequest): Promise<SplitResponse> => {
        const response = await api.post('splits/criar', data)
        return response.data
    },

    listar: async (): Promise<SplitResponse[]> => {
        const response = await api.get('splits/listar')
        return response.data
    },

    atualizar: async (uuid: string, data: Partial<SplitRequest>): Promise<SplitResponse> => {
        const response = await api.patch(`splits/atualizar/${uuid}`, data)
        return response.data
    },

    deletar: async (uuid: string): Promise<void> => {
        await api.delete(`splits/deletar/${uuid}`)
    }
}