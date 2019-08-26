# Getting Started

## Creating an instance

When first opening up Catalog, you will be prompted to choose a location on your filesystem which
Catalog will use for storing your data.

For example, you could choose your home directory, or a cloud-synced directory like Dropbox and
Drive if you have one.

The location you choose is called an _instance_ , and when you create the instance for the first
time, it will initialize a few files.

The first file is actually a directory by the name `Catalog`, which will contain the following
structure:

```
└── 📁 Catalog
    ├── 📁 files
    └── 🖹 sqlite3.db
```

Tip: Use the same instance for all of your data. You're not likely to benefit from having two or
more instances.

## Adding files

Files are stored in the `files` directory shown in the above diagram.

### What you shouldn't Do

Catalog makes a few assumptions about the content of `files` that you shouldn't break.

Make sure to follow these instructions:

- Don't add files to the `files` directory yourself
- Don't delete files from the `files` directory yourself
- Don't rename files from the `files` directory yourself

Note: not following these instructions may cause Catalog to misbehave.

The reason for this is because Catalog maintains a registry of all existing files, and currently
cannot tell when you add / delete / remove a file yourself.

### How to add Files

There are currently three ways to add files:

1. Add new text file: provide a name for the file and Catalog will create an empty text file for you
   and add it to your `files` directory
2. Import existing files: locate the files you want to import from your filesystem and Catalog will
   add them for you to the `files` directory
3. Web clip images: using the Web Clipper extension, you can easily capture images from the web
   browser and add them to your `files` directory.

## Finding Files: Just starting out

When starting out, the most intuitive way to find your files is probably the Timeline screen.

The Timeline screen lists your files by the order they were added, i.e. it's a chronological list of
your files.

Tip: to quickly access files you just added, visit the Timeline screen and you will find these files
at the top of the list.

## Finding Files: I am drowning in files, please help!

When you have more than a few dozens of files, you will probably find that going through all your
files one by one is tedious.

Catalog was built exactly for solving this problem, as it lets you find files efficiently.

The first solution you can employ is to visit the Search screen and execute a query to get all files
by name. Your files will be filtered by this name and you will only retrieve files with matching
names. Probably sounds familiar to you, as this feature isn't unique to Catalog by any means.

However, we don't always give meaningful names to our files, and more crucially, we don't always
remember the names we give to files, since we have other things that need our attention. A unique
name for every file is just a limitation that the computer imposes on us, but it doesn't serve our
needs.

Read more about [Categories](/categories.md) to find another solution
