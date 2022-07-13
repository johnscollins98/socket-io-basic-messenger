import React, { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { MessageData } from '../lib/model/MessageData';

const socket = io();

function App() {
  const [name, setName] = useState(localStorage.getItem('name') ?? '');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<(MessageData & { me: boolean })[]>(
    []
  );

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessages([{ name, message, me: true }, ...messages]);
    setMessage('');
    localStorage.setItem('name', name);
    socket.emit('SEND_MESSAGE', { name, message });
  };

  const receiveMessage = useCallback(
    ({ message, name }: MessageData) => {
      setMessages([{ name, message, me: false }, ...messages]);
    },
    [messages]
  );

  useEffect(() => {
    socket.on('RECEIVE_MESSAGE', receiveMessage);
  }, [receiveMessage]);

  return (
    <div className="App p-3 d-flex flex-grow-1 flex-column container-fluid">
      <div className="name mb-3">
        <label htmlFor="your-name" className="form-label">
          Enter your name:{' '}
        </label>
        <input
          placeholder="Name..."
          type="text"
          id="your-name"
          name="your-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control"
        />
      </div>
      <div
        className="messages flex-grow-1"
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          overflow: 'auto',
        }}
      >
        {messages.map((m, i) => (
          <div
            className="card mb-1"
            style={{
              width: 'fit-content',
              alignSelf: m.me ? 'flex-start' : 'flex-end',
              background: m.me ? 'rgb(0, 132, 255)' : undefined,
              color: m.me ? 'white' : undefined,
            }}
            key={i}
          >
            <div className="card-body">
              <h5 className="card-title">{m.name}</h5>
              <p className="card-text">{m.message}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="mb-3 mt-3">
        <div className="input-group message">
          <input
            placeholder="Message..."
            type="text"
            id="messageInput"
            name="messageInput"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="form-control"
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
