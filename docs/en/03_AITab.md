# AI Suggest Tab

The SEO analysis field has an "AI Suggest" tab that is meant to generate a
meta title, meta description and focus keyword suggestion for a page using
an AI service, via a `POST /ai-suggest/seo` request.

> **Note:** this tab currently ships without a corresponding backend
> endpoint. Unless `POST /ai-suggest/seo` is implemented and routed in your
> project, clicking "Generate suggestions" will fail.

## Disable the AI Suggest tab

If you don't have the backend endpoint wired up (or simply don't want to
offer this feature to editors), hide the tab entirely with the following
option:

```yaml
Syntro\Seo\Forms\SEOAnalysisField:
  show_ai_tab: false
```

The tab (and its contents) will then not be rendered at all, rather than
just being hidden from view.
