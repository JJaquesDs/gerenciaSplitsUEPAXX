package com.ladino.gerenciaSplits.dtos.requests;

import com.ladino.gerenciaSplits.models.Enums.TipoManu;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record HisManRequest(

        @NotNull
        LocalDate dataManu,

        @NotNull
        TipoManu tipoManu,

        @NotBlank
        String tecnicoResponsavel,

        @NotBlank
        String servicoRealizado,

        String observacoes,

        @NotNull(message = "O split é obrigatório")
        UUID splitId

) {
}
