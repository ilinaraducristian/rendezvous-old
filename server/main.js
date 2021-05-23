window.addEventListener('load', onLoad);

let socket;

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
};

const peers = new Map();
let localStream, streams;
let token, message;
let loginButton, joinVCButton, sendMessageButton;

async function onLoad() {

    // localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});

    streams = document.querySelector('#streams');
    token = document.querySelector('#token');
    loginButton = document.querySelector('#login');
    joinVCButton = document.querySelector('#joinVC');
    sendMessageButton = document.querySelector('#sendMessage');
    message = document.querySelector('#message');

    loginButton.addEventListener('click', login);
    joinVCButton.addEventListener('click', () => {
        socket.emit("call_me");
    });

    sendMessageButton.addEventListener('click', sendMessage);

}

async function login() {
    socket = io('https://localhost:3000', {
        auth: {
            token: token.value
        }
    });

    socket.on('connect_error', err => {
        console.log(err);
    });

    socket.on('connect', socketOnConnect);
    socket.on('disconnect', socketOnDisconnect);

    socket.on('message_received', messageReceived);

    // voice/video channel
    socket.on('create_offering', createOffering);
    socket.on('offer_created', offerCreated);
    socket.on('answer_created', answerCreated);
}

async function sendMessage() {
    socket.emit('send_message', {message: message.value});
}

async function messageReceived(payload) {
    console.log("Message received from " + payload.username);
    console.log(payload.message)
}

async function createOffering(payload) {
    const initiator = payload.initiator;
    const pc = new RTCPeerConnection(servers);
    const remoteStream = new MediaStream();
    peers.set(initiator, {pc, remoteStream});
    createVideo(remoteStream);
    console.log('ok');
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

    pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
    };

    const caller_ices = [];
    pc.onicecandidate = (event) => {
        if (event.candidate) {
            caller_ices.push(event.candidate.toJSON());
        } else {
            sendOffering();
        }
    };

    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    async function sendOffering() {
        socket.emit('offer_created', {
            initiator, caller_ices, offer: {
                sdp: offerDescription.sdp,
                type: offerDescription.type,
            }
        });
        pc.onicecandidate = () => {
        };
    }

}

async function offerCreated(payload) {
    if (payload.initiator !== socket.id) return;
    const caller = payload.caller;
    const pc = new RTCPeerConnection(servers);
    const remoteStream = new MediaStream();
    peers.set(caller, {pc, remoteStream});
    createVideo(remoteStream);

    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

    pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
    };

    const initiator_ices = [];
    pc.onicecandidate = (event) => {
        if (event.candidate) {
            initiator_ices.push(event.candidate.toJSON());
        } else if (event.candidate === null) {
            sendAnswer();
        }
    };


    await pc.setRemoteDescription(new RTCSessionDescription(payload.offer));
    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    async function sendAnswer() {
        payload.initiator_ices = initiator_ices;
        payload.answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
        };
        socket.emit('answer_created', payload);
        payload.caller_ices.forEach(ice => pc.addIceCandidate(new RTCIceCandidate(ice)));
        pc.onicecandidate = () => {
        };
    }

}

async function answerCreated(payload) {
    if (payload.caller !== socket.id) return;
    const pc_data = peers.get(payload.initiator);
    const pc = pc_data.pc;
    if (!pc.currentRemoteDescription && payload.answer) {
        const answerDescription = new RTCSessionDescription(payload.answer);
        await pc.setRemoteDescription(answerDescription);
    }
    payload.initiator_ices.forEach(ice => pc.addIceCandidate(new RTCIceCandidate(ice)));
}

function createVideo(stream) {
    const video = document.createElement('video');
    video.setAttribute('width', '200');
    video.setAttribute('height', '200');
    video.setAttribute('autoplay', '');
    video.setAttribute('playsinline', '');
    video.srcObject = stream;
    streams.appendChild(video);
}

async function socketOnConnect() {
}

async function socketOnDisconnect() {

}
