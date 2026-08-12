package com.ladino.gerenciaSplits.reports;

import com.ladino.gerenciaSplits.dtos.responses.reports.SplitCadRepResponse;
import com.ladino.gerenciaSplits.infra.ExcelStyleHelper;
import com.ladino.gerenciaSplits.infra.ExcelUtills;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class SplitCadExcelGenerator {

    //Injeção de dependência de estilos padronizados Excel e utilitários
    private final ExcelStyleHelper styleHelper;

    private final ExcelUtills excelUtills;

    public SplitCadExcelGenerator(
            ExcelStyleHelper styleHelper,
            ExcelUtills excelUtills
            ){
        this.styleHelper = styleHelper;
        this.excelUtills = excelUtills;
    }


    private void criarCabecalho(Sheet sheet, CellStyle cabecalhoEstilo){

        // Criando planilha na segunda linha para não ficar colado
        Row linhaCabecalho = sheet.createRow(1);

        String[] colunas = {
                "LOCAL/SETOR", "MARCA", "CAPACIDADE", "RP",
                "DATA ENTRADA", "TEMPO DE USO(ANOS)", "PERÍODO MANUTENÇÃO"
        };

        // Percorrendo linhas e preenchendo células com valores e estilos
        for (int i = 0; i < colunas.length;  i++){

            Cell cell = linhaCabecalho.createCell(i);

            cell.setCellValue(colunas[i]);
            cell.setCellStyle(cabecalhoEstilo);
        }
    }

    /**
     * Calcula tempo de uso em anos completos.
     */
    private long calcularTempoUsoAnos(LocalDate dataEntrada) {
        if (dataEntrada == null) {
            return 0;
        }
        return ChronoUnit.YEARS.between(dataEntrada, LocalDate.now());
    }


    public void preencherDados(
            Sheet sheet,
            List<SplitCadRepResponse> dados,
            CellStyle textoStyle,
            CellStyle dataStyle,
            CellStyle numeroStyle
    ){

        // Começando após o cabeçalho (cabeçalho = linha 1)
        int rowNum = 2;

        for (SplitCadRepResponse split : dados){

            Row row = sheet.createRow(rowNum++);

            // Coluna 0 (LOCAL/SETOR)
            excelUtills.criarCelulaTexto(row, 0, split.nomeLocal(), textoStyle);

            // Coluna 1 (MARCA)
            excelUtills.criarCelulaTexto(row, 1, split.marca(), textoStyle);

            // Coluna 2 (CAPACIDADE)
            excelUtills.criarCelulaTexto(row, 2, split.capacidadeBtu(), textoStyle);

            // Coluna 3 (RP)
            excelUtills.criarCelulaTexto(row,3, split.rp(), textoStyle);

            // Coluna 4 (DATA ENTRADA)
            excelUtills.criarCelulaData(row, 4, split.dataEntrada(), dataStyle);

            // COLUNA 5 (TEMPO DE USO) calculando aqui
            long tempoUso = calcularTempoUsoAnos(split.dataEntrada());

            excelUtills.criarCelulaNumerica(row, 5, tempoUso, numeroStyle);

            // COLUNA 6 (PERÍODO MANUTENÇÃO)
            excelUtills.criarCelulaTexto(row, 6, split.periodoManutencao().toString(), textoStyle);
        }

    }

    /**
     * Método para gerar relatório
     * **/
    public byte[] gerar(List<SplitCadRepResponse> dados){

        // Criando workbook e sheet
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Cadastro Splits");

        // Estilos reutilizáveis
        CellStyle cabecalhoEstilo = styleHelper.criarEstiloCabecalho(workbook);
        CellStyle textoEstilo = styleHelper.criarEstiloTexto(workbook);
        CellStyle numeroEstilo = styleHelper.criarEstiloNumerico(workbook);
        CellStyle dataEstilo = styleHelper.criarEstiloData(workbook);

        // Criar cabeçalho
        criarCabecalho(sheet, cabecalhoEstilo);

        //preenchendo os dados
        preencherDados(sheet, dados, textoEstilo, dataEstilo, numeroEstilo);

        // Ajustando largura das colunas
        excelUtills.autoSizeColumns(sheet, 7);

        //retornar dados
        return excelUtills.workbookParaBytes(workbook);

    }

}
