package com.ladino.gerenciaSplits.mappers;

import com.ladino.gerenciaSplits.dtos.requests.HisManRequest;
import com.ladino.gerenciaSplits.dtos.responses.HisManResponse;
import com.ladino.gerenciaSplits.models.HistoricoManun;
import org.mapstruct.*;

import java.util.Optional;

@Mapper(componentModel = "spring")
public interface HisManMapper {


    //Transformando split Objeto inteiro em apenas registro patrimonial para responses da API
    @Mapping(target = "split", source = "split.rp")
    HisManResponse toResponse(HistoricoManun historicoManun);


    //Ignorando split por conta do mapper não transformar split entidade apenas com base no UUID
    @Mapping(target = "split", ignore = true)
    HistoricoManun toEntity(HisManRequest hisManRequest);


    //Mapper para ignorar valores nulos para atualizar de HisManRequest
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromRequest(HisManRequest hisManRequest, @MappingTarget HistoricoManun historicoManun);

}
