package com.ladino.gerenciaSplits.dtos.requests;

import com.ladino.gerenciaSplits.models.Enums.PeriodoManutencao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record SplitRequest(

        @NotBlank
        String rp,

        @NotBlank
        String marca,

        @NotBlank
        String capacidadeBtu,

        @NotNull
        LocalDate dataEntrada,

        @NotNull
        PeriodoManutencao periodoManMes,

        @NotNull(message = "O local deve ser informado")
        UUID localId
) {
}
