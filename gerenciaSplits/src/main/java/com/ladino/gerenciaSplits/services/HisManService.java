package com.ladino.gerenciaSplits.services;

import com.ladino.gerenciaSplits.dtos.requests.HisManRequest;
import com.ladino.gerenciaSplits.dtos.responses.HisManResponse;
import com.ladino.gerenciaSplits.mappers.HisManMapper;
import com.ladino.gerenciaSplits.models.HistoricoManun;
import com.ladino.gerenciaSplits.models.Splits;
import com.ladino.gerenciaSplits.repository.HistoricoManunRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class HisManService {

    //Injeção de dependência do repositório
    private final HistoricoManunRepository hisManRepository;

    //Injeção de dependência para usar service de Splits
    private final SplitsService splitsService;

    //Injeção de dependência para usar Mapper
    private final HisManMapper hisManMapper;

    //Construtor
    public HisManService(
            HistoricoManunRepository hisManRepository,
            SplitsService splitsService,
            HisManMapper hisManMapper
    ) {
        this.hisManRepository = hisManRepository;
        this.splitsService = splitsService;
        this.hisManMapper = hisManMapper;
    }


    /**
     * Service para criar um Histórico de Manutenção de Splits
     * **/
    public HisManResponse criarHisMan(HisManRequest hisManRequest){

        Splits split = splitsService.buscarSplitExistente(hisManRequest.splitId());

        if(split == null){
            throw new RuntimeException("Split não encontrado");
        }

        //Usando mapper para criar a entidade com base no dto request
        HistoricoManun historicoManun = hisManMapper.toEntity(hisManRequest);

        //setando o Split id com base em id existente
        historicoManun.setSplit(split.getSplitId());

        hisManRepository.save(historicoManun);


        //retornando apenas o mapper para responses(evita json infinitos)
        return hisManMapper.toResponse(historicoManun);

    }


    /**
     * Service para Listar todos os Históricos de Manutenções
     * **/
    public List<HisManResponse> listarHisMan(){

        return hisManRepository.findAll().stream().map(hisMan -> new HisManResponse(
                hisMan.getHistoricoManunId(),
                hisMan.getDataManun(),
                hisMan.getTipoManun(),
                hisMan.getTecnicoResponsavel(),
                hisMan.getServicoRealizado(),
                hisMan.getObersavacoes(),
                hisMan.getSplit().getSplitId()
        )).toList();

    }


    /**
     * Service de Listar históricos de manutenções por UUID
     * **/
    public Optional<HistoricoManun> listarHisManPorUuid(UUID uuid){

        return hisManRepository.findById(uuid);

    }

}
