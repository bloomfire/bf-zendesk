Ensure that Ruby is installed (recommend rvm).

To begin development:

1. From the repo root, run `webpack --progress --colors --watch` to start Webpack in watch mode.
1. From the repo root, `cd app` and run `zat server` to start the Zendesk App Tools development server.
1. Open a new Chrome Incognito tab and navigate to a Zendesk ticket; e.g.: https://mashbox.zendesk.com/agent/tickets/1?zat=true
1. Click the shield icon at the right of Chrome's address bar. In the popup that appears, click the "Load unsafe scripts" button.

When the page reloads, you should see the app in right column. The page is still hosted by Zendesk, but the app's iframe is served locally. Changes to the source code will automatically generate new output files (thanks to Webpack), but you will need to refresh the Chrome tab manually to see your updates.
