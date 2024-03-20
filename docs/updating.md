Updating from upstream
===

I want to keep this fork updated with the upstream [Source]() theme; that's the whole point of basing off of one of the official themes. Non-official themes start to get out of date; just look at their issue trackers, and notice the issues getting ignored because the maintainer lost interest in maintaining a theme.

Conflicts with `assets/built/`
---

There's usually (always?) a conflict between the upstream and fork's `assets/
built/` files. These are a result of building css files; mine will always be different from upstream's, as the built assets include my customizations.

There are a couple ways to deal with this:

- When resolving these conflicts, always use my versions.
- Add these files to `.gitignore`.
    - I believe they're in version control for upstream, so people can download the zip and upload it to a host, without having to run the build commands.
    - I'm always runnning the build commands before uploading, so this isn't an issue.
    - Would become an issue if I make this public and want others to be able to use the same workflow as with other themes.

    
Other conflicts
---

If I end up seeing conflicts that work against my customizations at some point, consider writing a script that I run just before the build process. My script would never conflict with upstream changes. I would run my script before the build commands. The script would modify upstream files to include my modifications.

This is very much not ideal because it's a meta-approach. You can't just look at the theme files to know how this theme is different.

Updating process
---

Summary:

- Make a new branch
- Fetch upstream changes
- Merge upstream changes
- Resolve conflicts
- Merge to main

```sh
$ git checkout -b update_from_upstream
$ git fetch upstream main
$ git merge upstream main

# Assuming conflicts with built assets:
$ git checkout --ours assets/built/screen.css
$ git checkout --ours assets/built/screen.map.css
$ git add assets/built/screen.css
$ git add assets/built/screen.map.css

# Run build commands.
$ yarn zip
$ ./rezipper.sh

$ git commit -am "Merge upstream changes."

# Look at what's changed:
$ git diff main --name-only
$ git diff main assets/css/screen.css

$ git checkout main
$ git merge update_from_upstream
$ git push origin main
```

After following this workflow, note any changes here if the existing process doesn't work.