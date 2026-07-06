package com.ladino.gerenciaSplits.models;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "Splits")
public class Splits {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID SplitId;

    @Column(unique = true)
    private String rp;

    private String marca;

    private String capacidadeBtu;

    private LocalDate dataEntrada;

    private String periodoManMes;

    @ManyToOne
    @JoinColumn(name = "local_id")
    private Local local;

    @OneToMany(mappedBy = "split")
    private List<HistoricoManun> historicoManuns;

    // Construtor sem Argumentos
    public Splits() {
    }

    // Construtor com todos argumentos
    public Splits(
            UUID splitId,
            String rp,
            String marca,
            String capacidadeBtu,
            LocalDate dataEntrada,
            String periodoManMes,
            Local local,
            List<HistoricoManun> historicoManuns
    ) {
        SplitId = splitId;
        this.rp = rp;
        this.marca = marca;
        this.capacidadeBtu = capacidadeBtu;
        this.dataEntrada = dataEntrada;
        this.periodoManMes = periodoManMes;
        this.local = local;
        this.historicoManuns = historicoManuns;
    }

    // Getters e Setters
    public UUID getSplitId() {
        return SplitId;
    }

    public void setSplitId(UUID splitId) {
        SplitId = splitId;
    }

    public String getRp() {
        return rp;
    }

    public void setRp(String rp) {
        this.rp = rp;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getCapacidadeBtu() {
        return capacidadeBtu;
    }

    public void setCapacidadeBtu(String capacidadeBtu) {
        this.capacidadeBtu = capacidadeBtu;
    }

    public LocalDate getDataEntrada() {
        return dataEntrada;
    }

    public void setDataEntrada(LocalDate dataEntrada) {
        this.dataEntrada = dataEntrada;
    }

    public String getPeriodoManMes() {
        return periodoManMes;
    }

    public void setPeriodoManMes(String periodoManMes) {
        this.periodoManMes = periodoManMes;
    }

    public Local getLocal() {
        return local;
    }

    public void setLocal(Local local) {
        this.local = local;
    }

    public List<HistoricoManun> getHistoricoManuns() {
        return historicoManuns;
    }

    public void setHistoricoManuns(List<HistoricoManun> historicoManuns) {
        this.historicoManuns = historicoManuns;
    }
}