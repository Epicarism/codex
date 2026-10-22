<p align="center"><strong>Codex CLI</strong> is a coding agent from OpenAI that runs locally on your computer.
<p align="center">
  <img src="https://github.com/openai/codex/blob/main/.github/codex-cli-splash.png" alt="Codex CLI splash" width="80%" />
</p>
</br>
If you want Codex in your code editor (VS Code, Cursor, Windsurf), <a href="https://developers.openai.com/codex/ide">install in your IDE.</a>
</br>If you want the desktop app experience, run <code>codex app</code> or visit <a href="https://chatgpt.com/codex?app-landing-page=true">the Codex App page</a>.
</br>If you are looking for the <em>cloud-based agent</em> from OpenAI, <strong>Codex Web</strong>, go to <a href="https://chatgpt.com/codex">chatgpt.com/codex</a>.</p>

---

## Quickstart

### Installing and running Codex CLI

Run the following on Mac or Linux to install Codex CLI:

```shell
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

Run the following on Windows to install Codex CLI:

```shell
powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"
```

The standalone installers download from `https://releases.openai.com/codex` by default and fall back to GitHub Releases if a metadata or asset download is unavailable. To force GitHub Releases, set `CODEX_INSTALLER_USE_RELEASES_OPENAI_COM` to `false` (`0` and `no` are also accepted):

```shell
curl -fsSL https://chatgpt.com/codex/install.sh | CODEX_INSTALLER_USE_RELEASES_OPENAI_COM=false sh
```

```powershell
$env:CODEX_INSTALLER_USE_RELEASES_OPENAI_COM='false'; irm https://chatgpt.com/codex/install.ps1 | iex
```

Codex CLI can also be installed via the following package managers:

```shell
# Install using npm
npm install -g @openai/codex
```

```shell
# Install using Homebrew
brew install --cask codex
```

Then simply run `codex` to get started.

<details>
<summary>You can also go to the <a href="https://github.com/openai/codex/releases/latest">latest GitHub Release</a> and download the appropriate binary for your platform.</summary>

Each GitHub Release contains many executables, but in practice, you likely want one of these:

- macOS
  - Apple Silicon/arm64: `codex-aarch64-apple-darwin.tar.gz`
  - x86_64 (older Mac hardware): `codex-x86_64-apple-darwin.tar.gz`
- Linux
  - x86_64: `codex-x86_64-unknown-linux-musl.tar.gz`
  - arm64: `codex-aarch64-unknown-linux-musl.tar.gz`

Each archive contains a single entry with the platform baked into the name (e.g., `codex-x86_64-unknown-linux-musl`), so you likely want to rename it to `codex` after extracting it.

</details>

### Using Codex with your ChatGPT plan

Run `codex` and select **Sign in with ChatGPT**. We recommend signing into your ChatGPT account to use Codex as part of your Plus, Pro, Business, Edu, or Enterprise plan. [Learn more about what's included in your ChatGPT plan](https://help.openai.com/en/articles/11369540-codex-in-chatgpt).

You can also use Codex with an API key, but this requires [additional setup](https://developers.openai.com/codex/auth#sign-in-with-an-api-key).

## Docs

- [**Codex Documentation**](https://developers.openai.com/codex)
- [**Contributing**](./docs/contributing.md)
- [**Installing & building**](./docs/install.md)
- [**Open source fund**](./docs/open-source-fund.md)

This repository is licensed under the [Apache-2.0 License](LICENSE).

## Fork runtime security (2026-10-23)

Development and CI use Node 22.23.4; npm trusted publishing uses 24.22.1.
Previously these selected floating 22/24 and the secure devcontainer installed
floating NodeSource 22. The secure container now copies an exact Node 22.23.4
image, and `.node-version` records that version.
The root `>=22`, SDK `>=18` and CLI/proxy `>=16` engines describe package
compatibility, not approved operational runtimes; they remain unchanged.
The development installer engine range is restricted to supported patched
22.23.4+, 24.22.1+ and 26.12.1+ branches (within each major).

This addresses Node CVE-2026-111497 in the
[October 21 advisory](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases).
No PHP runtime or Composer pins were found; PHP2Shell
CVE-2026-109618/CVE-2026-109619 required no PHP changes.

Verify with `node --version`, `node .github/scripts/check-node-runtime.cjs` and
`pnpm audit --audit-level high` in both existing pnpm lockfile directories.
Local Node 24.22.1/Brotli 1.2.0 passed the actual runtime/Brotli and source-selector
gate. Throwaway fixtures rejected unsafe image, tarball, distro, version-file,
Volta and launcher selections while admitting patched supported boundaries.
The runtime gate has its own CI job, independent of unrelated repository checks.

Development security fixes include MCP SDK 1.26.0 to 1.32.0, Undici 7.28.0 to
7.29.1, Handlebars 4.7.9 to 4.7.10, fast-uri 3.1.1 to 3.1.7, patched JS-YAML
3/4 and brace-expansion 1/5 branches, proxy-addr 2.0.8 and Browserslist 4.28.7.
To remove the unpatched
[braces chain](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), its consumers
moved from Jest 29.7 to 30.5.2 and TypeScript-ESLint 8.45 to 8.48, with matching
Jest types and ts-jest 29.4.15. Existing test code, default suites and configurations
were preserved. This follows the
[supported Jest migration](https://jestjs.io/docs/upgrading-to-jest30);
no package scanner or advisory was suppressed.

The full root audit went from 42 high/3 critical to zero high/critical; 4 low
and 25 moderate findings remain in development tooling. The production-only
audit and the devcontainer installer audit contain zero vulnerabilities.
[Remote security/SDK proof](https://github.com/Epicarism/codex/actions/runs/39879779179)
passed the runtime and dependency jobs, frozen-lockfile/scripts-disabled install,
actual ESM/declaration build, type-check of all source/tests/samples, and Jest 30
discovery of all five unchanged default suites. Discovery is not test execution.
Full SDK/MCP integration execution requires the matching built Codex binary;
the inherited fork CI still fails its pre-existing Cargo workspace-manifest
verification and other unrelated jobs. No tests were deleted to hide that blocker.
Actionlint passed the changed repo-checks workflow; untouched SDK/release workflows
retain baseline deployment/matrix/cache-output diagnostics.
No live deployment, container build or model traffic was performed.
