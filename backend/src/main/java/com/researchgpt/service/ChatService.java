package com.researchgpt.service;

import com.researchgpt.dto.ChatResponse;
import com.researchgpt.dto.RetrievedChunkResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private static final int TOP_K = 5;

    private final RetrievalService retrievalService;
    private final PromptBuilder promptBuilder;
    private final ChatModel chatModel;

    public ChatResponse answerQuestion(String question) {

        List<RetrievedChunkResponse> retrievedChunks = retrievalService.retrieveTopChunks(question);

        String finalPrompt = promptBuilder.buildPrompt(question, retrievedChunks);

        String answer = chatModel.call(new Prompt(finalPrompt))
        .getResult()
        .getOutput()
        .getText();

        return new ChatResponse(answer, retrievedChunks);
    }
}