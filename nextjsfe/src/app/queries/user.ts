import { useQuery } from "@tanstack/react-query";
import { GET } from "../utils/queries/users/route";

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
