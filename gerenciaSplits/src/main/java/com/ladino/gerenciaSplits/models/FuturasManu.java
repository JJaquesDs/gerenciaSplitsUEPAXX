package com.ladino.gerenciaSplits.models;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "Faturas_manun")
public class FuturasManu {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID futurasManunId;

    private LocalDate dataProxManun;

    @OneToOne
    @JoinColumn(name = "split_id", nullable = false)
    private Splits split;

    public FuturasManu() {
    }

    public FuturasManu(
            UUID futurasManunId,
            LocalDate dataProxManun,
            Splits split
    ) {
        this.futurasManunId = futurasManunId;
        this.dataProxManun = dataProxManun;
        this.split = split;
    }

    public UUID getFuturasManunId() {
        return futurasManunId;
    }

    public void setFuturasManunId(UUID futurasManunId) {
        this.futurasManunId = futurasManunId;
    }

    public LocalDate getDataProxManun() {
        return dataProxManun;
    }

    public void setDataProxManun(LocalDate dataProxManun) {
        this.dataProxManun = dataProxManun;
    }

    public Splits getSplit() {
        return split;
    }

    public void setSplit(Splits split) {
        this.split = split;
    }
}
