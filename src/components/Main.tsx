import { DesktopCapturerSource } from "electron";
import { useState, useRef, useCallback, useEffect } from "react";

export default function Main() {
  const [startBtnText, setStartBtnText] = useState("Start");
  const [stopBtnState, setStopBtnState] = useState(true);
  const [startBtnState, setStartBtnState] = useState(true);
  const [videoBtnText, setVideoBtnText] = useState("Choose a Video Source");
  const [streams, setStreams] = useState(null);
  const mediaRecorder = useRef<MediaRecorder>();
  const recordedChunks = useRef([]);

  const refVideo = useCallback(
    (node: null | HTMLMediaElement) => {
      if (node) node.srcObject = streams;
    },
    [streams]
  );

  useEffect(() => {
    window.electronAPI.sourceSelected((value: DesktopCapturerSource) => {
      selectSource(value);
    });
    return () => {
      window.electronAPI.clearListeners();
    };
  });

  function handleDataAvailable(e: BlobEvent) {
    recordedChunks.current.push(e.data);
  }

  const handleStart = () => {
    mediaRecorder.current.start();
    setStartBtnText("Recording");
    setStopBtnState(false);
  };

  async function handleStop() {
    const blob = new Blob(recordedChunks.current, {
      type: "video/webm; codecs=vp9",
    });
    const buffer = await blob.arrayBuffer();
    recordedChunks.current = [];
    window.electronAPI.sendStream(buffer);
  }

  async function getVideoSources() {
    await window.electronAPI.videoSelectBtnClicked();
  }

  async function selectSource(source: DesktopCapturerSource) {
    setVideoBtnText(source.name);
    setStartBtnState(false);
    const constraints: object = {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: source.id,
        },
      },
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    setStreams(stream);

    const options = { mimeType: "video/webm; codecs=vp9" };
    const media = new MediaRecorder(stream, options);
    mediaRecorder.current = media;

    mediaRecorder.current.ondataavailable = handleDataAvailable;
    mediaRecorder.current.onstop = handleStop;
  }

  return (
    <main>
      <h1>Welcome to my app, sucker!</h1>

      <div>
        <button id="startBtn" disabled={startBtnState} onClick={handleStart}>
          {startBtnText}
        </button>
        <button
          id="stopBtn"
          disabled={stopBtnState}
          onClick={() => {
            mediaRecorder.current.stop();
            setStartBtnText("Start");
            setStopBtnState(true);
          }}
        >
          Stop
        </button>
      </div>
      <button id="videoSelectBtn" onClick={getVideoSources}>
        {videoBtnText}
      </button>

      <video ref={refVideo} autoPlay></video>

      <p>
        This is an app created using electronjs and vanilla javascript, it can
        still be better but at least it works. I can even sell this on any os!
        Also check the tray icon O.o
      </p>
    </main>
  );
}
