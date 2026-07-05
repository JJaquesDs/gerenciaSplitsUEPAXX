package com.ladino.gerenciaSplits.models.Enums;

public enum TipoManun {

    INSTALACAO("Instalação"),
    DESINSTALACAO("Desinstalação"),
    CORRETIVA("Corretiva"),
    PREVENTIVA("Preventiva"),
    INSTALACAO_PREVENTIVA("Instalação/Preventiva");

    private final String tipoManuntencao;

    // Construtor
    TipoManun(String tipoManuntencao) {
        this.tipoManuntencao = tipoManuntencao;
    }

    // Getter para puxar o enum específico
    public String getTipoManuntencao() {
        return tipoManuntencao;
    }

}
