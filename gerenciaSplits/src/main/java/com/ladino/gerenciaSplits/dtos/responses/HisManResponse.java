package com.ladino.gerenciaSplits.dtos.responses;

import com.ladino.gerenciaSplits.models.Enums.TipoManu;

import java.time.LocalDate;
import java.util.UUID;

public record HisManResponse(
        UUID historicoManuId,
        LocalDate dataManu,
        TipoManu tipoManu,
        String tecnicoResponsavel,
        String servicoRealizado,
        String observacoes,
        String rp,
        String local
) {
}
