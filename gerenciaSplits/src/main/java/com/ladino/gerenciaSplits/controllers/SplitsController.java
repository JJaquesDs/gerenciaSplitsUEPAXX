package com.ladino.gerenciaSplits.controllers;

import com.ladino.gerenciaSplits.dtos.requests.SplitRequest;
import com.ladino.gerenciaSplits.dtos.responses.SplitResponse;
import com.ladino.gerenciaSplits.services.SplitsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/splits")
@Tag(
        name = "Splits",
        description = "Rotas para lidar com requisições de Splits")
public class SplitsController {
    /**Classe que controla requisições de splits**/


    //Injeção de dependência para usar os service de splits
    private final SplitsService splitsService;


    //Construtor da classe
    public SplitsController(SplitsService splitsService){
        this.splitsService = splitsService;
    }


    /**
     * Rota para criar Splits
     **/
    @PostMapping("/criar")
    @Operation(
            summary = "Criar Split",
            description = "Rota para lidar com requisições POST de criar Splits"
    )
    public ResponseEntity<SplitResponse> criarSplit(@Valid @RequestBody SplitRequest splitRequest){
        return ResponseEntity.ok(splitsService.criarSplit(splitRequest));
    }

    /***
     * Rota para Listar todos Splits
     * **/
    @GetMapping("/listar")
    @Operation(
            summary = "Listar todos Splits",
            description = "Rota para lidar com requisições GET de listar todos os Splits"
    )
    public ResponseEntity<List<SplitResponse>> listarSplits(){
        return ResponseEntity.ok(splitsService.listarSplits());
    }

    @PatchMapping("/atualizar/{uuid}")
    @Operation(
            summary = "Atualizar Split por UUID",
            description = "Rota para lidar com requisições PATCH de atualizar splits por UUID"
    )
    public ResponseEntity<SplitResponse> atualizarSplit(@PathVariable UUID uuid,
                                        @RequestBody SplitRequest splitRequest){
        return ResponseEntity.ok(splitsService.atualizarSplitPorId(uuid, splitRequest));
    }


    @DeleteMapping("/deletar/{uuid}")
    @Operation(
            summary = "Deletar um split por UUID",
            description = "Rota para lidar com requisição DELETE de splits por UUID"
    )
    public ResponseEntity<Void> deletarSplit(@PathVariable UUID uuid){

        //tenta deletar o split pelo uuid, se não encontrar lança exception
        splitsService.deletarSplitPorId(uuid);

        //retorna requisição sem corpo
        return ResponseEntity.noContent().build();
    }
}
