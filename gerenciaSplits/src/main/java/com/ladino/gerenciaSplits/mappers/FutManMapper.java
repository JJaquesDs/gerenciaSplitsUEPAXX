package com.ladino.gerenciaSplits.mappers;

import com.ladino.gerenciaSplits.dtos.responses.FutManResponse;
import com.ladino.gerenciaSplits.models.FuturasManu;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.lang.annotation.Target;

@Mapper(componentModel = "spring")
public interface FutManMapper {

    //Transformando split Objeto inteiro em apenas splitId para responses da API
    @Mapping(target = "splitId", source = "split.splitId")
    FutManResponse toResponse(FuturasManu futurasManu);


}
