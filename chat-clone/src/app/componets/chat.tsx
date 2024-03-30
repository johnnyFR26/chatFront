"use client"

import React, { useState, useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const Chat: React.FC = () => {
  const [messageHistory, setMessageHistory] = useState<string[]>([]); // Definindo explicitamente o tipo do estado inicial como string[]
  const [inputValue, setInputValue] = useState('');

  const { sendMessage, readyState } = useWebSocket('ws://localhost:8080', {
    onMessage: useCallback((event: MessageEvent) => {
      setMessageHistory(prev => [...prev, event.data]);
    }, []),
  });

  const handleClickSendMessage = useCallback(() => {
    if (inputValue !== '') {
      sendMessage(inputValue);
      setInputValue('');
    }
  }, [inputValue, sendMessage]);

  return (
    <div>
      <ul>
        {messageHistory.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <input placeholder='Mensagem...' value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
      <button onClick={handleClickSendMessage} disabled={readyState !== ReadyState.OPEN}>
        Enviar
      </button>
    </div>
  );
};

export default Chat;
