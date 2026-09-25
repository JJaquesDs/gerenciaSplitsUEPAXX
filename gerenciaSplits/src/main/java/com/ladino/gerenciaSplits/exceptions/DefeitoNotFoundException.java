package com.ladino.gerenciaSplits.exceptions;

import java.util.UUID;

public class DefeitoNotFoundException extends RuntimeException {

    public DefeitoNotFoundException(UUID uuid) {
        super("Registro de defeito não encontrado. ID: " + uuid);
    }
}
