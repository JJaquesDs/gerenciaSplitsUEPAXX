package com.ladino.gerenciaSplits.dtos.responses;

import java.time.LocalDate;
import java.util.UUID;


/**
 * DTO para responses da API para futuras manutenções
 * **/
public record FutManResponse(

        UUID futurasManuId,
        LocalDate dataProxManu,
        String rp,
        String local

) {
}
