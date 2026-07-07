package com.ladino.gerenciaSplits.models;

import com.ladino.gerenciaSplits.models.Enums.PeriodoManutencao;
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

    @Column(unique = true, nullable = false)
    private String rp;

    @Column(nullable = false)
    private String marca;

    @Column(nullable = false)
    private String capacidadeBtu;

    @Column(nullable = false)
    private LocalDate dataEntrada;

    @Enumerated(EnumType.STRING)  // Tipo string para enum
    @Column(nullable = false)
    private PeriodoManutencao periodoManMes;

    @ManyToOne
    @JoinColumn(name = "local_id", nullable = false)
    private Local local;

    @OneToMany(mappedBy = "split")
    private List<HistoricoManu> historicoManu;

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
            PeriodoManutencao periodoManMes,
            Local local,
            List<HistoricoManu> historicoManu
    ) {
        SplitId = splitId;
        this.rp = rp;
        this.marca = marca;
        this.capacidadeBtu = capacidadeBtu;
        this.dataEntrada = dataEntrada;
        this.periodoManMes = periodoManMes;
        this.local = local;
        this.historicoManu = historicoManu;
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

    public PeriodoManutencao getPeriodoManMes() {
        return periodoManMes;
    }

    public void setPeriodoManMes(PeriodoManutencao periodoManMes) {
        this.periodoManMes = periodoManMes;
    }

    public Local getLocal() {
        return local;
    }

    public void setLocal(Local local) {
        this.local = local;
    }

    public List<HistoricoManu> getHistoricoManuns() {
        return historicoManu;
    }

    public void setHistoricoManuns(List<HistoricoManu> historicoManu) {
        this.historicoManu = historicoManu;
    }
}