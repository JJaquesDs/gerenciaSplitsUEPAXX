package com.ladino.gerenciaSplits.repository;

import com.ladino.gerenciaSplits.dtos.responses.HisUltimasManResponse;
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



}
