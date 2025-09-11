# Nore UI CLI

A command-line interface for quickly adding Nore UI components to your React projects with Panda CSS.

## Installation

```bash
npm install -g nore-ui
```

Or use with npx:

```bash
npx nore-ui@latest init
```

## Quick Start

1. **Initialize your project**

   ```bash
   nore-ui init
   ```

2. **Add components**

   ```bash
   nore-ui add button
   nore-ui add card
   ```

## Prerequisites

- React 19+
- Panda CSS configured

## Commands

### `init`

Set up Nore UI in your project. This will:

- Configure import aliases
- Set up component structure
- Install required dependencies

```bash
nore-ui init
```

### `add [component]`

Add a component from the registry:

```bash
nore-ui add button
nore-ui add input
nore-ui add dialog
```

## Configuration

During `init`, you'll configure where components are installed:

- **Components**: `@/components/ui` (default)
- **Utils**: `@/lib` (default)
- **Hooks**: `@/hooks` (default)

Settings are saved in `nore-ui.json`.

## Available Components

View all available components and their documentation at [template-fe.nore.web.id](https://template-fe.nore.web.id/).

## Author

Ahmad Miftachul Hidayat

## License

MIT
