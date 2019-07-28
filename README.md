# WikiFS - a File System App for Humans

## About

WikiFS is an open-source data manager and file navigator. It helps organize files on local drives by adding categories to files. Users get the same user interface to manage their files on different platforms. WikiFS is compatible with Windows, Linux and Mac. The application requires neither internet connection, nor user's registration to run on desktop devices.

### Hierarchy of Categories

Files may be assigned multiple categories.
Categories form a hierarchy.
A single top-level category is called the Root category.
New categories are added as children of this Root category by default.

#### Example Hierarchy

```
└── Root
    ├── BooksNotes
    ├── FinancialDocuments
    └── WebDevelopment
        ├── CssTricks
        └── JavaScript
```
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

4. Install a binary on `/dist` that should be named `WikiFS...`

## Development

```bash
npm run develop
```

Copyright Amit Novick 2019