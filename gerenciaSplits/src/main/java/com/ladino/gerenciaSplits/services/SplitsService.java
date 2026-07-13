package com.ladino.gerenciaSplits.services;

import com.ladino.gerenciaSplits.dtos.requests.SplitRequest;
import com.ladino.gerenciaSplits.dtos.responses.SplitResponse;
import com.ladino.gerenciaSplits.mappers.SplitMapper;
import com.ladino.gerenciaSplits.models.Local;
import com.ladino.gerenciaSplits.models.Splits;
import com.ladino.gerenciaSplits.repository.SplitRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SplitsService {

    // Injeção de Dependência do repositório
    private final SplitRepository splitRepository;

    //Injeção de Dependência de LocalService para usar os serviços de local aqui no SplitService
    private final LocalService localService;

    //Injeção de Dependência de FutManService para usar os serviços de Futuras Manutenções aqui no SplitService
    private final FutManService futManService;

    private final SplitMapper splitMapper;

    //Construtor
    public SplitsService(
            SplitRepository splitRepository,
            LocalService localService,
            FutManService futManService,
            SplitMapper splitMapper
    ) {
        this.splitRepository = splitRepository;
        this.localService = localService;
        this.splitMapper = splitMapper;
        this.futManService = futManService;
    }

    // Buscar se um split existe
    public Splits buscarSplitExistente(UUID uuid){
        //Cria um objeto que pode ou não ter um registro de split pelo uuid
        Optional<Splits> splitPorId = splitRepository.findById(uuid);

        // Se existir retorna ou retorna nulo
        return splitPorId.orElse(null);
    }

    // Create
    public SplitResponse criarSplit(SplitRequest splitRequest){

        Local local = localService.buscarLocalExistente(splitRequest.localId());

        if (local == null){
            throw new RuntimeException("Local não encontrado");
        }

        Splits split = splitMapper.toEntity(splitRequest);

        split.setLocal(local);


        splitRepository.save(split);

        //Criando uma nova data de manutenção para o split que foi criado automaticamente
        futManService.atualizarProxMan(split);

        //Retornando apenas o mapper Response (evitar jsons infinitos)
        return splitMapper.toResponse(split);
    }


    // Read
    public List<SplitResponse> listarSplits(){

        return splitRepository.findAll().stream().map(splits -> new SplitResponse(
                splits.getSplitId(),
                splits.getRp(),
                splits.getMarca(),
                splits.getCapacidadeBtu(),
                splits.getDataEntrada(),
                splits.getPeriodoManMes(),
                splits.getLocal().getNomeLocal()
        )).toList();
    }


    // Read por ID
    public Splits listarSplitPorId(UUID uuid){

        // Usa apenas o método que já existe
       return buscarSplitExistente(uuid);
    }

    //Atualizar
    public SplitResponse atualizarSplitPorId(UUID uuid, SplitRequest splitAtualizado){

        //Buscando se o split já existe
        Splits split = buscarSplitExistente(uuid);

        //TODO: CRIAR EXCEPTION
        if(split == null){
            throw new RuntimeException("Nao encontrado");
        }

        //Usando o mapper que já trata campos nulos
        splitMapper.updateFromRequest(splitAtualizado, split);

        //Essa verificação apenas para caso marca não ser atualizada o toUpperCase() não gerar null pointer exception
        if (splitAtualizado.marca() != null){
            split.setMarca(splitAtualizado.marca().toUpperCase());
        }

        // Se o local for atualizado, ele busca no banco qual é o local e atualiza ele (se nao achar lança exception)
        if (splitAtualizado.localId() != null){
            Local local = localService.buscarLocalExistente(splitAtualizado.localId());

            split.setLocal(local);
        }

        splitRepository.save(split);

        return new SplitResponse(
                split.getSplitId(),
                split.getRp(),
                split.getMarca(),
                split.getCapacidadeBtu(),
                split.getDataEntrada(),
                split.getPeriodoManMes(),
                split.getLocal().getNomeLocal()
        );
    }

    //Delete
    public void deletarSplitPorId(UUID uuid){

        Splits split = buscarSplitExistente(uuid);

        //TODO: Refatorar para lançar uma exception
        if (split != null) {
            splitRepository.delete(split);
        }
    }

}
