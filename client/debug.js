import { baseURL } from './src/utils/utils';
import fetch from "node-fetch";



async function uploadFile(file) {
  const form = new FormData();
  form.append('file', file, file.name);
  const res = await fetch(`${baseURL}/file`, {
    method: 'POST',
    body: form,
  });

  const result = await res.json(); // file id
  return result;
}

async function sendMessage(from, to, text, file, type, chatID) {
  if(file !== null && text === null){
    const fileID = await uploadFile(file);
    let res = await fetch(`${baseURL}/message`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        from: from,
        to: to,
        content: fileID,
        type: type
      }),
    });
    const messageID = res.json();
    if(res.status !== 404){
      res = await fetch(`${baseURL}/chat/${chatID}`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          messageID: messageID,
          from: from,
          to: to,
        }),
      });

    }
    return res.status
  }
  else {
    let res = await fetch(`${baseURL}/message`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        from: from,
        to: to,
        content: text,
        type: type
      }),
    });
    const messageID = await res.json();
    
    if(res.status !== 404){
      res = await fetch(`${baseURL}/chat/${chatID}`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          messageID: messageID,
          from: from,
          to: to,
        }),
      });
    }
    return res.status
  }
}





async function createChatThread() {
  let res = await fetch(`${baseURL}/chat`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({
      initiator: "Charles",
      recipient: "Vini",
    }),
  });

}


async function fetchChat(chatID) {
  return fetch(`${baseURL}/chat/${chatID}`)
    .then(async (res) => {
      const data = await res.json();
      if (res.status === 404) {
        return null;
      }
      return data;
    });
}

async function deleteFile(id) {
  let res = await fetch(`${baseURL}/file/${id}`, {
    method: 'DELETE',
    headers: { 'Content-type': 'application/json' },
  });
}

// const result = await fetchChat("61ab10765db131b822bc430b");
// console.log(result)

// await deleteFile('61ac064f95de15f68df4b63d')

