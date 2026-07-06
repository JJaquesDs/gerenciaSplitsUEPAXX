package com.ladino.gerenciaSplits.models;

import jakarta.persistence.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "Locais")
public class Local {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID LocaiId;

    @Column(nullable = false)
    private String nomeLocal;

    @OneToMany(mappedBy = "local")
    private List<Splits> splits;

    public Local() {
    }

    // Construtor
    public Local(UUID locaiId, String nomeLocal, List<Splits> splits) {
        LocaiId = locaiId;
        this.nomeLocal = nomeLocal;
        this.splits = splits;
    }

    // Getters e Setters
    public UUID getLocaiId() {
        return LocaiId;
    }

    public void setLocaiId(UUID locaiId) {
        LocaiId = locaiId;
    }

    public String getNomeLocal() {
        return nomeLocal;
    }

    public void setNomeLocal(String nomeLocal) {
        this.nomeLocal = nomeLocal;
    }

    public List<Splits> getSplits() {
        return splits;
    }

    public void setSplits(List<Splits> splits) {
        this.splits = splits;
    }
}
