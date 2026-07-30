package com.ladino.gerenciaSplits.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.UUID;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class HisManNotFoundException extends RuntimeException{

    //Construtores
    public HisManNotFoundException(String mensagem){
        super(mensagem);
    }


    public HisManNotFoundException(UUID uuid){
        super("Histórico de manutenções não encontrado. ID: " + uuid);
    }

}
