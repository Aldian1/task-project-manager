import React, { useState } from "react";
import { Button, Box, Text } from "@chakra-ui/react";

const SpeechRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  const handleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setTranscript("Transcribed text will appear here.");
    } else {
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
