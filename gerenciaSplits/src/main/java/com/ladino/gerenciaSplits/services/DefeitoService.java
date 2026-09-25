package com.ladino.gerenciaSplits.services;

import com.ladino.gerenciaSplits.dtos.requests.DefeitoRequest;
import com.ladino.gerenciaSplits.dtos.responses.DefeitoResponse;
import com.ladino.gerenciaSplits.exceptions.DefeitoNotFoundException;
import com.ladino.gerenciaSplits.models.Defeito;
import com.ladino.gerenciaSplits.models.Splits;
import com.ladino.gerenciaSplits.repository.DefeitoRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DefeitoService {

    private final DefeitoRepository defeitoRepository;
    private final SplitsService splitsService;
    private final SimpMessagingTemplate messagingTemplate;

    public DefeitoService(
            DefeitoRepository defeitoRepository,
            SplitsService splitsService,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.defeitoRepository = defeitoRepository;
        this.splitsService = splitsService;
        this.messagingTemplate = messagingTemplate;
    }

    public DefeitoResponse criar(DefeitoRequest request) {
        Splits split = splitsService.buscarSplitExistente(request.splitId());
        Defeito defeito = new Defeito();
        preencher(defeito, request, split);

        DefeitoResponse criado = paraResponse(defeitoRepository.save(defeito));
        notificarAtualizacao();
        return criado;
    }

    public List<DefeitoResponse> listar() {
        return defeitoRepository.findAll().stream()
                .map(this::paraResponse)
                .toList();
    }

    public DefeitoResponse atualizar(UUID uuid, DefeitoRequest request) {
        Defeito defeito = buscarEntidade(uuid);
        Splits split = splitsService.buscarSplitExistente(request.splitId());
        preencher(defeito, request, split);

        Defeito atualizado = defeitoRepository.save(defeito);
        notificarAtualizacao();
        return paraResponse(atualizado);
    }

    public void deletar(UUID uuid) {
        defeitoRepository.delete(buscarEntidade(uuid));
        notificarAtualizacao();
    }

    private Defeito buscarEntidade(UUID uuid) {
        return defeitoRepository.findById(uuid)
                .orElseThrow(() -> new DefeitoNotFoundException(uuid));
    }

    private void preencher(Defeito defeito, DefeitoRequest request, Splits split) {
        defeito.setDataRegistro(request.dataRegistro());
        defeito.setDescricao(request.descricao());
        defeito.setStatus(request.status());
        defeito.setObservacoes(request.observacoes());
        defeito.setSplit(split);
    }

    private DefeitoResponse paraResponse(Defeito defeito) {
        Splits split = defeito.getSplit();
        return new DefeitoResponse(
                defeito.getDefeitoId(),
                defeito.getDataRegistro(),
                defeito.getDescricao(),
                defeito.getStatus(),
                defeito.getObservacoes(),
                split.getRp(),
                split.getMarca(),
                split.getLocal().getNomeLocal()
        );
    }

    private void notificarAtualizacao() {
        messagingTemplate.convertAndSend("/topic/atualizacoes", "MUDANCA_DETECTADA");
    }
}
