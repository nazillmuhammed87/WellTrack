import React from 'react';

const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';

  const bubbleStyle = {
    maxWidth: '80%',
    padding: '8px 12px',
    borderRadius: '12px',
    marginBottom: '4px',
    wordWrap: 'break-word',
    fontSize: '0.875rem',
    lineHeight: '1.4',
    ...(isUser
      ? {
          backgroundColor: '#0d6efd',
          color: '#fff',
          borderBottomRightRadius: '4px',
        }
      : {
          backgroundColor: '#e9ecef',
          color: '#212529',
          borderBottomLeftRadius: '4px',
        }),
  };

  const timestampStyle = {
    fontSize: '0.7rem',
    color: '#6c757d',
    marginTop: '2px',
    marginBottom: '8px',
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      <div style={bubbleStyle}>{message.text}</div>
      <div
        style={{
          ...timestampStyle,
          textAlign: isUser ? 'right' : 'left',
        }}
      >
        {formatTime(message.timestamp)}
      </div>
    </div>
  );
};

export default ChatMessage;
