package com.ladino.gerenciaSplits.services;

import com.ladino.gerenciaSplits.dtos.responses.FutManResponse;
import com.ladino.gerenciaSplits.exceptions.FutManNotFoundException;
import com.ladino.gerenciaSplits.mappers.FutManMapper;
import com.ladino.gerenciaSplits.models.FuturasManu;
import com.ladino.gerenciaSplits.models.HistoricoManu;
import com.ladino.gerenciaSplits.models.Splits;
import com.ladino.gerenciaSplits.repository.FuturasManuRepository;
import com.ladino.gerenciaSplits.repository.HistoricoManuRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FutManService {

    //Injeção de dependência para usar repository
    private final FuturasManuRepository futurasManuRepository;

    private final HistoricoManuRepository historicoManuRepository;

    //Injeção de dependência para usar mapper
    private final FutManMapper futManMapper;

    //Construtor
    public FutManService(
            FuturasManuRepository futurasManuRepository,
            HistoricoManuRepository historicoManuRepository,
            FutManMapper futManMapper
    ){
        this.futurasManuRepository = futurasManuRepository;
        this.historicoManuRepository = historicoManuRepository;
        this.futManMapper = futManMapper;
    }

    /**
     * Buscando futuras manutenções já existentes
     * **/
    public FuturasManu buscarFutMan(UUID uuid){

        //Busca se a futura manutenção já existe, se não lança exception
        return futurasManuRepository.findById(uuid).orElseThrow(
                () -> new FutManNotFoundException(uuid)
        );
    }


    public void atualizarProxMan(Splits split){

        // Próxima data de manutenção
        LocalDate data;

        Optional<HistoricoManu> ultimaManu = historicoManuRepository.
                findFirstBySplitOrderByDataManuDesc(split);


        //Se já teve manutenção usa a data da última para atualizar a próxima
        if (ultimaManu.isPresent()){
            data = ultimaManu.get().getDataManu();

        }else {

            // Se nunca teve manutenção, usa data da entrada do split
            data = split.getDataEntrada();
        }

        //Pegando período de meses para adicionar para próxima manutenção
        int mesesAdicao = split.getPeriodoManMes().getMeses();

        // Adicionando meses
        LocalDate proximaData = data.plusMonths(mesesAdicao);

        //Atualizar ou criar registro em FuturasMan
        FuturasManu futurasManu = futurasManuRepository.
                findBySplit(split).orElse(new FuturasManu());

        futurasManu.setSplit(split);

        futurasManu.setDataProxManu(proximaData);

        futurasManuRepository.save(futurasManu);

        futManMapper.toResponse(futurasManu);
    }


    /**
     * Service para listar todas as futuras manutenções
     * **/
    public List<FutManResponse> listarFutManService(){

        return futurasManuRepository.findAll().stream().map(futurasManu -> new FutManResponse(
                futurasManu.getFuturasManuId(),
                futurasManu.getDataProxManu(),
                futurasManu.getSplit().getRp(),
                futurasManu.getSplit().getLocal().getNomeLocal()
        )).toList();

    }


    /**
     * Deletar uma futura manutenção
     * **/
    public void deletarFutMan(UUID uuid){

        //Busca se a futura manutenção já existe, se não lança exception
        FuturasManu futurasManu = buscarFutMan(uuid);

        futurasManuRepository.deleteById(uuid);

    }

}
