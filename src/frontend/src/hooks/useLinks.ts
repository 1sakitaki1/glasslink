import { type Link, createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useLinks() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Link[]>({
    queryKey: ["links"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listLinks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddLink() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      url: string;
      displayText: string;
      icon?: string;
      orderIndex: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addLink(
        data.url,
        data.displayText,
        data.icon ?? null,
        data.orderIndex,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });
}

export function useUpdateLink() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      url: string;
      displayText: string;
      icon?: string;
      orderIndex: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateLink(
        data.id,
        data.url,
        data.displayText,
        data.icon ?? null,
        data.orderIndex,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });
}

export function useDeleteLink() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteLink(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });
}
