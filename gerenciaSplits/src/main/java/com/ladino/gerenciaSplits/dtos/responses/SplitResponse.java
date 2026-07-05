package com.ladino.gerenciaSplits.dtos.responses;

import java.time.LocalDate;
import java.util.UUID;

public record SplitResponse(
        UUID uuid,
        String rp,
        String marca,
        String capacidadeBtu,
        LocalDate dataEntrada,
        String periodoManMes,
        String local
) {
}
