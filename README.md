# Catalog - Better Structure for Your Files
## About

Catalog is an open-source data manager and file navigator. It helps organize files on local drives by adding categories to files. Users get the same user interface to manage their files on different platforms. Catalog is compatible with Windows, Linux and Mac. The application requires neither internet connection, nor user's registration to run on desktop devices.

<div align="center">
  <img src="docs/app-screnshot.png" width="350" alt="Catalog App Screenshot">
</div>

### Files

Catalog is meant for files that you care about: documents, audio, video and more.

When there are many files to keep track of, Catalog offers you **categories** which can be assigned to files;

Related files can go under designated categories like: Documents, Music, Videos etc.

**Categories can also be nested** under other categories: Documents can further contain the following nested categories: MeetingSummaries, FinancialReports, SchoolPapers etc.

The novelty that Catalog provides lies in how **files can be assigned multiple categories**, and how the program assists you in preserving the category hierarchy while doing various operations: assigning a category to a file, moving a nested category to a different parent category, and more.

## Installation
### Build from source

1. Clone the repository

2. Install dependencies
```bash
npm install
```

3. Create a packaged build for your platform
```bash
npm run pack
```

4. Install a binary on `/dist` that should be named `Catalog...`

## Development

```bash
npm run develop
```

## License

Copyright © 2019 [Amit Novick](https://amitnovick.netlify.com/). Distributed under the GNU AFFERO PUBLIC LICENSE, Version 3. See separate LICENSE file.