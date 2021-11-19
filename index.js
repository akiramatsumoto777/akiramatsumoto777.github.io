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

async function getCameraAudioStream() {
    let videoStream;
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
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
        alert('case 9.');
        const localVideo = document.querySelector("video");

        videoStream = await getCameraAudioStream();

        localVideo.srcObject = videoStream;
        captureFlg = 1;
    });
});

$(function() {
    $('#record_start').click(async function() {
        alert('rec start start.');
        recordedBlobs = [];
        let tracks = getTracks();
        combinedStream = new MediaStream(tracks);
        try {
            // mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/mp4' });
            mediaRecorder = new MediaRecorder(combinedStream);
        } catch (err) {
            alert(err);
        }

        mediaRecorder.addEventListener('dataavailable', (event) => {
            if (event.data && event.data.size > 0) {
                recordedBlobs.push(event.data);
            }
        });
        mediaRecorder.start(500);
        alert('rec start end.');
    });
    $('#record_stop').click(async function() {
        alert('record stop start');
        mediaRecorder.stop();
        alert('record stop end');
    });
    $('#download').click(async function() {
        alert(mediaRecorder.mimeType);
//         const blob = new Blob(recordedBlobs, { type: "video/webm" });
        const blob = new Blob(recordedBlobs, { type: mediaRecorder.mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "movie.mp4";
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
