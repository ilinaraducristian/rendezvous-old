window.addEventListener('load', onload);

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
};

// define streams
let localStream, remoteStream;

// define the connection manager
const pc = new RTCPeerConnection(servers);

const socket = io('http://localhost:3000');

async function onload() {

    // assign webcam and microphone to the local stream
    localStream = await navigator.mediaDevices.getUserMedia({audio: true});

    //create empty remote stream
    remoteStream = new MediaStream();

    // add local stream to the connection manager
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

    // when a track is added to the connection (from the other peer)
    // add it to the remote stream object (to be displayed in browser)
    pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
    }


    document.querySelector('#localStream').srcObject = localStream;
    document.querySelector('#remoteStream').srcObject = remoteStream;

    document.querySelector('#call').addEventListener('click', call);
    document.querySelector('#answer').addEventListener('click', answer);
}

async function call() {

    // when finding an ice candidate add it to backend
    pc.onicecandidate = async (event) => {
        if (!event.candidate) return;
        console.count('candidat peer1')
        await fetch('http://localhost:3000/offerCandidates', {
            method: 'POST',
            body: JSON.stringify(event.candidate.toJSON())
        })
    };

    // create an offer to make a call
    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
    };

    // send offer to backend
    await fetch('http://localhost:3000/call', {method: 'POST', body: JSON.stringify(offer)});

    // when answered by the other peer get answer data
    socket.on('answer', call => {
        if (!pc.currentRemoteDescription && call.answer) {
            const answerDescription = new RTCSessionDescription(JSON.parse(call.answer));
            pc.setRemoteDescription(answerDescription);
        }
    });

    socket.on('answerCandidate', answerCandidate => {
        pc.addIceCandidate(new RTCIceCandidate(JSON.parse(answerCandidate)))
    });

}

async function answer() {

    // when finding an ice candidate add it to backend
    pc.onicecandidate = async (event) => {
        if (!event.candidate) return;
        await fetch('http://localhost:3000/answerCandidates', {
            method: 'POST',
            body: JSON.stringify(event.candidate.toJSON())
        })
    };

    // get call data
    const call = await fetch('http://localhost:3000/call').then(response => response.json());

    // get peer 1 call offer and create the remote description
    // console.log(call.offer);
    await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(call.offer)))

    // create answer for peer 1
    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
    };

    await fetch('http://localhost:3000/answer', {method: 'POST', body: JSON.stringify(answer)});

    socket.on('offerCandidate', offerCandidate => {
        pc.addIceCandidate(new RTCIceCandidate(offerCandidate))
    })

}
