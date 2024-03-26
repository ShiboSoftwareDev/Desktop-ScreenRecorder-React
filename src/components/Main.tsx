import { DesktopCapturerSource } from "electron";
import { useState, useRef, useCallback, useEffect } from "react";
import "../index.css";

export default function div() {
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
    const vidName: string[] =
      source.name.indexOf(" - ") > -1 ? source.name.split(" - ") : [];
    const sourceName =
      vidName.length > 0 ? vidName[vidName.length - 1] : source.name;
    setVideoBtnText(sourceName);
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
    <main className="w-screen h-screen flex flex-col p-10 items-center justify-center text-blue-900">
      <h1 className=" font-bold">{"Welcome to my app! ;)"}</h1>
      <div>
        <button
          disabled={startBtnState}
          onClick={handleStart}
          className={`w-28 border-2 ${
            startBtnState ? "border-blue-900" : "border-green-500"
          } ml-1`}
        >
          {startBtnText}
        </button>
        <button
          disabled={stopBtnState}
          onClick={() => {
            mediaRecorder.current.stop();
            setStartBtnText("Start");
            setStopBtnState(true);
          }}
          className={`w-28 border-2 ${
            stopBtnState ? "border-blue-900" : "border-red-500"
          } ml-1`}
        >
          Stop
        </button>
      </div>
      <button
        onClick={getVideoSources}
        className="w-[228px] ml-1 border-2 border-blue-900 my-1 overflow-hidden"
      >
        {videoBtnText}
      </button>
      <video
        ref={refVideo}
        autoPlay
        className="h-[50%] aspect-video border-t-2 border-b-2 border-blue-900"
      ></video>
      <p>
        {`This app was created using electronjs and vanilla javascript, now it has
        been refactored using react and tailwind. I can even destribute this on
        any os!`}
      </p>
    </main>
  );
}
