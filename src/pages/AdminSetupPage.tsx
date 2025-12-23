import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Shield, CheckCircle, AlertCircle, LogIn } from "lucide-react";

export default function AdminSetupPage() {
  const { user, isAdmin, checkAdminStatus, loading } = useAuth();
  const [setting, setSetting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSetAdmin = async () => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please sign in first to set up admin access.",
        variant: "destructive",
      });
      return;
    }

    setSetting(true);

    try {
      // Check if already admin
      const { data: existing } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (existing) {
        toast({
          title: "Already admin",
          description: "You already have admin privileges.",
        });
        await checkAdminStatus();
        setSetting(false);
        return;
      }

      // Insert admin role
      const { error } = await supabase.from("user_roles").insert({
        user_id: user.id,
        role: "admin",
      });

      if (error) {
        console.error("Error setting admin:", error);
        toast({
          title: "Error",
          description: "Failed to set admin role. " + error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Admin role assigned!",
          description: "You now have admin privileges.",
        });
        await checkAdminStatus();
      }
    } catch (err) {
      console.error("Error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setSetting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-foreground border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="volumetric-glass rounded-2xl p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <Shield className="h-16 w-16 mx-auto text-foreground mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Admin Setup
          </h1>
          <p className="text-muted-foreground">
            Assign admin privileges to your account
          </p>
        </div>

        {!user ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <AlertCircle className="h-5 w-5" />
              <span>You need to sign in first</span>
            </div>
            <Button
              onClick={() => navigate("/auth")}
              className="volumetric-glass-button text-foreground"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Go to Sign In
            </Button>
          </div>
        ) : isAdmin ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span>You are an admin!</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Logged in as: {user.email}
            </p>
            <Button
              onClick={() => navigate("/")}
              className="volumetric-glass-button text-foreground"
            >
              Go to Home
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Logged in as: {user.email}
            </p>
            <Button
              onClick={handleSetAdmin}
              disabled={setting}
              className="volumetric-glass-button text-foreground w-full"
            >
              {setting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Setting up...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Make Me Admin
                </span>
              )}
            </Button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-border/30">
          <button
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
