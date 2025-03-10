import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DELETE } from "../../utils/queries/users/[id]/route";

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
