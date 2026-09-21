package com.ladino.gerenciaSplits.dtos.requests;

import com.ladino.gerenciaSplits.models.Enums.StatusDefeito;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record DefeitoRequest(
        @NotNull LocalDate dataRegistro,
        @NotBlank String descricao,
        @NotNull StatusDefeito status,
        String observacoes,
        @NotNull(message = "O equipamento é obrigatório") UUID splitId
) {
}
