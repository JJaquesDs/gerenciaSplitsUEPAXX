package com.ladino.gerenciaSplits.reports;

import com.ladino.gerenciaSplits.dtos.responses.reports.HisManUltRepResponse;
import com.ladino.gerenciaSplits.infra.ExcelStyleHelper;
import com.ladino.gerenciaSplits.infra.ExcelUtills;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.hibernate.cache.spi.entry.CacheEntry;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class HisManUltExcelGenerator {

    // Injeção de dependências para usar utilitários Excel
    private final ExcelUtills excelUtills;

    //  Injeção de dependência para usar estilos Excel pré-definidos
    private final ExcelStyleHelper excelStyleHelper;

    public HisManUltExcelGenerator(
            ExcelUtills excelUtills,
            ExcelStyleHelper excelStyleHelper
    ){
        this.excelUtills = excelUtills;
        this.excelStyleHelper = excelStyleHelper;
    }

    private void criarCabecalho(Sheet sheet, CellStyle cabecalhoEstilo){

        // Primeira linha não colada no topo da planilha
        Row linhaCabecalho = sheet.createRow(1);

        String[] colunas = {
                    "LOCAL/SETOR", "MARCA", "CAPACIDADE",
                    "RP", "DATA DA ÚLTIMA MANUTENÇÃO",
                    "TEMPO SEM MANUTENÇÃO (EM MESES)", "OBSERVAÇÕES"
        };

        // Percorrendoo a linha para preencher as colunas
        for (int i = 0; i < colunas.length; i++){

            Cell cell = linhaCabecalho.createCell(i);

            cell.setCellValue(colunas[i]);
            cell.setCellStyle(cabecalhoEstilo);
        }

    }

    /**
     * Calculando tempo sem manutenção
     * **/
    private long calcularTempoSemManu(LocalDate dataUltimaManu){

        if (dataUltimaManu == null){
            return 0;
        }
        return ChronoUnit.MONTHS.between(dataUltimaManu, LocalDate.now());
    }

    private void preencherDados(
            Sheet sheet,
            List<HisManUltRepResponse> dados,
            CellStyle textoStyle,
            CellStyle dataStyle,
            CellStyle numeroStyle
    ){

        // Começando após o cabeçalho na linha 1
        int rowNum = 2;

        for (HisManUltRepResponse hisManUlt : dados){

            Row row = sheet.createRow(rowNum++);

            // Coluna 0 (LOCAL/SETOR)
            excelUtills.criarCelulaTexto(row, 0, hisManUlt.nomeLocal(), dataStyle);

            // Coluna 1 (MARCA)
            excelUtills.criarCelulaTexto(row, 1, hisManUlt.marca(), textoStyle);

            // Coluna 2 (CAPACIDADE)
            excelUtills.criarCelulaTexto(row, 2, hisManUlt.capacidadeBtu(), textoStyle);

            // Coluna 3 (RP)
            excelUtills.criarCelulaTexto(row, 3, hisManUlt.rp(), textoStyle);

            // Coluna 4 (DATA DA ULTIMA MANUTENÇÃO)
            excelUtills.criarCelulaData(row, 4, hisManUlt.dataUltimaMan(), dataStyle);

            // Coluna 5 (TEMPO SEM MANUTENÇÃO)
            long tempoSemManu = calcularTempoSemManu(hisManUlt.dataUltimaMan());
            excelUtills.criarCelulaNumerica(row, 5, tempoSemManu, numeroStyle);

            // COLUNA 6 (OBSERVAÇÕES)
            excelUtills.criarCelulaTexto(row, 6, hisManUlt.observacoes(), textoStyle);

        }

    }

    public byte[] gerar(List<HisManUltRepResponse> dados){

        //Criando workbook e sheet
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Manutenção");

        // Estilos reutilizáveis
        CellStyle cabecalhoEstilo = excelStyleHelper.criarEstiloCabecalho(workbook);
        CellStyle textoEstilo = excelStyleHelper.criarEstiloTexto(workbook);
        CellStyle dataEstilo = excelStyleHelper.criarEstiloData(workbook);
        CellStyle numeroEstilo = excelStyleHelper.criarEstiloNumerico(workbook);

        // Criando cabeçalho
        criarCabecalho(sheet, cabecalhoEstilo);

        // Preencher dados
        preencherDados(sheet, dados, textoEstilo, dataEstilo, numeroEstilo);

        // Ajustando tamanho das colunas
        excelUtills.autoSizeColumns(sheet, 7);


        return excelUtills.workbookParaBytes(workbook);
    }
}


