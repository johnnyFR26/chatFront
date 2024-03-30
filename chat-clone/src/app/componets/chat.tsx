"use client"

import React, { useState, useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const Chat: React.FC = () => {
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const { sendMessage, readyState } = useWebSocket('ws://localhost:8080', {
    onMessage: useCallback(async (event: MessageEvent) => {
      // Verifica se a mensagem é um Blob
      if (event.data instanceof Blob) {
        // Lê o conteúdo do Blob como texto
        const message = await event.data.text();
        setMessageHistory(prev => [...prev, message]);
      } else {
        // Se não for um Blob, assume que é uma string
        setMessageHistory(prev => [...prev, event.data]);
      }
    }, []),
  });

  const handleClickSendMessage = useCallback(() => {
    if (inputValue.trim() !== '') {
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
