package com.ladino.gerenciaSplits.repository;

import com.ladino.gerenciaSplits.models.Local;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface LocalRepository extends JpaRepository<Local, UUID> {

    // Procurando Locais por nomeLocal ("Optional" para se nao encontrar retorna null)
    Optional<Local> findByNomeLocal(String nomeLocal);
}
