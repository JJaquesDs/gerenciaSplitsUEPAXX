package com.ladino.gerenciaSplits.mappers;

import com.ladino.gerenciaSplits.dtos.requests.HisManRequest;
import com.ladino.gerenciaSplits.dtos.responses.HisManResponse;
import com.ladino.gerenciaSplits.models.Enums.TipoManun;
import com.ladino.gerenciaSplits.models.HistoricoManun;
import com.ladino.gerenciaSplits.models.Splits;
import java.time.LocalDate;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-06T17:11:06-0300",
    comments = "version: 1.6.3, compiler: javac, environment: Java 22 (Oracle Corporation)"
)
@Component
public class HisManMapperImpl implements HisManMapper {

    @Override
    public HisManResponse toResponse(HistoricoManun historicoManun) {
        if ( historicoManun == null ) {
            return null;
        }

        UUID splitId = null;
        UUID historicoManunId = null;
        LocalDate dataManun = null;
        TipoManun tipoManun = null;
        String tecnicoResponsavel = null;
        String servicoRealizado = null;

        splitId = historicoManunSplitSplitId( historicoManun );
        historicoManunId = historicoManun.getHistoricoManunId();
        dataManun = historicoManun.getDataManun();
        tipoManun = historicoManun.getTipoManun();
        tecnicoResponsavel = historicoManun.getTecnicoResponsavel();
        servicoRealizado = historicoManun.getServicoRealizado();

        String observacoes = null;

        HisManResponse hisManResponse = new HisManResponse( historicoManunId, dataManun, tipoManun, tecnicoResponsavel, servicoRealizado, observacoes, splitId );

        return hisManResponse;
    }

    @Override
    public HistoricoManun toEntity(HisManRequest hisManRequest) {
        if ( hisManRequest == null ) {
            return null;
        }

        HistoricoManun historicoManun = new HistoricoManun();

        historicoManun.setDataManun( hisManRequest.dataManun() );
        historicoManun.setTipoManun( hisManRequest.tipoManun() );
        historicoManun.setTecnicoResponsavel( hisManRequest.tecnicoResponsavel() );
        historicoManun.setServicoRealizado( hisManRequest.servicoRealizado() );

        return historicoManun;
    }

    @Override
    public void updateFromRequest(HisManRequest hisManRequest, HistoricoManun historicoManun) {
        if ( hisManRequest == null ) {
            return;
        }

        if ( hisManRequest.dataManun() != null ) {
            historicoManun.setDataManun( hisManRequest.dataManun() );
        }
        if ( hisManRequest.tipoManun() != null ) {
            historicoManun.setTipoManun( hisManRequest.tipoManun() );
        }
        if ( hisManRequest.tecnicoResponsavel() != null ) {
            historicoManun.setTecnicoResponsavel( hisManRequest.tecnicoResponsavel() );
        }
        if ( hisManRequest.servicoRealizado() != null ) {
            historicoManun.setServicoRealizado( hisManRequest.servicoRealizado() );
        }
    }

    private UUID historicoManunSplitSplitId(HistoricoManun historicoManun) {
        Splits split = historicoManun.getSplit();
        if ( split == null ) {
            return null;
        }
        return split.getSplitId();
    }
}
