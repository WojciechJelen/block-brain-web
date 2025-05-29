"use client";
import { useState } from "react";
import { api } from "@/utils/supabase/helpers-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at?: string;
}

export default function UserDetailsClient() { 
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/users/me");
      console.log(response);
      setUser(response.data);
    } catch (err) {
      setError("Failed to fetch user details");
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = (user: User) => {
    if (user.name) {
      return user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email[0].toUpperCase();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>
          View your account information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!user && !loading && (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Click the button below to fetch your user details
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {user && (
          <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
            <Avatar className="size-12">
              <AvatarImage src={user.avatar_url} alt={user.name || user.email} />
              <AvatarFallback className="text-sm font-medium">
                {getUserInitials(user)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.name || "No name set"}
              </p>
              <p className="text-sm text-muted-foreground">
                {user.email}
              </p>
              {user.created_at && (
                <p className="text-xs text-muted-foreground">
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}

        <Button 
          onClick={fetchUser} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "Loading..." : user ? "Refresh User Details" : "Fetch User Details"}
        </Button>
      </CardContent>
    </Card>
  );
}