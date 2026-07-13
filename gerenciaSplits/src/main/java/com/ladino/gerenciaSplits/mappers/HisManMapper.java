package com.ladino.gerenciaSplits.mappers;

import com.ladino.gerenciaSplits.dtos.requests.HisManRequest;
import com.ladino.gerenciaSplits.dtos.responses.HisManResponse;
import com.ladino.gerenciaSplits.models.HistoricoManu;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface HisManMapper {


    //pegando rp e nome do local para responses
    @Mapping(target = "rp", source = "split.rp")
    @Mapping(target = "local", source = "split.local.nomeLocal")
    HisManResponse toResponse(HistoricoManu historicoManu);


    //Ignorando split por conta do mapper não transformar split entidade apenas com base no UUID
    @Mapping(target = "split", ignore = true)
    HistoricoManu toEntity(HisManRequest hisManRequest);


    //Mapper para ignorar valores nulos para atualizar de HisManRequest
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromRequest(HisManRequest hisManRequest, @MappingTarget HistoricoManu historicoManu);

}
