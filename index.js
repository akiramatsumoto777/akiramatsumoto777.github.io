let audioStream;
let videoStream;
let combinedStream;
let mediaRecorder;
let recordedBlobs;
let captureFlg = 0;


async function getAudioStream() {
    let audioStream;
    try {
        audioStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true
        });
    } catch (err) {
        alert(err);
    }
    return audioStream;
}

async function getVideoStream() {
    let videoStream;
    try {
        videoStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false
        });
    } catch (err) {
        alert(err);
    }
    return videoStream;
}

async function getCameraStream() {
    let videoStream;
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });
    } catch (err) {
        alert(err);
    }
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
    $('#atach_camera_audio').click(async function() {
        alert('atach video1.');
        const localVideo = document.querySelector("video");

        audioStream = await getAudioStream();
        videoStream = await getCameraStream();

        localVideo.srcObject = videoStream;
        captureFlg = 2;
    });
});

$(function() {
    $('#record_start').click(async function() {
        recordedBlobs = [];
        alert('pass1.');
        let tracks = getTracks();
        alert('pass2.');
        // combinedStream = new MediaStream([...videoStream.getTracks(), ...audioStream.getTracks()])
        combinedStream = new MediaStream(tracks);
        alert('pass3.');
        try {
            mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm;codecs=h264' });
        } catch (err) {
            alert(err);
        }

        alert('pass4.');
        mediaRecorder.addEventListener('dataavailable', (event) => {
            if (event.data && event.data.size > 0) {
                recordedBlobs.push(event.data);
            }
            alert('event pass');
        });
        mediaRecorder.start(500);
        alert('rec start.');
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
        alert('videoStream.getTracks():' + videoStream.getTracks());
        tracks = [...videoStream.getTracks(), ...audioStream.getTracks()];
    }
    return tracks;
}
