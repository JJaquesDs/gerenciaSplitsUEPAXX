package com.ladino.gerenciaSplits.models;

import com.ladino.gerenciaSplits.models.Enums.TipoManun;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "Historico_manun")
public class HistoricoManun {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID historicoManunId;

    @Column(nullable = false)
    private LocalDate dataManun;

    //Transformando Enum em tipo String
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoManun tipoManun;

    @Column(nullable = false)
    private String tecnicoResponsavel;

    @Column(nullable = false)
    private String servicoRealizado;

    @Column(nullable = true)
    private String obersavacoes;

    @ManyToOne
    @JoinColumn(name = "split_id", nullable = false)
    private Splits split;

    // Construtores
    public HistoricoManun() {
    }

//    public HistoricoManun(
//            UUID historicoManunId,
//            LocalDate dataMaun,
//            TipoManun tipoManun,
//            String tecnicoResponsavel,
//            String servicoRealizado,
//            String obersavacoes,
//            UUID split
//    ) {
//        this.historicoManunId = historicoManunId;
//        this.dataManun = dataMaun;
//        this.tipoManun = tipoManun;
//        this.tecnicoResponsavel = tecnicoResponsavel;
//        this.servicoRealizado = servicoRealizado;
//        this.obersavacoes = obersavacoes;
//        split = split;
//    }


    public HistoricoManun(UUID historicoManunId,
                          LocalDate dataManun,
                          TipoManun tipoManun,
                          String tecnicoResponsavel,
                          String servicoRealizado,
                          String obersavacoes,
                          Splits split) {
        this.historicoManunId = historicoManunId;
        this.dataManun = dataManun;
        this.tipoManun = tipoManun;
        this.tecnicoResponsavel = tecnicoResponsavel;
        this.servicoRealizado = servicoRealizado;
        this.obersavacoes = obersavacoes;
        this.split = split;
    }

    public UUID getHistoricoManunId() {
        return historicoManunId;
    }

    public void setHistoricoManunId(UUID historicoManunId) {
        this.historicoManunId = historicoManunId;
    }

    public LocalDate getDataManun() {
        return dataManun;
    }

    public void setDataManun(LocalDate dataManun) {
        this.dataManun = dataManun;
    }

    public TipoManun getTipoManun() {
        return tipoManun;
    }

    public void setTipoManun(TipoManun tipoManun) {
        this.tipoManun = tipoManun;
    }

    public String getTecnicoResponsavel() {
        return tecnicoResponsavel;
    }

    public void setTecnicoResponsavel(String tecnicoResponsavel) {
        this.tecnicoResponsavel = tecnicoResponsavel;
    }

    public String getServicoRealizado() {
        return servicoRealizado;
    }

    public void setServicoRealizado(String servicoRealizado) {
        this.servicoRealizado = servicoRealizado;
    }

    public String getObersavacoes() {
        return obersavacoes;
    }

    public void setObersavacoes(String obersavacoes) {
        this.obersavacoes = obersavacoes;
    }

    public Splits getSplit() {
        return split;
    }

    public void setSplit(Splits split) {
        this.split = split;
    }
}