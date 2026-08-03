import { api } from "./api";
import type { HisManRequest, HisManResponse, HisUltimasManResponse } from "../types/Manutencao";

export const hisManService = {
    criar: async (data: HisManRequest): Promise<HisManResponse> => {
        const response = await api.post('his_man/criar', data)
        return response.data
    },

    listar: async (): Promise<HisManResponse[]> => {
        const response = await api.get('his_man/listar')
        return response.data
    },

    listarUuid: async (uuid: string): Promise<HisManResponse[]> => {
        const response = await api.get(`his_man/listar/${uuid}`)
        return response.data
    },

    deletar: async (uuid: string): Promise<void> => {
        await api.delete(`his_man/deletar/${uuid}`)
    },

    listarUltimasMan: async (): Promise<HisUltimasManResponse[]> => {
        const response = await api.get('his_man/ultimas')
        return response.data
    }

}