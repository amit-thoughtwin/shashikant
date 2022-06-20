/* eslint-disable no-return-assign */
/* eslint-disable no-redeclare */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* global document, window,io */
const objDiv = document.getElementById('chat');
objDiv.scrollTop = objDiv.scrollHeight;
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}
console.log('hiiiiiiiiiiiiii');
const socket = io();
const chatDiv = document.getElementById('chat');
const mainDiv = document.getElementById('all-msg');
const receiverIdOnPage = document.getElementById('receiverId').value;
const senderIdOnPage = document.getElementById('senderId').value;
const input = document.getElementById('search-user');
const closeButton = document.querySelector('.close');
const label1 = document.getElementById('label1');
socket.on('chat message', (data) => {
  const { message, receiverId, senderId } = data;
  if (receiverIdOnPage === senderId && senderIdOnPage === receiverId) {
    socket.emit('undateMsgRead', message);
    /// ////////////////msg read/////////////////
    const allUNread = document.getElementsByClassName('un-read');
    /// ////////////////////////////////////
    const appendHtml = `<div class ="vW7d1"><span></span>
<div class="_3_7SH _3DFk6 message-in tail"><span class="tail-container"></span><span
    class="tail-container highlight"></span>
  <div class="Tkt2p">
    <div class="copyable-text" data-pre-plain-text="">
      <div class="_3zb-j ZhF0n"><span dir="ltr"
          class="selectable-text invisible-space copyable-text">
        ${message.message}
        </span></div>
    </div>
    <div class="_2f-RV">
    <div class="_1DZAH" role="button"><span class="_1ORuP"></span>
    <span class="_3EFt_">${message.msgSentOn}</span>
     <div class="_32uRw">
      <span data-icon="msg-dblcheck-ack" class="">
       <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15"
        width="16" height="15">
        <path fill="#4FC3F7" class = 'read'
        d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z">
        </path>
        </svg>
        </span>
         </div>`;
    mainDiv.innerHTML += appendHtml;

    chatDiv.append(mainDiv);
    objDiv.scrollTop = objDiv.scrollHeight;
  }
});

const newUserDiv = document.getElementById('new-users');
input.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const search = input.value;
    event.preventDefault();
    fetch(`http://127.0.0.1:8080/user?search=${search}`)
      .then((data) => data.json())
      .then((datafound) => {
        const crossBtn = '<button class="close" onclick = "getFriends()"></button>';
        label1.innerHTML = crossBtn;
        let htmlForUsers = '';
        if (datafound.data.length === 0) {
          htmlForUsers += `<div tabindex="-1 id = "unknownUser">
                    <div class="_2EXPL" >
                      <div class="_3j7s9">
                        <div class="_2FBdJ">
                          <div class="_25Ooe"><span class="_3TEwt"><span dir="auto" title="Qasim Pk"
                                class="_1wjpf">
                               No Users Found
                              </span>
                              <div class="_1yct0"></div>
                            </span></div>
                        </div>
                        <div class="_1AwDx">
                        </div>
                      </div>
                    </div>
                  </div>`;
          newUserDiv.innerHTML = htmlForUsers;
        }
        datafound.data.forEach((element) => {
          htmlForUsers += `<div tabindex="-1">
                    <div class="_2EXPL">
                      <div class="dIyEr">
                        <div class="_1WliW" style="height: 49px; width: 49px;"><img
                            src="https://dyn.web.whatsapp.com/pp?e=https%3A%2F%2Fpps.whatsapp.net%2Fv%2Ft61.11540-24%2F36213239_205252013662177_8403903246124449792_n.jpg%3Foe%3D5BEAD3AB%26oh%3D3d7fa4a8514814bf245a4d423a7fb781&amp;t=s&amp;u=923311442244%40c.us&amp;i=1531644501"
                            class="Qgzj8 gqwaM" style="visibility: visible;">
                          <div class="_3ZW2E"><span data-icon="default-user" class=""><svg
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212" width="212" height="212">
                                <path fill="#DFE5E7"
                                  d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z">
                                </path>
                                <g fill="#FFF">
                                  <path
                                    d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z">
                                  </path>
                                </g>
                              </svg></span></div>
                        </div>
                      </div>
                      <div class="_3j7s9">
                        <div class="_2FBdJ">
                          <div class="_25Ooe"><span class="_3TEwt"><span dir="auto" title="${element.email}"
                                class="_1wjpf">
                                ${element.fullName}
                              </span>
                              <div class="_1yct0"></div>
                            </span></div>
                        </div>
                        <div class="_1AwDx">
                          <div class="_itDl"><span class="_2_LEW" title="&#8234;test&#8236;">
                              <div class="_1VfKB"></div><span dir="ltr" class="_1wjpf _3NFp9"> 
                              <input type = "button" id = "${element.id}" value ="Add Friend" onclick="addFriend(this)"></span>
                            </span></div>
                          <div class="_3Bxar"><span></span><span></span><span></span></div>
                        </div>
                      </div>
                    </div>
                  </div>`;
        });
        newUserDiv.innerHTML = htmlForUsers;
        // const closeButton =`<button class="close">`
        // input.innerHTML = closeButton
      });
  }
});
function addFriend(e) {
  fetch(`http://127.0.0.1:8080/friend/${e.id}`)
    .then((data) => data.json())
    .then((datafound) => {
      if (datafound.statusCode === 200) {
        e.value = 'Request Sent';
      }
      if (datafound.statusCode === 400) {
        e.value = 'Add Friend';
      }
    });
}
function checkId(data) {
  const action = data.action.split('/');
  // event.preventDefault();
  if (action[action.length - 1] === 'none') {
    const noUser = document.getElementById('noUser');
    noUser.innerText = 'Please select friend to send message ';
    return false;
  }
  return true;
}

