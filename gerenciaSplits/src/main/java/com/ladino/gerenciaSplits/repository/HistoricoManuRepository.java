package com.ladino.gerenciaSplits.repository;

import com.ladino.gerenciaSplits.dtos.responses.HisUltimasManResponse;
import com.ladino.gerenciaSplits.dtos.responses.reports.HisManRepResponse;
import com.ladino.gerenciaSplits.dtos.responses.reports.HisManUltRepResponse;
import com.ladino.gerenciaSplits.models.HistoricoManu;
import com.ladino.gerenciaSplits.models.Splits;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface HistoricoManuRepository extends JpaRepository<HistoricoManu, UUID> {

    // Busca o primeiro Split pela Data de manutenção na ordem decrescente(mais recente)
    Optional<HistoricoManu> findFirstBySplitOrderByDataManuDesc(Splits split);


    // Consulta para retornar todas as ultimas manutenções dos splits
    @Query("""
        SELECT new com.ladino.gerenciaSplits.dtos.responses.HisUltimasManResponse(
            s.SplitId,
            s.rp,
            s.marca,
            l.nomeLocal,
            MAX(h.dataManu)
        )
        FROM HistoricoManu h
        JOIN h.split s
        JOIN s.local l
        GROUP BY s.SplitId, s.rp, s.marca, l.nomeLocal
        ORDER BY MAX(h.dataManu) DESC
    """)
    List<HisUltimasManResponse> findUltimasManutencoes();

    /**
     * Consulta para retornar as últimas manutenções das splits
     * e fazer os cálculos de tempo sem manutenção
     * **/
    @Query("""
        SELECT new com.ladino.gerenciaSplits.dtos.responses.reports.HisManUltRepResponse(
            l.nomeLocal,
            s.marca,
            s.capacidadeBtu,
            s.rp,
            MAX(h.dataManu),
            h.observacoes
        )
        FROM HistoricoManu h
        JOIN h.split s
        JOIN s.local l
        GROUP BY l.nomeLocal, s.marca, s.capacidadeBtu, s.rp, h.observacoes
        ORDER BY MAX(h.dataManu) DESC
        
    """)
    List<HisManUltRepResponse> finUltimasManuByRepResponse();


    /** Escolha de consulta à parte por motivo de Single Responsibility Principle
    *    - Consulta de históricos de manutenções para relatórios Excel
    *    - DTOs de API REST != DTOs de relatório
    *    - Mudanças no relatório não afetam API REST
    **/
    @Query("""
            SELECT new com.ladino.gerenciaSplits.dtos.responses.reports.HisManRepResponse(
                l.nomeLocal,
                s.rp,
                s.marca,
                h.dataManu,
                h.tipoManu,
                h.tecnicoResponsavel,
                h.servicoRealizado,
                h.observacoes
            )
            FROM HistoricoManu h
            JOIN h.split s
            JOIN s.local l
            ORDER BY h.dataManu ASC
    """)
    List<HisManRepResponse> findAllForHisManRepResponse();


    /**
     * Consulta para retornar histórico de manutenções agrupados por splits e datas
     * Será usada para juntar com outra query e retornar o relatório de datas de manutenções
     * **/
    @Query("""
            SELECT h.split.SplitId, h.dataManu
            FROM HistoricoManu h
            ORDER BY h.split.SplitId, h.dataManu ASC
    """)
    List<Object[]> findAllDatasManuGroupBySplit();



}
