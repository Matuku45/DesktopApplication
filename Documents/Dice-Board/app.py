import eventlet
eventlet.monkey_patch()  # First!

from flask import Flask, render_template_string, request
from flask_socketio import SocketIO, emit, join_room
import random
import os



app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")




# In-memory sessions
sessions = {}  # session_name: {players:{sid:{name,credit,wins,losses,point}}, turn:sid, log:[], creator:sid}

template = """
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>🎲 Pop & Krepp Multiplayer Dice</title>
<style>
body {
    font-family: 'Segoe UI', Arial, sans-serif;
    margin:0; padding:0;
    background:#f0f4f7;
    display:flex;
    flex-direction:column;
    height:100vh;
}

/* Header */
header {
    background:#2e7d32; color:white;
    padding:15px; text-align:center;
    font-size:1.8em; font-weight:bold;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

/* Session Controls */
#sessionControls {
    display:flex; gap:10px; justify-content:center;
    flex-wrap:wrap; padding:10px; background:#a5d6a7;
}
#sessionControls input, #sessionControls button {
    padding:8px; border:none; border-radius:8px; font-weight:bold;
    transition:0.3s;
}
#sessionControls input { min-width:120px; }
#createSession, #joinSession, #startSession, #liveSessionsBtn { background:#2e7d32; color:white; }
#exitSession { background:#e53935; color:white; }
#sessionControls button:hover, #sessionControls input:focus { transform:scale(1.05); }

/* Main Layout */
#mainContainer { display:flex; flex:1; gap:20px; padding:10px; justify-content:center; flex-wrap:wrap; }

/* Left Panel: Board */
#boardContainer {
    display:flex; flex-direction:column; align-items:center;
    border:5px solid #2e7d32; border-radius:20px;
    padding:15px; background:linear-gradient(to bottom right,#4CAF50,#81C784);
    min-width:320px; box-shadow:0 6px 15px rgba(0,0,0,0.3);
}
#boardHeader { font-size:1.4em; color:white; text-align:center; font-weight:bold; margin-bottom:10px; }
#vsInfo, #turnInfo { margin:5px; color:white; font-weight:bold; text-shadow:1px 1px 2px #000; }

/* Dice */
#diceContainer { display:flex; gap:20px; justify-content:center; margin:15px; }
.dice {
    width:80px; height:80px; background:white; border-radius:12px;
    display:flex; justify-content:center; align-items:center;
    font-weight:bold; box-shadow:2px 2px 15px rgba(0,0,0,0.4);
    transition: transform 0.3s, box-shadow 0.3s;
}
.dice:hover { transform: scale(1.1) rotate(-5deg); box-shadow:2px 2px 25px rgba(0,0,0,0.6); }
.dice-inner {
    width: 100%; height: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    justify-items: center; align-items: center;
}
.dot {
    width: 14px; height: 14px;
    background: black; border-radius: 50%;
    opacity: 0; transition: opacity 0.2s;
}
.dot.visible { opacity: 1; }

/* Controls */
#controls { display:flex; gap:10px; justify-content:center; margin-top:10px; flex-wrap:wrap; }
#controls button { background:#4CAF50; color:white; padding:8px 12px; border:none; border-radius:8px; cursor:pointer; font-weight:bold; transition:0.3s; }
#controls button:hover { transform:scale(1.05); }

/* Right Panel */
#sidePanel { display:flex; flex-direction:column; gap:10px; min-width:320px; }
.graphBox, .playersOnlineBox, #playersInfo, #log {
    background:white; border-radius:12px; padding:10px; box-shadow:0 4px 10px rgba(0,0,0,0.2); max-height:220px; overflow:auto;
}
.graphBox h4, .playersOnlineBox h4, #playersInfo h3, #log h3 { margin:0 0 5px 0; font-size:1.1em; }

/* Video Feed */
#videoContainer { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; margin-top:10px; }
.videoBox { width:200px; height:150px; background:black; border-radius:10px; overflow:hidden; position:relative; box-shadow:0 3px 8px rgba(0,0,0,0.3); }
.videoBox video { width:100%; height:100%; object-fit:cover; }

/* Responsive */
@media(max-width:700px){
    #mainContainer { flex-direction:column; align-items:center; }
    #sidePanel { min-width:90%; }
    .videoBox { width:140px; height:100px; }
    .dice { width:60px; height:60px; }
}
</style>
</head>
<body>
<header>🎲 Pop & Krepp Multiplayer Dice</header>

<div id="sessionControls">
  <input id="playerName" placeholder="Your Name" />
  <input id="sessionName" placeholder="Session Name" />
  <button id="createSession">Create</button>
  <button id="joinSession">Join</button>
  <button id="startSession">Start</button>
  <button id="liveSessionsBtn">Live Sessions</button>
  <button id="exitSession">Exit</button>
</div>

<!-- main layout (same as your original) -->
<div id="mainContainer">
  <div id="boardContainer">
    <div id="boardHeader">🎯 Waiting for Players...</div>
    <div id="vsInfo">Waiting...</div>
    <div id="diceContainer">
      <div id="dice1" class="dice">
        <div class="dice-inner">
          <div class="dot" id="dice1p1"></div><div class="dot" id="dice1p2"></div><div class="dot" id="dice1p3"></div>
          <div class="dot" id="dice1p4"></div><div class="dot" id="dice1p5"></div><div class="dot" id="dice1p6"></div>
          <div class="dot" id="dice1p7"></div><div class="dot" id="dice1p8"></div><div class="dot" id="dice1p9"></div>
        </div>
      </div>
      <div id="dice2" class="dice">
        <div class="dice-inner">
          <div class="dot" id="dice2p1"></div><div class="dot" id="dice2p2"></div><div class="dot" id="dice2p3"></div>
          <div class="dot" id="dice2p4"></div><div class="dot" id="dice2p5"></div><div class="dot" id="dice2p6"></div>
          <div class="dot" id="dice2p7"></div><div class="dot" id="dice2p8"></div><div class="dot" id="dice2p9"></div>
        </div>
      </div>
    </div>
    <div id="turnInfo">Turn: -</div>
    <div id="controls">
      <button id="rollBtn">Roll 🎲</button>
      <button id="passBtn">Pass ✋</button>
    </div>
  </div>

  <div id="sidePanel">
    <div class="graphBox"><h4>Player Progress</h4><canvas id="playerGraph" width="400" height="150"></canvas></div>
    <div class="playersOnlineBox"><h4>Players Online</h4><div id="onlinePlayers" style="display:flex; flex-wrap:wrap; gap:5px;"></div></div>
    <div id="playersInfo"><h3>Player Stats:</h3><div id="stats"></div></div>
    <div id="log"><h3>Game Log:</h3></div>
  </div>
</div>

<div id="videoContainer" style="display:none;"></div>

<!-- Scripts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.2/socket.io.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
const socket = io(); // connect
let playerName = '', sessionName = '', colors = {};

const videoContainer = document.getElementById('videoContainer');
const onlinePlayersDiv = document.getElementById('onlinePlayers');
const statsDiv = document.getElementById('stats');
const logDiv = document.getElementById('log');
const vsInfo = document.getElementById('vsInfo');
const boardHeader = document.getElementById('boardHeader');
const turnInfo = document.getElementById('turnInfo');

// Chart Setup
const ctx = document.getElementById('playerGraph').getContext('2d');
const playerChart = new Chart(ctx, {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
        animation: { duration: 400 }
    }
});

// Dice Patterns (positions use ids like dice1p5)
const dicePatterns = {
    1: [5], 2: [1,9], 3: [1,5,9],
    4: [1,3,7,9], 5: [1,3,5,7,9], 6: [1,3,4,6,7,9]
};

function showDiceDots(diceId, value) {
    const dots = document.querySelectorAll(`#${diceId} .dot`);
    dots.forEach(dot => dot.classList.remove('visible'));
    if (!value) return;
    dicePatterns[value].forEach(pos => {
        const el = document.getElementById(`${diceId}p${pos}`);
        if (el) el.classList.add('visible');
    });
}

function rollDiceAnimation(diceId, callback) {
    let i = 0;
    const interval = setInterval(() => {
        const roll = Math.floor(Math.random() * 6) + 1;
        showDiceDots(diceId, roll);
        i++;
        if (i >= 10) {
            clearInterval(interval);
            if (callback) callback();
        }
    }, 80);
}

function updateStats(players) {
    statsDiv.innerHTML = ''; onlinePlayersDiv.innerHTML = '';
    const colorsList = ['#FF5733','#33FF57','#3357FF','#F3FF33','#FF33F6']; let idx = 0;
    Object.values(players).forEach(p => {
        statsDiv.innerHTML += `<div>${p.name} | Credit:${p.credit} | Wins:${p.wins} | Losses:${p.losses} | Point:${p.point || 0}</div>`;
        const tag = document.createElement('div');
        tag.style.padding = '3px 6px';
        tag.style.background = colorsList[idx % colorsList.length];
        tag.style.color = 'white'; tag.style.borderRadius = '5px';
        tag.innerText = p.name;
        onlinePlayersDiv.appendChild(tag);

        if (!colors[p.name]) colors[p.name] = colorsList[idx++];
        let ds = playerChart.data.datasets.find(d => d.label === p.name);
        if (!ds) {
            ds = { label: p.name, data: [], borderColor: colors[p.name], backgroundColor: 'rgba(0,0,0,0)', fill: false, tension: 0.4 };
            playerChart.data.datasets.push(ds);
        }
        ds.data.push(p.point || 0);
        if (ds.data.length > 20) ds.data.shift();
    });

    const now = new Date().toLocaleTimeString();
    playerChart.data.labels.push(now);
    if (playerChart.data.labels.length > 20) playerChart.data.labels.shift();
    playerChart.update();
}

function addLog(msg) {
    logDiv.innerHTML += `<div>${msg}</div>`;
    logDiv.scrollTop = logDiv.scrollHeight;
}

// --- Button wiring (IDs match HTML) ---
document.getElementById('createSession').onclick = () => {
    playerName = document.getElementById('playerName').value.trim();
    sessionName = document.getElementById('sessionName').value.trim();
    if (!playerName || !sessionName) { alert('Enter Player Name & Session Name'); return; }
    socket.emit('create_session', { session: sessionName, name: playerName });
};

document.getElementById('joinSession').onclick = () => {
    playerName = document.getElementById('playerName').value.trim();
    sessionName = document.getElementById('sessionName').value.trim();
    if (!playerName || !sessionName) { alert('Enter Player Name & Session Name'); return; }
    socket.emit('join_session', { session: sessionName, name: playerName });
};

document.getElementById('startSession').onclick = () => {
    sessionName = document.getElementById('sessionName').value.trim();
    if (!sessionName) { alert('Enter Session Name'); return; }
    socket.emit('start_session', { session: sessionName });
};

document.getElementById('rollBtn').onclick = () => {
    if (!sessionName || !playerName) { alert('Join a session first'); return; }
    // Animate locally first for snappy UI then ask server for result (server will broadcast dice outcome)
    rollDiceAnimation('dice1', () => {
        rollDiceAnimation('dice2');
    });
    socket.emit('roll_request', { session: sessionName });
};

document.getElementById('passBtn').onclick = () => {
    if (!sessionName || !playerName) { alert('Join a session first'); return; }
    socket.emit('pass_request', { session: sessionName });
};

document.getElementById('exitSession').onclick = () => {
    location.reload();
};
 
// --- Socket listeners (names match server) ---
socket.on('connect', () => { addLog('Connected to server'); });

socket.on('alert', msg => { addLog('⚠️ ' + msg); });

socket.on('session_created', data => {
    addLog(`✅ Session "${data.session}" created by ${data.creator}`);
    videoContainer.style.display = 'block';
    vsInfo.innerText = `Creator: ${data.creator}`;
    boardHeader.innerText = `Session: ${data.session}`;
    // store session
    sessionName = data.session;
});

socket.on('session_joined', data => {
    addLog(`✅ ${data.joined} joined. Players: ${data.vs_list}`);
    vsInfo.innerText = data.vs_list;
    updateStats(data.players);
    videoContainer.style.display = 'block';
});

socket.on('game_started', data => {
    addLog(`🎮 Game started. First turn: ${data.turn}`);
    turnInfo.innerText = `Turn: ${data.turn}`;
    updateStats(data.players);
});

socket.on('dice_rolled', data => {
    // Animate dice quickly with random rolls
    let frames = 10;
    const interval = setInterval(() => {
        showDiceDots('dice1', Math.floor(Math.random()*6)+1);
        showDiceDots('dice2', Math.floor(Math.random()*6)+1);
        frames--;
        if (frames <= 0) {
            clearInterval(interval);
            // After animation ends, show REAL dice from server
            showDiceDots('dice1', data.dice1);
            showDiceDots('dice2', data.dice2);
        }
    }, 80);

    // Update UI with server data
    addLog(`${data.player} rolled ${data.dice1} & ${data.dice2} → ${data.result}`);
    turnInfo.innerText = `Turn: ${data.nextTurn}`;
    vsInfo.innerText = data.vs_list;
    updateStats(data.players);
});


socket.on('remote_video', data => {
    addLog(`Remote video joined: ${data.player}`);
    // simple visual indicator for remote join
    const vb = document.createElement('div');
    vb.className = 'videoBox';
    vb.innerHTML = `<div style="color:white;padding:8px;">${data.player}</div>`;
    videoContainer.appendChild(vb);
});
</script>
</body>
</html>


"""


