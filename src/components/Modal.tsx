import React from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Text } from 'react-native';
import Card from './Card';
import { useTheme } from '../styles/Theme';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomModal: React.FC<ModalProps> = ({ visible, onClose, children }) => {
  const { colors, spacing, borders, typography } = useTheme();

  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      width: '80%',
      maxHeight: '80%',
      backgroundColor: colors.card,
      borderRadius: borders.radius,
      padding: spacing.lg,
      alignItems: 'center',
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    closeButton: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
    },
    closeButtonText: {
      ...typography.h3,
      color: colors.text,
    },
  });
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <Card style={styles.modalView}>
              {children}
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </Card>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomModal;