package com.ladino.gerenciaSplits.models;

import com.ladino.gerenciaSplits.models.Enums.StatusDefeito;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "defeitos")
public class Defeito {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID defeitoId;

    @Column(nullable = false)
    private LocalDate dataRegistro;

    @Column(nullable = false, length = 1000)
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusDefeito status;

    @Column(length = 2000)
    private String observacoes;

    @ManyToOne
    @JoinColumn(name = "split_id", nullable = false)
    private Splits split;

    public Defeito() {
    }

    public UUID getDefeitoId() {
        return defeitoId;
    }

    public LocalDate getDataRegistro() {
        return dataRegistro;
    }

    public void setDataRegistro(LocalDate dataRegistro) {
        this.dataRegistro = dataRegistro;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public StatusDefeito getStatus() {
        return status;
    }

    public void setStatus(StatusDefeito status) {
        this.status = status;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public Splits getSplit() {
        return split;
    }

    public void setSplit(Splits split) {
        this.split = split;
    }
}
