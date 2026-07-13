package com.ladino.gerenciaSplits.services;

import com.ladino.gerenciaSplits.dtos.responses.FutManResponse;
import com.ladino.gerenciaSplits.mappers.FutManMapper;
import com.ladino.gerenciaSplits.models.FuturasManu;
import com.ladino.gerenciaSplits.models.HistoricoManu;
import com.ladino.gerenciaSplits.models.Splits;
import com.ladino.gerenciaSplits.repository.FuturasManunRepository;
import com.ladino.gerenciaSplits.repository.HistoricoManunRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FutManService {

    //Injeção de dependência para usar repository
    private final FuturasManunRepository futurasManunRepository;

    private final HistoricoManunRepository historicoManunRepository;

    //Injeção de dependência para usar mapper
    private final FutManMapper futManMapper;

    //Construtor
    public FutManService(
            FuturasManunRepository futurasManunRepository,
            HistoricoManunRepository historicoManunRepository,
            FutManMapper futManMapper
    ){
        this.futurasManunRepository = futurasManunRepository;
        this.historicoManunRepository = historicoManunRepository;
        this.futManMapper = futManMapper;
    }

    /**
     * Buscando futuras manutenções já existentes
     * **/
    public FuturasManu buscarFutMan(UUID uuid){

        Optional<FuturasManu> futurasManu = futurasManunRepository.findById(uuid);

        return futurasManu.orElse(null);
    }


    public void atualizarProxMan(Splits split){

        // Próxima data de manutenção
        LocalDate data;

        Optional<HistoricoManu> ultimaManu = historicoManunRepository.
                findFirstBySplitOrderByDataManunDesc(split);


        //Se já teve manutenção usa a data da última para atualizar a próxima
        if (ultimaManu.isPresent()){
            data = ultimaManu.get().getDataManun();

        }else {

            // Se nunca teve manutenção, usa data da entrada do split
            data = split.getDataEntrada();
        }

        //Pegando período de meses para adicionar para próxima manutenção
        int mesesAdicao = split.getPeriodoManMes().getMeses();

        // Adicionando meses
        LocalDate proximaData = data.plusMonths(mesesAdicao);

        //Atualizar ou criar registro em FuturasMan
        FuturasManu futurasManu = futurasManunRepository.
                findBySplit(split).orElse(new FuturasManu());

        futurasManu.setSplit(split);

        futurasManu.setDataProxManu(proximaData);

        futurasManunRepository.save(futurasManu);

        futManMapper.toResponse(futurasManu);
    }


    /**
     * Service para listar todas as futuras manutenções
     * **/
    public List<FutManResponse> listarFutManService(){

        return futurasManunRepository.findAll().stream().map(futurasManu -> new FutManResponse(
                futurasManu.getFuturasManuId(),
                futurasManu.getDataProxManu(),
                futurasManu.getSplit().getSplitId()
        )).toList();

    }


    /**
     * Deletar uma futura manutenção
     * **/
    public void deletarFutMan(UUID uuid){

        FuturasManu futurasManu = buscarFutMan(uuid);

        if (futurasManu == null){
            throw new RuntimeException("Manutenção futura não encontrada");
        }

        futurasManunRepository.deleteById(uuid);

    }

}
