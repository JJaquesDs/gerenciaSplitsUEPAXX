package com.ladino.gerenciaSplits.services;

import com.ladino.gerenciaSplits.dtos.requests.HisManRequest;
import com.ladino.gerenciaSplits.dtos.responses.HisManResponse;
import com.ladino.gerenciaSplits.mappers.HisManMapper;
import com.ladino.gerenciaSplits.models.HistoricoManu;
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

    //Injeção de dependência para usar service de Futuras Manutenções
    private final FutManService futManService;

    //Injeção de dependência para usar Mapper
    private final HisManMapper hisManMapper;

    //Construtor
    public HisManService(
            HistoricoManunRepository hisManRepository,
            SplitsService splitsService,
            FutManService futManService,
            HisManMapper hisManMapper
    ) {
        this.hisManRepository = hisManRepository;
        this.splitsService = splitsService;
        this.futManService = futManService;
        this.hisManMapper = hisManMapper;
    }

    public HistoricoManu buscarHistoricoMan(UUID uuid){

        Optional<HistoricoManu> historicoManun = hisManRepository.findById(uuid);

        return historicoManun.orElse(null);

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
        HistoricoManu historicoManu = hisManMapper.toEntity(hisManRequest);

        //setando o Split id com base em id existente
        historicoManu.setSplit(split);

        hisManRepository.save(historicoManu);

        //empurrando a data da próxima manutenção conforme a manutenção feita
        futManService.atualizarProxMan(historicoManu.getSplit());


        //retornando apenas o mapper para responses(evita json infinitos)
        return hisManMapper.toResponse(historicoManu);

    }


    /**
     * Service para Listar todos os Históricos de Manutenções
     * **/
    public List<HisManResponse> listarHisMan(){

        return hisManRepository.findAll().stream().map(hisMan -> new HisManResponse(
                hisMan.getHistoricoManunId(),
                hisMan.getDataManun(),
                hisMan.getTipoManu(),
                hisMan.getTecnicoResponsavel(),
                hisMan.getServicoRealizado(),
                hisMan.getObservacoes(),
                hisMan.getSplit().getSplitId()
        )).toList();

    }


    /**
     * Service de Listar históricos de manutenções por UUID
     * **/
    public Optional<HistoricoManu> listarHisManPorUuid(UUID uuid){

        return hisManRepository.findById(uuid);

    }


    /**
     * Service para deletar um histórico de manutenção
     * **/
    public void hisManDelete(UUID uuid){

        HistoricoManu hisManRequest = buscarHistoricoMan(uuid);

        if (hisManRequest == null){
            throw new RuntimeException("Histórico não encontrado");
        }


        hisManRepository.deleteById(uuid);

    }

}
