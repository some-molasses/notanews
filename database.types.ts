export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          body: string | null
          created_at: string
          id: string
          issue_id: string | null
          postscript: string | null
          pseudonym: string | null
          state: Database["public"]["Enums"]["article-state"]
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          issue_id?: string | null
          postscript?: string | null
          pseudonym?: string | null
          state?: Database["public"]["Enums"]["article-state"]
          title?: string | null
          updated_at: string
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          issue_id?: string | null
          postscript?: string | null
          pseudonym?: string | null
          state?: Database["public"]["Enums"]["article-state"]
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      issue_template_components: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          issue_template_id: string | null
          plurality: Database["public"]["Enums"]["template-component-plurality"]
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          issue_template_id?: string | null
          plurality?: Database["public"]["Enums"]["template-component-plurality"]
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          issue_template_id?: string | null
          plurality?: Database["public"]["Enums"]["template-component-plurality"]
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issue_template_components_issue_template_id_fkey"
            columns: ["issue_template_id"]
            isOneToOne: false
            referencedRelation: "issue_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_templates: {
        Row: {
          created_at: string
          id: string
          issue_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          issue_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          issue_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issue_templates_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: true
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      issues: {
        Row: {
          created_at: string
          id: string
          name: string
          paper_id: string
          published_at: string | null
          state: Database["public"]["Enums"]["issue-state"]
          submission_deadline: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          paper_id: string
          published_at?: string | null
          state?: Database["public"]["Enums"]["issue-state"]
          submission_deadline?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          paper_id?: string
          published_at?: string | null
          state?: Database["public"]["Enums"]["issue-state"]
          submission_deadline?: string
        }
        Relationships: [
          {
            foreignKeyName: "issues_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
        ]
      }
      paper_members: {
        Row: {
          id: string
          paper_id: string
          type: Database["public"]["Enums"]["paper-role"]
          user_id: string
        }
        Insert: {
          id?: string
          paper_id: string
          type?: Database["public"]["Enums"]["paper-role"]
          user_id: string
        }
        Update: {
          id?: string
          paper_id?: string
          type?: Database["public"]["Enums"]["paper-role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org-members_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paper_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      papers: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          user_id?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          created_at: string
          id: string
          issue_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          issue_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          issue_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      paper_members_detailed: {
        Row: {
          email: string | null
          id: string | null
          paper_id: string | null
          type: Database["public"]["Enums"]["paper-role"] | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "org-members_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paper_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Functions: {
      close_overdue_issues: { Args: never; Returns: undefined }
    }
    Enums: {
      "article-state": "draft" | "submitted" | "approved" | "rejected"
      "issue-state": "writing" | "copyediting" | "generating" | "published"
      "paper-role": "contributor" | "editor"
      "template-component-plurality": "single-item" | "multi-item"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      "article-state": ["draft", "submitted", "approved", "rejected"],
      "issue-state": ["writing", "copyediting", "generating", "published"],
      "paper-role": ["contributor", "editor"],
      "template-component-plurality": ["single-item", "multi-item"],
    },
  },
} as const
