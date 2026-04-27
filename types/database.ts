export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4';
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      ai_generation_budget: {
        Row: {
          date: string;
          images_generated: number;
          total_cost_cents: number;
          user_id: string;
        };
        Insert: {
          date?: string;
          images_generated?: number;
          total_cost_cents?: number;
          user_id: string;
        };
        Update: {
          date?: string;
          images_generated?: number;
          total_cost_cents?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_generation_budget_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      ai_generation_log: {
        Row: {
          cost_cents: number;
          created_at: string;
          enhanced_prompt: string;
          error_message: string | null;
          id: string;
          model_used: string;
          recipe_snapshot: Json;
          rolled_axes: Json;
          status: string;
          upload_id: string | null;
          user_id: string;
        };
        Insert: {
          cost_cents?: number;
          created_at?: string;
          enhanced_prompt: string;
          error_message?: string | null;
          id?: string;
          model_used?: string;
          recipe_snapshot: Json;
          rolled_axes: Json;
          status?: string;
          upload_id?: string | null;
          user_id: string;
        };
        Update: {
          cost_cents?: number;
          created_at?: string;
          enhanced_prompt?: string;
          error_message?: string | null;
          id?: string;
          model_used?: string;
          recipe_snapshot?: Json;
          rolled_axes?: Json;
          status?: string;
          upload_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_generation_log_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 'uploads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'ai_generation_log_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      blocked_users: {
        Row: {
          blocked_id: string;
          blocker_id: string;
          created_at: string;
        };
        Insert: {
          blocked_id: string;
          blocker_id: string;
          created_at?: string;
        };
        Update: {
          blocked_id?: string;
          blocker_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'blocked_users_blocked_id_fkey';
            columns: ['blocked_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'blocked_users_blocker_id_fkey';
            columns: ['blocker_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      bot_seeds: {
        Row: {
          category: string;
          created_at: string;
          disabled: boolean;
          generation: number;
          id: string;
          template: string;
          used_at: string | null;
        };
        Insert: {
          category: string;
          created_at?: string;
          disabled?: boolean;
          generation?: number;
          id?: string;
          template: string;
          used_at?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string;
          disabled?: boolean;
          generation?: number;
          id?: string;
          template?: string;
          used_at?: string | null;
        };
        Relationships: [];
      };
      comment_likes: {
        Row: {
          comment_id: string;
          created_at: string;
          user_id: string;
        };
        Insert: {
          comment_id: string;
          created_at?: string;
          user_id: string;
        };
        Update: {
          comment_id?: string;
          created_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'comment_likes_comment_id_fkey';
            columns: ['comment_id'];
            isOneToOne: false;
            referencedRelation: 'comments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comment_likes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      comments: {
        Row: {
          body: string;
          created_at: string;
          id: string;
          is_deleted: boolean;
          like_count: number;
          parent_id: string | null;
          reply_count: number;
          upload_id: string;
          user_id: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          id?: string;
          is_deleted?: boolean;
          like_count?: number;
          parent_id?: string | null;
          reply_count?: number;
          upload_id: string;
          user_id: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          id?: string;
          is_deleted?: boolean;
          like_count?: number;
          parent_id?: string | null;
          reply_count?: number;
          upload_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'comments_parent_id_fkey';
            columns: ['parent_id'];
            isOneToOne: false;
            referencedRelation: 'comments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comments_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 'uploads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comments_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      dream_archetypes: {
        Row: {
          created_at: string;
          description: string;
          flavor_keywords: string[];
          id: string;
          is_active: boolean;
          key: string;
          min_matches: number;
          name: string;
          prompt_context: string;
          season_end: string | null;
          season_start: string | null;
          trigger_eras: string[];
          trigger_interests: string[];
          trigger_moods: string[];
          trigger_personality: string[];
          trigger_settings: string[];
        };
        Insert: {
          created_at?: string;
          description: string;
          flavor_keywords?: string[];
          id?: string;
          is_active?: boolean;
          key: string;
          min_matches?: number;
          name: string;
          prompt_context: string;
          season_end?: string | null;
          season_start?: string | null;
          trigger_eras?: string[];
          trigger_interests?: string[];
          trigger_moods?: string[];
          trigger_personality?: string[];
          trigger_settings?: string[];
        };
        Update: {
          created_at?: string;
          description?: string;
          flavor_keywords?: string[];
          id?: string;
          is_active?: boolean;
          key?: string;
          min_matches?: number;
          name?: string;
          prompt_context?: string;
          season_end?: string | null;
          season_start?: string | null;
          trigger_eras?: string[];
          trigger_interests?: string[];
          trigger_moods?: string[];
          trigger_personality?: string[];
          trigger_settings?: string[];
        };
        Relationships: [];
      };
      dream_jobs: {
        Row: {
          completed_at: string | null;
          created_at: string;
          error: string | null;
          id: string;
          result_image_url: string | null;
          result_medium: string | null;
          result_prompt: string | null;
          result_vibe: string | null;
          status: string;
          upload_id: string | null;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          error?: string | null;
          id: string;
          result_image_url?: string | null;
          result_medium?: string | null;
          result_prompt?: string | null;
          result_vibe?: string | null;
          status?: string;
          upload_id?: string | null;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          error?: string | null;
          id?: string;
          result_image_url?: string | null;
          result_medium?: string | null;
          result_prompt?: string | null;
          result_vibe?: string | null;
          status?: string;
          upload_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'dream_jobs_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 'uploads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'dream_jobs_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      dream_mediums: {
        Row: {
          character_render_mode: string;
          created_at: string;
          directive: string;
          face_swaps: boolean;
          flux_fragment: string;
          is_active: boolean;
          is_character_only: boolean;
          is_public: boolean;
          is_scene_only: boolean;
          key: string;
          label: string;
          nightly_skip: boolean;
          sort_order: number;
        };
        Insert: {
          character_render_mode?: string;
          created_at?: string;
          directive: string;
          face_swaps?: boolean;
          flux_fragment: string;
          is_active?: boolean;
          is_character_only?: boolean;
          is_public?: boolean;
          is_scene_only?: boolean;
          key: string;
          label: string;
          nightly_skip?: boolean;
          sort_order?: number;
        };
        Update: {
          character_render_mode?: string;
          created_at?: string;
          directive?: string;
          face_swaps?: boolean;
          flux_fragment?: string;
          is_active?: boolean;
          is_character_only?: boolean;
          is_public?: boolean;
          is_scene_only?: boolean;
          key?: string;
          label?: string;
          nightly_skip?: boolean;
          sort_order?: number;
        };
        Relationships: [];
      };
      dream_templates: {
        Row: {
          active_from: string | null;
          active_until: string | null;
          category: string;
          created_at: string;
          disabled: boolean;
          generation: number;
          id: string;
          seasonal: boolean;
          template: string;
          used_at: string | null;
        };
        Insert: {
          active_from?: string | null;
          active_until?: string | null;
          category: string;
          created_at?: string;
          disabled?: boolean;
          generation?: number;
          id?: string;
          seasonal?: boolean;
          template: string;
          used_at?: string | null;
        };
        Update: {
          active_from?: string | null;
          active_until?: string | null;
          category?: string;
          created_at?: string;
          disabled?: boolean;
          generation?: number;
          id?: string;
          seasonal?: boolean;
          template?: string;
          used_at?: string | null;
        };
        Relationships: [];
      };
      dream_vibes: {
        Row: {
          created_at: string;
          directive: string;
          is_active: boolean;
          key: string;
          label: string;
          sort_order: number;
        };
        Insert: {
          created_at?: string;
          directive: string;
          is_active?: boolean;
          key: string;
          label: string;
          sort_order?: number;
        };
        Update: {
          created_at?: string;
          directive?: string;
          is_active?: boolean;
          key?: string;
          label?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      favorites: {
        Row: {
          created_at: string;
          id: string;
          upload_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          upload_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          upload_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'favorites_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 'uploads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'favorites_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      follow_requests: {
        Row: {
          created_at: string;
          id: string;
          requester_id: string;
          target_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          requester_id: string;
          target_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          requester_id?: string;
          target_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'follow_requests_requester_id_fkey';
            columns: ['requester_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'follow_requests_target_id_fkey';
            columns: ['target_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      follows: {
        Row: {
          created_at: string;
          follower_id: string;
          following_id: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          follower_id: string;
          following_id: string;
          id?: string;
        };
        Update: {
          created_at?: string;
          follower_id?: string;
          following_id?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'follows_follower_id_fkey';
            columns: ['follower_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'follows_following_id_fkey';
            columns: ['following_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      friendships: {
        Row: {
          created_at: string;
          requester: string;
          status: string;
          user_a: string;
          user_b: string;
        };
        Insert: {
          created_at?: string;
          requester: string;
          status?: string;
          user_a: string;
          user_b: string;
        };
        Update: {
          created_at?: string;
          requester?: string;
          status?: string;
          user_a?: string;
          user_b?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'friendships_requester_fkey';
            columns: ['requester'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'friendships_user_a_fkey';
            columns: ['user_a'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'friendships_user_b_fkey';
            columns: ['user_b'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      likes: {
        Row: {
          created_at: string;
          id: string;
          upload_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          upload_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          upload_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'likes_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 'uploads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'likes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      location_cards: {
        Row: {
          architecture: string[];
          atmosphere: string[];
          cinematic_phrases: string[];
          created_at: string;
          fusion_settings: Json;
          id: string;
          is_approved: boolean;
          light_signature: string[];
          model_version: string;
          name: string;
          prompt_version: number;
          tags: string[];
          texture_details: string[];
          updated_at: string;
          visual_palette: string[];
        };
        Insert: {
          architecture?: string[];
          atmosphere?: string[];
          cinematic_phrases?: string[];
          created_at?: string;
          fusion_settings?: Json;
          id?: string;
          is_approved?: boolean;
          light_signature?: string[];
          model_version?: string;
          name: string;
          prompt_version?: number;
          tags?: string[];
          texture_details?: string[];
          updated_at?: string;
          visual_palette?: string[];
        };
        Update: {
          architecture?: string[];
          atmosphere?: string[];
          cinematic_phrases?: string[];
          created_at?: string;
          fusion_settings?: Json;
          id?: string;
          is_approved?: boolean;
          light_signature?: string[];
          model_version?: string;
          name?: string;
          prompt_version?: number;
          tags?: string[];
          texture_details?: string[];
          updated_at?: string;
          visual_palette?: string[];
        };
        Relationships: [];
      };
      nightly_seeds: {
        Row: {
          category: string;
          created_at: string;
          disabled: boolean;
          generation: number;
          id: string;
          template: string;
          used_at: string | null;
        };
        Insert: {
          category: string;
          created_at?: string;
          disabled?: boolean;
          generation?: number;
          id?: string;
          template: string;
          used_at?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string;
          disabled?: boolean;
          generation?: number;
          id?: string;
          template?: string;
          used_at?: string | null;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          actor_id: string;
          body: string | null;
          comment_id: string | null;
          created_at: string;
          id: string;
          recipient_id: string;
          seen_at: string | null;
          type: string;
          upload_id: string | null;
        };
        Insert: {
          actor_id: string;
          body?: string | null;
          comment_id?: string | null;
          created_at?: string;
          id?: string;
          recipient_id: string;
          seen_at?: string | null;
          type: string;
          upload_id?: string | null;
        };
        Update: {
          actor_id?: string;
          body?: string | null;
          comment_id?: string | null;
          created_at?: string;
          id?: string;
          recipient_id?: string;
          seen_at?: string | null;
          type?: string;
          upload_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_actor_id_fkey';
            columns: ['actor_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_comment_id_fkey';
            columns: ['comment_id'];
            isOneToOne: false;
            referencedRelation: 'comments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_recipient_id_fkey';
            columns: ['recipient_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 'uploads';
            referencedColumns: ['id'];
          },
        ];
      };
      object_cards: {
        Row: {
          category: string;
          context_bridges: string[];
          created_at: string;
          environment_bindings: string[];
          faceswap_forbidden: string[];
          faceswap_safe_positive: string[];
          fusion_forms: Json;
          id: string;
          interaction_modes: string[];
          is_approved: boolean;
          material_textures: string[];
          model_version: string;
          name: string;
          prompt_version: number;
          role_options: string[];
          scale: string;
          scale_contexts: string[];
          signature_details: string[];
          soft_presence_forms: string[];
          tags: string[];
          updated_at: string;
          visual_forms: string[];
        };
        Insert: {
          category?: string;
          context_bridges?: string[];
          created_at?: string;
          environment_bindings?: string[];
          faceswap_forbidden?: string[];
          faceswap_safe_positive?: string[];
          fusion_forms?: Json;
          id?: string;
          interaction_modes?: string[];
          is_approved?: boolean;
          material_textures?: string[];
          model_version?: string;
          name: string;
          prompt_version?: number;
          role_options?: string[];
          scale?: string;
          scale_contexts?: string[];
          signature_details?: string[];
          soft_presence_forms?: string[];
          tags?: string[];
          updated_at?: string;
          visual_forms?: string[];
        };
        Update: {
          category?: string;
          context_bridges?: string[];
          created_at?: string;
          environment_bindings?: string[];
          faceswap_forbidden?: string[];
          faceswap_safe_positive?: string[];
          fusion_forms?: Json;
          id?: string;
          interaction_modes?: string[];
          is_approved?: boolean;
          material_textures?: string[];
          model_version?: string;
          name?: string;
          prompt_version?: number;
          role_options?: string[];
          scale?: string;
          scale_contexts?: string[];
          signature_details?: string[];
          soft_presence_forms?: string[];
          tags?: string[];
          updated_at?: string;
          visual_forms?: string[];
        };
        Relationships: [];
      };
      post_impressions: {
        Row: {
          first_seen: string;
          id: string;
          last_seen: string;
          upload_id: string;
          user_id: string;
          view_count: number;
        };
        Insert: {
          first_seen?: string;
          id?: string;
          last_seen?: string;
          upload_id: string;
          user_id: string;
          view_count?: number;
        };
        Update: {
          first_seen?: string;
          id?: string;
          last_seen?: string;
          upload_id?: string;
          user_id?: string;
          view_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'post_impressions_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 'uploads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_impressions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      post_shares: {
        Row: {
          created_at: string;
          id: string;
          receiver_id: string;
          seen_at: string | null;
          sender_id: string;
          upload_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          receiver_id: string;
          seen_at?: string | null;
          sender_id: string;
          upload_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          receiver_id?: string;
          seen_at?: string | null;
          sender_id?: string;
          upload_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'post_shares_receiver_id_fkey';
            columns: ['receiver_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_shares_sender_id_fkey';
            columns: ['sender_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_shares_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 'uploads';
            referencedColumns: ['id'];
          },
        ];
      };
      push_tokens: {
        Row: {
          created_at: string;
          id: string;
          platform: string;
          token: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          platform?: string;
          token: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          platform?: string;
          token?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'push_tokens_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      reports: {
        Row: {
          created_at: string;
          id: string;
          reason: string;
          reporter_id: string;
          resolved: boolean;
          upload_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          reason: string;
          reporter_id: string;
          resolved?: boolean;
          upload_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          reason?: string;
          reporter_id?: string;
          resolved?: boolean;
          upload_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reports_reporter_id_fkey';
            columns: ['reporter_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reports_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 'uploads';
            referencedColumns: ['id'];
          },
        ];
      };
      sparkle_transactions: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          reason: string;
          reference_id: string | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: string;
          reason: string;
          reference_id?: string | null;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          reason?: string;
          reference_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'sparkle_transactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      uploads: {
        Row: {
          ai_concept: Json | null;
          ai_prompt: string | null;
          bot_message: string | null;
          caption: string | null;
          categories: string[];
          comment_count: number;
          created_at: string;
          description: string | null;
          dream_medium: string | null;
          dream_vibe: string | null;
          from_wish: string | null;
          fuse_count: number;
          fuse_of: string | null;
          height: number | null;
          id: string;
          image_url: string;
          is_active: boolean;
          is_ai_generated: boolean;
          is_approved: boolean | null;
          is_moderated: boolean;
          is_posted: boolean;
          is_public: boolean;
          like_count: number;
          media_type: string;
          posted_at: string | null;
          recipe_id: string | null;
          save_count: number;
          search_tsv: unknown;
          share_count: number;
          thumbnail_url: string | null;
          user_id: string;
          view_count: number;
          width: number | null;
        };
        Insert: {
          ai_concept?: Json | null;
          ai_prompt?: string | null;
          bot_message?: string | null;
          caption?: string | null;
          categories?: string[];
          comment_count?: number;
          created_at?: string;
          description?: string | null;
          dream_medium?: string | null;
          dream_vibe?: string | null;
          from_wish?: string | null;
          fuse_count?: number;
          fuse_of?: string | null;
          height?: number | null;
          id?: string;
          image_url: string;
          is_active?: boolean;
          is_ai_generated?: boolean;
          is_approved?: boolean | null;
          is_moderated?: boolean;
          is_posted?: boolean;
          is_public?: boolean;
          like_count?: number;
          media_type?: string;
          posted_at?: string | null;
          recipe_id?: string | null;
          save_count?: number;
          search_tsv?: unknown;
          share_count?: number;
          thumbnail_url?: string | null;
          user_id: string;
          view_count?: number;
          width?: number | null;
        };
        Update: {
          ai_concept?: Json | null;
          ai_prompt?: string | null;
          bot_message?: string | null;
          caption?: string | null;
          categories?: string[];
          comment_count?: number;
          created_at?: string;
          description?: string | null;
          dream_medium?: string | null;
          dream_vibe?: string | null;
          from_wish?: string | null;
          fuse_count?: number;
          fuse_of?: string | null;
          height?: number | null;
          id?: string;
          image_url?: string;
          is_active?: boolean;
          is_ai_generated?: boolean;
          is_approved?: boolean | null;
          is_moderated?: boolean;
          is_posted?: boolean;
          is_public?: boolean;
          like_count?: number;
          media_type?: string;
          posted_at?: string | null;
          recipe_id?: string | null;
          save_count?: number;
          search_tsv?: unknown;
          share_count?: number;
          thumbnail_url?: string | null;
          user_id?: string;
          view_count?: number;
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'uploads_fuse_of_fkey';
            columns: ['fuse_of'];
            isOneToOne: false;
            referencedRelation: 'uploads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'uploads_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_archetypes: {
        Row: {
          archetype_id: string;
          created_at: string;
          user_id: string;
        };
        Insert: {
          archetype_id: string;
          created_at?: string;
          user_id: string;
        };
        Update: {
          archetype_id?: string;
          created_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_archetypes_archetype_id_fkey';
            columns: ['archetype_id'];
            isOneToOne: false;
            referencedRelation: 'dream_archetypes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_archetypes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_recipes: {
        Row: {
          ai_enabled: boolean;
          created_at: string;
          dream_wish: string | null;
          onboarding_completed: boolean;
          recipe: Json;
          updated_at: string;
          user_id: string;
          wish_modifiers: Json | null;
          wish_recipient_ids: Json | null;
        };
        Insert: {
          ai_enabled?: boolean;
          created_at?: string;
          dream_wish?: string | null;
          onboarding_completed?: boolean;
          recipe?: Json;
          updated_at?: string;
          user_id: string;
          wish_modifiers?: Json | null;
          wish_recipient_ids?: Json | null;
        };
        Update: {
          ai_enabled?: boolean;
          created_at?: string;
          dream_wish?: string | null;
          onboarding_completed?: boolean;
          recipe?: Json;
          updated_at?: string;
          user_id?: string;
          wish_modifiers?: Json | null;
          wish_recipient_ids?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'user_recipes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          has_ai_recipe: boolean;
          id: string;
          is_admin: boolean | null;
          is_public: boolean;
          last_active_at: string | null;
          sparkle_balance: number;
          username: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          has_ai_recipe?: boolean;
          id: string;
          is_admin?: boolean | null;
          is_public?: boolean;
          last_active_at?: string | null;
          sparkle_balance?: number;
          username: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          has_ai_recipe?: boolean;
          id?: string;
          is_admin?: boolean | null;
          is_public?: boolean;
          last_active_at?: string | null;
          sparkle_balance?: number;
          username?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      ai_cost_summary: {
        Row: {
          cost_cents: number | null;
          date: string | null;
          images: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      admin_delete_upload: { Args: { p_upload_id: string }; Returns: undefined };
      approve_follow_and_follow_back: {
        Args: { p_requester_id: string };
        Returns: undefined;
      };
      approve_follow_request: {
        Args: { p_requester_id: string };
        Returns: undefined;
      };
      block_user: { Args: { p_blocked_id: string }; Returns: undefined };
      delete_own_account: { Args: never; Returns: undefined };
      deny_follow_request: {
        Args: { p_requester_id: string };
        Returns: undefined;
      };
      finalize_nightly_upload: {
        Args: {
          p_bot_message?: string;
          p_from_wish?: string;
          p_upload_id: string;
        };
        Returns: undefined;
      };
      get_bot_users: {
        Args: Record<PropertyKey, never>;
        Returns: {
          avatar_url: string;
          id: string;
          username: string;
        }[];
      };
      get_comments: {
        Args: { p_limit?: number; p_offset?: number; p_upload_id: string };
        Returns: {
          avatar_url: string;
          body: string;
          created_at: string;
          id: string;
          like_count: number;
          parent_id: string;
          reply_count: number;
          user_id: string;
          username: string;
        }[];
      };
      get_dream_mediums: {
        Args: never;
        Returns: {
          character_render_mode: string;
          directive: string;
          face_swaps: boolean;
          flux_fragment: string;
          is_character_only: boolean;
          is_scene_only: boolean;
          key: string;
          label: string;
          nightly_skip: boolean;
          sort_order: number;
        }[];
      };
      get_dream_vibes: {
        Args: never;
        Returns: {
          directive: string;
          key: string;
          label: string;
        }[];
      };
      get_feed: {
        Args: {
          p_bot_user_id?: string;
          p_cursor_id?: string;
          p_cursor_score?: number;
          p_limit?: number;
          p_medium?: string;
          p_offset?: number;
          p_seed?: number;
          p_tab?: string;
          p_user_id: string;
          p_vibe?: string;
        };
        Returns: {
          ai_concept: Json;
          ai_prompt: string;
          avatar_url: string;
          bot_message: string;
          caption: string;
          comment_count: number;
          created_at: string;
          description: string;
          dream_medium: string;
          dream_vibe: string;
          feed_score: number;
          fuse_count: number;
          height: number;
          id: string;
          image_url: string;
          like_count: number;
          posted_at: string;
          user_id: string;
          username: string;
          width: number;
        }[];
      };
      get_notifications: {
        Args: { p_limit?: number; p_offset?: number; p_user_id: string };
        Returns: {
          actor_avatar_url: string;
          actor_id: string;
          actor_username: string;
          body: string;
          comment_id: string;
          created_at: string;
          id: string;
          image_url: string;
          is_seen: boolean;
          thumbnail_url: string;
          type: string;
          upload_id: string;
        }[];
      };
      get_public_profile: {
        Args: { p_user_id: string };
        Returns: {
          avatar_url: string;
          follower_count: number;
          following_count: number;
          has_request: boolean;
          id: string;
          is_following: boolean;
          is_public: boolean;
          post_count: number;
          username: string;
        }[];
      };
      get_replies: {
        Args: { p_comment_id: string; p_limit?: number };
        Returns: {
          avatar_url: string;
          body: string;
          created_at: string;
          id: string;
          is_liked: boolean;
          like_count: number;
          parent_id: string;
          user_id: string;
          user_rank: string;
          username: string;
        }[];
      };
      get_shareable_vibers: {
        Args: { p_user_id: string };
        Returns: {
          avatar_url: string;
          interaction_count: number;
          user_id: string;
          username: string;
          vibe_score: number;
        }[];
      };
      get_unread_notification_count: {
        Args: { p_user_id: string };
        Returns: number;
      };
      grant_sparkles: {
        Args: { p_amount: number; p_reason: string; p_user_id: string };
        Returns: undefined;
      };
      record_impression: {
        Args: { p_upload_id: string; p_user_id: string };
        Returns: undefined;
      };
      spend_sparkles: {
        Args: {
          p_amount: number;
          p_reason: string;
          p_reference_id?: string;
          p_user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      vote_type: 'rad' | 'bad' | 'skip';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      vote_type: ['rad', 'bad', 'skip'],
    },
  },
} as const;
