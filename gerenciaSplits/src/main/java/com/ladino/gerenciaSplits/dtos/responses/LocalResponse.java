package com.ladino.gerenciaSplits.dtos.responses;

import java.util.UUID;

public record LocalResponse(
        UUID localId,
        String nomeLocal
) {
}
