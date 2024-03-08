<script lang="ts">
	import { onMount } from 'svelte';
	import Loader from '$components/Loader.svelte';

	// icon and image goodies
	import { Icon, MapPin, Link, BuildingOffice, MagnifyingGlass } from 'svelte-hero-icons';
	import ghGeorge from '$images/gh-george.png';
	import ghHeisenberg from '$images/gh-heisenberg.png';
	import ghIronMan from '$images/gh-iron-man.png';
	import ghRiddler from '$images/gh-riddler.png';
	import ghDaftPunkGuy from '$images/gh-daft-punk-guy.gif';
	import ghDaftPunkThomas from '$images/gh-daft-punk-thomas.gif';
	import ghHomer from '$images/gh-homer.png';

	// animation goodies
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import IntersectionObserver from 'svelte-intersection-observer';
	let visible: any[] = [];

	// search goodies
	let searchQuery = ''; // search query
	let users: any[] = []; // user array
	let currentPage = 1; // current page
	const usersPerPage = 3; // users per page
	let hasSearched = false; // has searched status
	let isLoading = false;

	async function initialSearch() {
		// reset the users array
		users = [];
		// reset the current page
		currentPage = 1;
		// search for users
		await search();
	}

	async function search() {
		// enable loading
		isLoading = true;
		// set has searched status
		hasSearched = false;
		// fetch users from GitHub API
		const response = await fetch(
			`https://api.github.com/search/users?q=${searchQuery}&page=${currentPage}&per_page=${usersPerPage}`
		);
		// disable loading
		isLoading = false;
		// if response ok
		if (response.ok) {
			// get the data
			const data = await response.json();
			// map over the items to get the user details
			const newUsers = await Promise.all(data.items.map(getUserDetails));
			users = [...users, ...newUsers];
			// set has searched status
			hasSearched = true;
		} else {
			console.error('Error:', response.status, response.statusText);
		}
	}

	async function getUserDetails(user: { login: any }) {
		// fetch user details from GitHub API
		const response = await fetch(`https://api.github.com/users/${user.login}`, {
			// add the authorization header to avoid rate limiting
			headers: {
				Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
			}
		});
		// if the response ok
		if (response.ok) {
			// return the user details
			return await response.json();
		} else {
			// log the error
			console.error('Failed to fetch user details:', response.status, response.statusText);
			return user;
		}
	}

	function handleChange() {
		// reset user search status
		hasSearched = false;
	}

	function loadMore() {
		// increment the current page
		currentPage++;
		// search for more users
		search();
	}

	// array of images
	const images = [
		ghGeorge,
		ghHeisenberg,
		ghIronMan,
		ghRiddler,
		ghDaftPunkGuy,
		ghDaftPunkThomas,
		ghHomer
	];

	// define random image variable
	let randomImage: string;

	onMount(async () => {
		await search();
		randomImage = images[Math.floor(Math.random() * images.length)];
	});
</script>

