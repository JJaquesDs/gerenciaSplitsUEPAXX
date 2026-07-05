package com.ladino.gerenciaSplits.repository;

import com.ladino.gerenciaSplits.models.Splits;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SplitRepository extends JpaRepository<Splits, UUID> {


}
