package com.ladino.gerenciaSplits.controllers;

import com.ladino.gerenciaSplits.services.RelatoriosService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/api/relatorios")
@Tag(name = "Relatórios", description = "Geração de relatórios Excel")
public class RelatoriosController {

    private final RelatoriosService relatoriosService;

    public RelatoriosController (RelatoriosService relatoriosService){
        this.relatoriosService = relatoriosService;
    }

    @GetMapping("/cadastro_splits")
    @Operation(summary = "Rota para lidar com requisições GET para puxar relatórios de cadastros de splits")
    public ResponseEntity<byte[]> gerarCadastroSplits(){

        byte[] excel = relatoriosService.gerarCadastroSplits();

        HttpHeaders httpHeaders = new HttpHeaders();

        httpHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        httpHeaders.setContentDisposition(
                ContentDisposition.builder("attachment")
                        .filename("cadastro_splits.xlsx")
                        .build()
        );

        return ResponseEntity.ok()
                .headers(httpHeaders)
                .body(excel);
    }

    @GetMapping("historico_descricao")
    @Operation(summary = "Rota para lidar com requisições GET para retornar planilha de histórico de manutenção dos splits")
    public ResponseEntity<byte[]> gerarHisManuSplits(){

        byte[] excel = relatoriosService.gerarManSplits();

        HttpHeaders httpHeaders = new HttpHeaders();

        httpHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        httpHeaders.setContentDisposition(
                ContentDisposition.builder("attachment")
                        .filename("historico_descricao.xlsx")
                        .build()
        );

        return ResponseEntity.ok()
                .headers(httpHeaders)
                .body(excel);

    }

    @GetMapping("ultimas_manu")
    @Operation(summary = "Rota para lidar com requisições GET para retornar planilha com histórico das últimas manutenções")
    public ResponseEntity<byte[]> gerarHisUltMan(){

        byte[] excel = relatoriosService.gerarHisManUti();

        HttpHeaders httpHeaders = new HttpHeaders();

        httpHeaders.setContentDisposition(
                ContentDisposition.builder("attachment")
                        .filename("ultimas_manu.xlsx")
                        .build()
        );

        return ResponseEntity.ok()
                .headers(httpHeaders)
                .body(excel);
    }

    @GetMapping("datas_ultimas_man")
    @Operation(summary = "Rota para lidar com requisições GET para retornar planilha com datas das últimas manutenções")
    public ResponseEntity<byte[]> gerarDatasUltMan(){

        byte[] excel = relatoriosService.gerarDatsUltMan();

        HttpHeaders httpHeaders = new HttpHeaders();

        httpHeaders.setContentDisposition(
                ContentDisposition.builder("attachment")
                        .filename("datas_ultimas_manu.xlsx")
                        .build()
        );

        return ResponseEntity.ok()
                .headers(httpHeaders)
                .body(excel);

    }
}
