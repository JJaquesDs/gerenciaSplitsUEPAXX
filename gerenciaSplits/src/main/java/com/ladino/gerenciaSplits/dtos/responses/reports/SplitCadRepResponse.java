package com.ladino.gerenciaSplits.dtos.responses.reports;

import com.ladino.gerenciaSplits.models.Enums.PeriodoManutencao;

import java.time.LocalDate;


/**
 * Dto para respostas Excel para alocação de splits no campus
 * **/
public record SplitCadRepResponse(
        String nomeLocal,
        String rp,
        String marca,
        String capacidadeBtu,
        LocalDate dataEntrada,
        PeriodoManutencao periodoManutencao
) { }
