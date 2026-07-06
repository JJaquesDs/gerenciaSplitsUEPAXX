package com.ladino.gerenciaSplits.dtos.requests;

import com.ladino.gerenciaSplits.models.Enums.TipoManun;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.util.UUID;

public record HisManRequest(

        @NotBlank
        LocalDate dataManun,

        @NotBlank
        TipoManun tipoManun,

        @NotBlank
        String tecnicoResponsavel,

        @NotBlank
        String servicoRealizado,
        String observacoes,

        @NotBlank(message = "O split é obrigatório")
        UUID splitId

) {
}
