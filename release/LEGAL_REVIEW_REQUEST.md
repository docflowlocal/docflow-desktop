# DocFlow Local 0.5.0 — legal and provenance review request

Status: **pending professional review**. This document records engineering
facts and questions for qualified counsel; it is not legal advice and does not
approve a release.

## Release scope

DocFlow Local is a privacy-first desktop document-automation product. The
planned public release consists of the following repositories in the
`docflowlocal` GitHub organization:

| Repository | Intended visibility | Intended license/status |
| --- | --- | --- |
| `docflow` | public | Core target is MPL-2.0; inherited files remain MPL-2.0 **and** AGPL-3.0-or-later until resolved |
| `docflow-desktop` | public | AGPL-3.0-or-later historical Community desktop application |
| `templates` | public | Per-template manifest; starter templates are documented as CC-BY |
| `plugins` | public | MPL-2.0 |
| `examples` | public | MPL-2.0 |
| `docs` | public | Documentation license to be selected |
| `docflow-pro` | private | Proprietary commercial modules |

## Engineering facts requiring review

1. The historical 0.x monolith and the Desktop Community source remain under
   AGPL-3.0-or-later. The historical tag must be retained.
2. The current Core preview includes files copied or adapted from historical
   AGPL engine code (`src/data.js`, `src/expression.js`, `src/index.js`, and
   `src/template-engine.js`). It is explicitly marked
   `MPL-2.0 AND AGPL-3.0-or-later`; it must **not** be represented as pure MPL
   before all relevant rightsholders grant relicensing permission or the code is
   independently replaced under the documented clean-room plan.
3. The private Pro product is separated from public repositories and public
   build artifacts. It may consume public contracts, but public products must
   not contain Pro source, customer data, licenses, signing keys, or commercial
   build logs.
4. Community templates, contributed examples, third-party fonts, package
   dependencies, trademarks, generated artifacts, contributor submissions, and
   product marketing all need rights/notice review.
5. The release process uses Developer ID signing and Apple notarization for
   macOS. Signing keys and notarization credentials are retained outside source
   control. Windows distribution will require a separately obtained trusted
   Authenticode certificate and Windows-host verification.

## Requested counsel determinations

- Confirm the permitted distribution and notice obligations for the AGPL
  Community desktop release and the mixed-license Core preview.
- Confirm the required relicensing grants, clean-room controls, or alternative
  architecture before any Core package is called “MPL-only”.
- Review the proposed commercial boundary between AGPL Community code and
  proprietary Pro modules, including API/plugin/IPC boundaries.
- Review the contributor process (DCO/CLA), copyright assignment policy if any,
  and inbound contribution license terms.
- Review template/content provenance, third-party dependency notices, font
  licenses, and trademark/name/domain usage.
- Review the proposed commercial license, support terms, privacy claims,
  export/sanctions obligations if applicable, and the website legal pages.

## Evidence needed to clear the release gate

The release record must contain a dated reference to a qualified reviewer’s
written approval or memo. That reference should state the reviewed commit/tag,
the repositories and licenses covered, exceptions or follow-up actions, and
the approving person or firm. Do not mark `legalProvenanceReview` complete from
this document alone.

## Related engineering records

- `RELEASE_CHECKLIST.md`
- `PLATFORM_ARCHITECTURE.md`
- `NOTICE.md`
- `LICENSE`, `LICENSES/MPL-2.0.txt`
- Core clean-room plan: <https://github.com/docflowlocal/docflow/blob/main/docs/core-relicensing-clean-room-plan.md>
