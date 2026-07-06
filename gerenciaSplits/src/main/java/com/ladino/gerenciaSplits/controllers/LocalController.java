package com.ladino.gerenciaSplits.controllers;

import com.ladino.gerenciaSplits.dtos.requests.LocalRequest;
import com.ladino.gerenciaSplits.dtos.responses.LocalResponse;
import com.ladino.gerenciaSplits.models.Local;
import com.ladino.gerenciaSplits.services.LocalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/locais")
@Tag(name = "Locais", description = "Rotas para lidar com requisições de Locais")
public class LocalController {

    private final LocalService localService;

    public LocalController(LocalService localService){
        this.localService = localService;
    }

    @PostMapping("/criar")
    @Operation(
            summary = "Criar Locais",
            description = "Rota para lidar com requisições POST de criar Locais")
    public Local criarLocal(@Valid @RequestBody LocalRequest localRequest){
        return localService.criarLocal(localRequest);
    }

    @GetMapping("/listar")
    @Operation(
            summary = "Listar Locais",
            description = "Rota para lidar com requisições GET de listar todos os locais")
    public List<LocalResponse> listarLocais(){
        return localService.listarLocais();
    }

    @DeleteMapping("/deletar/{uuid}")
    @Operation(
            summary = "Deletar Locais",
            description = "Rota para lidar com requisições DELETE de deletar Locais por UUID"
    )
    public void deletarLocal(@PathVariable UUID uuid){
        localService.deletarLocalPorId(uuid);
    }



}
