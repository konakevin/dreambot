export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4';
  };
  public: {
    Tables: {
      action_poses: {
        Row: {
          biomes: string[] | null;
          cast_type: string;
          created_at: string;
          disabled: boolean;
          id: number;
          pool: string;
          text: string;
          weight: number;
        };
        Insert: {
          biomes?: string[] | null;
          cast_type: string;
          created_at?: string;
          disabled?: boolean;
          id?: number;
          pool?: string;
          text: string;
          weight?: number;
        };
        Update: {
          biomes?: string[] | null;
          cast_type?: string;
          created_at?: string;
          disabled?: boolean;
          id?: number;
          pool?: string;
          text?: string;
          weight?: number;
        };
        Relationships: [];
      };
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
          fallback_reasons: string[];
          id: string;
          job_id: string | null;
          model_used: string;
          recipe_snapshot: Json;
          replicate_prediction_id: string | null;
          rolled_axes: Json;
          sonnet_brief: string | null;
          sonnet_raw_response: string | null;
          status: string;
          upload_id: string | null;
          user_id: string;
          vision_description: string | null;
        };
        Insert: {
          cost_cents?: number;
          created_at?: string;
          enhanced_prompt: string;
          error_message?: string | null;
          fallback_reasons?: string[];
          id?: string;
          job_id?: string | null;
          model_used?: string;
          recipe_snapshot: Json;
          replicate_prediction_id?: string | null;
          rolled_axes: Json;
          sonnet_brief?: string | null;
          sonnet_raw_response?: string | null;
          status?: string;
          upload_id?: string | null;
          user_id: string;
          vision_description?: string | null;
        };
        Update: {
          cost_cents?: number;
          created_at?: string;
          enhanced_prompt?: string;
          error_message?: string | null;
          fallback_reasons?: string[];
          id?: string;
          job_id?: string | null;
          model_used?: string;
          recipe_snapshot?: Json;
          replicate_prediction_id?: string | null;
          rolled_axes?: Json;
          sonnet_brief?: string | null;
          sonnet_raw_response?: string | null;
          status?: string;
          upload_id?: string | null;
          user_id?: string;
          vision_description?: string | null;
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
      announcement_seen: {
        Row: {
          announcement_id: string;
          seen_at: string;
          user_id: string;
        };
        Insert: {
          announcement_id: string;
          seen_at?: string;
          user_id: string;
        };
        Update: {
          announcement_id?: string;
          seen_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'announcement_seen_announcement_id_fkey';
            columns: ['announcement_id'];
            isOneToOne: false;
            referencedRelation: 'announcements';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'announcement_seen_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      announcements: {
        Row: {
          audience: string;
          body: string;
          created_at: string;
          cta_label: string | null;
          cta_route: string | null;
          ends_at: string | null;
          id: string;
          image_url: string | null;
          is_active: boolean;
          min_build: number | null;
          priority: number;
          starts_at: string;
          style: string;
          title: string;
        };
        Insert: {
          audience?: string;
          body: string;
          created_at?: string;
          cta_label?: string | null;
          cta_route?: string | null;
          ends_at?: string | null;
          id: string;
          image_url?: string | null;
          is_active?: boolean;
          min_build?: number | null;
          priority?: number;
          starts_at?: string;
          style?: string;
          title: string;
        };
        Update: {
          audience?: string;
          body?: string;
          created_at?: string;
          cta_label?: string | null;
          cta_route?: string | null;
          ends_at?: string | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          min_build?: number | null;
          priority?: number;
          starts_at?: string;
          style?: string;
          title?: string;
        };
        Relationships: [];
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
      bot_config: {
        Row: {
          allowed_models: string[] | null;
          bot_name: string;
          chaos_enabled: boolean | null;
          mediums: string[] | null;
          overrides: Json | null;
          two_pass_polish_enabled: boolean | null;
          updated_at: string;
          vibes: string[] | null;
        };
        Insert: {
          allowed_models?: string[] | null;
          bot_name: string;
          chaos_enabled?: boolean | null;
          mediums?: string[] | null;
          overrides?: Json | null;
          two_pass_polish_enabled?: boolean | null;
          updated_at?: string;
          vibes?: string[] | null;
        };
        Update: {
          allowed_models?: string[] | null;
          bot_name?: string;
          chaos_enabled?: boolean | null;
          mediums?: string[] | null;
          overrides?: Json | null;
          two_pass_polish_enabled?: boolean | null;
          updated_at?: string;
          vibes?: string[] | null;
        };
        Relationships: [];
      };
      bot_dedup: {
        Row: {
          axis: string;
          bot_name: string;
          id: number;
          picked_at: string;
          value: string;
        };
        Insert: {
          axis: string;
          bot_name: string;
          id?: number;
          picked_at?: string;
          value: string;
        };
        Update: {
          axis?: string;
          bot_name?: string;
          id?: number;
          picked_at?: string;
          value?: string;
        };
        Relationships: [];
      };
      bot_path_cycle: {
        Row: {
          bot_name: string;
          path: string;
          posted_at: string;
        };
        Insert: {
          bot_name: string;
          path: string;
          posted_at?: string;
        };
        Update: {
          bot_name?: string;
          path?: string;
          posted_at?: string;
        };
        Relationships: [];
      };
      bot_run_log: {
        Row: {
          bot_name: string;
          cost_cents: number | null;
          created_at: string;
          duration_ms: number | null;
          error: string | null;
          error_stage: string | null;
          id: string;
          image_url: string | null;
          medium: string | null;
          model: string | null;
          path: string | null;
          prompt_preview: string | null;
          sonnet_fell_back_to_secondary: boolean | null;
          sonnet_retries: number | null;
          source: string;
          status: string;
          vibe: string | null;
        };
        Insert: {
          bot_name: string;
          cost_cents?: number | null;
          created_at?: string;
          duration_ms?: number | null;
          error?: string | null;
          error_stage?: string | null;
          id?: string;
          image_url?: string | null;
          medium?: string | null;
          model?: string | null;
          path?: string | null;
          prompt_preview?: string | null;
          sonnet_fell_back_to_secondary?: boolean | null;
          sonnet_retries?: number | null;
          source?: string;
          status: string;
          vibe?: string | null;
        };
        Update: {
          bot_name?: string;
          cost_cents?: number | null;
          created_at?: string;
          duration_ms?: number | null;
          error?: string | null;
          error_stage?: string | null;
          id?: string;
          image_url?: string | null;
          medium?: string | null;
          model?: string | null;
          path?: string | null;
          prompt_preview?: string | null;
          sonnet_fell_back_to_secondary?: boolean | null;
          sonnet_retries?: number | null;
          source?: string;
          status?: string;
          vibe?: string | null;
        };
        Relationships: [];
      };
      bot_schedules: {
        Row: {
          active: boolean;
          bot_name: string;
          consecutive_failures: number;
          created_at: string;
          last_failure_at: string | null;
          last_failure_reason: string | null;
          last_posted_at: string | null;
          next_due_at: string | null;
          notes: string | null;
          phase_seed: number;
          posts_per_day: number;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          bot_name: string;
          consecutive_failures?: number;
          created_at?: string;
          last_failure_at?: string | null;
          last_failure_reason?: string | null;
          last_posted_at?: string | null;
          next_due_at?: string | null;
          notes?: string | null;
          phase_seed: number;
          posts_per_day?: number;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          bot_name?: string;
          consecutive_failures?: number;
          created_at?: string;
          last_failure_at?: string | null;
          last_failure_reason?: string | null;
          last_posted_at?: string | null;
          next_due_at?: string | null;
          notes?: string | null;
          phase_seed?: number;
          posts_per_day?: number;
          updated_at?: string;
        };
        Relationships: [];
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
      db_health_log: {
        Row: {
          active_conn: number | null;
          by_application: Json | null;
          by_wait_event: Json | null;
          captured_at: string;
          id: number;
          idle_conn: number | null;
          idle_in_txn_conn: number | null;
          lock_waiters: number | null;
          longest_active_query: string | null;
          longest_active_secs: number | null;
          longest_idle_txn_query: string | null;
          longest_idle_txn_secs: number | null;
          max_connections: number | null;
          total_conn: number | null;
        };
        Insert: {
          active_conn?: number | null;
          by_application?: Json | null;
          by_wait_event?: Json | null;
          captured_at?: string;
          id?: number;
          idle_conn?: number | null;
          idle_in_txn_conn?: number | null;
          lock_waiters?: number | null;
          longest_active_query?: string | null;
          longest_active_secs?: number | null;
          longest_idle_txn_query?: string | null;
          longest_idle_txn_secs?: number | null;
          max_connections?: number | null;
          total_conn?: number | null;
        };
        Update: {
          active_conn?: number | null;
          by_application?: Json | null;
          by_wait_event?: Json | null;
          captured_at?: string;
          id?: number;
          idle_conn?: number | null;
          idle_in_txn_conn?: number | null;
          lock_waiters?: number | null;
          longest_active_query?: string | null;
          longest_active_secs?: number | null;
          longest_idle_txn_query?: string | null;
          longest_idle_txn_secs?: number | null;
          max_connections?: number | null;
          total_conn?: number | null;
        };
        Relationships: [];
      };
      dlt_clean_mediums: {
        Row: {
          clean_directive: string;
          clean_flux_fragment: string;
          created_at: string;
          medium_key: string;
        };
        Insert: {
          clean_directive: string;
          clean_flux_fragment: string;
          created_at?: string;
          medium_key: string;
        };
        Update: {
          clean_directive?: string;
          clean_flux_fragment?: string;
          created_at?: string;
          medium_key?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'dlt_clean_mediums_medium_key_fkey';
            columns: ['medium_key'];
            isOneToOne: true;
            referencedRelation: 'dream_mediums';
            referencedColumns: ['key'];
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
          attempt_count: number;
          completed_at: string | null;
          created_at: string;
          error: string | null;
          id: string;
          notify_on_complete: boolean;
          payload: Json | null;
          result_image_url: string | null;
          result_medium: string | null;
          result_prompt: string | null;
          result_vibe: string | null;
          status: string;
          upload_id: string | null;
          user_id: string;
        };
        Insert: {
          attempt_count?: number;
          completed_at?: string | null;
          created_at?: string;
          error?: string | null;
          id: string;
          notify_on_complete?: boolean;
          payload?: Json | null;
          result_image_url?: string | null;
          result_medium?: string | null;
          result_prompt?: string | null;
          result_vibe?: string | null;
          status?: string;
          upload_id?: string | null;
          user_id: string;
        };
        Update: {
          attempt_count?: number;
          completed_at?: string | null;
          created_at?: string;
          error?: string | null;
          id?: string;
          notify_on_complete?: boolean;
          payload?: Json | null;
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
          allowed_models: string[] | null;
          character_render_mode: string;
          client_meta: Json | null;
          created_at: string;
          description: string | null;
          directive: string;
          engine: string | null;
          face_swap_directive: string | null;
          face_swap_flux_fragment: string | null;
          face_swaps: boolean;
          flux_dev_prompt_template: string | null;
          flux_fragment: string;
          is_active: boolean;
          is_bot_only: boolean;
          is_character_only: boolean;
          is_dream_eligible: boolean;
          is_public: boolean;
          is_scene_eligible: boolean;
          is_scene_only: boolean;
          key: string;
          kontext_directive: string | null;
          label: string;
          nightly_skip: boolean;
          preferred_model: string | null;
          render_base: string | null;
          scene_eligible_models: string[] | null;
          sort_order: number;
        };
        Insert: {
          allowed_models?: string[] | null;
          character_render_mode?: string;
          client_meta?: Json | null;
          created_at?: string;
          description?: string | null;
          directive: string;
          engine?: string | null;
          face_swap_directive?: string | null;
          face_swap_flux_fragment?: string | null;
          face_swaps?: boolean;
          flux_dev_prompt_template?: string | null;
          flux_fragment: string;
          is_active?: boolean;
          is_bot_only?: boolean;
          is_character_only?: boolean;
          is_dream_eligible?: boolean;
          is_public?: boolean;
          is_scene_eligible?: boolean;
          is_scene_only?: boolean;
          key: string;
          kontext_directive?: string | null;
          label: string;
          nightly_skip?: boolean;
          preferred_model?: string | null;
          render_base?: string | null;
          scene_eligible_models?: string[] | null;
          sort_order?: number;
        };
        Update: {
          allowed_models?: string[] | null;
          character_render_mode?: string;
          client_meta?: Json | null;
          created_at?: string;
          description?: string | null;
          directive?: string;
          engine?: string | null;
          face_swap_directive?: string | null;
          face_swap_flux_fragment?: string | null;
          face_swaps?: boolean;
          flux_dev_prompt_template?: string | null;
          flux_fragment?: string;
          is_active?: boolean;
          is_bot_only?: boolean;
          is_character_only?: boolean;
          is_dream_eligible?: boolean;
          is_public?: boolean;
          is_scene_eligible?: boolean;
          is_scene_only?: boolean;
          key?: string;
          kontext_directive?: string | null;
          label?: string;
          nightly_skip?: boolean;
          preferred_model?: string | null;
          render_base?: string | null;
          scene_eligible_models?: string[] | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      dream_queue: {
        Row: {
          attempt_count: number;
          completed_at: string | null;
          created_at: string;
          current_stage: string | null;
          dedup_key: string | null;
          id: string;
          last_error: string | null;
          model: string | null;
          payload: Json;
          source: string;
          stage_updated_at: string | null;
          started_at: string | null;
          status: string;
          upload_id: string | null;
          user_id: string;
          weight: string;
          worker_id: string | null;
        };
        Insert: {
          attempt_count?: number;
          completed_at?: string | null;
          created_at?: string;
          current_stage?: string | null;
          dedup_key?: string | null;
          id?: string;
          last_error?: string | null;
          model?: string | null;
          payload: Json;
          source: string;
          stage_updated_at?: string | null;
          started_at?: string | null;
          status?: string;
          upload_id?: string | null;
          user_id: string;
          weight?: string;
          worker_id?: string | null;
        };
        Update: {
          attempt_count?: number;
          completed_at?: string | null;
          created_at?: string;
          current_stage?: string | null;
          dedup_key?: string | null;
          id?: string;
          last_error?: string | null;
          model?: string | null;
          payload?: Json;
          source?: string;
          stage_updated_at?: string | null;
          started_at?: string | null;
          status?: string;
          upload_id?: string | null;
          user_id?: string;
          weight?: string;
          worker_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'dream_queue_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 'uploads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'dream_queue_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      dream_vibes: {
        Row: {
          client_meta: Json | null;
          created_at: string;
          description: string | null;
          directive: string;
          face_swap_directive: string | null;
          is_active: boolean;
          is_dream_eligible: boolean;
          key: string;
          label: string;
          mood_profile: Json | null;
          sort_order: number;
        };
        Insert: {
          client_meta?: Json | null;
          created_at?: string;
          description?: string | null;
          directive: string;
          face_swap_directive?: string | null;
          is_active?: boolean;
          is_dream_eligible?: boolean;
          key: string;
          label: string;
          mood_profile?: Json | null;
          sort_order?: number;
        };
        Update: {
          client_meta?: Json | null;
          created_at?: string;
          description?: string | null;
          directive?: string;
          face_swap_directive?: string | null;
          is_active?: boolean;
          is_dream_eligible?: boolean;
          key?: string;
          label?: string;
          mood_profile?: Json | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      dual_scenarios: {
        Row: {
          attire: string;
          category: string | null;
          created_at: string;
          disabled: boolean;
          id: string;
          medium_ban: string | null;
          medium_key: string | null;
          pool: string;
          pose_pool: string | null;
          scene: string;
        };
        Insert: {
          attire: string;
          category?: string | null;
          created_at?: string;
          disabled?: boolean;
          id?: string;
          medium_ban?: string | null;
          medium_key?: string | null;
          pool: string;
          pose_pool?: string | null;
          scene: string;
        };
        Update: {
          attire?: string;
          category?: string | null;
          created_at?: string;
          disabled?: boolean;
          id?: string;
          medium_ban?: string | null;
          medium_key?: string | null;
          pool?: string;
          pose_pool?: string | null;
          scene?: string;
        };
        Relationships: [];
      };
      edge_function_invocations: {
        Row: {
          created_at: string;
          function_name: string;
          id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          function_name: string;
          id?: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          function_name?: string;
          id?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      engine_config: {
        Row: {
          base_sparkle_cost: number;
          basic_hd_downloads_per_month: number;
          basic_monthly_sparkle_bundle: number;
          chaos_high_threshold: number;
          chaos_low_threshold: number;
          dream_art_mediums: string[];
          dream_art_share: number;
          dream_queue_max_concurrent: number;
          dream_queue_max_concurrent_heavy: number;
          dream_queue_max_jobs_per_tick: number;
          dual_action_pose_pct: number;
          dual_scene_active_pct: number;
          dual_scene_elegant_pct: number;
          dual_scene_goofy_pct: number;
          embodied_mediums_high: string[];
          embodied_mediums_mid: string[];
          extra_models_high: string[];
          extra_models_mid: string[];
          face_restore_create_enabled: boolean;
          face_restore_enabled: boolean;
          face_restore_fidelity: number;
          face_swap_dual_rate: number;
          face_swap_self_rate: number;
          face_swap_share: number;
          face_swap_share_with_plus_one: number;
          first_dream_ip_max: number;
          first_dream_ip_window_hours: number;
          gallery_max_images: number;
          gift_max_per_day: number;
          gift_max_per_send: number;
          gift_message_max_len: number;
          gifting_enabled: boolean;
          id: number;
          latest_app_version: string | null;
          max_pinned_posts: number;
          min_app_version: string | null;
          new_scene_max_people: number;
          new_scene_price_best: number;
          new_scene_price_standard: number;
          nightly_enabled: boolean;
          nightly_max_jobs: number;
          nightly_require_ai_enabled: boolean;
          nightly_require_onboarding: boolean;
          pet_words: string;
          photo_preprocess_quality: number;
          photo_preprocess_width: number;
          pro_monthly_sparkle_bundle: number;
          pro_trial_days: number;
          prompt_max_length: number;
          relationship_regex: string | null;
          relationship_words: string;
          scene_eligible_models: string[];
          scene_embodied_rate: number;
          scene_embodied_rate_high: number;
          scene_embodied_rate_low: number;
          scene_embodied_rate_mid: number;
          self_ref_regex: string | null;
          single_action_pose_pct: number;
          single_composition_expanded_pct: number;
          single_scene_active_pct: number;
          single_scene_elegant_pct: number;
          single_scene_goofy_pct: number;
          updated_at: string;
          welcome_sparkle_bonus: number;
        };
        Insert: {
          base_sparkle_cost?: number;
          basic_hd_downloads_per_month?: number;
          basic_monthly_sparkle_bundle?: number;
          chaos_high_threshold?: number;
          chaos_low_threshold?: number;
          dream_art_mediums?: string[];
          dream_art_share?: number;
          dream_queue_max_concurrent?: number;
          dream_queue_max_concurrent_heavy?: number;
          dream_queue_max_jobs_per_tick?: number;
          dual_action_pose_pct?: number;
          dual_scene_active_pct?: number;
          dual_scene_elegant_pct?: number;
          dual_scene_goofy_pct?: number;
          embodied_mediums_high?: string[];
          embodied_mediums_mid?: string[];
          extra_models_high?: string[];
          extra_models_mid?: string[];
          face_restore_create_enabled?: boolean;
          face_restore_enabled?: boolean;
          face_restore_fidelity?: number;
          face_swap_dual_rate?: number;
          face_swap_self_rate?: number;
          face_swap_share?: number;
          face_swap_share_with_plus_one?: number;
          first_dream_ip_max?: number;
          first_dream_ip_window_hours?: number;
          gallery_max_images?: number;
          gift_max_per_day?: number;
          gift_max_per_send?: number;
          gift_message_max_len?: number;
          gifting_enabled?: boolean;
          id?: number;
          latest_app_version?: string | null;
          max_pinned_posts?: number;
          min_app_version?: string | null;
          new_scene_max_people?: number;
          new_scene_price_best?: number;
          new_scene_price_standard?: number;
          nightly_enabled?: boolean;
          nightly_max_jobs?: number;
          nightly_require_ai_enabled?: boolean;
          nightly_require_onboarding?: boolean;
          pet_words?: string;
          photo_preprocess_quality?: number;
          photo_preprocess_width?: number;
          pro_monthly_sparkle_bundle?: number;
          pro_trial_days?: number;
          prompt_max_length?: number;
          relationship_regex?: string | null;
          relationship_words?: string;
          scene_eligible_models?: string[];
          scene_embodied_rate?: number;
          scene_embodied_rate_high?: number;
          scene_embodied_rate_low?: number;
          scene_embodied_rate_mid?: number;
          self_ref_regex?: string | null;
          single_action_pose_pct?: number;
          single_composition_expanded_pct?: number;
          single_scene_active_pct?: number;
          single_scene_elegant_pct?: number;
          single_scene_goofy_pct?: number;
          updated_at?: string;
          welcome_sparkle_bonus?: number;
        };
        Update: {
          base_sparkle_cost?: number;
          basic_hd_downloads_per_month?: number;
          basic_monthly_sparkle_bundle?: number;
          chaos_high_threshold?: number;
          chaos_low_threshold?: number;
          dream_art_mediums?: string[];
          dream_art_share?: number;
          dream_queue_max_concurrent?: number;
          dream_queue_max_concurrent_heavy?: number;
          dream_queue_max_jobs_per_tick?: number;
          dual_action_pose_pct?: number;
          dual_scene_active_pct?: number;
          dual_scene_elegant_pct?: number;
          dual_scene_goofy_pct?: number;
          embodied_mediums_high?: string[];
          embodied_mediums_mid?: string[];
          extra_models_high?: string[];
          extra_models_mid?: string[];
          face_restore_create_enabled?: boolean;
          face_restore_enabled?: boolean;
          face_restore_fidelity?: number;
          face_swap_dual_rate?: number;
          face_swap_self_rate?: number;
          face_swap_share?: number;
          face_swap_share_with_plus_one?: number;
          first_dream_ip_max?: number;
          first_dream_ip_window_hours?: number;
          gallery_max_images?: number;
          gift_max_per_day?: number;
          gift_max_per_send?: number;
          gift_message_max_len?: number;
          gifting_enabled?: boolean;
          id?: number;
          latest_app_version?: string | null;
          max_pinned_posts?: number;
          min_app_version?: string | null;
          new_scene_max_people?: number;
          new_scene_price_best?: number;
          new_scene_price_standard?: number;
          nightly_enabled?: boolean;
          nightly_max_jobs?: number;
          nightly_require_ai_enabled?: boolean;
          nightly_require_onboarding?: boolean;
          pet_words?: string;
          photo_preprocess_quality?: number;
          photo_preprocess_width?: number;
          pro_monthly_sparkle_bundle?: number;
          pro_trial_days?: number;
          prompt_max_length?: number;
          relationship_regex?: string | null;
          relationship_words?: string;
          scene_eligible_models?: string[];
          scene_embodied_rate?: number;
          scene_embodied_rate_high?: number;
          scene_embodied_rate_low?: number;
          scene_embodied_rate_mid?: number;
          self_ref_regex?: string | null;
          single_action_pose_pct?: number;
          single_composition_expanded_pct?: number;
          single_scene_active_pct?: number;
          single_scene_elegant_pct?: number;
          single_scene_goofy_pct?: number;
          updated_at?: string;
          welcome_sparkle_bonus?: number;
        };
        Relationships: [];
      };
      face_swap_model_overrides: {
        Row: {
          banned_vibes: string[];
          created_at: string;
          fragment: string;
          id: number;
          is_active: boolean;
          medium_key: string;
          model: string;
          note: string | null;
        };
        Insert: {
          banned_vibes?: string[];
          created_at?: string;
          fragment: string;
          id?: never;
          is_active?: boolean;
          medium_key: string;
          model: string;
          note?: string | null;
        };
        Update: {
          banned_vibes?: string[];
          created_at?: string;
          fragment?: string;
          id?: never;
          is_active?: boolean;
          medium_key?: string;
          model?: string;
          note?: string | null;
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
      first_dream_ip_events: {
        Row: {
          created_at: string;
          id: number;
          ip: string;
        };
        Insert: {
          created_at?: string;
          id?: never;
          ip: string;
        };
        Update: {
          created_at?: string;
          id?: never;
          ip?: string;
        };
        Relationships: [];
      };
      first_dream_scene_cards: {
        Row: {
          banned_motifs: string[];
          composition_brief: string;
          created_at: string;
          iconic_motifs: string[];
          id: string;
          lighting_recipe: string;
          location_key: string;
          mood: string;
          pose_duo: string | null;
          pose_no_cast: string | null;
          pose_solo: string | null;
          scene_title: string;
          slot_idx: number;
          works_for_personas: string[];
        };
        Insert: {
          banned_motifs?: string[];
          composition_brief: string;
          created_at?: string;
          iconic_motifs: string[];
          id?: string;
          lighting_recipe: string;
          location_key: string;
          mood: string;
          pose_duo?: string | null;
          pose_no_cast?: string | null;
          pose_solo?: string | null;
          scene_title: string;
          slot_idx: number;
          works_for_personas: string[];
        };
        Update: {
          banned_motifs?: string[];
          composition_brief?: string;
          created_at?: string;
          iconic_motifs?: string[];
          id?: string;
          lighting_recipe?: string;
          location_key?: string;
          mood?: string;
          pose_duo?: string | null;
          pose_no_cast?: string | null;
          pose_solo?: string | null;
          scene_title?: string;
          slot_idx?: number;
          works_for_personas?: string[];
        };
        Relationships: [];
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
      image_models: {
        Row: {
          cost_cents: number;
          description: string;
          dreambot_enabled: boolean;
          family: string;
          id: string;
          is_active: boolean;
          is_default: boolean;
          label: string;
          sort_order: number;
          sparkle_cost: number;
          updated_at: string;
        };
        Insert: {
          cost_cents?: number;
          description?: string;
          dreambot_enabled?: boolean;
          family: string;
          id: string;
          is_active?: boolean;
          is_default?: boolean;
          label: string;
          sort_order?: number;
          sparkle_cost?: number;
          updated_at?: string;
        };
        Update: {
          cost_cents?: number;
          description?: string;
          dreambot_enabled?: boolean;
          family?: string;
          id?: string;
          is_active?: boolean;
          is_default?: boolean;
          label?: string;
          sort_order?: number;
          sparkle_cost?: number;
          updated_at?: string;
        };
        Relationships: [];
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
          biome: string | null;
          biome_config: Json | null;
          cinematic_phrases: string[];
          created_at: string;
          display_name: string | null;
          fusion_settings: Json;
          id: string;
          is_approved: boolean;
          light_signature: string[];
          model_version: string;
          must_include: string[] | null;
          name: string;
          picker_category: string | null;
          picker_sort_order: number | null;
          prompt_version: number;
          sub_regions: string[] | null;
          tags: string[];
          texture_details: string[];
          thumbnail_url: string | null;
          updated_at: string;
          visual_palette: string[];
        };
        Insert: {
          architecture?: string[];
          atmosphere?: string[];
          biome?: string | null;
          biome_config?: Json | null;
          cinematic_phrases?: string[];
          created_at?: string;
          display_name?: string | null;
          fusion_settings?: Json;
          id?: string;
          is_approved?: boolean;
          light_signature?: string[];
          model_version?: string;
          must_include?: string[] | null;
          name: string;
          picker_category?: string | null;
          picker_sort_order?: number | null;
          prompt_version?: number;
          sub_regions?: string[] | null;
          tags?: string[];
          texture_details?: string[];
          thumbnail_url?: string | null;
          updated_at?: string;
          visual_palette?: string[];
        };
        Update: {
          architecture?: string[];
          atmosphere?: string[];
          biome?: string | null;
          biome_config?: Json | null;
          cinematic_phrases?: string[];
          created_at?: string;
          display_name?: string | null;
          fusion_settings?: Json;
          id?: string;
          is_approved?: boolean;
          light_signature?: string[];
          model_version?: string;
          must_include?: string[] | null;
          name?: string;
          picker_category?: string | null;
          picker_sort_order?: number | null;
          prompt_version?: number;
          sub_regions?: string[] | null;
          tags?: string[];
          texture_details?: string[];
          thumbnail_url?: string | null;
          updated_at?: string;
          visual_palette?: string[];
        };
        Relationships: [];
      };
      location_iconic_spots: {
        Row: {
          character_eligible: boolean | null;
          created_at: string;
          id: string;
          is_active: boolean;
          location_key: string;
          pure_scene_eligible: boolean | null;
          quality_tier: string;
          spot_kind: string;
          spot_text: string;
        };
        Insert: {
          character_eligible?: boolean | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          location_key: string;
          pure_scene_eligible?: boolean | null;
          quality_tier?: string;
          spot_kind?: string;
          spot_text: string;
        };
        Update: {
          character_eligible?: boolean | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          location_key?: string;
          pure_scene_eligible?: boolean | null;
          quality_tier?: string;
          spot_kind?: string;
          spot_text?: string;
        };
        Relationships: [];
      };
      location_spots: {
        Row: {
          created_at: string;
          disabled: boolean;
          id: number;
          kind: string;
          location_key: string;
          text: string;
        };
        Insert: {
          created_at?: string;
          disabled?: boolean;
          id?: number;
          kind: string;
          location_key: string;
          text: string;
        };
        Update: {
          created_at?: string;
          disabled?: boolean;
          id?: number;
          kind?: string;
          location_key?: string;
          text?: string;
        };
        Relationships: [];
      };
      model_overrides: {
        Row: {
          allowed_models: string[];
          medium_key: string;
          vibe_key: string;
        };
        Insert: {
          allowed_models: string[];
          medium_key: string;
          vibe_key: string;
        };
        Update: {
          allowed_models?: string[];
          medium_key?: string;
          vibe_key?: string;
        };
        Relationships: [];
      };
      moderation_words: {
        Row: {
          is_phrase: boolean;
          word: string;
        };
        Insert: {
          is_phrase?: boolean;
          word: string;
        };
        Update: {
          is_phrase?: boolean;
          word?: string;
        };
        Relationships: [];
      };
      mood_axes: {
        Row: {
          default_value: number;
          description: string | null;
          is_active: boolean;
          key: string;
          left_hint: string | null;
          left_label: string;
          right_hint: string | null;
          right_label: string;
          sort_order: number;
          title: string;
        };
        Insert: {
          default_value?: number;
          description?: string | null;
          is_active?: boolean;
          key: string;
          left_hint?: string | null;
          left_label: string;
          right_hint?: string | null;
          right_label: string;
          sort_order?: number;
          title: string;
        };
        Update: {
          default_value?: number;
          description?: string | null;
          is_active?: boolean;
          key?: string;
          left_hint?: string | null;
          left_label?: string;
          right_hint?: string | null;
          right_label?: string;
          sort_order?: number;
          title?: string;
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
      notification_preferences: {
        Row: {
          category: string;
          channel: string;
          enabled: boolean;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          category: string;
          channel: string;
          enabled?: boolean;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          category?: string;
          channel?: string;
          enabled?: boolean;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notification_preferences_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      notification_settings: {
        Row: {
          push_paused: boolean;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          push_paused?: boolean;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          push_paused?: boolean;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notification_settings_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      notifications: {
        Row: {
          actor_id: string;
          body: string | null;
          comment_id: string | null;
          created_at: string;
          group_key: string | null;
          id: string;
          recipient_id: string;
          reference_id: string | null;
          seen_at: string | null;
          subtype: string | null;
          type: string;
          upload_id: string | null;
        };
        Insert: {
          actor_id: string;
          body?: string | null;
          comment_id?: string | null;
          created_at?: string;
          group_key?: string | null;
          id?: string;
          recipient_id: string;
          reference_id?: string | null;
          seen_at?: string | null;
          subtype?: string | null;
          type: string;
          upload_id?: string | null;
        };
        Update: {
          actor_id?: string;
          body?: string | null;
          comment_id?: string | null;
          created_at?: string;
          group_key?: string | null;
          id?: string;
          recipient_id?: string;
          reference_id?: string | null;
          seen_at?: string | null;
          subtype?: string | null;
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
      pending_push_groups: {
        Row: {
          fire_at: string;
          group_key: string;
          latest_notification_id: string;
          original_created_at: string;
          recipient_id: string;
        };
        Insert: {
          fire_at: string;
          group_key: string;
          latest_notification_id: string;
          original_created_at?: string;
          recipient_id: string;
        };
        Update: {
          fire_at?: string;
          group_key?: string;
          latest_notification_id?: string;
          original_created_at?: string;
          recipient_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'pending_push_groups_latest_notification_id_fkey';
            columns: ['latest_notification_id'];
            isOneToOne: false;
            referencedRelation: 'notifications';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'pending_push_groups_recipient_id_fkey';
            columns: ['recipient_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      pool_pick_history: {
        Row: {
          id: number;
          item_key: string;
          picked_at: string;
          pool: string;
          user_id: string;
        };
        Insert: {
          id?: number;
          item_key: string;
          picked_at?: string;
          pool: string;
          user_id: string;
        };
        Update: {
          id?: number;
          item_key?: string;
          picked_at?: string;
          pool?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      post_hashtags: {
        Row: {
          created_at: string;
          tag: string;
          upload_id: string;
        };
        Insert: {
          created_at?: string;
          tag: string;
          upload_id: string;
        };
        Update: {
          created_at?: string;
          tag?: string;
          upload_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'post_hashtags_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 'uploads';
            referencedColumns: ['id'];
          },
        ];
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
      post_reposts: {
        Row: {
          created_at: string;
          id: string;
          reposter_id: string;
          upload_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          reposter_id: string;
          upload_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          reposter_id?: string;
          upload_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'post_reposts_reposter_id_fkey';
            columns: ['reposter_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'post_reposts_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 'uploads';
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
      pro_hq_downloads_log: {
        Row: {
          created_at: string;
          id: string;
          upload_id: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          upload_id?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          upload_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'pro_hq_downloads_log_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 'uploads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'pro_hq_downloads_log_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      push_send_failures: {
        Row: {
          created_at: string;
          detail: string | null;
          error_kind: string | null;
          id: string;
          notification_type: string | null;
          recipient_id: string | null;
        };
        Insert: {
          created_at?: string;
          detail?: string | null;
          error_kind?: string | null;
          id?: string;
          notification_type?: string | null;
          recipient_id?: string | null;
        };
        Update: {
          created_at?: string;
          detail?: string | null;
          error_kind?: string | null;
          id?: string;
          notification_type?: string | null;
          recipient_id?: string | null;
        };
        Relationships: [];
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
          comment_id: string | null;
          created_at: string;
          details: string | null;
          id: string;
          reason: string;
          reported_user_id: string | null;
          reporter_id: string;
          resolved: boolean;
          resolved_at: string | null;
          resolved_by: string | null;
          status: string;
          upload_id: string | null;
        };
        Insert: {
          comment_id?: string | null;
          created_at?: string;
          details?: string | null;
          id?: string;
          reason: string;
          reported_user_id?: string | null;
          reporter_id: string;
          resolved?: boolean;
          resolved_at?: string | null;
          resolved_by?: string | null;
          status?: string;
          upload_id?: string | null;
        };
        Update: {
          comment_id?: string | null;
          created_at?: string;
          details?: string | null;
          id?: string;
          reason?: string;
          reported_user_id?: string | null;
          reporter_id?: string;
          resolved?: boolean;
          resolved_at?: string | null;
          resolved_by?: string | null;
          status?: string;
          upload_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'reports_comment_id_fkey';
            columns: ['comment_id'];
            isOneToOne: false;
            referencedRelation: 'comments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reports_reported_user_id_fkey';
            columns: ['reported_user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reports_reporter_id_fkey';
            columns: ['reporter_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reports_resolved_by_fkey';
            columns: ['resolved_by'];
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
      single_scenarios: {
        Row: {
          attire: string;
          category: string | null;
          created_at: string;
          disabled: boolean;
          gender: string;
          id: string;
          medium_ban: string | null;
          medium_key: string | null;
          pool: string;
          pose_pool: string | null;
          scene: string;
        };
        Insert: {
          attire: string;
          category?: string | null;
          created_at?: string;
          disabled?: boolean;
          gender?: string;
          id?: string;
          medium_ban?: string | null;
          medium_key?: string | null;
          pool: string;
          pose_pool?: string | null;
          scene: string;
        };
        Update: {
          attire?: string;
          category?: string | null;
          created_at?: string;
          disabled?: boolean;
          gender?: string;
          id?: string;
          medium_ban?: string | null;
          medium_key?: string | null;
          pool?: string;
          pose_pool?: string | null;
          scene?: string;
        };
        Relationships: [];
      };
      sparkle_packs: {
        Row: {
          icon: string;
          is_active: boolean;
          label: string;
          product_id: string;
          sort_order: number;
          sparkles: number;
        };
        Insert: {
          icon: string;
          is_active?: boolean;
          label: string;
          product_id: string;
          sort_order?: number;
          sparkles: number;
        };
        Update: {
          icon?: string;
          is_active?: boolean;
          label?: string;
          product_id?: string;
          sort_order?: number;
          sparkles?: number;
        };
        Relationships: [];
      };
      sparkle_transactions: {
        Row: {
          amount: number;
          balance_after: number | null;
          created_at: string;
          id: string;
          reason: string;
          reference_id: string | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          balance_after?: number | null;
          created_at?: string;
          id?: string;
          reason: string;
          reference_id?: string | null;
          user_id: string;
        };
        Update: {
          amount?: number;
          balance_after?: number | null;
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
      upload_media: {
        Row: {
          created_at: string;
          height: number | null;
          id: string;
          image_url: string;
          image_url_display: string | null;
          image_url_hq: string | null;
          image_url_hq_generated_at: string | null;
          position: number;
          source_upload_id: string | null;
          thumbhash: string | null;
          upload_id: string;
          width: number | null;
        };
        Insert: {
          created_at?: string;
          height?: number | null;
          id?: string;
          image_url: string;
          image_url_display?: string | null;
          image_url_hq?: string | null;
          image_url_hq_generated_at?: string | null;
          position: number;
          source_upload_id?: string | null;
          thumbhash?: string | null;
          upload_id: string;
          width?: number | null;
        };
        Update: {
          created_at?: string;
          height?: number | null;
          id?: string;
          image_url?: string;
          image_url_display?: string | null;
          image_url_hq?: string | null;
          image_url_hq_generated_at?: string | null;
          position?: number;
          source_upload_id?: string | null;
          thumbhash?: string | null;
          upload_id?: string;
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'upload_media_source_upload_id_fkey';
            columns: ['source_upload_id'];
            isOneToOne: false;
            referencedRelation: 'uploads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'upload_media_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 'uploads';
            referencedColumns: ['id'];
          },
        ];
      };
      uploads: {
        Row: {
          ai_concept: Json | null;
          ai_prompt: string | null;
          album_ref_count: number;
          bot_message: string | null;
          caption: string | null;
          categories: string[];
          comment_count: number;
          created_at: string;
          description: string | null;
          dream_medium: string | null;
          dream_vibe: string | null;
          face_swap_mode: string | null;
          flux_seed: number | null;
          height: number | null;
          id: string;
          image_url: string;
          image_url_display: string | null;
          image_url_hq: string | null;
          image_url_hq_generated_at: string | null;
          image_url_thumb: string | null;
          is_active: boolean;
          is_ai_generated: boolean;
          is_approved: boolean | null;
          is_moderated: boolean;
          is_posted: boolean;
          is_public: boolean;
          like_count: number;
          media_count: number;
          media_type: string;
          model: string | null;
          output_hash: string | null;
          output_phash: string | null;
          pinned_at: string | null;
          posted_at: string | null;
          recipe: Json | null;
          recipe_id: string | null;
          repost_count: number;
          save_count: number;
          search_tsv: unknown;
          shadow: boolean;
          share_count: number;
          style_summary: string | null;
          thumbhash: string | null;
          thumbnail_url: string | null;
          user_id: string;
          view_count: number;
          width: number | null;
        };
        Insert: {
          ai_concept?: Json | null;
          ai_prompt?: string | null;
          album_ref_count?: number;
          bot_message?: string | null;
          caption?: string | null;
          categories?: string[];
          comment_count?: number;
          created_at?: string;
          description?: string | null;
          dream_medium?: string | null;
          dream_vibe?: string | null;
          face_swap_mode?: string | null;
          flux_seed?: number | null;
          height?: number | null;
          id?: string;
          image_url: string;
          image_url_display?: string | null;
          image_url_hq?: string | null;
          image_url_hq_generated_at?: string | null;
          image_url_thumb?: string | null;
          is_active?: boolean;
          is_ai_generated?: boolean;
          is_approved?: boolean | null;
          is_moderated?: boolean;
          is_posted?: boolean;
          is_public?: boolean;
          like_count?: number;
          media_count?: number;
          media_type?: string;
          model?: string | null;
          output_hash?: string | null;
          output_phash?: string | null;
          pinned_at?: string | null;
          posted_at?: string | null;
          recipe?: Json | null;
          recipe_id?: string | null;
          repost_count?: number;
          save_count?: number;
          search_tsv?: unknown;
          shadow?: boolean;
          share_count?: number;
          style_summary?: string | null;
          thumbhash?: string | null;
          thumbnail_url?: string | null;
          user_id: string;
          view_count?: number;
          width?: number | null;
        };
        Update: {
          ai_concept?: Json | null;
          ai_prompt?: string | null;
          album_ref_count?: number;
          bot_message?: string | null;
          caption?: string | null;
          categories?: string[];
          comment_count?: number;
          created_at?: string;
          description?: string | null;
          dream_medium?: string | null;
          dream_vibe?: string | null;
          face_swap_mode?: string | null;
          flux_seed?: number | null;
          height?: number | null;
          id?: string;
          image_url?: string;
          image_url_display?: string | null;
          image_url_hq?: string | null;
          image_url_hq_generated_at?: string | null;
          image_url_thumb?: string | null;
          is_active?: boolean;
          is_ai_generated?: boolean;
          is_approved?: boolean | null;
          is_moderated?: boolean;
          is_posted?: boolean;
          is_public?: boolean;
          like_count?: number;
          media_count?: number;
          media_type?: string;
          model?: string | null;
          output_hash?: string | null;
          output_phash?: string | null;
          pinned_at?: string | null;
          posted_at?: string | null;
          recipe?: Json | null;
          recipe_id?: string | null;
          repost_count?: number;
          save_count?: number;
          search_tsv?: unknown;
          shadow?: boolean;
          share_count?: number;
          style_summary?: string | null;
          thumbhash?: string | null;
          thumbnail_url?: string | null;
          user_id?: string;
          view_count?: number;
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'uploads_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      upscale_jobs: {
        Row: {
          attempts: number;
          created_at: string;
          last_error: string | null;
          status: string;
          updated_at: string;
          upload_id: string;
        };
        Insert: {
          attempts?: number;
          created_at?: string;
          last_error?: string | null;
          status?: string;
          updated_at?: string;
          upload_id: string;
        };
        Update: {
          attempts?: number;
          created_at?: string;
          last_error?: string | null;
          status?: string;
          updated_at?: string;
          upload_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'upscale_jobs_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: true;
            referencedRelation: 'uploads';
            referencedColumns: ['id'];
          },
        ];
      };
      upscale_requests: {
        Row: {
          created_at: string;
          id: string;
          notified_at: string | null;
          upload_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          notified_at?: string | null;
          upload_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          notified_at?: string | null;
          upload_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'upscale_requests_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 'uploads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'upscale_requests_user_id_fkey';
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
      user_first_run: {
        Row: {
          ai_consent_at: string | null;
          seen_create_intro: boolean;
          seen_feed_intro: boolean;
          seen_mediums_intro: boolean;
          seen_sparkle_intro: boolean;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          ai_consent_at?: string | null;
          seen_create_intro?: boolean;
          seen_feed_intro?: boolean;
          seen_mediums_intro?: boolean;
          seen_sparkle_intro?: boolean;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          ai_consent_at?: string | null;
          seen_create_intro?: boolean;
          seen_feed_intro?: boolean;
          seen_mediums_intro?: boolean;
          seen_sparkle_intro?: boolean;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_first_run_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_recipes: {
        Row: {
          ai_enabled: boolean;
          created_at: string;
          onboarding_completed: boolean;
          recipe: Json;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          ai_enabled?: boolean;
          created_at?: string;
          onboarding_completed?: boolean;
          recipe?: Json;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          ai_enabled?: boolean;
          created_at?: string;
          onboarding_completed?: boolean;
          recipe?: Json;
          updated_at?: string;
          user_id?: string;
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
          allow_downloads: boolean;
          allow_reposts: boolean;
          avatar_url: string | null;
          banned_at: string | null;
          banned_by: string | null;
          basic_subscription: boolean;
          basic_subscription_expires_at: string | null;
          bio: string | null;
          confirm_surprise_dream: boolean;
          created_at: string;
          display_name: string | null;
          dreams_filter: string;
          dreams_private_only: boolean;
          email: string;
          first_dream_completed_at: string | null;
          has_ai_recipe: boolean;
          id: string;
          is_admin: boolean | null;
          is_banned: boolean;
          is_bot: boolean;
          is_public: boolean;
          last_active_at: string | null;
          last_inbox_view_at: string | null;
          pro_mode_flux_model: string;
          pro_subscription: boolean;
          pro_subscription_expires_at: string | null;
          pro_subscription_will_renew: boolean;
          pro_trial_started_at: string | null;
          sparkle_balance: number;
          username: string;
          username_confirmed: boolean;
        };
        Insert: {
          allow_downloads?: boolean;
          allow_reposts?: boolean;
          avatar_url?: string | null;
          banned_at?: string | null;
          banned_by?: string | null;
          basic_subscription?: boolean;
          basic_subscription_expires_at?: string | null;
          bio?: string | null;
          confirm_surprise_dream?: boolean;
          created_at?: string;
          display_name?: string | null;
          dreams_filter?: string;
          dreams_private_only?: boolean;
          email: string;
          first_dream_completed_at?: string | null;
          has_ai_recipe?: boolean;
          id: string;
          is_admin?: boolean | null;
          is_banned?: boolean;
          is_bot?: boolean;
          is_public?: boolean;
          last_active_at?: string | null;
          last_inbox_view_at?: string | null;
          pro_mode_flux_model?: string;
          pro_subscription?: boolean;
          pro_subscription_expires_at?: string | null;
          pro_subscription_will_renew?: boolean;
          pro_trial_started_at?: string | null;
          sparkle_balance?: number;
          username: string;
          username_confirmed?: boolean;
        };
        Update: {
          allow_downloads?: boolean;
          allow_reposts?: boolean;
          avatar_url?: string | null;
          banned_at?: string | null;
          banned_by?: string | null;
          basic_subscription?: boolean;
          basic_subscription_expires_at?: string | null;
          bio?: string | null;
          confirm_surprise_dream?: boolean;
          created_at?: string;
          display_name?: string | null;
          dreams_filter?: string;
          dreams_private_only?: boolean;
          email?: string;
          first_dream_completed_at?: string | null;
          has_ai_recipe?: boolean;
          id?: string;
          is_admin?: boolean | null;
          is_banned?: boolean;
          is_bot?: boolean;
          is_public?: boolean;
          last_active_at?: string | null;
          last_inbox_view_at?: string | null;
          pro_mode_flux_model?: string;
          pro_subscription?: boolean;
          pro_subscription_expires_at?: string | null;
          pro_subscription_will_renew?: boolean;
          pro_trial_started_at?: string | null;
          sparkle_balance?: number;
          username?: string;
          username_confirmed?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: 'users_banned_by_fkey';
            columns: ['banned_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
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
      admin_ban_user: { Args: { p_user_id: string }; Returns: undefined };
      admin_delete_comment: {
        Args: { p_comment_id: string };
        Returns: undefined;
      };
      admin_delete_upload: { Args: { p_upload_id: string }; Returns: undefined };
      admin_hide_upload: { Args: { p_upload_id: string }; Returns: undefined };
      admin_list_reports: {
        Args: { p_limit?: number; p_status?: string };
        Returns: {
          comment_body: string;
          comment_id: string;
          created_at: string;
          details: string;
          id: string;
          reason: string;
          reporter_id: string;
          reporter_username: string;
          status: string;
          target_kind: string;
          target_user_banned: boolean;
          target_user_id: string;
          target_username: string;
          upload_id: string;
          upload_image_url: string;
        }[];
      };
      admin_resolve_report: {
        Args: { p_report_id: string; p_status: string };
        Returns: undefined;
      };
      admin_unban_user: { Args: { p_user_id: string }; Returns: undefined };
      approve_follow_and_follow_back: {
        Args: { p_requester_id: string };
        Returns: undefined;
      };
      approve_follow_request: {
        Args: { p_requester_id: string };
        Returns: undefined;
      };
      block_exists: { Args: { a: string; b: string }; Returns: boolean };
      block_user: { Args: { p_blocked_id: string }; Returns: undefined };
      cancel_pending_download_push: {
        Args: { p_upload_id: string };
        Returns: undefined;
      };
      cancel_pending_dream_push: {
        Args: { p_upload_id: string };
        Returns: undefined;
      };
      capture_db_health: { Args: never; Returns: undefined };
      category_enabled_for: {
        Args: { p_category: string; p_channel: string; p_user_id: string };
        Returns: boolean;
      };
      charge_sparkles: {
        Args: {
          p_amount: number;
          p_reason: string;
          p_reference_id: string;
          p_user_id: string;
        };
        Returns: string;
      };
      claim_dream_queue_job: {
        Args: { p_worker_id: string };
        Returns: {
          attempt_count: number;
          completed_at: string | null;
          created_at: string;
          current_stage: string | null;
          dedup_key: string | null;
          id: string;
          last_error: string | null;
          model: string | null;
          payload: Json;
          source: string;
          stage_updated_at: string | null;
          started_at: string | null;
          status: string;
          upload_id: string | null;
          user_id: string;
          weight: string;
          worker_id: string | null;
        };
        SetofOptions: {
          from: '*';
          to: 'dream_queue';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      claim_dream_queue_jobs: {
        Args: { p_limit?: number; p_worker_id: string };
        Returns: {
          attempt_count: number;
          completed_at: string | null;
          created_at: string;
          current_stage: string | null;
          dedup_key: string | null;
          id: string;
          last_error: string | null;
          model: string | null;
          payload: Json;
          source: string;
          stage_updated_at: string | null;
          started_at: string | null;
          status: string;
          upload_id: string | null;
          user_id: string;
          weight: string;
          worker_id: string | null;
        }[];
        SetofOptions: {
          from: '*';
          to: 'dream_queue';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      claim_dream_queue_jobs_by_weight: {
        Args: { p_limit?: number; p_weight: string; p_worker_id: string };
        Returns: {
          attempt_count: number;
          completed_at: string | null;
          created_at: string;
          current_stage: string | null;
          dedup_key: string | null;
          id: string;
          last_error: string | null;
          model: string | null;
          payload: Json;
          source: string;
          stage_updated_at: string | null;
          started_at: string | null;
          status: string;
          upload_id: string | null;
          user_id: string;
          weight: string;
          worker_id: string | null;
        }[];
        SetofOptions: {
          from: '*';
          to: 'dream_queue';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      claim_first_dream_ip: { Args: { p_ip: string }; Returns: boolean };
      claim_upscale_job: {
        Args: { p_stale_minutes?: number; p_upload_id: string };
        Returns: string;
      };
      compute_bot_next_due: {
        Args: {
          p_min_lead_seconds?: number;
          p_phase_seed: number;
          p_posts_per_day: number;
        };
        Returns: string;
      };
      delete_group: {
        Args: { p_group_key: string; p_user_id: string };
        Returns: undefined;
      };
      delete_own_account: { Args: never; Returns: undefined };
      deny_follow_request: {
        Args: { p_requester_id: string };
        Returns: undefined;
      };
      describe_album_impact: {
        Args: { p_source_ids: string[] };
        Returns: {
          albums_deleted: number;
          albums_touched: number;
        }[];
      };
      drain_pending_push_groups: { Args: never; Returns: undefined };
      dream_forensics: { Args: { p_job_id: string }; Returns: Json };
      dream_forensics_recent: {
        Args: { p_hours?: number; p_user_id: string };
        Returns: Json;
      };
      ensure_dream_generated_notification: {
        Args: { p_body: string; p_upload_id: string; p_user_id: string };
        Returns: undefined;
      };
      extract_hashtags: { Args: { p_text: string }; Returns: string[] };
      fetch_nightly_history: {
        Args: { p_user_id: string };
        Returns: {
          created_at: string;
          rolled_axes: Json;
        }[];
      };
      finalize_nightly_upload: {
        Args: { p_bot_message?: string; p_upload_id: string };
        Returns: undefined;
      };
      get_blocked_users: {
        Args: never;
        Returns: {
          avatar_url: string;
          blocked_at: string;
          user_id: string;
          username: string;
        }[];
      };
      get_bot_thumbnails: {
        Args: { p_per_bot?: number };
        Returns: {
          bot_user_id: string;
          thumbnail_urls: string[];
        }[];
      };
      get_bot_users: {
        Args: never;
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
          client_meta: Json;
          description: string;
          directive: string;
          face_swaps: boolean;
          flux_fragment: string;
          is_character_only: boolean;
          key: string;
          label: string;
          sort_order: number;
        }[];
      };
      get_dream_vibes: {
        Args: never;
        Returns: {
          client_meta: Json;
          description: string;
          directive: string;
          key: string;
          label: string;
          sort_order: number;
        }[];
      };
      get_engine_config: { Args: never; Returns: Json };
      get_feed: {
        Args: {
          p_bot_user_id?: string;
          p_cursor_id?: string;
          p_cursor_score?: number;
          p_limit?: number;
          p_medium?: string;
          p_offset?: number;
          p_seed?: number;
          p_shuffle?: number;
          p_tab?: string;
          p_user_id: string;
          p_vibe?: string;
        };
        Returns: {
          ai_concept: Json;
          ai_prompt: string;
          allow_downloads: boolean;
          allow_reposts: boolean;
          avatar_url: string;
          bot_message: string;
          caption: string;
          comment_count: number;
          created_at: string;
          description: string;
          dream_medium: string;
          dream_vibe: string;
          feed_score: number;
          height: number;
          id: string;
          image_url: string;
          image_url_display: string;
          image_url_hq: string;
          like_count: number;
          model: string;
          posted_at: string;
          repost_count: number;
          reposted_at: string;
          reposter_id: string;
          reposter_name: string;
          reposters_more: number;
          surface_type: string;
          thumbhash: string;
          user_id: string;
          username: string;
          width: number;
        }[];
      };
      get_gift: {
        Args: { p_reference_id: string };
        Returns: {
          amount: number;
          created_at: string;
          message: string;
          sender_avatar: string;
          sender_id: string;
          sender_username: string;
          thanked: boolean;
        }[];
      };
      get_giftable_balance: {
        Args: never;
        Returns: {
          balance: number;
          giftable: number;
          max_per_day: number;
          max_per_send: number;
          sent_today: number;
        }[];
      };
      get_group_actors: {
        Args: {
          p_group_key: string;
          p_limit?: number;
          p_offset?: number;
          p_user_id: string;
        };
        Returns: {
          actor_id: string;
          avatar_url: string;
          latest_at: string;
          username: string;
        }[];
      };
      get_image_models: {
        Args: never;
        Returns: {
          cost_cents: number;
          description: string;
          dreambot_enabled: boolean;
          family: string;
          id: string;
          is_active: boolean;
          is_default: boolean;
          label: string;
          sort_order: number;
          sparkle_cost: number;
          updated_at: string;
        }[];
        SetofOptions: {
          from: '*';
          to: 'image_models';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      get_inbox: {
        Args: { p_limit?: number; p_offset?: number; p_user_id: string };
        Returns: {
          actor_count: number;
          any_unseen: boolean;
          body: string;
          category: string;
          comment_id: string;
          event_count: number;
          group_key: string;
          is_new_since_view: boolean;
          last_at: string;
          preview_actor_ids: string[];
          preview_avatars: string[];
          preview_usernames: string[];
          reference_id: string;
          subtype: string;
          type: string;
          upload_id: string;
          upload_image_url: string;
          upload_thumbhash: string;
        }[];
      };
      get_mood_axes: {
        Args: never;
        Returns: {
          default_value: number;
          description: string;
          key: string;
          left_hint: string;
          left_label: string;
          right_hint: string;
          right_label: string;
          sort_order: number;
          title: string;
        }[];
      };
      get_my_account: {
        Args: never;
        Returns: {
          basic_subscription: boolean;
          basic_subscription_expires_at: string;
          email: string;
          is_admin: boolean;
          pro_subscription: boolean;
          pro_subscription_expires_at: string;
          pro_subscription_will_renew: boolean;
          pro_trial_started_at: string;
          sparkle_balance: number;
        }[];
      };
      get_new_notification_count: {
        Args: { p_user_id: string };
        Returns: number;
      };
      get_notification_settings: { Args: { p_user_id?: string }; Returns: Json };
      get_public_profile: {
        Args: { p_user_id: string };
        Returns: {
          avatar_url: string;
          bio: string;
          created_at: string;
          display_name: string;
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
          username: string;
        }[];
      };
      get_reposters: {
        Args: { p_cursor?: string; p_limit?: number; p_upload_id: string };
        Returns: {
          avatar_url: string;
          reposted_at: string;
          user_id: string;
          username: string;
        }[];
      };
      get_shadow_feed: {
        Args: { p_bot_user_id?: string; p_limit?: number; p_offset?: number };
        Returns: {
          ai_concept: Json | null;
          ai_prompt: string | null;
          album_ref_count: number;
          bot_message: string | null;
          caption: string | null;
          categories: string[];
          comment_count: number;
          created_at: string;
          description: string | null;
          dream_medium: string | null;
          dream_vibe: string | null;
          face_swap_mode: string | null;
          flux_seed: number | null;
          height: number | null;
          id: string;
          image_url: string;
          image_url_display: string | null;
          image_url_hq: string | null;
          image_url_hq_generated_at: string | null;
          image_url_thumb: string | null;
          is_active: boolean;
          is_ai_generated: boolean;
          is_approved: boolean | null;
          is_moderated: boolean;
          is_posted: boolean;
          is_public: boolean;
          like_count: number;
          media_count: number;
          media_type: string;
          model: string | null;
          output_hash: string | null;
          output_phash: string | null;
          pinned_at: string | null;
          posted_at: string | null;
          recipe: Json | null;
          recipe_id: string | null;
          repost_count: number;
          save_count: number;
          search_tsv: unknown;
          shadow: boolean;
          share_count: number;
          style_summary: string | null;
          thumbhash: string | null;
          thumbnail_url: string | null;
          user_id: string;
          view_count: number;
          width: number | null;
        }[];
        SetofOptions: {
          from: '*';
          to: 'uploads';
          isOneToOne: false;
          isSetofReturn: true;
        };
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
      get_shared_post: {
        Args: { p_id: string };
        Returns: {
          allow_reposts: boolean;
          avatar_url: string;
          caption: string;
          comment_count: number;
          created_at: string;
          description: string;
          dream_medium: string;
          dream_vibe: string;
          id: string;
          image_url: string;
          image_url_display: string;
          image_url_hq: string;
          is_public: boolean;
          like_count: number;
          media: Json;
          model: string;
          posted_at: string;
          thumbhash: string;
          user_id: string;
          username: string;
        }[];
      };
      get_unread_group_count: { Args: { p_user_id: string }; Returns: number };
      get_unread_notification_count: {
        Args: { p_user_id: string };
        Returns: number;
      };
      gift_sparkles: {
        Args: {
          p_amount: number;
          p_message?: string;
          p_recipient: string;
          p_reference_id?: string;
        };
        Returns: string;
      };
      grant_sparkles: {
        Args: { p_amount: number; p_reason: string; p_user_id: string };
        Returns: undefined;
      };
      is_basic_active: { Args: { p_user_id: string }; Returns: boolean };
      is_dream_eligible: { Args: { p_user_id: string }; Returns: boolean };
      is_pro_active: { Args: { p_user_id: string }; Returns: boolean };
      list_my_upload_paths: { Args: never; Returns: string[] };
      mark_group_seen: {
        Args: { p_group_key: string; p_user_id: string };
        Returns: undefined;
      };
      mark_inbox_viewed: { Args: { p_user_id: string }; Returns: undefined };
      notification_category: { Args: { p_type: string }; Returns: string };
      notification_group_key: {
        Args: {
          p_comment_id: string;
          p_created_at: string;
          p_id: string;
          p_recipient_id: string;
          p_subtype: string;
          p_type: string;
          p_upload_id: string;
        };
        Returns: string;
      };
      pin_post: { Args: { p_upload_id: string }; Returns: undefined };
      prune_observability_logs: {
        Args: { p_days?: number };
        Returns: {
          deleted: number;
          table_name: string;
        }[];
      };
      rebalance_bot_schedules: {
        Args: { p_min_lead_seconds?: number };
        Returns: undefined;
      };
      reconcile_sparkles: {
        Args: { p_user_id: string };
        Returns: {
          current_balance: number;
          drift: number;
          last_recorded_balance: number;
          last_tx_at: string;
          ledger_sum: number;
          tx_count: number;
        }[];
      };
      record_impression: {
        Args: { p_upload_id: string; p_user_id: string };
        Returns: undefined;
      };
      refund_sparkles: {
        Args: {
          p_amount: number;
          p_reason: string;
          p_reference_id: string;
          p_user_id: string;
        };
        Returns: boolean;
      };
      request_dream_notification: {
        Args: { p_job_id: string };
        Returns: undefined;
      };
      reset_my_profile: { Args: never; Returns: undefined };
      sanitize_user_multiline_text: {
        Args: { p_text: string };
        Returns: string;
      };
      sanitize_user_text: { Args: { p_text: string }; Returns: string };
      search_hashtags: {
        Args: { p_limit?: number; p_prefix: string };
        Returns: {
          post_count: number;
          tag: string;
        }[];
      };
      set_notification_pref: {
        Args: { p_category: string; p_channel: string; p_enabled: boolean };
        Returns: undefined;
      };
      set_push_paused: { Args: { p_paused: boolean }; Returns: undefined };
      spend_sparkles: {
        Args: {
          p_amount: number;
          p_reason: string;
          p_reference_id?: string;
          p_user_id: string;
        };
        Returns: boolean;
      };
      text_is_blocked: { Args: { p_text: string }; Returns: boolean };
      thank_gift: { Args: { p_reference_id: string }; Returns: string };
      toggle_repost: {
        Args: { p_upload_id: string };
        Returns: {
          repost_count: number;
          reposted: boolean;
        }[];
      };
      touch_last_active: { Args: never; Returns: undefined };
      unpin_post: { Args: { p_upload_id: string }; Returns: undefined };
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
  public: {
    Enums: {
      vote_type: ['rad', 'bad', 'skip'],
    },
  },
} as const;
