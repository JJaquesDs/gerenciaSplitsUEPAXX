package com.ladino.gerenciaSplits.services;

import com.ladino.gerenciaSplits.dtos.requests.HisManRequest;
import com.ladino.gerenciaSplits.dtos.responses.HisManResponse;
import com.ladino.gerenciaSplits.exceptions.HisManNotFoundException;
import com.ladino.gerenciaSplits.mappers.HisManMapper;
import com.ladino.gerenciaSplits.models.HistoricoManu;
import com.ladino.gerenciaSplits.models.Splits;
import com.ladino.gerenciaSplits.repository.HistoricoManuRepository;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;
import java.util.UUID;

@Service
public class HisManService {

    //Injeção de dependência do repositório
    private final HistoricoManuRepository hisManRepository;

    //Injeção de dependência para usar service de Splits
    private final SplitsService splitsService;

    //Injeção de dependência para usar service de Futuras Manutenções
    private final FutManService futManService;

    //Injeção de dependência para usar Mapper
    private final HisManMapper hisManMapper;

    // Injeção da ferramenta de envio de mensagens do WebSocket
    private final SimpMessagingTemplate messagingTemplate;

    //Construtor
    public HisManService(
            HistoricoManuRepository hisManRepository,
            SplitsService splitsService,
            FutManService futManService,
            HisManMapper hisManMapper,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.hisManRepository = hisManRepository;
        this.splitsService = splitsService;
        this.futManService = futManService;
        this.hisManMapper = hisManMapper;
        this.messagingTemplate = messagingTemplate;
    }

    public HisManResponse buscarHistoricoMan(UUID uuid){

        //Busca o split pelo id e se não encontrar lança exception
        return hisManRepository.findById(uuid).map(historicoManu -> new HisManResponse(
                historicoManu.getHistoricoManuId(),
                historicoManu.getDataManu(),
                historicoManu.getTipoManu(),
                historicoManu.getTecnicoResponsavel(),
                historicoManu.getServicoRealizado(),
                historicoManu.getObservacoes(),
                historicoManu.getSplit().getRp(),
                historicoManu.getSplit().getLocal().getNomeLocal()
        )).orElseThrow(
                () -> new HisManNotFoundException(uuid)
        );

    }


    /**
     * Service para criar um Histórico de Manutenção de Splits
     * **/
    public HisManResponse criarHisMan(HisManRequest hisManRequest){

        //Se não encontrar já lança exception
        Splits split = splitsService.buscarSplitExistente(hisManRequest.splitId());

        //Usando mapper para criar a entidade com base no dto request
        HistoricoManu historicoManu = hisManMapper.toEntity(hisManRequest);

        //setando o Split id com base em id existente
        historicoManu.setSplit(split);

        hisManRepository.save(historicoManu);

        //empurrando a data da próxima manutenção conforme a manutenção feita
        futManService.atualizarProxMan(historicoManu.getSplit());

        messagingTemplate.convertAndSend("/topic/atualizacoes", "MUDANCA_DETECTADA");

        //retornando apenas o mapper para responses(evita json infinitos)
        return hisManMapper.toResponse(historicoManu);

    }


    /**
     * Service para Listar todos os Históricos de Manutenções
     * **/
    public List<HisManResponse> listarHisMan(){

        return hisManRepository.findAll().stream().map(hisMan -> new HisManResponse(
                hisMan.getHistoricoManuId(),
                hisMan.getDataManu(),
                hisMan.getTipoManu(),
                hisMan.getTecnicoResponsavel(),
                hisMan.getServicoRealizado(),
                hisMan.getObservacoes(),
                hisMan.getSplit().getRp(),
                hisMan.getSplit().getLocal().getNomeLocal()
        )).toList();

    }


    /**
     * Service para deletar um histórico de manutenção
     * **/
    public void hisManDelete(UUID uuid){

        //Busca o histórico se não encontrar lança exception
        HisManResponse hisManRequest = buscarHistoricoMan(uuid);

        hisManRepository.deleteById(uuid);

        messagingTemplate.convertAndSend("/topic/atualizacoes", "MUDANCA_DETECTADA");
    }

}
