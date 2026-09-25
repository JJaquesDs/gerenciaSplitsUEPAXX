package com.ladino.gerenciaSplits.models.Enums;

public enum TipoManu {

    INSTALACAO("Instalação"),
    DESINSTALACAO("Desinstalação"),
    CORRETIVA("Corretiva"),

    CORRETIVA_PREVENTIVA("Corretiva/Preventiva"),
    PREVENTIVA("Preventiva"),
    INSTALACAO_PREVENTIVA("Instalação/Preventiva");

    private final String tipoManuntencao;

    // Construtor
    TipoManu(String tipoManuntencao) {
        this.tipoManuntencao = tipoManuntencao;
    }

    // Getter para puxar o enum específico
    public String getTipoManuntencao() {
        return tipoManuntencao;
    }

}
