<script lang="ts">
    import { HOST, API_HOST } from "$lib/constants";

    export let data: any;

    let showDialog = false;
    let showError = false;

    let url = new URL("https://example.com"); // temporary assign

    try {
        url = new URL(data.url);
    } catch (error) {
        showError = true;
    }

    if (url.toString() != "https://example.com") {
        const self_host = new URL(HOST);
        const self_api = new URL(API_HOST);

        if (url.host != self_host.host && url.host != self_api.host) {
            showDialog = true;
        } else {
            window.location.href = url.toString();
        }
    }
</script>

<div id="content">
    {#if showError}

        <h1>Whoops</h1>
        <h3>Ein Link hat versucht dich zu einer ungültigen URL weiterzuleiten.</h3>
        <h4>Solltest du sie trotzdem öffnen wollen, klicke <a href={data.url}>hier</a>.</h4>
        <h5>Durch das Öffnen einer externen Webseite kann sie dich möglicherweise identifizieren!</h5>
        <h6>Wir übernehmen keine Haftung!</h6>
    
    {:else if showDialog}
        <h1>Du verlässt nun WildChat</h1>
        <h3>Die folgende Webseite kann dich möglicherweise identifizieren.</h3>
        <h4>Wir übernehmen keine Haftung!</h4>
        <h5>{url.host}</h5>
        <a href={url.toString()}
            ><button class="btn btn-primary">Weiter</button></a
        >
    {/if}
</div>

<style>
    #content {
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
    }
</style>