@app.route('/')
def index():
    return render_template_string(template)

# ---------------- Session Management ----------------
@socketio.on('create_session')
def create_session(data):
    session = data['session']
    name = data['name']
    sid = request.sid
    if session in sessions:
        emit('alert', 'Session exists', room=sid)
        return
    sessions[session] = {
        'players': {sid: {'name': name, 'credit': 10, 'wins': 0, 'losses': 0, 'point': None, 'charged': False}},
        'turn': sid,
        'creator': sid,
        'log': []
    }
    join_room(session)
    emit('session_created', {'creator': name}, room=sid)

@socketio.on('join_session')
def join_session(data):
    session = data['session']
    name = data['name']
    sid = request.sid
    s = sessions.get(session)
    if not s:
        emit('alert', 'Session does not exist', room=sid)
        return
    s['players'][sid] = {'name': name, 'credit': 10, 'wins': 0, 'losses': 0, 'point': None, 'charged': False}
    join_room(session)
    vs_list = " vs ".join([p['name'] for p in s['players'].values()])
    emit('session_joined', {
        'creator': s['players'][s['creator']]['name'],
        'joined': name,
        'vs_list': vs_list,
        'players': s['players']
    }, room=session)

@socketio.on('start_session')
def start_session(data):
    session = data['session']
    s = sessions.get(session)
    if not s:
        emit('alert', 'Session does not exist', room=request.sid)
        return
    if len(s['players']) < 1:
        emit('alert', 'Need exactly 2 players to start', room=request.sid)
        return
        emit('alert', 'Need at least 2 players', room=request.sid)
        return
    s['turn'] = s['creator']
    first_player = s['players'][s['turn']]['name']
    emit('game_started', {'turn': first_player, 'players': s['players']}, room=session)

