package com.ladino.gerenciaSplits.mappers;

import com.ladino.gerenciaSplits.dtos.requests.HisManRequest;
import com.ladino.gerenciaSplits.dtos.responses.HisManResponse;
import com.ladino.gerenciaSplits.models.HistoricoManu;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface HisManMapper {


    //Transformando split Objeto inteiro em apenas splitId para responses da API
    @Mapping(target = "splitId", source = "split.splitId")
    HisManResponse toResponse(HistoricoManu historicoManu);


    //Ignorando split por conta do mapper não transformar split entidade apenas com base no UUID
    @Mapping(target = "split", ignore = true)
    HistoricoManu toEntity(HisManRequest hisManRequest);


    //Mapper para ignorar valores nulos para atualizar de HisManRequest
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromRequest(HisManRequest hisManRequest, @MappingTarget HistoricoManu historicoManu);

}
