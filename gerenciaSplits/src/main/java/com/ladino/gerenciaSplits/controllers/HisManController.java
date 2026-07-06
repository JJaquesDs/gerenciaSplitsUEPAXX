package com.ladino.gerenciaSplits.controllers;

import com.ladino.gerenciaSplits.dtos.requests.HisManRequest;
import com.ladino.gerenciaSplits.dtos.responses.HisManResponse;
import com.ladino.gerenciaSplits.models.HistoricoManun;
import com.ladino.gerenciaSplits.services.HisManService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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

    public HisManController(HisManService hisManService){
        this.hisManService = hisManService;
    }


    @PostMapping("/criar")
    @Operation(
            summary = "Criar históricos de manutenções",
            description = "Rota para lidar com requisições POST de criar Históricos de Manutenções"
    )
    public HisManResponse criarHisMan(@RequestBody HisManRequest hisManRequest){
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
    public Optional<HistoricoManun> HisManPorUUID(@PathVariable UUID uuid,
                                                  @RequestBody HisManRequest hisManRequest){
        return hisManService.listarHisManPorUuid(uuid);
    }


}
