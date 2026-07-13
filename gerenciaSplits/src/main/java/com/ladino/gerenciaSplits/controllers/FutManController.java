package com.ladino.gerenciaSplits.controllers;

import com.ladino.gerenciaSplits.dtos.responses.FutManResponse;
import com.ladino.gerenciaSplits.services.FutManService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/manu_futuras")
@Tag(
        name = "Manutenções Futuras",
        description = "Rota para lidar com requisições de Futuras Manutenções de Splits"
)
public class FutManController {

    //Injeção de dependência para usar service de Futuras Manutenções
    private final FutManService futManService;

    //Construtor
    public FutManController (FutManService futManService){
        this.futManService = futManService;
    }

    @GetMapping("/listar")
    @Operation(
            summary = "Listar todas as futuras manutenções de todos splits",
            description = "Rota para lidar com requisições GET para listar todas futuras manutenções de splits"
    )
    public List<FutManResponse> listarFutMan(){
        return futManService.listarFutManService();
    }

    @DeleteMapping("deletar/{uuid}")
    @Operation(
            summary = "Deletar futura manutenção pelo UUID",
            description = "Rota para lidar com requisições DELETE para deletar futuras manutenções pelo UUID"
    )
    public void deletarFutMan(@PathVariable("uuid") UUID uuid){
        futManService.deletarFutMan(uuid);
    }

}
