package com.ladino.gerenciaSplits.mappers;

import com.ladino.gerenciaSplits.dtos.requests.SplitRequest;
import com.ladino.gerenciaSplits.dtos.responses.SplitResponse;
import com.ladino.gerenciaSplits.models.Splits;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface SplitMapper {

    //Mapper para ignorar valores nulos para atualizar de SplitRequests
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromRequest(SplitRequest splitRequest, @MappingTarget Splits split);

    //Transformando local Classe para String nome do local apenas
    @Mapping(target = "local", source = "local.nomeLocal")
    SplitResponse toResponse(Splits split);

    //Ignorando local pq mapper não pode transformar UUID e Ids no geral em um objeto inteiro (Service faz isso)
    @Mapping(target = "local", ignore = true)
    //Padronizando marca e capacidadeBtu para upper case
    @Mapping(target = "marca", source = "marca", qualifiedByName = "upper")
    @Mapping(target = "capacidadeBtu", source = "capacidadeBtu", qualifiedByName = "upper")
    Splits toEntity(SplitRequest splitRequest);

    //Levando todos com nome "upper" para upper case
    @Named("upper")
    default String upper(String valor){
        return valor == null ? null : valor.toUpperCase();
    }
}