# ---------------- Dice Game Logic ----------------
@socketio.on('roll_request')
def roll_request(data):
    session = data['session']
    sid = request.sid
    s = sessions.get(session)
    if not s:
        emit('alert', 'Session does not exist', room=sid)
        return
    if s['turn'] != sid:
        emit('alert', 'Not your turn!', room=sid)
        return

    player = s['players'][sid]

    # Only deduct 1 credit the first time the player plays
    if not player['charged']:
        player['credit'] -= 1
        player['charged'] = True

    if player['credit'] <= 0:
        emit('alert', 'Out of credit! Game will reset.', room=sid)
        # Reset session automatically
        for p in s['players'].values():
            p.update({'credit':10,'point':None,'wins':0,'losses':0,'charged':False})
        s['turn'] = s['creator']
        emit('game_started', {'turn': s['players'][s['turn']]['name'], 'players': s['players']}, room=session)
        return

    d1, d2 = random.randint(1,6), random.randint(1,6)
    total = d1 + d2
    result, keep_turn = '', False

    # Game logic
    if player['point'] is None:
        if total in [7,11]:
            result = 'Pop (Win)'; player['wins'] += 1; player['credit'] += total; keep_turn=True
        elif total in [2,3,12]:
            result = 'Krepp (Lose)'; player['losses'] += 1
        else:
            result = f'Mail {total} (Point set)'; player['point'] = total; keep_turn=True
    else:
        if total == player['point']:
            result = 'Mail Hit (Win)'; player['wins'] += 1; player['credit'] += total; player['point'] = None; keep_turn=True
        elif total == 7:
            result = '7 Rolled (Lose)'; player['losses'] += 1; player['point'] = None
        else:
            result = f'Rolling... (Point={player["point"]})'; keep_turn=True

    # Switch turn if necessary
    if not keep_turn:
        player_sids = list(s['players'].keys())
        next_index = (player_sids.index(sid)+1) % len(player_sids)
        s['turn'] = player_sids[next_index]

    emit('dice_rolled', {
        'player': player['name'],
        'dice1': d1,
        'dice2': d2,
        'total': total,
        'result': result,
        'nextTurn': s['players'][s['turn']]['name'],
        'vs_list': " vs ".join([p['name'] for p in s['players'].values()]),
        'players': s['players']
    }, room=session)

@socketio.on('pass_request')
def pass_request(data):
    session = data['session']
    sid = request.sid
    s = sessions.get(session)
    if not s:
        emit('alert', 'Session does not exist', room=sid)
        return
    if s['turn'] != sid:
        emit('alert', 'Not your turn!', room=sid)
        return

    player_sids = list(s['players'].keys())
    next_index = (player_sids.index(sid)+1) % len(player_sids)
    s['turn'] = player_sids[next_index]

    emit('dice_rolled', {
        'player': s['players'][sid]['name'],
        'dice1': 0,
        'dice2': 0,
        'total': 0,
        'result': 'Turn Passed',
        'nextTurn': s['players'][s['turn']]['name'],
        'vs_list': " vs ".join([p['name'] for p in s['players'].values()]),
        'players': s['players']
    }, room=session)

# ---------------- Video ----------------
@socketio.on('join_video')
def join_video(data):
    session = data['session']
    sid = request.sid
    name = data['player']
    join_room(session)
    emit('remote_video', {'player': name, 'sid': sid}, room=session, include_self=False)

# ---------------- Run Server ----------------
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    socketio.run(app, host='0.0.0.0', port=port)
