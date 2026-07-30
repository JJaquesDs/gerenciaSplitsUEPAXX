package com.ladino.gerenciaSplits.exceptions;


public class BusinessException extends RuntimeException{
    /**
     * Classe para lidar com exceptions mais abrangentes a negócios
     **/


    //Construtor
    public BusinessException(String mensagem){
        super(mensagem);
    }

}
