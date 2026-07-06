package com.ladino.gerenciaSplits.dtos.requests;

import jakarta.validation.constraints.NotBlank;

public record LocalRequest(

        @NotBlank
        String nomeLocal
) {
}
