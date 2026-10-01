export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      plan_limits: {
        Row: {
          plan: 'free' | 'premium';
          max_recipes: number;
          max_members: number;
          ai_imports_per_month: number;
          max_owned_households: number;
          can_translate: boolean;
        };
        Insert: {
          plan: 'free' | 'premium';
          max_recipes: number;
          max_members: number;
          ai_imports_per_month: number;
          max_owned_households?: number;
          can_translate?: boolean;
        };
        Update: {
          plan?: 'free' | 'premium';
          max_recipes?: number;
          max_members?: number;
          ai_imports_per_month?: number;
          max_owned_households?: number;
          can_translate?: boolean;
        };
        Relationships: [];
      };
      app_admins: {
        Row: {
          user_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      households: {
        Row: {
          id: string;
          name: string;
          plan: 'free' | 'premium';
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          plan?: 'free' | 'premium';
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          plan?: 'free' | 'premium';
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      household_members: {
        Row: {
          id: string;
          household_id: string;
          user_id: string;
          role: 'owner' | 'member';
          joined_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          user_id: string;
          role?: 'owner' | 'member';
          joined_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          user_id?: string;
          role?: 'owner' | 'member';
          joined_at?: string;
        };
        Relationships: [];
      };
      household_invites: {
        Row: {
          id: string;
          household_id: string;
          code: string;
          email: string | null;
          created_by: string;
          created_at: string;
          expires_at: string;
          used_at: string | null;
          used_by: string | null;
        };
        Insert: {
          id?: string;
          household_id: string;
          code: string;
          email?: string | null;
          created_by: string;
          created_at?: string;
          expires_at?: string;
          used_at?: string | null;
          used_by?: string | null;
        };
        Update: {
          id?: string;
          household_id?: string;
          code?: string;
          email?: string | null;
          created_by?: string;
          created_at?: string;
          expires_at?: string;
          used_at?: string | null;
          used_by?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          user_id: string;
          display_name: string | null;
          ui_language: 'sv' | 'en';
          unit_system: 'metric' | 'us';
          active_household_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          display_name?: string | null;
          ui_language?: 'sv' | 'en';
          unit_system?: 'metric' | 'us';
          active_household_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          display_name?: string | null;
          ui_language?: 'sv' | 'en';
          unit_system?: 'metric' | 'us';
          active_household_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      recipes: {
        Row: {
          id: string;
          household_id: string;
          title: string;
          description: string | null;
          image_url: string | null;
          servings: number;
          servings_estimated: boolean;
          prep_time_minutes: number | null;
          cook_time_minutes: number | null;
          source_url: string | null;
          source_name: string | null;
          category: 'starter' | 'main' | 'dessert' | 'snack' | 'breakfast' | 'baking' | 'drink' | 'side';
          tags: string[];
          language: string;
          import_source: 'url_jsonld' | 'url_ai' | 'photo' | 'pdf' | 'text' | 'manual';
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          title: string;
          description?: string | null;
          image_url?: string | null;
          servings?: number;
          servings_estimated?: boolean;
          prep_time_minutes?: number | null;
          cook_time_minutes?: number | null;
          source_url?: string | null;
          source_name?: string | null;
          category: 'starter' | 'main' | 'dessert' | 'snack' | 'breakfast' | 'baking' | 'drink' | 'side';
          tags?: string[];
          language?: string;
          import_source: 'url_jsonld' | 'url_ai' | 'photo' | 'pdf' | 'text' | 'manual';
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          title?: string;
          description?: string | null;
          image_url?: string | null;
          servings?: number;
          servings_estimated?: boolean;
          prep_time_minutes?: number | null;
          cook_time_minutes?: number | null;
          source_url?: string | null;
          source_name?: string | null;
          category?: 'starter' | 'main' | 'dessert' | 'snack' | 'breakfast' | 'baking' | 'drink' | 'side';
          tags?: string[];
          language?: string;
          import_source?: 'url_jsonld' | 'url_ai' | 'photo' | 'pdf' | 'text' | 'manual';
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      recipe_ingredients: {
        Row: {
          id: string;
          recipe_id: string;
          item: string;
          quantity: number | null;
          quantity_max: number | null;
          unit: string | null;
          note: string | null;
          ingredient_group: string | null;
          original_text: string | null;
          aisle: 'produce' | 'dairy' | 'meat_fish' | 'pantry' | 'spices' | 'bakery' | 'frozen' | 'other';
          sort_order: number;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          item: string;
          quantity?: number | null;
          quantity_max?: number | null;
          unit?: string | null;
          note?: string | null;
          ingredient_group?: string | null;
          original_text?: string | null;
          aisle?: 'produce' | 'dairy' | 'meat_fish' | 'pantry' | 'spices' | 'bakery' | 'frozen' | 'other';
          sort_order?: number;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          item?: string;
          quantity?: number | null;
          quantity_max?: number | null;
          unit?: string | null;
          note?: string | null;
          ingredient_group?: string | null;
          original_text?: string | null;
          aisle?: 'produce' | 'dairy' | 'meat_fish' | 'pantry' | 'spices' | 'bakery' | 'frozen' | 'other';
          sort_order?: number;
        };
        Relationships: [];
      };
      recipe_steps: {
        Row: {
          id: string;
          recipe_id: string;
          step_number: number;
          instruction: string;
          duration_minutes: number | null;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          step_number: number;
          instruction: string;
          duration_minutes?: number | null;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          step_number?: number;
          instruction?: string;
          duration_minutes?: number | null;
        };
        Relationships: [];
      };
      recipe_user_state: {
        Row: {
          recipe_id: string;
          user_id: string;
          rating: number | null;
          tried: boolean;
          note: string | null;
          updated_at: string;
        };
        Insert: {
          recipe_id: string;
          user_id: string;
          rating?: number | null;
          tried?: boolean;
          note?: string | null;
          updated_at?: string;
        };
        Update: {
          recipe_id?: string;
          user_id?: string;
          rating?: number | null;
          tried?: boolean;
          note?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      cook_log: {
        Row: {
          id: string;
          recipe_id: string;
          household_id: string;
          cooked_by: string;
          cooked_on: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          household_id: string;
          cooked_by: string;
          cooked_on?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          household_id?: string;
          cooked_by?: string;
          cooked_on?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      recipe_translations: {
        Row: {
          recipe_id: string;
          language: 'sv' | 'en';
          content: Json;
          created_at: string;
        };
        Insert: {
          recipe_id: string;
          language: 'sv' | 'en';
          content: Json;
          created_at?: string;
        };
        Update: {
          recipe_id?: string;
          language?: 'sv' | 'en';
          content?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      aisle_cache: {
        Row: {
          item_key: string;
          aisle: string;
          created_at: string;
        };
        Insert: {
          item_key: string;
          aisle: string;
          created_at?: string;
        };
        Update: {
          item_key?: string;
          aisle?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      density_cache: {
        Row: {
          item_key: string;
          grams_per_dl: number;
          estimated: boolean;
          created_at: string;
        };
        Insert: {
          item_key: string;
          grams_per_dl: number;
          estimated?: boolean;
          created_at?: string;
        };
        Update: {
          item_key?: string;
          grams_per_dl?: number;
          estimated?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      shopping_items: {
        Row: {
          id: string;
          household_id: string;
          item: string;
          quantity: number | null;
          unit: string | null;
          aisle: string;
          servings: number | null;
          checked: boolean;
          checked_by: string | null;
          checked_at: string | null;
          recipe_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          item: string;
          quantity?: number | null;
          unit?: string | null;
          aisle?: string;
          servings?: number | null;
          checked?: boolean;
          checked_by?: string | null;
          checked_at?: string | null;
          recipe_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          item?: string;
          quantity?: number | null;
          unit?: string | null;
          aisle?: string;
          servings?: number | null;
          checked?: boolean;
          checked_by?: string | null;
          checked_at?: string | null;
          recipe_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ai_usage: {
        Row: {
          id: string;
          household_id: string;
          user_id: string | null;
          feature: 'import_photo' | 'import_pdf' | 'import_text' | 'import_url_ai' | 'translate';
          model: string;
          input_tokens: number;
          output_tokens: number;
          cost_estimate: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          user_id?: string | null;
          feature: 'import_photo' | 'import_pdf' | 'import_text' | 'import_url_ai' | 'translate';
          model: string;
          input_tokens?: number;
          output_tokens?: number;
          cost_estimate?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          user_id?: string | null;
          feature?: 'import_photo' | 'import_pdf' | 'import_text' | 'import_url_ai' | 'translate';
          model?: string;
          input_tokens?: number;
          output_tokens?: number;
          cost_estimate?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_household: {
        Args: { name: string };
        Returns: string;
      };
      create_invite: {
        Args: { p_household_id: string };
        Returns: string;
      };
      accept_invite: {
        Args: { code: string };
        Returns: string;
      };
      prepare_account_deletion: {
        Args: Record<PropertyKey, never>;
        Returns: { deleted_household_id: string }[];
      };
      is_household_member: {
        Args: { h_id: string };
        Returns: boolean;
      };
      is_household_owner: {
        Args: { h_id: string };
        Returns: boolean;
      };
      is_app_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
