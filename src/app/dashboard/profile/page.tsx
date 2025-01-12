"use client";

import { useState, useEffect } from "react";
import type { EditableUser } from "~/lib/types/user";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert } from "~/components/ui/alert";

export default function ProfilePage() {
  const [user, setUser] = useState<EditableUser>({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/profile", { method: "GET" });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data: EditableUser = (await response.json()) as EditableUser;
        setUser({ ...data, password: "" });
        setLoading(false);
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to fetch user information.");
        setLoading(false);
      }
    };

    fetchUser().catch((error) => console.error("Error fetching user:", error));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setSuccessMessage("Profile successfully updated.");
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("An error occurred while updating the profile.");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete your account?")) {
      setSuccessMessage(null);
      setErrorMessage(null);

      try {
        const response = await fetch("/api/profile", {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete profile");
        }

        setSuccessMessage("Account successfully deleted.");
        setUser({ name: "", email: "", password: "" });

        window.location.href = "/login";
      } catch (error) {
        console.error("Error deleting profile:", error);
        setErrorMessage("An error occurred while deleting the account.");
      }
    }
  };

  if (loading) {
    return <p className="text-center text-gray-700">Loading...</p>;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-700">
            Update Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          {successMessage && (
            <Alert className="mb-4 text-green-600" variant="default">
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert className="mb-4 text-red-600" variant="destructive">
              {errorMessage}
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password (optional)
              </label>
              <Input
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="mt-4 w-full">
              Update
            </Button>
          </form>
          <Button
            onClick={handleDelete}
            variant="destructive"
            className="mt-4 w-full"
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
