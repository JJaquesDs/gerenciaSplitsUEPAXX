import { api } from "./api";
import type { LocalRequest, LocalResponse } from "../types/Local";

export const localService = {
    criar: async (data: LocalRequest): Promise<LocalResponse> => {
        const response = await api.post('locais/criar', data)
        return response.data
    },

    listar: async (): Promise<LocalResponse[]> => {
        const response = await api.get('locais/listar')
        return response.data
    },

    deletar: async (uuid: string): Promise<void> => {
        await api.delete(`locais/deletar/${uuid}`)
    }

}