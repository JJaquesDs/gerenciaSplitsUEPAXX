package com.ladino.gerenciaSplits.repository;

import com.ladino.gerenciaSplits.dtos.responses.reports.SplitBasicRepResponse;
import com.ladino.gerenciaSplits.dtos.responses.reports.SplitCadRepResponse;
import com.ladino.gerenciaSplits.models.Splits;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface SplitRepository extends JpaRepository<Splits, UUID> {

    /**
     * Consulta para retornar os splits cadastrados e montar planilha Excel
     * **/
    @Query(
            """
                    SELECT new com.ladino.gerenciaSplits.dtos.responses.reports.SplitCadRepResponse(
                        l.nomeLocal,
                        s.rp,
                        s.marca,
                        s.capacidadeBtu,
                        s.dataEntrada,
                        s.periodoManMes
                    )
                    FROM Splits s
                    JOIN s.local l
                    ORDER BY l.nomeLocal ASC, s.rp ASC
            """
    )
    List<SplitCadRepResponse> findAllForCadRepResponse();


    /**
     * Consulta para buscar dados básicos das splits e mesclar com histórico de manutenções
     * Juntar queries para montar planilha todas as últimas manutenções
     * **/
    @Query("""
        SELECT new com.ladino.gerenciaSplits.dtos.responses.reports.SplitBasicRepResponse(
            s.SplitId,
            l.nomeLocal,
            s.marca,
            s.capacidadeBtu,
            s.rp
        )
        FROM Splits s
        JOIN s.local l
        ORDER BY l.nomeLocal ASC, s.capacidadeBtu ASC
    """)
    List<SplitBasicRepResponse> findALlForSplitBasicRepResponse();


}
