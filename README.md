# PERT With Wings

Helper to make PERT estimates in JIRA / Azure DevOps tickets.

This project creates two zip files including Chrome and Firefox extension packages in /extensions folder.

Uses https://crxjs.dev/vite-plugin to build the react typescript bases application to a browser extension.

# Installation

`npm install`

# Development

`npm run dev`

in chrome://extensions enable Developer mode and point to /dist folder by clicking on **Load unpacked** button.

# Creating chrome / firefox extension packages.

**Important:** Increment the version number of the extension by updating version in `package.json`. (This will be the version of the extension as well.)

`npm run build`

Creates two zip files inside /extensions folder for chrome web store and Firefox Add-ons.

# Report a bug / Request a feature

Create a new issue in https://github.com/aligent/pert-with-wings/issues/new.

# Contribute

Please send a PR to this repo with a clear list of what you've done. However before merging, any new changes should be approved by Project Management Team Leader.

# Publishing to Chrome Web Store / Firefox Add-ons.

## Chrome Web Store

- Get yoursef added to `aligent-extensions` Publisher group by contacting a Principal Software Engineer / General Manager IT.
- In https://chrome.google.com/webstore/devconsole/, select publisher **aligent-extensions**, go to **Items** and select **PERT With Wings**.
- Go to **Package** tab and select **Upload new package**.
- Upload `chrome-PERT-with-wings-package-<version>.zip`.
- Go to **Store listing** tab, update description if necessary, and click **Submit for review**.

## Firefox Add-ons

- Create an account at https://addons.mozilla.org/en-US/firefox/
- Get yoursef added to `aligent-extensions@aligent.com.au` mozilla addon account as a developer by contacting a Principal Software Engineer / General Manager IT.
- Go to https://addons.mozilla.org/en-GB/developers/addon/pert-with-wings/versions/submit/ and upload `firefox-PERT-with-wings-package-<version>.zip`.
- When prompted also upload a zip file of source code. You can generate a zip file by doing `git archive --format zip --output pert-extension.zip main`
