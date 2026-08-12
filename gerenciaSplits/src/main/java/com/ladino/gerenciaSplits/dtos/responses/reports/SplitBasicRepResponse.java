package com.ladino.gerenciaSplits.dtos.responses.reports;

import java.util.UUID;

/**
 * Dto básico que serve de intermediário entre as query para buscar
 * relatórios de cadastro
 * **/
public record SplitBasicRepResponse(
        UUID SplitId,
        String nomeLocal,
        String marca,
        String capacidadeBtu,
        String rp
) {
}
