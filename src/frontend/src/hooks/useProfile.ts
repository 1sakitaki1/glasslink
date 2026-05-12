import { type Profile, createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useProfile() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return { name: "", bio: "", avatarBlob: undefined };
      return actor.getProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetProfile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      bio: string;
      avatarBlob?: import("@/backend").ExternalBlob;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.setProfile(data.name, data.bio, data.avatarBlob ?? null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
