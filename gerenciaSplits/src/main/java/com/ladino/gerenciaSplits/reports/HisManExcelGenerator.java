package com.ladino.gerenciaSplits.reports;

import com.ladino.gerenciaSplits.dtos.responses.reports.HisManRepResponse;
import com.ladino.gerenciaSplits.infra.ExcelStyleHelper;
import com.ladino.gerenciaSplits.infra.ExcelUtills;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class HisManExcelGenerator {

    // Injeção de dependências de estilos padronizados Excel e utilitários
    private final ExcelStyleHelper excelStyleHelper;

    private final ExcelUtills excelUtills;

    public HisManExcelGenerator(
            ExcelStyleHelper styleHelper,
            ExcelUtills excelUtills
    ){
        this.excelStyleHelper = styleHelper;
        this.excelUtills = excelUtills;
    }

    public void criarCabecalho(Sheet sheet, CellStyle cabecalhoEstilo){

        // Criando planilha na primeira linha para não ficar colado
        Row linhaCabecalho = sheet.createRow(1);

        String [] colunas = {
                "DATA", "LOCAL/SETOR", "RP", "TIPO MANUTENÇÃO",
                "TÉCNICO RESPONSÁVEL", "SERVIÇOS REALIZADOS", "OBSERVAÇÕES"
        };

        // Preenchendo linhas e células comm valores e estilos
        for (int i = 0; i < colunas.length; i++){

            Cell celula = linhaCabecalho.createCell(i);

            celula.setCellValue(colunas[i]);
            celula.setCellStyle(cabecalhoEstilo);
        }
    }

    public void preencherDados(
            Sheet sheet,
            List<HisManRepResponse> dados,
            CellStyle textoStyle,
            CellStyle dataStyle
    ){

        // Começando após o cabeçalho(primeira linha)
        int rowNum = 2;

        for (HisManRepResponse hisManu : dados){

            Row row = sheet.createRow(rowNum++);

            // Coluna 0 (DATA)
            excelUtills.criarCelulaData(row, 0, hisManu.dataManu(), dataStyle);

            // Coluna 1 (LOCAL/SETOR)
            excelUtills.criarCelulaTexto(row, 1, hisManu.nomeLocal(), textoStyle);

            // Coluna 2 (RP)
            excelUtills.criarCelulaTexto(row, 2, hisManu.rp(), textoStyle);

            // Coluna 3 (TIPO MANUTENÇÂO)
            excelUtills.criarCelulaTexto(row, 3, hisManu.tipoManu().toString(), textoStyle);

            // Coluna 4 (TÉCNICO RESPONSÁVEL)
            excelUtills.criarCelulaTexto(row, 4, hisManu.tecnicoResponsavel(), textoStyle);

            // Coluna 5 (SERVIÇOS REALIZADOS)
            excelUtills.criarCelulaTexto(row, 5, hisManu.servicoRealizado(), textoStyle);

            // Coluna 6 (OBSERSVAÇÕES)
            excelUtills.criarCelulaTexto(row, 6, hisManu.observacoes(), textoStyle);

        }

    }

    public byte[] gerar(List<HisManRepResponse> dados){

        // Criando workbook e sheet
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Historico-Descrição");

        // Estilos reutilizáveis
        CellStyle cabecalhoEstilo = excelStyleHelper.criarEstiloCabecalho(workbook);
        CellStyle textoEstilo = excelStyleHelper.criarEstiloTexto(workbook);
        CellStyle dataEstilo = excelStyleHelper.criarEstiloData(workbook);

        // Criando cabeçalho
        criarCabecalho(sheet, cabecalhoEstilo);

        // Preenchendo dados
        preencherDados(sheet, dados, textoEstilo, dataEstilo);

        // Ajustando largura das colunas
        excelUtills.autoSizeColumns(sheet, 7);

        return excelUtills.workbookParaBytes(workbook);

    }

}
