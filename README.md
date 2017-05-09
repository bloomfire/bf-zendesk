# bloomfire-zendesk-app

A Zendesk app integrating Bloomfire community features like search and Post/Question creation, and providing a way to link Bloomfire resources to Zendesk tickets for future reference.

## Setup

Ensure that Ruby is installed ([rvm](https://rvm.io/) is recommended).

## Development

To begin development:

1. From the repo root, run `npm run dev` to start Webpack in watch mode.
1. In another terminal window (also from the repo root), run `npm run server` to start the Zendesk App Tools development server. If desired, you can instead run just `zat server` from the `app/` directory if you want to provide different app settings than the defaults in `app/settings.json` (the `zat` CLI will prompt you for individual values).
1. Open a Chrome tab (Incognito mode works best) and navigate to a Zendesk ticket ([this one](https://mashbox.zendesk.com/agent/tickets/1?zat=true), for example), including the query string `?zat=true` in the URL.
1. Click the shield icon at the right of Chrome's address bar. In the popup that appears, click the "Load unsafe scripts" button.

When the page reloads, you should see the app in the right column. The page is still hosted by Zendesk, but the app's iframe is served locally. Changes to the source code will automatically generate new output files (via Webpack), but you will need to refresh the Chrome tab manually to see those updates.

## Build & Release

1. Stop watch mode (that was started via `npm run dev`) if running.
1. Create a minified production build by running `npm run build`.
1. Increment semantic version in `package.json` & `manifest.json` and add release notes below.
1. Package the app by running [`zat package`](https://developer.zendesk.com/apps/docs/apps-v2/getting_started#package) in the `/app` directory. This will create a new ZIP file in `/app/tmp`. Currently, these ZIP builds are checked in to git to keep a rudimentary revision history, but it may be wise to `.gitignore` them at some point if that gets unwieldy.
1. Upload the package via the Zendesk web app.

## Release Notes

* 1.0.0 - Initial release.
* 1.0.1 - Update support contact information and change search filter query parameter from `tk` to `trk`.

## Notes

* The `/app` directory is the root directory for the app as far as Zendesk is concerned. For example, the [ZAF CLI](https://developer.zendesk.com/apps/docs/apps-v2/getting_started#zendesk-app-tools) commands won't work in the root directory of this repo; they need to be run from `/app`.

## Troubleshooting

* For things to work correctly end-to-end, it's important to follow the development steps in the order listed above.
* Sometimes - especially after the computer returns from sleep mode - the page under development in the browser may stop responding to code updates. If this happens, first try closing and reopening Chrome. If that doesn't work, you'll need to stop everything and restart from step 1 above.
