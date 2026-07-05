package com.ladino.gerenciaSplits.dtos.requests;

import java.time.LocalDate;
import java.util.UUID;

public record SplitRequest(
        String rp,
        String marca,
        String capacidadeBtu,
        LocalDate dataEntrada,
        String periodoManMes,
        UUID localId
) {
}
