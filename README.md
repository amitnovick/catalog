# WikiFS - a File System App for Humans

## About

WikiFS provides an alternative implementation of a File System, built on top of the existing ones.
The FIle System is accessible through a rich GUI that integrates common general-use operations on files and category hierarchies.

## Motivation

The motivation comes from being frustrated with the limitation where **a file may only reside under single parent directory at a time**.

For me as a computer user, storing my own files (text files, audio files, image files etc.) it is an unacceptable limitation, as it restricts my ability to organize my files in the way most natural to my brain. 

### Categories, not Directories

Consider this common scenario:
```
Your colleague gives you a link to a document with your last metting's notes.
You download the file `Notes.txt` to your File System, and by default it goes under `Downloads` directory.
You may have a bunch of other files in the `Downloads` directory as well, that you occasionally need to use.
Your File System has another directory: `Documents`, where you already have some other documents.
You realize that you have to put it under `Documents` if you want that directory to include all the documents you own.

The following week, you realize you need to read something from this important file, and the first thing that comes up is that you downoaded the file.
So you open up the File System on the `Downloads` directory, because you clearly remember downloading the file!
However, you forgot that you decided to move the file somewhere else, in order to aggregate all `Documents` under one place.
```

Using the **Category** concept, the file could be assigned both `Downloads` and `Documents`, and be available to you in whichever lookup keyword makes most sense to you!

Therefore, I eschew the use of the Directory semantic in favour of the Category semantic.
The origin of the word Category that I use comes from its usage in MediaWiki (the software powering Wikipedia) 

## Features

This File System is accessible through a GUI that provides rich functionality:
- Search for files by name
- Search for files under a specific category
- Category tree Explorer
- Control Panel  for creating new files and categories

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

4. Install a binary on `/dist` that should be named `MyApp...`

## Development

```bash
npm run develop
```

Copyright Amit Novick 2019