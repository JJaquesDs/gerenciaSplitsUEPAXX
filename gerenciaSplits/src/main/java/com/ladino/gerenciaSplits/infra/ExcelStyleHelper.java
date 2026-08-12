package com.ladino.gerenciaSplits.infra;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.DefaultIndexedColorMap;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.springframework.stereotype.Component;

/**
 *  Helper para criação de estilos reutilizáveis em planilhas Excel.
 *  Centraliza a formatação para manter consistência entre relatórios.
 * **/
@Component
public class ExcelStyleHelper {

    public CellStyle criarEstiloCabecalho(Workbook workbook){
        CellStyle style = workbook.createCellStyle();

        // Fonte do cabeçalho em negrito
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 10);
        font.setFontName("Calibri");
        style.setFont(font);

        // Fundo

        XSSFColor corFundo = new XSSFColor(
                new java.awt.Color(217, 225, 242),
                new DefaultIndexedColorMap()
        );

        style.setFillForegroundColor(corFundo);
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        //Bordas
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);

        // Alinhamento Centralizado
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);

        return style;

    }

    public CellStyle criarEstiloTexto(Workbook workbook){
        CellStyle style = workbook.createCellStyle();

        // Fonte padrão
        Font font = workbook.createFont();
        font.setFontHeightInPoints((short) 10);
        font.setFontName("Calibri");
        style.setFont(font);

        //Bordas
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);

        //Alinhamento á esquerda
        style.setAlignment(HorizontalAlignment.LEFT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);

        return style;
    }


    /**
     * Cria estilo de data padrão brasileiro: DD/MM/YY
     * **/
    public CellStyle criarEstiloData(Workbook workbook){

        CellStyle style = workbook.createCellStyle();

        // Fonte padrão
        Font font = workbook.createFont();
        font.setFontHeightInPoints((short) 10);
        font.setFontName("Calibri");
        style.setFont(font);

        // Formato data brasileira
        CreationHelper creationHelper = workbook.getCreationHelper();
        style.setDataFormat(creationHelper.createDataFormat().getFormat(
                "dd//MM/yy"
        ));

        //Bordas
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);

        //Alinhamento centralizado
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);

        return style;

    }

    /**
     * Cria estilo de células numéricas sem números decimais
     * **/
    public CellStyle criarEstiloNumerico(Workbook workbook){

        CellStyle style = workbook.createCellStyle();

        // Fonte padrão
        Font font = workbook.createFont();
        font.setFontHeightInPoints((short) 10);
        font.setFontName("Calibri");
        style.setFont(font);

        // Formato numérico
        CreationHelper creationHelper = workbook.getCreationHelper();
        style.setDataFormat(creationHelper.createDataFormat().getFormat("0"));

        //Bordas
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);

        //Alinhamento centralizado
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);

        return style;
    }

    /**
     * Cria formatação para texto longo como quebra de linha, por exemplo:
     * na coluna "Observações"
     * **/
    public CellStyle criarEstiloTextoLongo(Workbook workbook){

        CellStyle style = workbook.createCellStyle();

        // Fonte padrão
        Font font = workbook.createFont();
        font.setFontHeightInPoints((short) 10);
        font.setFontName("Calibri");
        style.setFont(font);

        //Bordas
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);

        // Quebra de linha automática
        style.setWrapText(true);

        //Alinhamento centralizado
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);

        return style;
    }


}
