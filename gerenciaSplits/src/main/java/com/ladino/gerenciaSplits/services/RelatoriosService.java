package com.ladino.gerenciaSplits.services;

import com.ladino.gerenciaSplits.dtos.responses.reports.*;
import com.ladino.gerenciaSplits.reports.DatasManExcelGenerator;
import com.ladino.gerenciaSplits.reports.HisManExcelGenerator;
import com.ladino.gerenciaSplits.reports.HisManUltExcelGenerator;
import com.ladino.gerenciaSplits.reports.SplitCadExcelGenerator;
import com.ladino.gerenciaSplits.repository.HistoricoManuRepository;
import com.ladino.gerenciaSplits.repository.SplitRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class RelatoriosService {

    //---------------------------------------------------------------------
    //  Injeção de dependências
    //---------------------------------------------------------------------

    // Dependências de repositórios para usar consultas ao banco:
    private final SplitRepository splitRepository;

    private final HistoricoManuRepository historicoManuRepository;
    //---------------------------------------------------------------------

    // Dependências de generator Excels para gerar planilhas
    private final SplitCadExcelGenerator splitCadExcelGenerator;

    private final HisManExcelGenerator hisManExcelGenerator;

    private final HisManUltExcelGenerator hisManUltExcelGenerator;

    private final DatasManExcelGenerator datasManExcelGenerator;

    // Construtor para usar métodos das dependências
    public RelatoriosService(
            SplitRepository splitRepository,
            SplitCadExcelGenerator splitCadExcelGenerator,
            HistoricoManuRepository historicoManuRepository,
            HisManExcelGenerator hisManExcelGenerator,
            HisManUltExcelGenerator hisManUltExcelGenerator,
            DatasManExcelGenerator datasManExcelGenerator
    ){
        this.splitRepository = splitRepository;
        this.splitCadExcelGenerator = splitCadExcelGenerator;
        this.historicoManuRepository = historicoManuRepository;
        this.hisManExcelGenerator = hisManExcelGenerator;
        this.hisManUltExcelGenerator = hisManUltExcelGenerator;
        this.datasManExcelGenerator = datasManExcelGenerator;
    }


    /**
     * Service para gerar planilhas Excel de cadastro das splits
     * **/
    public byte[] gerarCadastroSplits(){
        List<SplitCadRepResponse> dados = splitRepository.findAllForCadRepResponse();
        return splitCadExcelGenerator.gerar(dados);
    }

    /**
     * Service para gerar planilhas Excel de Histórico de manutenções das splits
     * **/
    public byte[] gerarManSplits(){
        List<HisManRepResponse> dados = historicoManuRepository.findAllForHisManRepResponse();
        return hisManExcelGenerator.gerar(dados);
    }

    /**
     * Service para gerar últimas manutenções das splits
     * **/
    public byte[] gerarHisManUti(){
        List<HisManUltRepResponse> dados = historicoManuRepository.finUltimasManuByRepResponse();
        return hisManUltExcelGenerator.gerar(dados);
    }

    /**
     * Service para gerar datas de todas as datas das últimas manutenções das splits sendo uma planilha dinâmica
     * **/
    public byte[] gerarDatsUltMan(){

        // Buscando splitsBasic
        List<SplitBasicRepResponse> splits = splitRepository.findALlForSplitBasicRepResponse();

        // Buscando todas as datas de manutenções
        List<Object[]> manutencoes = historicoManuRepository.findAllDatasManuGroupBySplit();

        //Agrupando datas por splits
        Map<UUID, List<LocalDate>> manutencoesPorSplit = new HashMap<>();

        for (Object[] row : manutencoes){
            UUID splitId = (UUID) row[0];
            LocalDate data = (LocalDate) row[1];

            manutencoesPorSplit
                    .computeIfAbsent(splitId, k -> new ArrayList<>()
                    ).add(data);
        }

        // Ordenar datas dentro de cada split (por garantia)
        manutencoesPorSplit.values().forEach(
                datas -> datas.sort(Comparator.naturalOrder())
        );

        //Combinando splits com as manutenções
        List<DatasManRepResponse> dados = splits.stream()
                .map(split -> new DatasManRepResponse(
                        split.nomeLocal(),
                        split.marca(),
                        split.capacidadeBtu(),
                        split.rp(),
                        manutencoesPorSplit.getOrDefault(split.SplitId(), List.of())
                )).toList();

        return datasManExcelGenerator.gerar(dados);
    }
}
