package com.ladino.gerenciaSplits.repository;

import com.ladino.gerenciaSplits.models.HistoricoManu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface HistoricoManunRepository extends JpaRepository<HistoricoManu, UUID> {
}
