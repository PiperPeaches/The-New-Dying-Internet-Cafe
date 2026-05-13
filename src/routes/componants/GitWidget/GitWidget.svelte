<script lang="ts">
    import { onMount } from 'svelte';

    interface GitFile {
        name: string;
        path: string;
        type: 'file' | 'dir';
        download_url?: string;
        sha: string;
        size: number;
        url: string;
    }

    let username = "piperpeaches";
    let repo = "The-New-Dying-Internet-Cafe";

    // State Management
    let files = $state<GitFile[]>([]);
    let currentPath = $state("");
    let selectedFileContent = $state("");
    let currentFileName = $state("");
    let loading = $state(true);
    let viewLoading = $state(false);

    // Fetch Directory Structure
    async function fetchData(path = "") {
        loading = true;
        try {
            const res = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`);
            if (res.ok) files = await res.json();
            loading = false;
        } catch {
            loading = false;
        }
    }

    // Fetch and Read File Content
    async function readFile(file: GitFile) {
        if (file.type === 'dir') {
            currentPath = file.path;
            fetchData(file.path);
            return;
        }

        viewLoading = true;
        currentFileName = file.name;
        try {
            const res = await fetch(file.download_url!);
            selectedFileContent = await res.text();
        } catch {
            selectedFileContent = "ERROR: UNABLE_TO_READ_BUFFER";
        } finally {
            viewLoading = false;
        }
    }

    function goBack() {
        const parts = currentPath.split('/');
        parts.pop();
        currentPath = parts.join('/');
        fetchData(currentPath);
        selectedFileContent = ""; // Clear reader when navigating
        currentFileName = "";
    }

    onMount(() => fetchData());
</script>

<div class="flex rounded border-white w-full h-[55vh] max-h-[55vh] overflow-hidden min-h-0 text-white border p-5">
    <!-- Sidebar: File Browser -->
    <div class="w-[35%] flex flex-col min-h-0 h-full">
        <div class="p-1 uppercase"><a href="https://github.com/piperpeaches/Nixos-Config" target="_blank" rel="noreferrer">{repo}</a>: /{currentPath}</div>
        
        {#if loading}
            <div class="animate-pulse">MAPPING_SECTORS...</div>
        {:else}
            <div class="overflow-y-auto p-[5px] min-h-0">
                {#if currentPath !== ""}
                    <button type="button" on:click={goBack} class="block w-full text-left cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis p-0.75 px-1.25 text-red-400"> [..] UP_DIR </button>
                {/if}

                {#each files as file (file.path)}
                    <button 
                        type="button"
                        on:click={() => readFile(file)} 
                        class="block w-full text-left cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis p-0.75 px-1.25"
                        class:text-purple-400={file.type === 'dir'} class:font-bold={file.type === 'dir'}
                        class:text-purple-200={file.type === 'file'}
                        class:bg-gray-700={currentFileName === file.name}
                    >
                        <span class="mr-1">{file.type === 'dir' ? '>>' : '--'}</span>
                        {file.name}
                    </button>
                {/each}
            </div>
        {/if}
    </div>

    <!-- Main View: File Reader -->
    <div class="w-[65%] flex flex-col min-h-0 h-full">
        <div class="p-1 uppercase">File: {currentFileName || "IDLE"}</div>
        
        <div class="flex-1 overflow-auto p-4 min-h-0 h-full">
            {#if viewLoading}
                <div class="animate-pulse">LOADING_BYTES...</div>
            {:else if selectedFileContent}
                <pre class="m-0 text-[11px] leading-[1.4] whitespace-pre-wrap break-words overflow-auto max-h-full"><code>{selectedFileContent}</code></pre>
            {:else}
                <div class="h-full flex items-center justify-center">SELECT_FILE_FOR_OUTPUT</div>
            {/if}
        </div>
    </div>
</div>