<div class="container pt-24 pb-48 relative z-10">
	{#if randomImage}
		<img
			class="w-32 h-32 lg:w-48 lg:h-48 fill-white block mx-auto"
			src={randomImage}
			alt="GitHub Logo"
		/>
	{:else}
		<div class="w-32 h-32 lg:w-48 lg:h-48"></div>
	{/if}
	<h1 class="text-2xl lg:text-3xl text-center mt-8">GitHub User Search</h1>

	<form
		class="bg-slate-800 rounded-xl px-2 py-2 flex justify-between mt-12 items-center"
		on:submit|preventDefault={initialSearch}
	>
		<Icon class="w-8 shrink-0 text-blue-500 ml-3 hidden lg:block" src={MagnifyingGlass} solid />
		<!-- svelte-ignore a11y-autofocus -->
		<input
			class="bg-transparent px-4 lg:px-6 outline-none w-full"
			type="text"
			bind:value={searchQuery}
			on:input={handleChange}
			placeholder="Search GitHub users..."
			required
		/>
		<button type="submit" class="w-36">
			{#if isLoading}
				<Loader />
			{:else}
				Search
			{/if}
		</button>
	</form>

	<div class="relative">
		{#each users as { id, avatar_url, bio, blog, company, created_at, html_url, login, name, public_repos, followers, following, location, twitter_username } (id)}
			<IntersectionObserver threshold={0.2} bind:intersecting={visible[id]}>
				<div
					class="bg-slate-800 rounded-xl mt-6 p-8 lg:p-14 lg:flex gap-x-12 overflow-hidden"
					in:fly={{ y: visible[id] ? 0 : 200, duration: 500, easing: cubicOut }}
				>
					<img class="h-32 w-32 rounded-full mx-auto" src={avatar_url} alt={name} />
					<div class="w-full mt-8 lg:mt-0">
						<header class="flex flex-col lg:grid lg:grid-cols-[2fr_1fr] items-center">
							<a class="!text-white" href={html_url} target="_blank">
								<p class="text-3xl">{name}</p>
							</a>
							<p class="text-right text-slate-400">
								Joined {new Date(created_at).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'short',
									day: 'numeric'
								})}
							</p>
							<a href={html_url} target="_blank">
								<p class="mt-2 text-blue-500">@{login}</p>
							</a>
							<p class="col-span-2 mt-8 text-slate-400 text-center lg:text-left">
								{#if bio}
									{bio}
								{:else}
									No bio for this user.
								{/if}
							</p>
						</header>
						<span
							class="bg-slate-900 rounded-xl flex items-center justify-between px-6 py-6 lg:px-12 mt-8"
						>
							<p>
								<span class="block text-slate-400 text-sm">Repos</span><span
									class="font-bold text-2xl mt-3">{public_repos}</span
								>
							</p>
							<p>
								<span class="block text-slate-400 text-sm">Followers</span><span
									class="font-bold text-2xl mt-3">{followers}</span
								>
							</p>
							<p>
								<span class="block text-slate-400 text-sm">Following</span><span
									class="font-bold text-2xl mt-3">{following}</span
								>
							</p>
						</span>
						<footer class="mt-8 flex flex-col lg:grid grid-cols-2 gap-x-4 gap-y-4 text-slate-300">
							{#if location}
								<p class="flex items-center gap-x-4">
									<Icon class="w-6 shrink-0 text-white" src={MapPin} solid />
									{location}
								</p>
							{/if}

							{#if twitter_username}
								<p class="flex items-center gap-x-4">
									<svg
										class="w-6 shrink-0 fill-white"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
									>
										<path
											d="M21.543 7.104c.015.211.015.423.015.636 0 6.507-4.954 14.01-14.01 14.01v-.003A13.94 13.94 0 0 1 0 19.539a9.88 9.88 0 0 0 7.287-2.041 4.93 4.93 0 0 1-4.6-3.42 4.916 4.916 0 0 0 2.223-.084A4.926 4.926 0 0 1 .96 9.167v-.062a4.887 4.887 0 0 0 2.235.616A4.928 4.928 0 0 1 1.67 3.148a13.98 13.98 0 0 0 10.15 5.144 4.929 4.929 0 0 1 8.39-4.49 9.868 9.868 0 0 0 3.128-1.196 4.941 4.941 0 0 1-2.165 2.724A9.828 9.828 0 0 0 24 4.555a10.019 10.019 0 0 1-2.457 2.549z"
										/>
									</svg>
									<a href="https://twitter.com/{twitter_username}" target="_blank"
										>@{twitter_username}</a
									>
								</p>
							{/if}

							{#if blog}
								<p class="flex items-center gap-x-4">
									<Icon class="w-6 shrink-0 text-white" src={Link} solid />
									<a href={blog} target="_blank">{blog}</a>
								</p>
							{/if}

							{#if company}
								<p class="flex items-center gap-x-4">
									<Icon class="w-6 shrink-0 text-white" src={BuildingOffice} solid />
									{company}
								</p>
							{/if}
						</footer>
					</div>
				</div>
			</IntersectionObserver>
		{/each}

		{#if searchQuery !== '' && users.length === 0 && hasSearched}
			<p class="text-center mt-8 text-slate-400">No users found</p>
		{/if}
	</div>

	{#if users.length !== 0}
		<button on:click={loadMore} class="mx-auto mt-8 w-36">
			{#if isLoading}
				<Loader />
			{:else}
				Load More
			{/if}
		</button>
	{/if}
</div>
