package com.ladino.gerenciaSplits.dtos.responses;

import com.ladino.gerenciaSplits.models.Enums.StatusDefeito;

import java.time.LocalDate;
import java.util.UUID;

public record DefeitoResponse(
        UUID defeitoId,
        LocalDate dataRegistro,
        String descricao,
        StatusDefeito status,
        String observacoes,
        String rp,
        String marca,
        String local
) {
}
