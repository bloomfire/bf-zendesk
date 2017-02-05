## Setup

Ensure that Ruby is installed ([rvm](https://rvm.io/) is recommended).

## Development

To begin development:

1. In a termimal window, From the repo root, run `npm run dev` to start Webpack in watch mode.
1. In another terminal window, from the repo root, `cd app` and run `zat server` to start the Zendesk App Tools development server.
1. Open a new Chrome Incognito tab and log in to Bloomfire: [https://rooms.bloomfire.ws/]
1. Open another Chrome Incognito tab and navigate to a Zendesk ticket; e.g.: [https://mashbox.zendesk.com/agent/tickets/1?zat=true]
1. Click the shield icon at the right of Chrome's address bar. In the popup that appears, click the "Load unsafe scripts" button.

When the page reloads, you should see the app in the right column. The page is still hosted by Zendesk, but the app's iframe is served locally. Changes to the source code will automatically generate new output files (thanks to Webpack), but you will need to refresh the Chrome tab manually to see your updates.

## Troubleshooting

* For things to work correctly end-to-end, it's important to follow the development steps in the order listed above.
* Sometimes - especially after the computer returns from sleep mode - the page under development in the browser may stop responding to code updates. If this happens, first try closing and reopening Chrome. If that doesn't work, you'll need to stop everything and restarting from step 1 above.
