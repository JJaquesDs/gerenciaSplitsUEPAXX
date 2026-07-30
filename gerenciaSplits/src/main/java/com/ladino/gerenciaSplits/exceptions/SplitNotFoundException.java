package com.ladino.gerenciaSplits.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.UUID;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class SplitNotFoundException extends RuntimeException{

    //Construtor
    public SplitNotFoundException(String mensagem){
        super(mensagem);
    }


    public SplitNotFoundException(UUID uuid){
        super("Split não encontrado. ID: " + uuid);
    }
}
