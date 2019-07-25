# WikiFS - a File System App for Humans

## About

WikiFS provides an alternative implementation of a File System, built on top of the existing ones.
The FIle System is accessible through a rich GUI that integrates common general-use operations on files and category hierarchies.

## Motivation

The motivation comes from being frustrated with the limitation where **a file may only reside under single parent directory at a time**.

For me as a computer user, storing my own files (text files, audio files, image files etc.) it is an unacceptable limitation, as it restricts my ability to organize my files in the way most natural to my brain. 

### Categories, not Directories

Using the **Category** concept, files may be assigned multiple categories, and be available to you in whichever lookup keyword makes most sense to you!

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