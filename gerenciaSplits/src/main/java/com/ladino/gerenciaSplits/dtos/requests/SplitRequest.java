package com.ladino.gerenciaSplits.dtos.requests;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.util.UUID;

public record SplitRequest(

        @NotBlank
        String rp,

        @NotBlank
        String marca,

        @NotBlank
        String capacidadeBtu,

        @NotBlank
        LocalDate dataEntrada,

        @NotBlank
        String periodoManMes,

        @NotBlank(message = "O local deve ser informado")
        UUID localId
) {
}
