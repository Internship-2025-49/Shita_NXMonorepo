/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DELETE, PUT } from "../../utils/queries/users/[id]/route";

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
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      queryClient.invalidateQueries({ queryKey: ["users"] }); 
    },
  })
};
