import { api } from "./api";
import type { FutManResponse } from "../types/Manutencao";

export const futManService = {
    listar: async (): Promise<FutManResponse[]> => {
        const response = await api.get('manu_futuras/listar')
        return response.data
    },

    deletar: async (uuid: string): Promise<void> => {
        await api.delete(`manu_futuras/deletar/${uuid}`)
    }

}