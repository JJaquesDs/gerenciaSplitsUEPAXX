package com.ladino.gerenciaSplits.services;

import com.ladino.gerenciaSplits.dtos.requests.LocalRequest;
import com.ladino.gerenciaSplits.dtos.responses.LocalResponse;
import com.ladino.gerenciaSplits.exceptions.LocalJaExisteException;
import com.ladino.gerenciaSplits.exceptions.LocalNotFoundException;
import com.ladino.gerenciaSplits.models.Local;
import com.ladino.gerenciaSplits.repository.LocalRepository;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LocalService {

    //Injeção de dependência do repositório
    private final LocalRepository localRepository;
    
    // Injeção da ferramenta de envio de mensagens do WebSocket
    private final SimpMessagingTemplate messagingTemplate;

    public LocalService(LocalRepository localRepository, SimpMessagingTemplate messagingTemplate) {
        this.localRepository = localRepository;
        this.messagingTemplate = messagingTemplate;
    }


    /**
     * Buscando se um local existe no banco pelo uuid
     * */
    public Local buscarLocalExistente(UUID uuid){

        //busca no repositório se não achar lança exception
        return localRepository.findById(uuid).orElseThrow(() -> new LocalNotFoundException(uuid));
    }

    /**
     * SERVIÇO DE CRUD DE LOCAIS
     * **/
    public Local criarLocal(LocalRequest localRequest){

        //Primeiro jogando para upperCase para padronizar
        String nomeLocal = localRequest.nomeLocal().toUpperCase();

        //verificando se o local já existe para não duplicar persistências
        if (localRepository.findByNomeLocal(nomeLocal).isPresent()){
            throw new LocalJaExisteException(nomeLocal);
        }


        //Criando local
        Local local = new Local();
        local.setNomeLocal(nomeLocal);

        Local localSalvo = localRepository.save(local);

        messagingTemplate.convertAndSend("/topic/atualizacoes", "MUDANCA_DETECTADA");

        return localSalvo;

    }

    //Listar locais
    public List<LocalResponse> listarLocais(){

        return localRepository.findAll().stream().map(local -> new LocalResponse(
                local.getLocaiId(),
                local.getNomeLocal()
        )).toList();
    }


    //Listar por Id
    public Local listarLocalPorId(UUID uuid){

        //Utilizando Método já existente (já lança exception caso não ache)
        return buscarLocalExistente(uuid);
    }

    //Atualizar Local
    public Local atualizarLocalPorId(UUID uuid, LocalRequest localRequest ){

        //Já lança exception caso não encontre
        Local local = buscarLocalExistente(uuid);

        local.setNomeLocal(localRequest.nomeLocal());

        messagingTemplate.convertAndSend("/topic/atualizacoes", "MUDANCA_DETECTADA");

        return localRepository.save(local);
    }

    //Deletar Local
    public void deletarLocalPorId(UUID uuid){

        //Já lança exception caso não encontre
        Local local = buscarLocalExistente(uuid);


        localRepository.deleteById(uuid);

        messagingTemplate.convertAndSend("/topic/atualizacoes", "MUDANCA_DETECTADA");
    }
}
