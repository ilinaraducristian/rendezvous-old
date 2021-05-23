window.addEventListener('load', onload);

const socket = io('http://localhost:3000');

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
};

async function onload() {

    const callButton = document.querySelector('#call');
    const answerButton = document.querySelector('#answer');

    callButton.addEventListener('click', call);
    answerButton.addEventListener('click', answer);

    const pc = new RTCPeerConnection(servers);
    let localStream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
    let remoteStream1 = new MediaStream();
    let remoteStream2 = new MediaStream();

    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    pc.ontrack = (event) => {
        console.log(event.streams.length);
        event.streams[0].getTracks().forEach(track => remoteStream1.addTrack(track));
        // event.streams[1].getTracks().forEach(track => remoteStream2.addTrack(track));
    };

    document.querySelector('#localStream').srcObject = localStream;
    document.querySelector('#remoteStream1').srcObject = remoteStream1;
    document.querySelector('#remoteStream2').srcObject = remoteStream2;

    async function call() {

        socket.on('answer', ({ices, answer}) => {
            ices.map(ice => new RTCIceCandidate(ice)).forEach(rtc => pc.addIceCandidate(rtc));
            pc.setRemoteDescription(new RTCSessionDescription(answer));
            console.log('answer');
        });

        socket.emit('register');

        const ices = [];
        let offerDescription;
        pc.onicecandidate = async (event) => {
            if (event?.candidate !== null) {
                ices.push(event.candidate.toJSON());
                return;
            }
            let offerDescription2 = await pc.createOffer();
            await pc.setLocalDescription(offerDescription2);
            socket.emit('peer1_offer', {
                ices, offer: {
                    sdp: offerDescription.sdp,
                    type: offerDescription.type,
                }
            });
        };

        offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);

    }

    async function answer() {
        socket.emit('get_peer1_offer', async ({p1_ices, offer}) => {
            let answerDescription;
            const ices = [];
            pc.onicecandidate = async (event) => {
                if (event?.candidate !== null) {
                    ices.push(event.candidate.toJSON());
                    return;
                }
                p1_ices.map(ice => new RTCIceCandidate(ice)).forEach(rtc => pc.addIceCandidate(rtc));
                socket.emit('answer', {
                    ices, answer: {
                        type: answerDescription.type,
                        sdp: answerDescription.sdp,
                    }
                });
            };

            await pc.setRemoteDescription(new RTCSessionDescription(offer));

            answerDescription = await pc.createAnswer();
            await pc.setLocalDescription(answerDescription);

        });
    }

}
