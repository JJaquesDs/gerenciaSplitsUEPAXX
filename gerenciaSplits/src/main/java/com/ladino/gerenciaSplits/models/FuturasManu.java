package com.ladino.gerenciaSplits.models;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "futuras_manu")
public class FuturasManu {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID futurasManuId;

    private LocalDate dataProxManu;

    @OneToOne
    @JoinColumn(name = "split_id", nullable = false)
    private Splits split;

    public FuturasManu() {
    }

    public FuturasManu(
            LocalDate dataProxManu,
            Splits split
    ) {
        this.dataProxManu = dataProxManu;
        this.split = split;
    }

    public UUID getFuturasManuId() {
        return futurasManuId;
    }

    public void setFuturasManuId(UUID futurasManuId) {
        this.futurasManuId = futurasManuId;
    }

    public LocalDate getDataProxManu() {
        return dataProxManu;
    }

    public void setDataProxManu(LocalDate dataProxManun) {
        this.dataProxManu = dataProxManun;
    }

    public Splits getSplit() {
        return split;
    }

    public void setSplit(Splits split) {
        this.split = split;
    }
}
