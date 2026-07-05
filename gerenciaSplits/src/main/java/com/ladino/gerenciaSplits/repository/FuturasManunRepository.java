package com.ladino.gerenciaSplits.repository;

import com.ladino.gerenciaSplits.models.FuturasManun;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FuturasManunRepository extends JpaRepository<FuturasManun, UUID> {
}
