# Code signing policy

Free code signing provided by SignPath.io, certificate by SignPath Foundation.

This policy applies only to official Windows releases of the open-source
DocFlow Local Desktop Community application. A release must not be described
as signed until its Authenticode signature and timestamp have been verified.

## Signing scope

The SignPath Foundation certificate may be used only for these Community
artifacts built from this repository:

- the Windows x64 NSIS installer;
- the Windows x64 portable executable; and
- DocFlow Local executable files authored and maintained by this project that
  are contained in those packages.

Private DocFlow Pro modules, commercial connectors, customer files, license
payloads, credentials, signing keys, and commercial packages are excluded.
Upstream binaries are not signed with the project's certificate.

Every component included in a signed Community package is distributed under
its applicable OSI-approved open-source license. The Community application,
Core, contracts, and license verifier are not offered under a proprietary
alternative license. Commercial products and services are limited to separate
Pro software that is not included in Community, industry templates,
implementation, training, support, service-level agreements, and trademark
permissions.

## Build and approval

- Source repository: <https://github.com/docflowlocal/docflow-desktop>
- Build system: GitHub Actions on GitHub-hosted runners
- Release inputs: reviewed immutable version tags or full commit SHAs
- Committer and reviewer: [@txianlian](https://github.com/txianlian)
- Release approver: [@txianlian](https://github.com/txianlian)

This is currently a single-maintainer project, so the same maintainer holds the
documented roles. Release signing still requires an explicit manual approval.
Maintainers must enable multi-factor authentication for both GitHub and
SignPath access.

## Privacy and user control

The [Community privacy policy](PRIVACY.md) applies to every signed build. The
Community Edition does not transfer document contents, customer data, file
names, field values, templates, signatures, or generated output to DocFlow
Local or another networked system. A network action explicitly requested by a
user must be separately documented and must not silently upload document
content.

The Windows installer provides an uninstaller. Users can remove DocFlow Local
from **Settings > Apps > Installed apps > DocFlow Local > Uninstall** or from
the Start menu shortcut created by the installer.

## Verification

Release notes publish the source commit, SHA-256 checksums, a CycloneDX SBOM,
and the build record. A signed Windows artifact must pass both
`Get-AuthenticodeSignature` and `signtool verify /pa /all /v` before it is
published.
