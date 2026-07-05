package com.ladino.gerenciaSplits.dtos.responses;

import com.ladino.gerenciaSplits.models.Enums.TipoManun;

import java.time.LocalDate;
import java.util.UUID;

public record HisManResponse(
        UUID historicoManunId,
        LocalDate dataManun,
        Enum<TipoManun> tipoManunEnum,
        String tecnicoResponsavel,
        String servicoRealizado,
        String observacoes,
        UUID splitId
) {
}
