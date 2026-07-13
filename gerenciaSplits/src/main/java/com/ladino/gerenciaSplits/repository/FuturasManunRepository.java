package com.ladino.gerenciaSplits.repository;

import com.ladino.gerenciaSplits.models.FuturasManu;
import com.ladino.gerenciaSplits.models.Splits;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface FuturasManunRepository extends JpaRepository<FuturasManu, UUID> {


    Optional<FuturasManu> findBySplit(Splits split);

}
