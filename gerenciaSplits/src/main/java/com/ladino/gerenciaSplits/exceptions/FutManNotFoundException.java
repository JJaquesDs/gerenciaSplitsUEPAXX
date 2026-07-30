package com.ladino.gerenciaSplits.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.UUID;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class FutManNotFoundException extends RuntimeException{

    public FutManNotFoundException(String mensagem){
        super(mensagem);
    }

    public FutManNotFoundException(UUID uuid){
        super("Futura manutenção não encontrada. ID: " + uuid);
    }

}
