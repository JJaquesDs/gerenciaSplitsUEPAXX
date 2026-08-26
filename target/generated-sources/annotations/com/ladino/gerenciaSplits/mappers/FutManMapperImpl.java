package com.ladino.gerenciaSplits.mappers;

import com.ladino.gerenciaSplits.dtos.responses.FutManResponse;
import com.ladino.gerenciaSplits.models.FuturasManu;
import com.ladino.gerenciaSplits.models.Local;
import com.ladino.gerenciaSplits.models.Splits;
import java.time.LocalDate;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-26T09:28:29-0300",
    comments = "version: 1.6.3, compiler: javac, environment: Java 22 (Oracle Corporation)"
)
@Component
public class FutManMapperImpl implements FutManMapper {

    @Override
    public FutManResponse toResponse(FuturasManu futurasManu) {
        if ( futurasManu == null ) {
            return null;
        }

        String rp = null;
        String local = null;
        LocalDate dataProxManu = null;

        rp = futurasManuSplitRp( futurasManu );
        local = futurasManuSplitLocalNomeLocal( futurasManu );
        dataProxManu = futurasManu.getDataProxManu();

        UUID futurasManunId = null;

        FutManResponse futManResponse = new FutManResponse( futurasManunId, dataProxManu, rp, local );

        return futManResponse;
    }

    private String futurasManuSplitRp(FuturasManu futurasManu) {
        Splits split = futurasManu.getSplit();
        if ( split == null ) {
            return null;
        }
        return split.getRp();
    }

    private String futurasManuSplitLocalNomeLocal(FuturasManu futurasManu) {
        Splits split = futurasManu.getSplit();
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
