package com.ladino.gerenciaSplits.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.UUID;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class LocalNotFoundException extends RuntimeException{

    //Construtor
    public LocalNotFoundException(UUID uuid){
        super("Local não encontrado. ID: " + uuid);
    }


    public LocalNotFoundException(String mensagem){
        super(mensagem);
    }


}
