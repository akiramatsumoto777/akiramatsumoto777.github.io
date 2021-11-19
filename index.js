let audioStream;
let videoStream;
let combinedStream;
let mediaRecorder;
let recordedBlobs;
let captureFlg = 0;


async function getAudioStream() {
    const audioStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
    });
    return audioStream;
}

async function getVideoStream() {
    const videoStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
    });
    return videoStream;
}


$(function() {
    $('#atach_disp_only').click(async function() {
        const localVideo = document.querySelector("video");

        videoStream = await getVideoStream();

        localVideo.srcObject = videoStream;
        captureFlg = 1;
    });
    $('#atach_disp_audio').click(async function() {
        const localVideo = document.querySelector("video");

        audioStream = await getAudioStream();
        videoStream = await getVideoStream();

        localVideo.srcObject = videoStream;
        captureFlg = 2;
    });
});

$(function() {
    $('#record_start').click(async function() {
        recordedBlobs = [];
        let tracks = getTracks();
        // combinedStream = new MediaStream([...videoStream.getTracks(), ...audioStream.getTracks()])
        combinedStream = new MediaStream(tracks);
        mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm;codecs=h264' });
        mediaRecorder.addEventListener('dataavailable', (event) => {
            if (event.data && event.data.size > 0) {
                console.log('pass');
                recordedBlobs.push(event.data);
            }
        });
        mediaRecorder.start(500);
    });
    $('#record_stop').click(async function() {
        mediaRecorder.stop();
    });
    $('#download').click(async function() {
        const blob = new Blob(recordedBlobs, { type: "video/webm" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "rec.webm";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    });
});

function getTracks() {
    let tracks;
    if (captureFlg == 1) {
        tracks = [...videoStream.getTracks()];

    } else if (captureFlg == 2) {
        tracks = [...videoStream.getTracks(), ...audioStream.getTracks()];
    }
    return tracks;
}
