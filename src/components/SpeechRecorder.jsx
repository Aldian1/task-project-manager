import React, { useState, useEffect } from "react";
import { initialize, SessionManager, AvailableModels, DecodingOptionsBuilder } from "whisper-turbo";
import { Button, Box, Text } from "@chakra-ui/react";

const SpeechRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    const initWhisper = async () => {
      await initialize();
      const sessionManager = new SessionManager();
      const result = await sessionManager.loadModel(
        AvailableModels.WHISPER_TINY,
        () => console.log("Model loaded successfully"),
        (progress) => console.log(`Loading: ${progress}%`),
      );
      if (result.isOk()) {
        setSession(result.value);
      } else {
        console.error("Failed to load model:", result.error);
      }
    };
    initWhisper();
  }, []);

  const [session, setSession] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  const handleRecording = () => {
    if (isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event) => {
          setAudioChunks((prev) => [...prev, event.data]);
        };
        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          const arrayBuffer = await audioBlob.arrayBuffer();
          const audioData = new Uint8Array(arrayBuffer);
          const options = new DecodingOptionsBuilder().setTask("transcribe").build();
          session.transcribe(audioData, true, options, (segment) => {
            setTranscript((prev) => prev + segment.text);
          });
        };
        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      });
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
