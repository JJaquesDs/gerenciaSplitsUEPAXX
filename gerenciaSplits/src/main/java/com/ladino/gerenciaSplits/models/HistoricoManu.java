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
    private UUID historicoManunId;

    @Column(nullable = false)
    private LocalDate dataManun;

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


    public HistoricoManu(UUID historicoManunId,
                         LocalDate dataManun,
                         TipoManu tipoManu,
                         String tecnicoResponsavel,
                         String servicoRealizado,
                         String observacoes,
                         Splits split) {
        this.historicoManunId = historicoManunId;
        this.dataManun = dataManun;
        this.tipoManu = tipoManu;
        this.tecnicoResponsavel = tecnicoResponsavel;
        this.servicoRealizado = servicoRealizado;
        this.observacoes = observacoes;
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