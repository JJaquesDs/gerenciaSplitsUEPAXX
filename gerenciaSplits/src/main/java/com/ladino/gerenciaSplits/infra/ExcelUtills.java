package com.ladino.gerenciaSplits.infra;

import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;

@Component
public class ExcelUtills {

    public void criarCelulaTexto(
            Row row,
            int colIndex,
            String texto,
            CellStyle style
    ){
        if (texto == null){
            return; // Célula vazia
        }

        Cell cell = row.createCell(colIndex);
        cell.setCellValue(texto);
        cell.setCellStyle(style);
    }


    // Criar células de data
    public void criarCelulaData(
            Row row,
            int colIndex,
            LocalDate date,
            CellStyle style
    ){
        if (date == null){
            return;  // Célula vazia
        }

        Cell cell = row.createCell(colIndex);
        cell.setCellValue(date);
        cell.setCellStyle(style);
    }

    // Cria células numéricas
    public void criarCelulaNumerica(
            Row row,
            int conIndex,
            Number valor,
            CellStyle style
    ){
        if (valor == null){
            return;  // retorna vazio
        }

        Cell cell = row.createCell(conIndex);
        cell.setCellValue(valor.doubleValue());
        cell.setCellStyle(style);
    }

    /**
     * Converte Workbook para array de bytes.
     */
    public byte[] workbookParaBytes(Workbook workbook) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            workbook.write(outputStream);
            workbook.close();
            return outputStream.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("Erro ao converter workbook para bytes", e);
        }
    }

    /**
     * Ajusta automaticamente a largura de todas as colunas.
     *
     * Limita a largura máxima para evitar colunas excessivamente largas.
     */
    public void autoSizeColumns(Sheet sheet, int numberOfColumns) {
        for (int i = 0; i < numberOfColumns; i++) {
            sheet.autoSizeColumn(i);

            // Limitar largura máxima (caracteres * 256)
            int currentWidth = sheet.getColumnWidth(i);
            int maxWidth = 60 * 256; // 60 caracteres

            if (currentWidth > maxWidth) {
                sheet.setColumnWidth(i, maxWidth);
            }
        }
    }


}
