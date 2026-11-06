<script lang="ts">
	import ConfigureAnalyses from '$lib/components/Project/ConfigureAnalyses.svelte';
	import NotebookSprawl from '$lib/components/Project/NotebookSprawl.svelte';
	import ProjectPage from '$lib/components/Project/ProjectPage.svelte';
	import ProjectSection from '$lib/components/Project/ProjectSection.svelte';
	import ReportPreview from '$lib/components/Project/ReportPreview.svelte';
	import Text from '$lib/components/Text.svelte';
	import { getProject } from '$lib/projects';

	const project = getProject('data-sanity-check');
</script>

<ProjectPage {project} showStack>
	<ProjectSection
		title="The problem"
		text={[
			`Before a client's official launch, we sent them a "Sanity Check": a report on their data tables and key metrics, so they could confirm everything aligned with their expectations.`,
			'When I joined the ETL team, the report generator lived in a single notebook, and it was painful in three ways:',
			[
				'Fragile, manual setup: outdated libraries, fiddly connection settings, and cells that had to be run by hand in order.',
				'Hand-edited configuration: every analysis was defined in Python dictionaries.',
				'Slow runs: every query ran sequentially, with a separate query for each time granularity.'
			],
			'Getting the latest version to run cleanly took a day or two, and generating a report for a decently sized client took around 20 minutes.'
		]}
	>
		<NotebookSprawl />
	</ProjectSection>

	<ProjectSection
		title="Approach"
		text={[
			"A coworker had started an internal tool in Streamlit, and I joined the initiative early on. Knowing that all client data lived in Snowflake already, I saw an opportunity for the notebook's logic to move there.",
			'A UI for setup was already significantly easier to manage than the notebook. I built a configuration screen where users specify analyses to generate on a column level, and define key metrics like deposits and net revenue.',
			"I then noticed that most of those choices could be inferred automatically. Dollar amounts get totaled, status-like columns get distributions, and the client's vertical sets how deposits and net revenue are defined.",
			'An Auto Configure button applies all of it, leaving the user to verify and refine rather than build from scratch.',
			'Under the hood, I replaced the sequential queries with batched queries run in parallel. A report that used to take around 20 minutes now took only 2.'
		]}
	>
		<ConfigureAnalyses />
	</ProjectSection>

	<ProjectSection
		title="The report"
		text={[
			'The old report was one long static HTML page with every table analysis in a single scroll, each one using all available screen real-estate. This was not ideal for clients, whose goal was to verify the numbers quickly.',
			'The new report was built around that goal:',
			[
				'A sidebar with a page for each table and key metric, so clients could jump straight to any analysis.',
				'Charts side by side, each titled with its query, so clients could compare analyses at a glance.',
				'Table and CSV views on every chart, so clients could copy the numbers straight into Excel.',
				'Daily, monthly, and yearly toggles on every chart, so clients could check trends at any time scale.',
				'A SQL view on every chart, so clients could validate the logic themselves.',
				'An Excel export of the whole report, should clients need to do their own analyses.'
			]
		]}
	>
		<ReportPreview />
	</ProjectSection>

	<ProjectSection
		title="Result"
		text={[
			'Getting a report out went from a day or two of setup plus around 20 minutes of runtime to about two minutes: auto configure, save, generate. Clients got a report they could navigate and verify themselves.'
		]}
	>
		{#snippet aside()}
			<Text tone="subtle" twclass="max-w-prose text-label font-normal">
				The screens on this page are recreated with made-up data. I no longer have the original
				work.
			</Text>
		{/snippet}
	</ProjectSection>
</ProjectPage>
