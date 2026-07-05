package com.ladino.gerenciaSplits.services;

import com.ladino.gerenciaSplits.repository.HistoricoManunRepository;
import org.springframework.stereotype.Service;

@Service
public class HisManService {

    //Injeção de dependência do repositório
    private final HistoricoManunRepository hisManRepository;

    public HisManService(HistoricoManunRepository hisManRepository){
        this.hisManRepository = hisManRepository;
    }




}
