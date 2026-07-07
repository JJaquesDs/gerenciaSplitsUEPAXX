package com.ladino.gerenciaSplits.repository;

import com.ladino.gerenciaSplits.models.FuturasManu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FuturasManunRepository extends JpaRepository<FuturasManu, UUID> {
}
