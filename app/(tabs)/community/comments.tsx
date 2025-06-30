import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../../theme';
import { useApp } from '../../../providers/AppProvider';
import { useToast } from '../../../components/common/Toast';
import { useInAppTracking } from '@/hooks/useInAppTracking';
import { supabase, checkSupabaseConnection } from '../../../lib/supabase';
import { ArrowLeft, Send, Clock, Heart, MoreVertical } from 'lucide-react-native';

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

interface RealityCheck {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

export default function CommentsScreen() {
  const { colors, typography, spacing } = useTheme();
  const { user, profile } = useApp();
  const { showToast } = useToast();
  const { startTracking } = useInAppTracking();
  const router = useRouter();
  const params = useLocalSearchParams();
  const realityCheckId = params.id as string;
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [realityCheck, setRealityCheck] = useState<RealityCheck | null>(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(true);

  // Start tracking this screen
  useEffect(() => {
    startTracking('Comments');
  }, []);

  useEffect(() => {
    if (realityCheckId) {
      loadData();
    } else {
      router.back();
    }
  }, [realityCheckId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabaseConnected = await checkSupabaseConnection();
      setIsSupabaseAvailable(supabaseConnected);

      if (supabaseConnected) {
        // Load reality check
        const { data: rcData, error: rcError } = await supabase
          .from('reality_checks')
          .select(`
            *,
            profiles:user_id (
              display_name,
              avatar_url
            )
          `)
          .eq('id', realityCheckId)
          .single();

        if (rcError) throw rcError;
        setRealityCheck(rcData);

        // Load comments
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select(`
            *,
            profiles:user_id (
              display_name,
              avatar_url
            )
          `)
          .eq('reality_check_id', realityCheckId)
          .order('created_at', { ascending: true });

        if (commentsError) throw commentsError;
        setComments(commentsData || []);
      } else {
        // Use mock data
        setRealityCheck({
          id: realityCheckId,
          user_id: '1',
          title: 'Morning Mindfulness',
          description: 'Started my day with 10 minutes of meditation. Feeling centered and ready to tackle the day!',
          image_url: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          profiles: {
            display_name: 'Sarah Chen',
            avatar_url: null,
          },
        });

        setComments([
          {
            id: '1',
            user_id: '2',
            content: 'This is so inspiring! I need to start my day like this too.',
            created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            profiles: {
              display_name: 'Alex Rivera',
              avatar_url: null,
            },
          },
          {
            id: '2',
            user_id: '3',
            content: 'What meditation app do you use?',
            created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            profiles: {
              display_name: 'Jordan Kim',
              avatar_url: null,
            },
          },
        ]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load comments');
      // Use mock data as fallback
      setRealityCheck({
        id: realityCheckId,
        user_id: '1',
        title: 'Morning Mindfulness',
        description: 'Started my day with 10 minutes of meditation. Feeling centered and ready to tackle the day!',
        image_url: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        profiles: {
          display_name: 'Sarah Chen',
          avatar_url: null,
        },
      });

      setComments([
        {
          id: '1',
          user_id: '2',
          content: 'This is so inspiring! I need to start my day like this too.',
          created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          profiles: {
            display_name: 'Alex Rivera',
            avatar_url: null,
          },
        },
        {
          id: '2',
          user_id: '3',
          content: 'What meditation app do you use?',
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          profiles: {
            display_name: 'Jordan Kim',
            avatar_url: null,
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    try {
      if (isSupabaseAvailable) {
        const { data, error } = await supabase
          .from('comments')
          .insert({
            reality_check_id: realityCheckId,
            user_id: user.id,
            content: newComment.trim(),
          })
          .select(`
            *,
            profiles:user_id (
              display_name,
              avatar_url
            )
          `)
          .single();

        if (error) throw error;
        setComments(prev => [...prev, data]);
      } else {
        // Mock comment creation
        const mockComment: Comment = {
          id: Date.now().toString(),
          user_id: user.id,
          content: newComment.trim(),
          created_at: new Date().toISOString(),
          profiles: {
            display_name: profile?.display_name || user.email?.split('@')[0] || 'You',
            avatar_url: profile?.avatar_url,
          },
        };
        setComments(prev => [...prev, mockComment]);
      }

      setNewComment('');
      showToast({
        type: 'success',
        title: 'Comment Added',
        message: 'Your comment has been posted successfully!',
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to post comment',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.primary,
      backgroundColor: colors.surface.primary,
    },
    backButton: {
      padding: spacing.sm,
    },
    headerTitle: {
      ...typography.textStyles.heading.md,
      color: colors.text.primary,
      marginLeft: spacing.md,
      fontWeight: '700',
    },
    content: {
      flex: 1,
    },
    realityCheckCard: {
      margin: spacing.lg,
      marginBottom: spacing.md,
      borderRadius: spacing.lg,
      overflow: 'hidden',
    },
    realityCheckHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    userAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.gray[200],
      marginRight: spacing.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      fontWeight: '700',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      ...typography.textStyles.body.large,
      color: colors.text.primary,
      fontWeight: '700',
      marginBottom: spacing.xs,
    },
    postTime: {
      ...typography.textStyles.caption.lg,
      color: colors.text.secondary,
      fontWeight: '500',
    },
    realityCheckTitle: {
      ...typography.textStyles.heading.sm,
      color: colors.text.primary,
      fontWeight: '700',
      marginBottom: spacing.sm,
    },
    realityCheckDescription: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      lineHeight: 22,
      marginBottom: spacing.md,
    },
    realityCheckImage: {
      width: '100%',
      height: 150,
      borderRadius: spacing.md,
      marginBottom: spacing.md,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border.primary,
      marginVertical: spacing.md,
    },
    commentsContainer: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
    commentsHeader: {
      ...typography.textStyles.heading.sm,
      color: colors.text.primary,
      marginBottom: spacing.md,
      fontWeight: '700',
    },
    commentItem: {
      marginBottom: spacing.lg,
    },
    commentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    commentAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.gray[200],
      marginRight: spacing.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    commentInfo: {
      flex: 1,
    },
    commentUserName: {
      ...typography.textStyles.body.medium,
      color: colors.text.primary,
      fontWeight: '700',
      marginBottom: spacing.xs,
    },
    commentTime: {
      ...typography.textStyles.caption.md,
      color: colors.text.secondary,
      fontWeight: '500',
    },
    commentContent: {
      ...typography.textStyles.body.medium,
      color: colors.text.primary,
      lineHeight: 22,
      marginLeft: 36 + spacing.md, // Align with avatar
    },
    commentActions: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm,
      marginLeft: 36 + spacing.md, // Align with avatar
    },
    commentAction: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: spacing.lg,
    },
    commentActionText: {
      ...typography.textStyles.caption.md,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
      fontWeight: '600',
    },
    inputContainer: {
      borderTopWidth: 1,
      borderTopColor: colors.border.primary,
      padding: spacing.md,
      backgroundColor: colors.surface.primary,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border.primary,
      borderRadius: spacing.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: Platform.OS === 'ios' ? spacing.md : spacing.sm,
      ...typography.textStyles.body.medium,
      color: colors.text.primary,
      backgroundColor: colors.background.primary,
      maxHeight: 100,
    },
    sendButton: {
      marginLeft: spacing.md,
      padding: spacing.sm,
      backgroundColor: colors.primary[500],
      borderRadius: spacing.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      backgroundColor: colors.gray[300],
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      ...typography.textStyles.body.medium,
      color: colors.text.secondary,
      marginTop: spacing.md,
    },
    emptyCommentsContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    emptyCommentsText: {
      ...typography.textStyles.body.large,
      color: colors.text.secondary,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    errorText: {
      ...typography.textStyles.body.medium,
      color: colors.error[500],
      textAlign: 'center',
      margin: spacing.lg,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color={colors.text.primary} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Comments</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={styles.loadingText}>Loading comments...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color={colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comments</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          {realityCheck && (
            <View style={styles.realityCheckCard}>
              <View style={styles.realityCheckHeader}>
                <View style={styles.userAvatar}>
                  {realityCheck.profiles?.avatar_url ? (
                    <Image 
                      source={{ uri: realityCheck.profiles.avatar_url }} 
                      style={styles.userAvatar}
                    />
                  ) : (
                    <Text style={styles.avatarText}>
                      {realityCheck.profiles?.display_name?.charAt(0).toUpperCase() || '?'}
                    </Text>
                  )}
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>
                    {realityCheck.profiles?.display_name || 'Anonymous User'}
                  </Text>
                  <Text style={styles.postTime}>
                    {formatTimeAgo(realityCheck.created_at)}
                  </Text>
                </View>
              </View>

              <Text style={styles.realityCheckTitle}>{realityCheck.title}</Text>
              {realityCheck.description && (
                <Text style={styles.realityCheckDescription}>
                  {realityCheck.description}
                </Text>
              )}
              
              {realityCheck.image_url && (
                <Image 
                  source={{ uri: realityCheck.image_url }}
                  style={styles.realityCheckImage}
                  resizeMode="cover"
                />
              )}
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.commentsContainer}>
            <Text style={styles.commentsHeader}>
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </Text>

            {comments.length === 0 ? (
              <View style={styles.emptyCommentsContainer}>
                <Text style={styles.emptyCommentsText}>
                  No comments yet. Be the first to share your thoughts!
                </Text>
              </View>
            ) : (
              comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <View style={styles.commentAvatar}>
                      {comment.profiles?.avatar_url ? (
                        <Image 
                          source={{ uri: comment.profiles.avatar_url }} 
                          style={styles.commentAvatar}
                        />
                      ) : (
                        <Text style={styles.avatarText}>
                          {comment.profiles?.display_name?.charAt(0).toUpperCase() || '?'}
                        </Text>
                      )}
                    </View>
                    <View style={styles.commentInfo}>
                      <Text style={styles.commentUserName}>
                        {comment.profiles?.display_name || 'Anonymous User'}
                      </Text>
                      <Text style={styles.commentTime}>
                        {formatTimeAgo(comment.created_at)}
                      </Text>
                    </View>
                    <TouchableOpacity>
                      <MoreVertical color={colors.text.secondary} size={20} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.commentContent}>{comment.content}</Text>
                  <View style={styles.commentActions}>
                    <TouchableOpacity style={styles.commentAction}>
                      <Heart color={colors.text.secondary} size={16} />
                      <Text style={styles.commentActionText}>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.commentAction}>
                      <Clock color={colors.text.secondary} size={16} />
                      <Text style={styles.commentActionText}>{formatTimeAgo(comment.created_at)}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Add a comment..."
              placeholderTextColor={colors.text.secondary}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!newComment.trim() || submitting) && styles.sendButtonDisabled,
              ]}
              onPress={handleSubmitComment}
              disabled={!newComment.trim() || submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Send color={colors.white} size={20} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}