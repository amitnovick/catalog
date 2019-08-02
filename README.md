# WikiFS - A Structure for your Files that Fits your Brain
## About

WikiFS is an open-source data manager and file navigator. It helps organize files on local drives by adding categories to files. Users get the same user interface to manage their files on different platforms. WikiFS is compatible with Windows, Linux and Mac. The application requires neither internet connection, nor user's registration to run on desktop devices.

### Categories

When you have multiple files, you start wanting to organize them into categories.
Categories can be nested under other categories.
A single top-level category exists at all times, and is called the Root category.
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

### Files

You may be thinking, alright, categories are just like folders in the File System we already have.
So how is this system any different?
In WikiFS, files are not restricted to a single category.
In fact, files can have multiple categories at once. WikiFS will help you maintain the categories of files throughout common operations like: moving categories around, adding and removing categories to a file.

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