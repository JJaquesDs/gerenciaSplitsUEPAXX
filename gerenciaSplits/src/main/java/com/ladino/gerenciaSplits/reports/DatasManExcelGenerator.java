package com.ladino.gerenciaSplits.reports;

import com.ladino.gerenciaSplits.dtos.responses.reports.DatasManRepResponse;
import com.ladino.gerenciaSplits.infra.ExcelStyleHelper;
import com.ladino.gerenciaSplits.infra.ExcelUtills;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DatasManExcelGenerator {

    // Injeção de dependências
    private final ExcelStyleHelper styleHelper;

    private final ExcelUtills excelUtills;

    // Construtor
    public DatasManExcelGenerator(
            ExcelStyleHelper styleHelper,
            ExcelUtills excelUtills
    ){
        this.styleHelper = styleHelper;
        this.excelUtills = excelUtills;
    }




    public void preencherDados(
            Sheet sheet,
            List<DatasManRepResponse> dados,
            CellStyle textoStyle,
            CellStyle dataStyle
    ){

        // Estilo reutilizacel
        CellStyle cabecalhoEstilo = styleHelper.criarEstiloCabecalho(sheet.getWorkbook());

        // Pegando o máximo de datas de manutenções para gerar colunas dinâmicas
        int maxManutencoes = dados.stream()
                .mapToInt(dto -> dto.datasManu().size())
                .max()
                .orElse(0);

        // Criando cabeçalho dinâmico (linha 2 para nao ficar colado)
        Row linhaCabecalho = sheet.createRow(1);

        //--------------------------------------------------------------------------------------------
        //  Criando células de forma manual para usar dinamicidade
        //--------------------------------------------------------------------------------------------
        // Linha 1, coluna 0 (SETOR/LOCAL)
        excelUtills.criarCelulaTexto(linhaCabecalho, 0, "SETOR/LOCAL", cabecalhoEstilo);

        // Linha 1, coluna 1 (MARCA)
        excelUtills.criarCelulaTexto(linhaCabecalho, 1, "MARCA", cabecalhoEstilo);

        // Linha 1, coluna 2 (CAPACIDADE)
        excelUtills.criarCelulaTexto(linhaCabecalho, 2, "CAPACIDADE", cabecalhoEstilo);

        // Linha 1, coluna 3 (RP)
        excelUtills.criarCelulaTexto(linhaCabecalho, 3, "RP", cabecalhoEstilo);

        // Usando um for para preencher a linha do cabeçalho dinamicamente conforme o máimo de manutenções
        for (int i = 0; i < maxManutencoes; i++){
            excelUtills.criarCelulaTexto(linhaCabecalho, 4 + i, "DATA DA MANUTENÇÃO", cabecalhoEstilo);
        }

        // começando a preencher após o cabeçalho
        int rowNum = 2;

        for (DatasManRepResponse datasMan : dados){

            Row row = sheet.createRow(rowNum++);

            // Coluna 0 (LOCAL/SETOR)
            excelUtills.criarCelulaTexto(row, 0, datasMan.nomeLocal(), textoStyle);

            // Coluna 1 (MARCA)
            excelUtills.criarCelulaTexto(row, 1, datasMan.marca(), textoStyle);

            // Coluna 2 (CAPACIDADE)
            excelUtills.criarCelulaTexto(row, 2, datasMan.capacidadeBtu(), textoStyle);

            // Coluna 3 (RP)
            excelUtills.criarCelulaTexto(row, 3, datasMan.rp(), textoStyle);

            // Coluna 4 (DATA DA MANUTENÇÃO)
            // Dinâmica, pois só preencher splits que contém essa informação
            // Demais splits que não contém, deixa a célula vazia
            List<LocalDate> datas = datasMan.datasManu();
            for (int i = 0; i < datas.size(); i++) {
                excelUtills.criarCelulaData(row, 4 + i, datas.get(i), dataStyle);
            }


            // ajusta as larguras dinâmicamente
            for (int i = 0; i < 4 + maxManutencoes; i++){
                sheet.autoSizeColumn(i);
            }

        }



    }

    public byte[] gerar(List<DatasManRepResponse> dados){

        // Criando workbook e sheet
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Histórico-Últimas-Manutenções");

        // Estilos reutilizaveis
        CellStyle textoEstilo = styleHelper.criarEstiloTexto(workbook);
        CellStyle dataEstilo = styleHelper.criarEstiloData(workbook);

        preencherDados(sheet, dados, textoEstilo, dataEstilo);

        return excelUtills.workbookParaBytes(workbook);
    }



}
