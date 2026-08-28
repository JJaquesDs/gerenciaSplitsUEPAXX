package com.ladino.gerenciaSplits.mappers;

import com.ladino.gerenciaSplits.dtos.requests.SplitRequest;
import com.ladino.gerenciaSplits.dtos.responses.SplitResponse;
import com.ladino.gerenciaSplits.models.Enums.PeriodoManutencao;
import com.ladino.gerenciaSplits.models.Local;
import com.ladino.gerenciaSplits.models.Splits;
import java.time.LocalDate;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-28T14:51:19-0300",
    comments = "version: 1.6.3, compiler: javac, environment: Java 22 (Oracle Corporation)"
)
@Component
public class SplitMapperImpl implements SplitMapper {

    @Override
    public void updateFromRequest(SplitRequest splitRequest, Splits split) {
        if ( splitRequest == null ) {
            return;
        }

        if ( splitRequest.rp() != null ) {
            split.setRp( splitRequest.rp() );
        }
        if ( splitRequest.marca() != null ) {
            split.setMarca( splitRequest.marca() );
        }
        if ( splitRequest.capacidadeBtu() != null ) {
            split.setCapacidadeBtu( splitRequest.capacidadeBtu() );
        }
        if ( splitRequest.dataEntrada() != null ) {
            split.setDataEntrada( splitRequest.dataEntrada() );
        }
        if ( splitRequest.periodoManMes() != null ) {
            split.setPeriodoManMes( splitRequest.periodoManMes() );
        }
    }

    @Override
    public SplitResponse toResponse(Splits split) {
        if ( split == null ) {
            return null;
        }

        String local = null;
        String rp = null;
        String marca = null;
        String capacidadeBtu = null;
        LocalDate dataEntrada = null;
        PeriodoManutencao periodoManMes = null;

        local = splitLocalNomeLocal( split );
        rp = split.getRp();
        marca = split.getMarca();
        capacidadeBtu = split.getCapacidadeBtu();
        dataEntrada = split.getDataEntrada();
        periodoManMes = split.getPeriodoManMes();

        UUID uuid = null;

        SplitResponse splitResponse = new SplitResponse( uuid, rp, marca, capacidadeBtu, dataEntrada, periodoManMes, local );

        return splitResponse;
    }

    @Override
    public Splits toEntity(SplitRequest splitRequest) {
        if ( splitRequest == null ) {
            return null;
        }

        Splits splits = new Splits();

        splits.setMarca( upper( splitRequest.marca() ) );
        splits.setCapacidadeBtu( upper( splitRequest.capacidadeBtu() ) );
        splits.setRp( splitRequest.rp() );
        splits.setDataEntrada( splitRequest.dataEntrada() );
        splits.setPeriodoManMes( splitRequest.periodoManMes() );

        return splits;
    }

    private String splitLocalNomeLocal(Splits splits) {
        Local local = splits.getLocal();
        if ( local == null ) {
            return null;
        }
        return local.getNomeLocal();
    }
}
