package com.ladino.gerenciaSplits.dtos.responses.reports;

import com.ladino.gerenciaSplits.models.Enums.TipoManu;

import java.time.LocalDate;

/**
 * Dto para respostas Excel para relatórios de históricos de manutenções
 * **/
public record HisManRepResponse(
        String nomeLocal,
        String rp,
        String marca,
        LocalDate dataManu,
        TipoManu tipoManu,
        String tecnicoResponsavel,
        String servicoRealizado,
        String observacoes)
{}