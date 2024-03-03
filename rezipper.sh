# On my macOS system, `yarn zip` generates a source.zip file that isn't a valid theme
# on Ghost Pro. For some reason unzipping it and rezipping the contents on the macOS
# command line works.

# cd into dist/ unzip to a temp dir, rezip from the temp dir, remove the temp dir.
cd dist
unzip source.zip -d temp_unzipped_source
zip -r tech-source.zip temp_unzipped_source
rm -rf temp_unzipped_source
