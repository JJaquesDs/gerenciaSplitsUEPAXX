import { api } from './api'; 

// Função auxiliar para forçar o navegador a fazer o download do arquivo
function dispararDownload(dados: Blob, nomeArquivo: string) {
    const url = window.URL.createObjectURL(new Blob([dados]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nomeArquivo);
    document.body.appendChild(link);
    link.click();
    
    // Limpeza para não consumir memória do navegador
    if (link.parentNode) {
        link.parentNode.removeChild(link);
    }
    window.URL.revokeObjectURL(url);
}

export const relatoriosService = {
    gerarCadastroSplits: async () => {
        const response = await api.get('/api/relatorios/cadastro_splits', { 
            responseType: 'blob' 
        });
        dispararDownload(response.data, 'cadastro_splits.xlsx');
    },

    gerarHistoricoDescricao: async () => {
        const response = await api.get('/api/relatorios/historico_descricao', { 
            responseType: 'blob' 
        });
        dispararDownload(response.data, 'historico_descricao.xlsx');
    },

    gerarUltimasManutencoes: async () => {
        const response = await api.get('/api/relatorios/ultimas_manu', { 
            responseType: 'blob' 
        });
        dispararDownload(response.data, 'ultimas_manu.xlsx');
    },

    gerarDatasUltimasManutencoes: async () => {
        const response = await api.get('/api/relatorios/datas_ultimas_man', { 
            responseType: 'blob' 
        });
        dispararDownload(response.data, 'datas_ultimas_manu.xlsx');
    }
};