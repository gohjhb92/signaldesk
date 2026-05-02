export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type AnalystPriority = "low" | "medium" | "high";
export type SourceType = "rss" | "blog" | "substack" | "podcast" | "youtube" | "report" | "x_manual";
export type Sentiment = "bullish" | "bearish" | "neutral" | "mixed" | "unknown";
export type ThesisStatus = "watching" | "building" | "active" | "trimming" | "exited";

export type Database = {
  public: {
    Tables: {
      analysts: {
        Row: {
          id: string;
          name: string;
          category: string | null;
          priority: AnalystPriority;
          notes: string | null;
          website: string | null;
          x_handle: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category?: string | null;
          priority?: AnalystPriority;
          notes?: string | null;
          website?: string | null;
          x_handle?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string | null;
          priority?: AnalystPriority;
          notes?: string | null;
          website?: string | null;
          x_handle?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sources: {
        Row: {
          id: string;
          analyst_id: string;
          source_type: SourceType;
          source_url: string;
          active: boolean;
          last_checked_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          analyst_id: string;
          source_type: SourceType;
          source_url: string;
          active?: boolean;
          last_checked_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          analyst_id?: string;
          source_type?: SourceType;
          source_url?: string;
          active?: boolean;
          last_checked_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sources_analyst_id_fkey";
            columns: ["analyst_id"];
            isOneToOne: false;
            referencedRelation: "analysts";
            referencedColumns: ["id"];
          }
        ];
      };
      content_items: {
        Row: {
          id: string;
          analyst_id: string;
          source_id: string | null;
          title: string;
          url: string;
          source_type: string | null;
          published_at: string | null;
          raw_text: string | null;
          summary: string | null;
          why_it_matters: string | null;
          sentiment: Sentiment;
          importance_score: number;
          assets: string[];
          themes: string[];
          embedding: string | null;
          embedding_model: string | null;
          embedded_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          analyst_id: string;
          source_id?: string | null;
          title: string;
          url: string;
          source_type?: string | null;
          published_at?: string | null;
          raw_text?: string | null;
          summary?: string | null;
          why_it_matters?: string | null;
          sentiment?: Sentiment;
          importance_score?: number;
          assets?: string[];
          themes?: string[];
          embedding?: string | null;
          embedding_model?: string | null;
          embedded_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          analyst_id?: string;
          source_id?: string | null;
          title?: string;
          url?: string;
          source_type?: string | null;
          published_at?: string | null;
          raw_text?: string | null;
          summary?: string | null;
          why_it_matters?: string | null;
          sentiment?: Sentiment;
          importance_score?: number;
          assets?: string[];
          themes?: string[];
          embedding?: string | null;
          embedding_model?: string | null;
          embedded_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "content_items_analyst_id_fkey";
            columns: ["analyst_id"];
            isOneToOne: false;
            referencedRelation: "analysts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_items_source_id_fkey";
            columns: ["source_id"];
            isOneToOne: false;
            referencedRelation: "sources";
            referencedColumns: ["id"];
          }
        ];
      };
      content_tags: {
        Row: {
          id: string;
          content_item_id: string;
          tag: string;
          tag_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          content_item_id: string;
          tag: string;
          tag_type?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          content_item_id?: string;
          tag?: string;
          tag_type?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "content_tags_content_item_id_fkey";
            columns: ["content_item_id"];
            isOneToOne: false;
            referencedRelation: "content_items";
            referencedColumns: ["id"];
          }
        ];
      };
      alert_rules: {
        Row: {
          id: string;
          name: string;
          keywords: string[];
          assets: string[];
          minimum_priority: AnalystPriority | null;
          enabled: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          keywords?: string[];
          assets?: string[];
          minimum_priority?: AnalystPriority | null;
          enabled?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          keywords?: string[];
          assets?: string[];
          minimum_priority?: AnalystPriority | null;
          enabled?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      trade_theses: {
        Row: {
          id: string;
          name: string;
          category: string | null;
          status: ThesisStatus;
          horizon: string | null;
          conviction: AnalystPriority;
          assets: string[];
          themes: string[];
          bull_case: string | null;
          bear_case: string | null;
          catalysts: string[];
          invalidation_signals: string[];
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category?: string | null;
          status?: ThesisStatus;
          horizon?: string | null;
          conviction?: AnalystPriority;
          assets?: string[];
          themes?: string[];
          bull_case?: string | null;
          bear_case?: string | null;
          catalysts?: string[];
          invalidation_signals?: string[];
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string | null;
          status?: ThesisStatus;
          horizon?: string | null;
          conviction?: AnalystPriority;
          assets?: string[];
          themes?: string[];
          bull_case?: string | null;
          bear_case?: string | null;
          catalysts?: string[];
          invalidation_signals?: string[];
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      alert_history: {
        Row: {
          id: string;
          content_item_id: string;
          alert_rule_id: string | null;
          trigger_reason: string;
          delivered_to: string;
          delivered_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          content_item_id: string;
          alert_rule_id?: string | null;
          trigger_reason: string;
          delivered_to?: string;
          delivered_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          content_item_id?: string;
          alert_rule_id?: string | null;
          trigger_reason?: string;
          delivered_to?: string;
          delivered_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "alert_history_content_item_id_fkey";
            columns: ["content_item_id"];
            isOneToOne: false;
            referencedRelation: "content_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "alert_history_alert_rule_id_fkey";
            columns: ["alert_rule_id"];
            isOneToOne: false;
            referencedRelation: "alert_rules";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      set_updated_at: {
        Args: Record<string, never>;
        Returns: unknown;
      };
      search_content_items: {
        Args: {
          query_embedding: string;
          query_text: string;
          match_count?: number;
        };
        Returns: Array<{
          id: string;
          title: string;
          url: string;
          source_type: string | null;
          published_at: string | null;
          summary: string | null;
          why_it_matters: string | null;
          sentiment: Sentiment;
          importance_score: number;
          assets: string[];
          themes: string[];
          analyst_name: string;
          vector_score: number;
          keyword_score: number;
          combined_score: number;
        }>;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
