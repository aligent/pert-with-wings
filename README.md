# PERT With Wings

Helper to make PERT estimates in JIRA / Azure DevOps tickets.

This project creates two zip files including Chrome and Firefox extension packages in /extensions folder.

Uses https://crxjs.dev/vite-plugin to build the react typescript based application to a browser extension.

# Installation

`yarn`

# Development

## For Chrome and Co

`yarn dev`

in chrome://extensions enable Developer mode and point to /dist folder by clicking on **Load unpacked** button.

## For Firefox

`yarn dev:firefox`

in about:debugging click on **Load Temporary Add-on** button and point to /dist/manifest.json file.

# Creating chrome / firefox extension packages.

Find `PERT with wings testing` secure note in LastPass containing testing credentials and create `.env` in project root.

**Important:** Increment the version number of the extension by updating version in `package.json`. (This will be the version of the extension as well.)

`yarn deploy`

This will run tests and create three zip files inside /extensions folder, 2 for chrome web store and Firefox Add-ons, one including the source code which is required for firefox add-on submission.

# Report a bug / Request a feature

Create an issue in https://aligent.atlassian.net/jira/software/c/projects/PERT/issues/.

# Contribute

Please send a PR to this repo with a clear list of what you've done. However before merging, any new changes should be approved by Project Management Team Leader.

# Publishing to Chrome Web Store / Firefox Add-ons.

## Chrome Web Store

- Get yourself added to `aligent-extensions` Publisher group by contacting a Principal Software Engineer / General Manager IT.
- In https://chrome.google.com/webstore/devconsole/, select publisher **aligent-extensions**, go to **Items** and select **PERT With Wings**.
- Go to **Package** tab and select **Upload new package**.
- Upload `chrome-PERT-with-wings-package-<version>.zip`. (Generate this zip file by following https://github.com/aligent/pert-with-wings#creating-chrome--firefox-extension-packages)
- Go to **Store listing** tab, update description if necessary, and click **Submit for review**.

## Firefox Add-ons

- Create an account at https://addons.mozilla.org/en-US/firefox/
- Get yourself added to `aligent-extensions@aligent.com.au` mozilla addon account as a developer by contacting a Principal Software Engineer / General Manager IT.
- Go to https://addons.mozilla.org/en-GB/developers/addon/pert-with-wings/versions/submit/ and upload `firefox-PERT-with-wings-package-<version>.zip`. (Generate this zip file by following https://github.com/aligent/pert-with-wings#creating-chrome--firefox-extension-packages)
- When prompted also upload a zip file of source code. You can find `pert-extension-source-code-<version>.zip` file in /extensions folder.
