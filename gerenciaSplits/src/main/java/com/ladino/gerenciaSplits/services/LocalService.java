package com.ladino.gerenciaSplits.services;

import com.ladino.gerenciaSplits.dtos.requests.LocalRequest;
import com.ladino.gerenciaSplits.dtos.responses.LocalResponse;
import com.ladino.gerenciaSplits.models.Local;
import com.ladino.gerenciaSplits.repository.LocalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LocalService {

    //Injeção de dependência do repositório
    private final LocalRepository localRepository;

    public LocalService(LocalRepository localRepository) {
        this.localRepository = localRepository;
    }


    /**
     * Buscando se um local existe no banco pelo uuid
     * */
    public Local buscarLocalExistente(UUID uuid){

        //Cria um objeto que pode ou não ter um registro de split pelo uuid
        Optional<Local> localPorId = localRepository.findById(uuid);

        return localPorId.orElse(null);
    }

    /**
     * SERVIÇO DE CRUD DE LOCAIS
     * **/
    public Local criarLocal(LocalRequest localRequest){

        //Primeiro jogando para upperCase para padronizar
        String nomeLocal = localRequest.nomeLocal().toUpperCase();

        //verificando se o local já existe para não duplicar persistências
        if (localRepository.findByNomeLocal(nomeLocal).isPresent()){
            throw new RuntimeException("Local já existe");
        }

        //Criando local
        Local local = new Local();
        local.setNomeLocal(nomeLocal);

        return localRepository.save(local);

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

        //Utilizando Método já existente
        return buscarLocalExistente(uuid);
    }

    //Atualizar Local
    public Local atualizarLocalPorId(UUID uuid, LocalRequest localRequest ){

        Local local = buscarLocalExistente(uuid);

        if (local == null){
            throw new RuntimeException("Local não existe");
        }

        local.setNomeLocal(localRequest.nomeLocal());

        return localRepository.save(local);
    }

    //Deletar Local
    public void deletarLocalPorId(UUID uuid){

        localRepository.deleteById(uuid);
    }
}
