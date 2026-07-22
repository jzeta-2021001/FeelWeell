// client-mobile/src/features/chat/components/ChatInput.jsx
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SPACING, FONT_SIZE } from '../../../shared/constants/theme';

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (trimmed && trimmed.length <= 2000 && !disabled) {
      onSend(trimmed);
      setText('');
    }
  };

  const isOverLimit = text.length > 2000;
  const canSend = text.trim().length > 0 && !isOverLimit && !disabled;

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Escribe cómo te sientes..."
          placeholderTextColor="#9b9fb8"
          multiline
          value={text}
          onChangeText={setText}
          maxLength={2100}
        />
        <View style={styles.rightAction}>
          {text.length > 1800 && (
            <Text style={[styles.counter, isOverLimit && styles.counterOver]}>
              {2000 - text.length}
            </Text>
          )}
          <TouchableOpacity
            style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!canSend}
          >
            <MaterialIcons
              name="send"
              size={18}
              color={canSend ? '#ffffff' : '#9b9fb8'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
    backgroundColor: '#f7f8ff',
  },
  inputWrapper: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7f0',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#2f3348',
    maxHeight: 100,
    minHeight: 38,
    textAlignVertical: 'center',
  },
  rightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  counter: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9b9fb8',
  },
  counterOver: {
    color: '#d14b6d',
  },
  sendButton: {
    backgroundColor: '#6d72d8',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#e5e7f0',
    opacity: 0.5,
  },
});
