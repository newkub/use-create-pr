> ![Status](https://img.shields.io/badge/status-in_development-orange)

# use-create-pr

Create fully-featured pull requests with annotated screenshots, test-case accordions, and staging preview links.

![GitHub release](https://img.shields.io/github/v/release/newkub/use-create-pr?color=10b981)
![License](https://img.shields.io/badge/license-MIT-blue)
![Issues](https://img.shields.io/github/issues/newkub/use-create-pr?color=ef4444)

```text
┌──────────────────────────────────────────────────────────────────┐
│  use-create-pr                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  ## Feature Summary                                         │ │
│  │  | No. | Feature | Status | Evidence |                      │ │
│  │  ...                                                        │ │
│  │                                                             │ │
│  │  <details>                                                  │ │
│  │  <summary>Test case 1: Open homepage</summary>              │ │
│  │  - Preview: [staging]                                       │ │
│  │  - ![annotated screenshot](...)                            │ │
│  │  </details>                                                 │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## Get Started

1. Install dependencies
   ```bash
   bun install
   ```
2. Run the Probot dev server
   ```bash
   bun run dev
   ```
3. Or use the CLI to build a PR body
   ```bash
   bunx tsx src/cli.ts --input pr-body.json --output pr-body.md
   ```

## Features

| Icon | Feature | Description |
|:---:|---------|-------------|
| 🖼️ | Annotated screenshots | Add arrows, boxes, and text on screenshots automatically |
| 📝 | Accordion test cases | One `<details>` block per test case with description and evidence |
| 🔗 | Staging preview links | Separate preview link for each test case (not embedded in the image) |
| 🤖 | GitHub App (Probot) | Auto-format PR bodies on `pull_request.opened` or via slash commands |
| 🧰 | CLI + Devin skill | Use locally, in CI, or as a Devin `/use-create-pr` skill |

## Usage

### CLI

```bash
bunx tsx src/cli.ts --input pr-body.json --output pr-body.md
```

### Probot GitHub App

1. Create a GitHub App in your account or organization.
2. Set permissions: `Pull requests`, `Issues`, `Contents`.
3. Subscribe to events: `Pull request`, `Issue comment`.
4. Install the app on your repositories.
5. Set environment variables from `.env.example`.

### Devin skill

Copy `SKILL.md` to your `.devin/skills/use-create-pr/` directory and invoke with `/use-create-pr`.

## Configuration

Create `.github/use-create-pr.json` in the target repository:

```json
{
  "enabled": true,
  "features": [
    {
      "name": "Docs migration",
      "description": "Migrate docs to VitePress",
      "status": "Ready",
      "testCases": [
        {
          "summary": "Homepage loads",
          "description": "See the docs homepage",
          "previewUrl": "http://localhost:4173",
          "imageName": "docs-homepage.png",
          "imageAlt": "docs homepage"
        }
      ]
    }
  ],
  "images": [
    { "localPath": "docs/screenshots/homepage.png", "name": "docs-homepage.png" }
  ]
}
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE.md)
