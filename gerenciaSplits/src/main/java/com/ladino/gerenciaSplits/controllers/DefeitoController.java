package com.ladino.gerenciaSplits.controllers;

import com.ladino.gerenciaSplits.dtos.requests.DefeitoRequest;
import com.ladino.gerenciaSplits.dtos.responses.DefeitoResponse;
import com.ladino.gerenciaSplits.services.DefeitoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/defeitos")
@Tag(name = "Defeitos", description = "Rotas para registrar defeitos nos equipamentos")
public class DefeitoController {

    private final DefeitoService defeitoService;

    public DefeitoController(DefeitoService defeitoService) {
        this.defeitoService = defeitoService;
    }

    @PostMapping("/criar")
    @Operation(summary = "Registrar defeito")
    public ResponseEntity<DefeitoResponse> criar(@Valid @RequestBody DefeitoRequest request) {
        return ResponseEntity.ok(defeitoService.criar(request));
    }

    @GetMapping("/listar")
    @Operation(summary = "Listar defeitos")
    public ResponseEntity<List<DefeitoResponse>> listar() {
        return ResponseEntity.ok(defeitoService.listar());
    }

    @PatchMapping("/atualizar/{uuid}")
    @Operation(summary = "Atualizar defeito")
    public ResponseEntity<DefeitoResponse> atualizar(
            @PathVariable UUID uuid,
            @Valid @RequestBody DefeitoRequest request
    ) {
        return ResponseEntity.ok(defeitoService.atualizar(uuid, request));
    }

    @DeleteMapping("/deletar/{uuid}")
    @Operation(summary = "Excluir defeito")
    public ResponseEntity<Void> deletar(@PathVariable UUID uuid) {
        defeitoService.deletar(uuid);
        return ResponseEntity.noContent().build();
    }
}
