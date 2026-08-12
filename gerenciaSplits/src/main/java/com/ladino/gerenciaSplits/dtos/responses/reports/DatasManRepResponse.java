package com.ladino.gerenciaSplits.dtos.responses.reports;

import java.time.LocalDate;
import java.util.List;

/**
 * Dto de respostas Excel para relatórios de datas de todas manutenções
 * **/
public record DatasManRepResponse(
        String nomeLocal,
        String marca,
        String capacidadeBtu,
        String rp,
        List<LocalDate> datasManu
) { }
