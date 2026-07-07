package com.ladino.gerenciaSplits.models.Enums;

public enum PeriodoManutencao {
    /**
     * Período de Manutenção de meses de splits
     * **/

    MENSAL(1),
    BIMESTRAL(2),
    TRIMESTRAL(3),
    SEMESTRAL(6),
    ANUAL(12);

    private final int meses;

    //Construtor
    PeriodoManutencao(int meses){
        this.meses = meses;
    }

    //getter
    public int getMeses(){
        return meses;
    }


}
