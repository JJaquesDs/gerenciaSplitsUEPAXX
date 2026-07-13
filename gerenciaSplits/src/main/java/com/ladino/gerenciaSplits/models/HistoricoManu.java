package com.ladino.gerenciaSplits.models;

import com.ladino.gerenciaSplits.models.Enums.TipoManu;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "Historico_manun")
public class HistoricoManu {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID historicoManuId;

    @Column(nullable = false)
    private LocalDate dataManu;

    //Transformando Enum em tipo String
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoManu tipoManu;

    @Column(nullable = false)
    private String tecnicoResponsavel;

    @Column(nullable = false)
    private String servicoRealizado;

    @Column(nullable = true)
    private String observacoes;

    @ManyToOne
    @JoinColumn(name = "split_id", nullable = false)
    private Splits split;

    // Construtores
    public HistoricoManu() {
    }


    public HistoricoManu(UUID historicoManuId,
                         LocalDate dataManu,
                         TipoManu tipoManu,
                         String tecnicoResponsavel,
                         String servicoRealizado,
                         String observacoes,
                         Splits split) {
        this.historicoManuId = historicoManuId;
        this.dataManu = dataManu;
        this.tipoManu = tipoManu;
        this.tecnicoResponsavel = tecnicoResponsavel;
        this.servicoRealizado = servicoRealizado;
        this.observacoes = observacoes;
        this.split = split;
    }

    public UUID getHistoricoManuId() {
        return historicoManuId;
    }

    public void setHistoricoManuId(UUID historicoManuId) {
        this.historicoManuId = historicoManuId;
    }

    public LocalDate getDataManu() {
        return dataManu;
    }

    public void setDataManu(LocalDate dataManu) {
        this.dataManu = dataManu;
    }

    public TipoManu getTipoManu() {
        return tipoManu;
    }

    public void setTipoManu(TipoManu tipoManu) {
        this.tipoManu = tipoManu;
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

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String obersavacoes) {
        this.observacoes = obersavacoes;
    }

    public Splits getSplit() {
        return split;
    }

    public void setSplit(Splits split) {
        this.split = split;
    }
}