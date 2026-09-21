package com.ladino.gerenciaSplits.repository;

import com.ladino.gerenciaSplits.models.Defeito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DefeitoRepository extends JpaRepository<Defeito, UUID> {
}
