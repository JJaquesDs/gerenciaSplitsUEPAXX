package com.ladino.gerenciaSplits.infra;

import com.ladino.gerenciaSplits.exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

//Manipulação de Exceptions
@RestControllerAdvice
public class RestExceptionHandle extends ResponseEntityExceptionHandler {


    /**
     * Método para padronização de respostas de mensagens de erro
     * **/
    public ResponseEntity<Map<String, Object>> constructorErrorResponse(
            HttpStatus status,
            String mensagem
    ){

        //Criando resposta de erro como um hashMap linked para virar uma sequência fixa por ordem de inserção
        Map<String, Object> errorResponse = new LinkedHashMap<>();

        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", status.value());
        errorResponse.put("error", status.getReasonPhrase()); //pegando frase do motivo do erro
        errorResponse.put("message", mensagem);

        return ResponseEntity.status(status).body(errorResponse);
    }


    // Local não encontrado - 404
    @ExceptionHandler(LocalNotFoundException.class)
    public ResponseEntity<Map<String, Object>> localNotFoundException(
            LocalNotFoundException exception
    ){
        return constructorErrorResponse(HttpStatus.NOT_FOUND, exception.getMessage());
    }


    //Split não encontrado - 404
    @ExceptionHandler(SplitNotFoundException.class)
    public ResponseEntity<Map<String, Object>> spitNotFoundException(
            SplitNotFoundException exception
    ){
        return constructorErrorResponse(HttpStatus.NOT_FOUND, exception.getMessage());
    }


    //Histórico de manutenção não encontrado - 404
    @ExceptionHandler(HisManNotFoundException.class)
    public ResponseEntity<Map<String, Object>> hisManNotFoundException(
            HisManNotFoundException exception
    ){
        return constructorErrorResponse(HttpStatus.NOT_FOUND, exception.getMessage());
    }


    //Local já existente - 409
    @ExceptionHandler(LocalJaExisteException.class)
    public ResponseEntity<Map<String, Object>> localJaExistenteException(
            LocalJaExisteException exception
    ){
        return constructorErrorResponse(HttpStatus.CONFLICT, exception.getMessage());
    }

    //Futura manutenção não encontrada - 404
    @ExceptionHandler(FutManNotFoundException.class)
    public ResponseEntity<Map<String, Object>> futManNotFoundException(
            FutManNotFoundException exception
    ){
        return constructorErrorResponse(HttpStatus.NOT_FOUND, exception.getMessage());
    }


    //TODO: business exception caso achar necessário

}
