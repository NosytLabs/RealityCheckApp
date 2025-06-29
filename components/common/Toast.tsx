import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, Circle as XCircle, Info, X } from 'lucide-react-native';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastConfig {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastContextType {
  showToast: (config: Omit<ToastConfig, 'id'>) => void;
  hideToast: (id: string) => void;
  hideAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  const showToast = useCallback((config: Omit<ToastConfig, 'id'>) => {
    const id = Date.now().toString();
    const newToast: ToastConfig = {
      ...config,
      id,
      duration: config.duration ?? 4000,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-hide toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, newToast.duration);
    }
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const hideAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const contextValue: ToastContextType = {
    showToast,
    hideToast,
    hideAllToasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onHide={hideToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: ToastConfig[];
  onHide: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onHide }) => {
  const { colors, spacing } = useTheme();

  if (toasts.length === 0) return null;

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      pointerEvents: 'box-none',
    },
    toastWrapper: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      pointerEvents: 'box-none',
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {toasts.map((toast) => (
        <View key={toast.id} style={styles.toastWrapper}>
          <ToastItem toast={toast} onHide={onHide} />
        </View>
      ))}
    </SafeAreaView>
  );
};

interface ToastItemProps {
  toast: ToastConfig;
  onHide: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onHide }) => {
  const { colors, typography, spacing } = useTheme();
  const [slideAnim] = useState(new Animated.Value(-100));
  const [opacityAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleHide = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide(toast.id);
    });
  };

  const getToastConfig = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: colors.success[50],
          borderColor: colors.success[200],
          iconColor: colors.success[600],
          icon: CheckCircle,
        };
      case 'error':
        return {
          backgroundColor: colors.error[50],
          borderColor: colors.error[200],
          iconColor: colors.error[600],
          icon: XCircle,
        };
      case 'warning':
        return {
          backgroundColor: colors.warning[50],
          borderColor: colors.warning[200],
          iconColor: colors.warning[600],
          icon: AlertCircle,
        };
      case 'info':
        return {
          backgroundColor: colors.blue[50],
          borderColor: colors.blue[200],
          iconColor: colors.blue[600],
          icon: Info,
        };
    }
  };

  const config = getToastConfig(toast.type);
  const IconComponent = config.icon;

  const styles = StyleSheet.create({
    toast: {
      backgroundColor: config.backgroundColor,
      borderWidth: 1,
      borderColor: config.borderColor,
      borderRadius: spacing.md,
      padding: spacing.md,
      flexDirection: 'row',
      alignItems: 'flex-start',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    iconContainer: {
      marginRight: spacing.md,
      marginTop: 2,
    },
    content: {
      flex: 1,
    },
    title: {
      ...typography.textStyles.body.medium,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: toast.message ? spacing.xs : 0,
    },
    message: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      lineHeight: 20,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: spacing.sm,
    },
    actionButton: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: spacing.sm,
      backgroundColor: colors.primary[500],
      marginRight: spacing.sm,
    },
    actionButtonText: {
      ...typography.textStyles.caption.lg,
      color: colors.white,
      fontWeight: '600',
    },
    closeButton: {
      padding: spacing.xs,
    },
  });

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <IconComponent color={config.iconColor} size={20} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{toast.title}</Text>
        {toast.message && (
          <Text style={styles.message}>{toast.message}</Text>
        )}
      </View>

      <View style={styles.actions}>
        {toast.action && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={toast.action.onPress}
          >
            <Text style={styles.actionButtonText}>{toast.action.label}</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleHide}
        >
          <X color={colors.text.secondary} size={16} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;