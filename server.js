const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();

app.use(cors());

// 인증서 파일 경로 설정
const keyPath = path.resolve(__dirname, 'certs', 'privkey.pem');
const certPath = path.resolve(__dirname, 'certs', 'fullchain.pem');

// 인증서 파일 읽기
let key, cert;
try {
    console.log(`인증서 파일 경로: ${keyPath}, ${certPath}`);
    key = fs.readFileSync(keyPath);
    cert = fs.readFileSync(certPath);
    console.log('SSL 인증서 파일을 성공적으로 읽었습니다.');
} catch (error) {
    console.error('SSL 인증서 파일을 읽는 중 오류가 발생했습니다:', error);
    process.exit(1); // 오류 발생 시 프로세스를 종료합니다.
}

// HTTPS 서버 설정
const options = {
    key: key,
    cert: cert,
};

const server = https.createServer(options, app);

// 정적 파일 제공을 위해 public 폴더 설정
app.use(express.static(path.join(__dirname, 'public')));

app.use('/models', express.static(path.join(__dirname,'models')));

// 기본 경로에 대한 핸들러 추가
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'index.html'));
});

// WebSocket 서버 설정
const wss = new WebSocket.Server({ server });


// 웹소켓 연결 처리
wss.on('connection', function connection(ws) {
    console.log('Client connected via WebSocket');

    ws.on('message', function incoming(message) {
        console.log('Received from client: ' + message);

        // 다른 클라이언트에 메시지를 전송할 수 있습니다
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(""+message);
            }
        });
    });
}); 

onload = function() {
    updateReceivedMessages();
} 

// 다른 필요한 경로 설정
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signUp.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signUp.html'));
});

app.get('/signUpMobile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signUpMobile.html'));
});

app.get('/mypage.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mypage.html'));
});


// 필요한 다른 라우트 추가

server.listen(8443, () => {
    console.log('Server running at https://localhost:8443/');
    console.log('Server also accessible at https://givernance.p-e.kr:8443/');
});
