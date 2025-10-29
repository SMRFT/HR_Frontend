import React, { useEffect, useRef, useState } from "react";

export default function SpeechRecognitionComponent() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize browser SpeechRecognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser 😢");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ". ";
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setTranscript((prev) => prev + finalTranscript);
      setInterimText(interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended.");
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleStart = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setListening(true);
      console.log("🎙️ Listening...");
    }
  };

  const handleStop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      console.log("🛑 Stopped listening");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto text-center">
      <h2 className="text-xl font-semibold mb-4">🎤 Speech Recognition (React)</h2>

      <div className="flex justify-center gap-3">
        <button
          onClick={handleStart}
          disabled={listening}
          className={`px-4 py-2 rounded text-white ${
            listening ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Start Listening
        </button>
        <button
          onClick={handleStop}
          disabled={!listening}
          className={`px-4 py-2 rounded text-white ${
            !listening ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          Stop
        </button>
      </div>

      <div className="mt-5 bg-gray-100 text-left rounded p-3 min-h-[150px] whitespace-pre-wrap">
        {transcript || interimText ? (
          <>
            <span>{transcript}</span>
            <span className="text-gray-400">{interimText}</span>
          </>
        ) : (
          <span className="text-gray-400 italic">Speak something...</span>
        )}
      </div>
    </div>
  );
}
