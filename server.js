const express = require("express");
const { spawn } = require("child_process");
const app = express();

let ffmpegProcess = null;

function startStream() {
  const videoUrl = process.env.VIDEO_URL;
  const streamKey = process.env.STREAM_KEY;

  if (!videoUrl || !streamKey) {
    console.log("Missing VIDEO_URL or STREAM_KEY env vars");
    return;
  }

  const args = [
    "-stream_loop", "-1",
    "-re",
    "-i", videoUrl,
    "-c", "copy",
    "-f", "flv",
    `rtmp://a.rtmp.youtube.com/live2/${streamKey}`
  ];

  ffmpegProcess = spawn("ffmpeg", args);

  ffmpegProcess.stderr.on("data", (data) => console.log(data.toString()));
  ffmpegProcess.on("close", (code) => {
    console.log(`ffmpeg exited with code ${code}, restarting in 5s...`);
    setTimeout(startStream, 5000);
  });
}

app.get("/ping", (req, res) => res.send("OK, stream running"));
app.get("/", (req, res) => res.send("Loop stream service alive"));

app.listen(process.env.PORT || 10000, () => {
  console.log("Server started");
  startStream();
});
