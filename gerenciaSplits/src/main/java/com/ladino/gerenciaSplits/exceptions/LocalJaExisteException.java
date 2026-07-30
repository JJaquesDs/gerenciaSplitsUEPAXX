package com.ladino.gerenciaSplits.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.UUID;

@ResponseStatus(HttpStatus.CONFLICT) //status 409
public class LocalJaExisteException extends RuntimeException{

    //Construtor
    public LocalJaExisteException(String nomeLocal){
        super("O local: " + nomeLocal + " já existe");
    }

}
