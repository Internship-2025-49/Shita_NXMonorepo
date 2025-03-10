import { useQuery } from "@tanstack/react-query";
import { GET } from "../utils/queries/users/route";
import { fetchUserById } from "../utils/queries/users/[id]/route";
import { useParams } from "next/navigation";

//GET All Data
export const useUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await GET();
            if (!res || res.error) {
                throw new Error(res?.error || "Failed to fetch users");
            }
            return Array.isArray(res) ? res : [];
        },
    });
};

//GET Data By Id
export const useUsersById = () => {
  const params = useParams();
  const userId = Number(params?.id);

  return useQuery({
    queryKey: ["users", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");

      const res = await fetchUserById(userId);
      if (!res || res.error) {
        throw new Error(res?.error || "Failed to show user data");
      }

      return res;
    },
    enabled: !!userId,
  });
};