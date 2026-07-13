package com.ladino.gerenciaSplits.repository;

import com.ladino.gerenciaSplits.models.HistoricoManu;
import com.ladino.gerenciaSplits.models.Splits;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface HistoricoManuRepository extends JpaRepository<HistoricoManu, UUID> {

    // Busca o primeiro Split pela Data de manutenção na ordem decrescente(mais recente)
    Optional<HistoricoManu> findFirstBySplitOrderByDataManuDesc(Splits split);


}
