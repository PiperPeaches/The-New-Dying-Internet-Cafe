<script lang="ts">
    import { onMount } from 'svelte';

    let servers = $state([
        { id: "1447409301055606796", label: "The Dying Internet Cafe", data: null as any, loading: true },
        { id: "1504256914324984020", label: "Indieweb Hangout", data: null as any, loading: true }
    ]);

    async function fetchServerStats(index: number) {
        try {
            const res = await fetch(`https://discord.com/api/guilds/${servers[index].id}/widget.json`);
            if (res.ok) {
                servers[index].data = await res.json();
            }
        } catch {
            servers[index].data = null;
        } finally {
            servers[index].loading = false;
        }
    }

    onMount(() => {
        fetchServerStats(0);
        fetchServerStats(1);
    });
</script>

<div class="rounded border-white border p-4 flex flex-col gap-4 w-full">
    <div class="flex justify-between items-center border-b border-white p-2">
        <h2 class="">Live Discord Activity</h2>
    </div>

    <div class="flex flex-col gap-6">
        {#each servers as server}
            <div class="flex flex-col gap-2">
                <!-- Node Header -->
                <div class="flex justify-between items-center">
                    <span class="text-purple-200 font-bold">>> {server.label}</span>
                </div>
                
                {#if server.loading}
                    <div class="text-purple-300">Shaking Violently...</div>
                {:else if server.data}
                    <!-- Detailed Stats Grid -->
                    <div class="grid grid-cols-2 gap-y-1 pl-3">
                        <div class="text-white">Activity:</div>
                        <div class="text-green-400">{server.data.presence_count} Online</div>
                    </div>

                {:else}
                    <div class="pl-3 py-2 border border-dashed border-white/10 mx-3">
                        <div class="text-red-500 text-[9px]">>> ERROR: API_LINK_REFUSED</div>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>