let elementClicked = false;
function seeRequest(divData) {
  if (elementClicked === false) {
    fetch('http://127.0.0.1:8080/friend/')
      .then((data) => data.json())
      .then((datafound) => {
        if (datafound.statusCode === 200) {
          if (datafound.data.length > 0) {
            let allDetails = '';

            const li = document.createElement('li');
            datafound.data.forEach((element) => {
              allDetails += `
          <div tabindex="-1">
          <div class="_2EXPL">
            <div class="dIyEr">
              <div class="_1WliW" style="height: 49px; width: 49px;"><img 
                  src="https://dyn.web.whatsapp.com/pp?e=https%3A%2F%2Fpps.whatsapp.net%2Fv%2Ft61.11540-24%2F36213239_205252013662177_8403903246124449792_n.jpg%3Foe%3D5BEAD3AB%26oh%3D3d7fa4a8514814bf245a4d423a7fb781&amp;t=s&amp;u=923311442244%40c.us&amp;i=1531644501"
                  class="Qgzj8 gqwaM avatar" style="visibility: visible;">
                <div class="_3ZW2E"><span data-icon="default-user" class=""><svg
                      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212" width="212" height="212">
                      <path fill="#DFE5E7"
                        d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z">
                      </path>
                      <g fill="#FFF">
                        <path
                          d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z">
                        </path>
                      </g>
                    </svg></span></div>
              </div>
            </div>
            <div class="_3j7s9">
              <div class="_2FBdJ">
                <div class="_25Ooe"><span class="_3TEwt"><span dir="auto" title="Qasim Pk"
                      class="_1wjpf">
                      ${element.sentFrom.fullName}
                    </span>
                    <div class="_1yct0"></div>
                  </span></div>
              </div>
              <div class="_1AwDx">
                <div class="_itDl"><span class="_2_LEW" title="&#8234;test&#8236;">
                    <div class="_1VfKB"></div><span dir="ltr" class="_1wjpf _3NFp9"> 
                    <input type = "button" id = "${element.sentFrom.id}" value ="Accept Request" onclick="acceptRequest(this)"></span>
                    <input type = "button" id = "${element.sentFrom.id}" value ="Reject Request" onclick="rejectRequest(this)"></span>
                  </span></div>
                <div class="_3Bxar"><span></span><span></span><span></span></div>
              </div>
            </div>
          </div>
        </div>
          `;
            });

            elementClicked = true;
            li.innerHTML += allDetails;
            li.style.listStyleType = 'none';
            divData.append(li);
          }
          if (datafound.data.length === 0) {
            divData.title = 'There is no Requests';
          }
        }
      });
  } else {
    divData.removeChild(divData.lastChild);
    elementClicked = false;
  }
}
function acceptRequest(Request) {
  fetch(`http://127.0.0.1:8080/friend/accept/${Request.id}`)
    .then((data) => data.json())
    .then((datafound) => {});
}
function rejectRequest(data) {
  fetch(`http://127.0.0.1:8080/friend/reject/${data.id}`)
    .then((data) => data.json())
    .then((datafound) => {});
}
/// ///////////////colour img ////////////////////
function generateAvatar(text, foregroundColor, backgroundColor) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = 200;
  canvas.height = 200;

  // Draw background
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw text
  context.font = 'bold 100px Assistant';
  context.fillStyle = foregroundColor;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  return canvas.toDataURL('image/png');
}
const users = document.getElementsByClassName('gqwaM');
for (let i = 0; i < users.length; i += 1) {
  users[i].src = generateAvatar(
    // users[i].id[0].toUpperCase(),
    's',
    'white',
    '#1bc2a2',
  );
}
/// ///////////send request///////////////////////
const seeRequestDiv = document.getElementById('see-request');
socket.on('send request', (data) => {
  const { receiver } = data;
  if (receiver === senderIdOnPage) {
    fetch('http://127.0.0.1:8080/friend/')
      .then((data) => data.json())
      .then((datafound) => {
        const totalRequest = `<span class="icon-button__badge">${datafound.data.length}</span>`;
        seeRequestDiv.innerHTML += totalRequest;
      });
  }
});
function closeUserList(data) {
  console.log('data', data);
}
const friendList = document.getElementsByClassName('friend-list');
// socket.on('loginUsers', (data) => {
//   for (let i = 0; i < friendList.length; i += 1) {
//     if (friendList[i].value === data) {
//       const setOnline = document.getElementById(data);
//       setOnline.innerText = 'online';
//     }
//   }
// });
function getFriends(btndata) {
  fetch('http://127.0.0.1:8080/friend/friendList')
    .then((data) => data.json())
    .then((datafound) => {
      const crossBtn = '<button class="close" onclick = "getFriends()"></button>';
      label1.innerHTML = '';
      let htmlForUsers = '';
      datafound.data.forEach((element) => {
        htmlForUsers += `<div tabindex="-1">
                    <div class="_2EXPL">
                      <div class="dIyEr">
                        <div class="_1WliW" style="height: 49px; width: 49px;"><img
                            src="https://dyn.web.whatsapp.com/pp?e=https%3A%2F%2Fpps.whatsapp.net%2Fv%2Ft61.11540-24%2F36213239_205252013662177_8403903246124449792_n.jpg%3Foe%3D5BEAD3AB%26oh%3D3d7fa4a8514814bf245a4d423a7fb781&amp;t=s&amp;u=923311442244%40c.us&amp;i=1531644501"
                            class="Qgzj8 gqwaM" style="visibility: visible;">
                          <div class="_3ZW2E"><span data-icon="default-user" class=""><svg
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212" width="212" height="212">
                                <path fill="#DFE5E7"
                                  d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z">
                                </path>
                                <g fill="#FFF">
                                  <path
                                    d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z">
                                  </path>
                                </g>
                              </svg></span></div>
                        </div>
                      </div>
                      <div class="_3j7s9">
                        <div class="_2FBdJ">
                          <div class="_25Ooe"><span class="_3TEwt"><span dir="auto" title="${element.email}"
                                class="_1wjpf">
                                ${element.fullName}
                              </span>
                              <div class="_1yct0"></div>
                            </span></div>
                        </div>
                        <div class="_1AwDx">
                          <div class="_itDl"><span class="_2_LEW" title="&#8234;test&#8236;">
                              <div class="_1VfKB"></div><span dir="ltr" class="_1wjpf _3NFp9"> 
                             </span>
                            </span></div>
                          <div class="_3Bxar"><span></span><span></span><span></span></div>
                        </div>
                      </div>
                    </div>
                  </div>`;
      });
      newUserDiv.innerHTML = htmlForUsers;
      // const closeButton =`<button class="close">`
      // input.innerHTML = closeButton
    });
}
let number = 0;
socket.on('sent message', (data) => {
  const { message, receiverId, senderId } = data;
  if (senderIdOnPage === receiverId) {
    const friend = document.getElementById(`${senderId}_friend_list`);
    if (receiverIdOnPage === senderId) {
      friend.innerHTML = `${message.message}<svg id="Layer_1"
      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18">
      <path fill="#4FC3F7"
        d="M17.394 5.035l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-.427-.388a.381.381 0 0 0-.578.038l-.451.576a.497.497 0 0 0 .043.645l1.575 1.51a.38.38 0 0 0 .577-.039l7.483-9.602a.436.436 0 0 0-.076-.609zm-4.892 0l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-2.614-2.556a.435.435 0 0 0-.614.007l-.505.516a.435.435 0 0 0 .007.614l3.887 3.8a.38.38 0 0 0 .577-.039l7.483-9.602a.435.435 0 0 0-.075-.609z">
      </path>
    </svg></span></div>`;
    } else {
      if (friend.getElementsByClassName('icon-button__badge')[0]) {
        const newNumber = friend.getElementsByClassName('icon-button__badge')[0].textContent;
        number = parseInt(newNumber, 2);
      }
      number += 1;
      friend.innerHTML = `${message.message}<span class="icon-button__badge unread-msg" >${number}</span>`;
    }
  }
});
socket.on('msg seen', (data) => {
  const { userId, otherId } = data;
  if (receiverIdOnPage === userId && senderIdOnPage === otherId) {
    const unreadMsg = document.getElementsByClassName('un-read');
    console.log(unreadMsg);
    if (unreadMsg) {
      for (let i = 0; i < unreadMsg.length; i + 1) {
        unreadMsg[i].fill = 'red';
      }
    }
  }
});
