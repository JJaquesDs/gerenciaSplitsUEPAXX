package com.ladino.gerenciaSplits.controllers;

import com.ladino.gerenciaSplits.dtos.requests.HisManRequest;
import com.ladino.gerenciaSplits.dtos.responses.HisManResponse;
import com.ladino.gerenciaSplits.dtos.responses.HisUltimasManResponse;
import com.ladino.gerenciaSplits.models.HistoricoManu;
import com.ladino.gerenciaSplits.services.HisManService;
import com.ladino.gerenciaSplits.services.UltimasManService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/his_man")
@Tag(
        name = "Históricos de Manutenções",
        description = "Rota para controlar requisições de Históricos de Manutenções de Splits")
public class HisManController {


    //Injeção de dependência para usar Service de históricos de manutenções
    private final HisManService hisManService;

    private final UltimasManService ultimasManService;


    public HisManController(
            HisManService hisManService,
            UltimasManService ultimasManService
    ){
        this.hisManService = hisManService;
        this.ultimasManService = ultimasManService;
    }


    @PostMapping("/criar")
    @Operation(
            summary = "Criar históricos de manutenções",
            description = "Rota para lidar com requisições POST de criar Históricos de Manutenções"
    )
    public HisManResponse criarHisMan( @Valid @RequestBody HisManRequest hisManRequest){
        return hisManService.criarHisMan(hisManRequest);
    }


    @GetMapping("/listar")
    @Operation(
            summary = "Listar históricos de manutenções",
            description = "Rota para lidar com requisições GET de listar todos os históricos de manutenções"
    )
    public List<HisManResponse> listarHisMan(){
        return hisManService.listarHisMan();
    }


    @GetMapping("/listar/{uuid}")
    @Operation(
            summary = "Listar históricos de manutenções por UUID",
            description = "Rota para lidar com requisições GET de listar históricos de manutenção por UUID"
    )
    public Optional<HistoricoManu> HisManPorUUID(@PathVariable UUID uuid){
        return hisManService.listarHisManPorUuid(uuid);
    }

    @DeleteMapping("/deletar/{uuid}")
    @Operation(
            summary = "Deletar históricos de manutenções por UUID",
            description = "Rota para lidar com requisições DELETE de históricos de manutenção por UUID"
    )
    public void deleteHisMan(@PathVariable("uuid") UUID uuid){

        hisManService.hisManDelete(uuid);
    }

    @GetMapping("/ultimas")
    @Operation(
            summary = "Listar todasa as últimas manutenções dos splits",
            description = "Rota para lidar com requisições GET para listar todas as últimas datas de manutenções dos splits"
    )
    public List<HisUltimasManResponse> hisUltimas(){
        return ultimasManService.listarUltimasManService();
    }


}
