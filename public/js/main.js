const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
//const select = document.getElementById('room');

// function rotateFunction(){
//   var min = 1024;
//   var max = 9999;
//   var deg = Math.floor(Math.random() * (max - min)) + min;
//   document.getElementById('box').style.transform = "rotate("+deg+"deg)";

//   var element = document.getElementById('mainbox');
//   element.classList.remove('animate');

//   setTimeout(function(){
//     element.classList.add('animate');
//   }, 5000);
// }



// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//select.appendChild(1);

const socket = io();

// var opt = document.createElement('option');
// opt.value = i;
// opt.innerHTML = i;
// select.appendChild(opt);

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });

  
}

document.getElementById('live-btn').addEventListener('click', () => {
  const enterchat = confirm('You are now joining live dicussion with other users, we require your camera and mic to be on'); 
  if(enterchat){
    console.log('https://hackathons-x-rtc.herokuapp.com/' + room);
    const link = 'https://hackathons-x-rtc.herokuapp.com/' + room; 
    window.location = link; 
  }
});

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
