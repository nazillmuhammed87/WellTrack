import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { FiSend } from 'react-icons/fi';

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Form onSubmit={handleSubmit} style={{ padding: '8px' }}>
      <InputGroup size="sm">
        <Form.Control
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ fontSize: '0.875rem' }}
        />
        <Button
          variant="primary"
          type="submit"
          disabled={!text.trim()}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <FiSend />
        </Button>
      </InputGroup>
    </Form>
  );
};

export default ChatInput;
