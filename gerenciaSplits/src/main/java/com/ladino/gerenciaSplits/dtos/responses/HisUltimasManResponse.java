package com.ladino.gerenciaSplits.dtos.responses;

import java.time.LocalDate;
import java.util.UUID;

public record HisUltimasManResponse(

        UUID splitId,
        String rp,
        String marca,
        String nomeLocal,
        LocalDate dataUltimaMan
) {
}
