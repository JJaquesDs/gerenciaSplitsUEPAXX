package com.ladino.gerenciaSplits.controllers;

import com.ladino.gerenciaSplits.dtos.requests.SplitRequest;
import com.ladino.gerenciaSplits.dtos.responses.SplitResponse;
import com.ladino.gerenciaSplits.services.SplitsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/splits")
@Tag(name = "Listar", description = "Rotas para lidar com requisições de Splits//")
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
     * **/
    @PostMapping("/criar")
    @Operation(
            summary = "Criar Split",
            description = "Rota para lidar com requisições POST de criar Splits"
    )
    public SplitResponse criarSplit(@RequestBody SplitRequest splitRequest){
        return splitsService.criarSplit(splitRequest);
    }

    /***
     * Rota para Listar todos Splits
     * **/
    @GetMapping("/listar")
    @Operation(
            summary = "Listar todos Splits",
            description = "Rota para lidar com requisições GET de listar todos os Splits"
    )
    public List<SplitResponse> listarSplits(){
        return splitsService.listarSplits();
    }

    @PatchMapping("/atualizar/{uuid}")
    @Operation(
            summary = "Atualizar Split por UUID",
            description = "Rota para lidar com requisições PATCH de atualizar splits por UUID"
    )
    public SplitResponse atualizarSplit(@PathVariable UUID uuid,
                                        @RequestBody SplitRequest splitRequest){
        return splitsService.atualizarSplitPorId(uuid, splitRequest);
    }
}
