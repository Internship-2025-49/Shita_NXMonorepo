/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DELETE, PUT } from "../../utils/queries/users/[id]/route";
import { getApiKey, getAuthToken } from "../../utils/authHelper";
import { toast } from "sonner";

// DELETE Data
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        const result = await DELETE(id);
        return result;
      } catch (error) {
        console.error("Failed to delete post:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

//PUT Data 
export const usePutUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updateData }: { id: number; updateData: any }) => {
      return await PUT(id, updateData);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["user", id, "users"] });
    },
  })
};

//POST Data 
export const usePostUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUser: Record<string, any>) => {
      if (!newUser) throw new Error("User data is required");

      if (!newUser.username || /\s/.test(newUser.username.trim())) {
        toast.error("Usernames cannot contain spaces!");
        throw new Error("Usernames cannot contain spaces!");
      }

      const token = await getAuthToken();
      const apiKey = await getApiKey(token);

      const res = await fetch("http://localhost:3000/api/users/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "nx-api": apiKey,
        },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Request failed: ${errorText}`);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};


