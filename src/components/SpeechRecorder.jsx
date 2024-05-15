import React, { useState } from "react";
import { Button, Box, Text } from "@chakra-ui/react";

const SpeechRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  const handleRecording = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + event.results[i][0].transcript);
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  return (
    <Box mt={4}>
      <Button onClick={handleRecording} colorScheme={isRecording ? "red" : "green"}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      <Text mt={2}>{transcript}</Text>
    </Box>
  );
};

export default SpeechRecorder;
