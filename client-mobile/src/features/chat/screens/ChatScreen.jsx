import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../../shared/constants/theme';
import useChat from '../hooks/useChat';
import ChatEmergencyBanner from '../components/ChatEmergencyBanner';
import ChatTypingIndicator from '../components/ChatTypingIndicator';
import ChatSuggestions from '../components/ChatSuggestions';
import ChatInput from '../components/ChatInput';

export default function ChatScreen() {
  const {
    messages,
    typing,
    error,
    sendMessage,
    showEmergencyBanner,
    emergencyMessage,
    dismissEmergencyBanner,
  } = useChat();

  const renderItem = ({ item }) => {
    const isUser = item.role === 'USER';
    const isEmergency = item.tipo === 'EMERGENCIA';

    return (
      <View
        style={[
          styles.messageRow,
          isUser ? styles.userRow : styles.assistantRow,
        ]}
      >
        {!isUser && (
          <View style={styles.assistantAvatar}>
            <MaterialIcons name="auto-awesome" size={16} color="#ffffff" />
          </View>
        )}
        <View style={styles.bubbleWrapper}>
          {!isUser && isEmergency && (
            <View style={styles.labelRow}>
              <MaterialIcons name="warning" size={12} color="#d14b6d" />
              <Text style={styles.emergencyLabel}>Apoyo de emergencia</Text>
            </View>
          )}
          <View
            style={[
              styles.messageBubble,
              isUser ? styles.userBubble : styles.assistantBubble,
              isEmergency && styles.emergencyBubble,
            ]}
          >
            <Text style={[styles.messageText, isUser ? styles.userText : styles.assistantText]}>
              {item.text}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header idéntico al web */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <MaterialIcons name="auto-awesome" size={20} color="#6d72d8" />
          </View>
          <View style={styles.onlineDot} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Tiyú</Text>
          <Text style={styles.headerSubtitle}>En línea · Siempre aquí para ti</Text>
        </View>
      </View>

      {/* Banner de Emergencia estilo web */}
      {showEmergencyBanner && (
        <ChatEmergencyBanner
          message={emergencyMessage}
          onDismiss={dismissEmergencyBanner}
        />
      )}

      {/* Lista de mensajes o Sugerencias */}
      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <MaterialIcons name="auto-awesome" size={32} color="#6d72d8" />
          </View>
          <Text style={styles.emptyTitle}>Hola, soy Tiyú</Text>
          <Text style={styles.emptySubtitle}>
            Tu espacio de apoyo emocional. ¿De qué te gustaría hablar hoy?
          </Text>
          <ChatSuggestions onSelectSuggestion={sendMessage} />
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          inverted
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={typing ? <ChatTypingIndicator /> : null}
        />
      )}

      {/* Mensaje de error si falla la llamada */}
      {!!error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={typing} />
      <Text style={styles.disclaimerText}>
        Tiyú es un asistente de apoyo emocional, no reemplaza atención profesional.
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#edefff',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#edefff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6d72d8',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  headerInfo: {
    marginLeft: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '900',
    color: '#2f3348',
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: '#6d72d8',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#edefff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '900',
    color: '#2f3348',
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.sm,
    color: '#7b8094',
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: SPACING.xs,
    gap: SPACING.xs,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  assistantRow: {
    justifyContent: 'flex-start',
  },
  assistantAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#6d72d8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  bubbleWrapper: {
    maxWidth: '78%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  emergencyLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: '#d14b6d',
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
  },
  userBubble: {
    backgroundColor: '#6d72d8',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#edefff',
  },
  emergencyBubble: {
    backgroundColor: '#fff0f3',
    borderColor: '#f8c8d0',
    borderWidth: 1,
  },
  messageText: {
    fontSize: FONT_SIZE.md - 1,
    lineHeight: 22,
    fontWeight: '600',
  },
  userText: {
    color: '#ffffff',
  },
  assistantText: {
    color: '#2f3348',
  },
  errorContainer: {
    backgroundColor: '#fff0f3',
    padding: SPACING.sm,
    alignItems: 'center',
  },
  errorText: {
    color: '#d14b6d',
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  disclaimerText: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
    color: '#c5c7d8',
    paddingVertical: SPACING.xs,
    backgroundColor: '#f7f8ff',
  },
});
