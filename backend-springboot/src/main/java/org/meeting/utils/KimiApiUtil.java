package org.meeting.utils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class KimiApiUtil {
    private static final String API_URL = "https://api.moonshot.cn/v1/chat/completions";
    private final String apiKey;

    public KimiApiUtil(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getCompletion(String model, String systemMessage, String userMessage, double temperature) throws JSONException {
        HttpClient client = HttpClient.newHttpClient();
        JSONObject requestBody = new JSONObject();
        requestBody.put("model", model);

        JSONArray messages = new JSONArray();
        JSONObject systemMessageObj = new JSONObject();
        systemMessageObj.put("role", "system");
        systemMessageObj.put("content", systemMessage);
        messages.put(systemMessageObj);

        JSONObject userMessageObj = new JSONObject();
        userMessageObj.put("role", "user");
        userMessageObj.put("content", userMessage);
        messages.put(userMessageObj);

        requestBody.put("messages", messages);
        requestBody.put("temperature", temperature);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(API_URL))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(requestBody.toString()))
                .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                JSONObject responseJson = new JSONObject(response.body());
                JSONArray choices = responseJson.getJSONArray("choices");
                if (choices.length() > 0) {
                    return choices.getJSONObject(0).getJSONObject("message").getString("content");
                }
            }
        } catch (IOException | InterruptedException | JSONException e) {
            e.printStackTrace();
        }
        return null;
    }
}