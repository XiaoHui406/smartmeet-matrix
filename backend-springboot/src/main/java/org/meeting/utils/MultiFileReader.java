package org.meeting.utils;

import com.baidu.aip.ocr.AipOcr;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Scanner;

public class MultiFileReader {

    public static String readDocxFromUrl(String urlStr) {
        StringBuilder text = new StringBuilder();
        try (InputStream is = new URL(urlStr).openStream();
             XWPFDocument document = new XWPFDocument(is)) {
            List<XWPFParagraph> paragraphs = document.getParagraphs();
            for (XWPFParagraph paragraph : paragraphs) {
                text.append(paragraph.getText()).append("\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return text.toString();
    }

    public static String readPdfFromUrl(String urlStr) {
        StringBuilder text = new StringBuilder();
        try (InputStream is = new URL(urlStr).openStream();
             PDDocument document = PDDocument.load(is)) {
            PDFTextStripper stripper = new PDFTextStripper();
            text.append(stripper.getText(document));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return text.toString();
    }

    public static String readTxtFromUrl(String urlStr) {
        StringBuilder text = new StringBuilder();
        try (InputStream is = new URL(urlStr).openStream();
             Scanner scanner = new Scanner(is)) {
            while (scanner.hasNextLine()) {
                text.append(scanner.nextLine()).append("\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return text.toString();
    }

    public static String readXlsxFromUrl(String urlStr) {
        StringBuilder text = new StringBuilder();
        try (InputStream is = new URL(urlStr).openStream();
             Workbook workbook = new XSSFWorkbook(is)) {
            for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                Sheet sheet = workbook.getSheetAt(i);
                for (Row row : sheet) {
                    for (Cell cell : row) {
                        text.append(cell.toString()).append("\t");
                    }
                    text.append("\n");
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return text.toString();
    }

    public static String readImageFromUrl(String urlStr, String appId, String apiKey, String secretKey) {
        try {
            URL url = new URL(urlStr);
            File tempFile = File.createTempFile("temp", ".jpg");
            try (InputStream in = url.openStream()) {
                Files.copy(in, tempFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
            }

            AipOcr client = new AipOcr(appId, apiKey, secretKey);
            JSONObject res = client.basicGeneral(tempFile.getAbsolutePath(), new java.util.HashMap<>());
            JSONArray wordsResult = res.getJSONArray("words_result");
            StringBuilder text = new StringBuilder();
            for (int i = 0; i < wordsResult.length(); i++) {
                JSONObject item = wordsResult.getJSONObject(i);
                text.append(item.getString("words")).append("\n");
            }
            tempFile.delete();
            return text.toString();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }

    public static String readFileFromUrl(String urlStr, String appId, String apiKey, String secretKey) {
        if (urlStr.endsWith(".docx")) {
            return readDocxFromUrl(urlStr);
        } else if (urlStr.endsWith(".pdf")) {
            return readPdfFromUrl(urlStr);
        } else if (urlStr.endsWith(".txt")) {
            return readTxtFromUrl(urlStr);
        } else if (urlStr.endsWith(".xlsx")) {
            return readXlsxFromUrl(urlStr);
        } else if (urlStr.endsWith(".jpg") || urlStr.endsWith(".png")) {
            return readImageFromUrl(urlStr, appId, apiKey, secretKey);
        } else {
            System.out.println("不支持的文件类型，仅支持 .docx、.pdf、.txt、.xlsx、.jpg 和 .png 文件。");
            return null;
        }
    }
}    