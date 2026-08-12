package com.ladino.gerenciaSplits.dtos.responses.reports;

import com.ladino.gerenciaSplits.models.Local;

import java.time.LocalDate;

/**
 * Dto usado para construir relatório excel de últimas manutenções
 * **/
public record HisManUltRepResponse(
        String nomeLocal,
        String marca,
        String capacidadeBtu,
        String rp,
        LocalDate dataUltimaMan,
        String observacoes
) {
}
