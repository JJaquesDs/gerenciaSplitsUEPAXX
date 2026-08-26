package com.ladino.gerenciaSplits.mappers;

import com.ladino.gerenciaSplits.dtos.requests.HisManRequest;
import com.ladino.gerenciaSplits.dtos.responses.HisManResponse;
import com.ladino.gerenciaSplits.models.Enums.TipoManu;
import com.ladino.gerenciaSplits.models.HistoricoManu;
import com.ladino.gerenciaSplits.models.Local;
import com.ladino.gerenciaSplits.models.Splits;
import java.time.LocalDate;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-26T09:28:30-0300",
    comments = "version: 1.6.3, compiler: javac, environment: Java 22 (Oracle Corporation)"
)
@Component
public class HisManMapperImpl implements HisManMapper {

    @Override
    public HisManResponse toResponse(HistoricoManu historicoManu) {
        if ( historicoManu == null ) {
            return null;
        }

        String rp = null;
        String local = null;
        UUID historicoManuId = null;
        LocalDate dataManu = null;
        TipoManu tipoManu = null;
        String tecnicoResponsavel = null;
        String servicoRealizado = null;
        String observacoes = null;

        rp = historicoManuSplitRp( historicoManu );
        local = historicoManuSplitLocalNomeLocal( historicoManu );
        historicoManuId = historicoManu.getHistoricoManuId();
        dataManu = historicoManu.getDataManu();
        tipoManu = historicoManu.getTipoManu();
        tecnicoResponsavel = historicoManu.getTecnicoResponsavel();
        servicoRealizado = historicoManu.getServicoRealizado();
        observacoes = historicoManu.getObservacoes();

        HisManResponse hisManResponse = new HisManResponse( historicoManuId, dataManu, tipoManu, tecnicoResponsavel, servicoRealizado, observacoes, rp, local );

        return hisManResponse;
    }

    @Override
    public HistoricoManu toEntity(HisManRequest hisManRequest) {
        if ( hisManRequest == null ) {
            return null;
        }

        HistoricoManu historicoManu = new HistoricoManu();

        historicoManu.setDataManu( hisManRequest.dataManu() );
        historicoManu.setTipoManu( hisManRequest.tipoManu() );
        historicoManu.setTecnicoResponsavel( hisManRequest.tecnicoResponsavel() );
        historicoManu.setServicoRealizado( hisManRequest.servicoRealizado() );
        historicoManu.setObservacoes( hisManRequest.observacoes() );

        return historicoManu;
    }

    @Override
    public void updateFromRequest(HisManRequest hisManRequest, HistoricoManu historicoManu) {
        if ( hisManRequest == null ) {
            return;
        }

        if ( hisManRequest.dataManu() != null ) {
            historicoManu.setDataManu( hisManRequest.dataManu() );
        }
        if ( hisManRequest.tipoManu() != null ) {
            historicoManu.setTipoManu( hisManRequest.tipoManu() );
        }
        if ( hisManRequest.tecnicoResponsavel() != null ) {
            historicoManu.setTecnicoResponsavel( hisManRequest.tecnicoResponsavel() );
        }
        if ( hisManRequest.servicoRealizado() != null ) {
            historicoManu.setServicoRealizado( hisManRequest.servicoRealizado() );
        }
        if ( hisManRequest.observacoes() != null ) {
            historicoManu.setObservacoes( hisManRequest.observacoes() );
        }
    }

    private String historicoManuSplitRp(HistoricoManu historicoManu) {
        Splits split = historicoManu.getSplit();
        if ( split == null ) {
            return null;
        }
        return split.getRp();
    }

    private String historicoManuSplitLocalNomeLocal(HistoricoManu historicoManu) {
        Splits split = historicoManu.getSplit();
        if ( split == null ) {
            return null;
        }
        Local local = split.getLocal();
        if ( local == null ) {
            return null;
        }
        return local.getNomeLocal();
    }
}
