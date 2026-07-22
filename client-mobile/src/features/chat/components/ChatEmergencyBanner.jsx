// client-mobile/src/features/chat/components/ChatEmergencyBanner.jsx
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SPACING } from '../../../shared/constants/theme';

export default function ChatEmergencyBanner({ message, onDismiss }) {
  const handleCall = () => {
    Linking.openURL('tel:110');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <MaterialIcons name="phone" size={16} color="#d14b6d" />
        </View>
        <View style={styles.contentFlex}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Líneas de apoyo disponibles ahora</Text>
            {onDismiss && (
              <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
                <MaterialIcons name="close" size={16} color="#7b8094" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.subText}>
            🇬🇹 Guatemala: <Text style={styles.bold}>110</Text> (PGN) · <Text style={styles.bold}>1546</Text> (MINEDUC){'\n'}
            Si estás en otro país, busca la línea de crisis local.
          </Text>
          {!!message && <Text style={styles.customMessage}>{message}</Text>}
          <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
            <MaterialIcons name="call" size={14} color="#ffffff" />
            <Text style={styles.callBtnText}>Llamar a la línea de ayuda (110)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff0f3',
    borderColor: '#f8c8d0',
    borderWidth: 1,
    borderRadius: 14,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(209, 75, 109, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentFlex: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 13,
    fontWeight: '900',
    color: '#d14b6d',
  },
  closeButton: {
    padding: 2,
  },
  subText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#505570',
    marginTop: 2,
    lineHeight: 18,
  },
  bold: {
    fontWeight: '900',
    color: '#2f3348',
  },
  customMessage: {
    fontSize: 12,
    color: '#2f3348',
    marginTop: 6,
    lineHeight: 18,
  },
  callBtn: {
    backgroundColor: '#d14b6d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
    gap: 6,
  },
  callBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
});
