package com.ladino.gerenciaSplits.dtos.responses;

import com.ladino.gerenciaSplits.models.Enums.PeriodoManutencao;

import java.time.LocalDate;
import java.util.UUID;

public record SplitResponse(
        UUID uuid,
        String rp,
        String marca,
        String capacidadeBtu,
        LocalDate dataEntrada,
        PeriodoManutencao periodoManMes,
        String local
) {
}
