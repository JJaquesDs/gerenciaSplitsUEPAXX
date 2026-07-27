package com.ladino.gerenciaSplits.services;

import com.ladino.gerenciaSplits.dtos.responses.HisUltimasManResponse;
import com.ladino.gerenciaSplits.repository.HistoricoManuRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UltimasManService {

    //Injeção de dependências para usar mapper
    private final HistoricoManuRepository historicoManuRepository;

    //Construtor
    public UltimasManService(
            HistoricoManuRepository historicoManuRepository
    ){
        this.historicoManuRepository = historicoManuRepository;
    }

    /**
     * Mostrando todas as últimas manutenções
     * **/
    public List<HisUltimasManResponse> listarUltimasManService(){

        return historicoManuRepository.findUltimasManutencoes();
    }

}
