const {series, watch, src, dest, parallel} = require('gulp');
const pump = require('pump');
const path = require('path');
const releaseUtils = require('@tryghost/release-utils');
const inquirer = require('inquirer');

// gulp plugins and utils
const livereload = require('gulp-livereload');
const postcss = require('gulp-postcss');
const zip = require('gulp-zip');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const beeper = require('beeper');
const fs = require('fs');

// postcss plugins
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const easyimport = require('postcss-easy-import');

// Locale paths
const SHARED_LOCALES_PATH = path.join(__dirname, 'node_modules/@tryghost/shared-theme-assets/assets/locales');
const LOCALE_OVERRIDES_PATH = path.join(__dirname, 'locale-overrides');
const OUTPUT_LOCALES_PATH = path.join(__dirname, 'locales');

const REPO = 'TryGhost/Source';
const REPO_READONLY = 'TryGhost/Source';
const CHANGELOG_PATH = path.join(process.cwd(), '.', 'changelog.md');

function serve(done) {
    livereload.listen();
    done();
}

const handleError = (done) => {
    return function (err) {
        if (err) {
            beeper();
        }
        return done(err);
    };
};

function hbs(done) {
    pump([
        src(['*.hbs', 'partials/**/*.hbs']),
        livereload()
    ], handleError(done));
}

function css(done) {
    pump([
        src('assets/css/screen.css', {sourcemaps: true}),
        postcss([
            easyimport,
            autoprefixer(),
            cssnano()
        ]),
        dest('assets/built/', {sourcemaps: '.'}),
        livereload()
    ], handleError(done));
}

function js(done) {
    pump([
        src([
            // pull in lib files first so our own code can depend on it
            'assets/js/lib/*.js',
            'assets/js/*.js'
        ], {sourcemaps: true}),
        concat('source.js'),
        uglify(),
        dest('assets/built/', {sourcemaps: '.'}),
        livereload()
    ], handleError(done));
}

function zipper(done) {
    const filename = require('./package.json').name + '.zip';

    pump([
        src([
            '**',
            '!node_modules', '!node_modules/**',
            '!dist', '!dist/**',
            '!yarn-error.log',
            '!yarn.lock',
            '!gulpfile.js'
        ]),
        zip(filename),
        dest('dist/')
    ], handleError(done));
}

/**
 * Merge locale files from shared-theme-assets with local overrides.
 * Local overrides win if both have non-blank strings for the same key.
 */
function locales(done) {
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_LOCALES_PATH)) {
        fs.mkdirSync(OUTPUT_LOCALES_PATH, {recursive: true});
    }

    // Get list of all locale files from both sources
    const sharedLocales = fs.existsSync(SHARED_LOCALES_PATH)
        ? fs.readdirSync(SHARED_LOCALES_PATH).filter(f => f.endsWith('.json'))
        : [];
    const overrideLocales = fs.existsSync(LOCALE_OVERRIDES_PATH)
        ? fs.readdirSync(LOCALE_OVERRIDES_PATH).filter(f => f.endsWith('.json'))
        : [];

    // Combine unique locale filenames
    const allLocales = [...new Set([...sharedLocales, ...overrideLocales])];

    if (allLocales.length === 0) {
        console.log('No locale files found in shared-theme-assets or locale-overrides');
        done();
        return;
    }

    for (const localeFile of allLocales) {
        const sharedPath = path.join(SHARED_LOCALES_PATH, localeFile);
        const overridePath = path.join(LOCALE_OVERRIDES_PATH, localeFile);
        const outputPath = path.join(OUTPUT_LOCALES_PATH, localeFile);

        // Load shared locale (base)
        let sharedData = {};
        if (fs.existsSync(sharedPath)) {
            try {
                sharedData = JSON.parse(fs.readFileSync(sharedPath, 'utf8'));
            } catch (err) {
                console.warn(`Warning: Could not parse ${sharedPath}: ${err.message}`);
            }
        }

        // Load override locale
        let overrideData = {};
        if (fs.existsSync(overridePath)) {
            try {
                overrideData = JSON.parse(fs.readFileSync(overridePath, 'utf8'));
            } catch (err) {
                console.warn(`Warning: Could not parse ${overridePath}: ${err.message}`);
            }
        }

        // Merge: start with shared, then apply non-blank overrides
        const merged = {...sharedData};
        for (const [key, value] of Object.entries(overrideData)) {
            // Override wins if it has a non-blank string value
            if (typeof value === 'string' && value.trim() !== '') {
                merged[key] = value;
            } else if (!(key in merged)) {
                // Add keys that don't exist in shared (even if blank)
                merged[key] = value;
            }
        }

        // Sort keys alphabetically for consistent output
        const sortedMerged = {};
        for (const key of Object.keys(merged).sort()) {
            sortedMerged[key] = merged[key];
        }

        // Write merged locale file
        fs.writeFileSync(outputPath, JSON.stringify(sortedMerged, null, 4) + '\n');
        console.log(`Generated ${localeFile}`);
    }

    done();
}

const cssWatcher = () => watch('assets/css/**', css);
const jsWatcher = () => watch('assets/js/**', js);
const hbsWatcher = () => watch(['*.hbs', 'partials/**/*.hbs'], hbs);
const localesWatcher = () => watch(['locale-overrides/**/*.json'], locales);
const watcher = parallel(cssWatcher, jsWatcher, hbsWatcher, localesWatcher);
const build = series(css, js, locales);

exports.build = build;
exports.locales = locales;
exports.zip = series(build, zipper);
exports.default = series(build, serve, watcher);

exports.release = async () => {
    // @NOTE: https://yarnpkg.com/lang/en/docs/cli/version/
    // require(./package.json) can run into caching issues, this re-reads from file everytime on release
    let packageJSON = JSON.parse(fs.readFileSync('./package.json'));
    const newVersion = packageJSON.version;

    if (!newVersion || newVersion === '') {
        console.log(`Invalid version: ${newVersion}`);
        return;
    }

    console.log(`\nCreating release for ${newVersion}...`);

    const githubToken = process.env.GST_TOKEN;

    if (!githubToken) {
        console.log('Please configure your environment with a GitHub token located in GST_TOKEN');
        return;
    }

    try {
        const result = await inquirer.prompt([{
            type: 'input',
            name: 'compatibleWithGhost',
            message: 'Which version of Ghost is it compatible with?',
            default: '5.0.0'
        }]);

        const compatibleWithGhost = result.compatibleWithGhost;

        const releasesResponse = await releaseUtils.releases.get({
            userAgent: 'Source',
            uri: `https://api.github.com/repos/${REPO_READONLY}/releases`
        });

        if (!releasesResponse || !releasesResponse) {
            console.log('No releases found. Skipping...');
            return;
        }

        let previousVersion = releasesResponse[0].tag_name || releasesResponse[0].name;
        console.log(`Previous version: ${previousVersion}`);

        const changelog = new releaseUtils.Changelog({
            changelogPath: CHANGELOG_PATH,
            folder: path.join(process.cwd(), '.')
        });

        changelog
            .write({
                githubRepoPath: `https://github.com/${REPO}`,
                lastVersion: previousVersion
            })
            .sort()
            .clean();

        const newReleaseResponse = await releaseUtils.releases.create({
            draft: true,
            preRelease: false,
            tagName: 'v' + newVersion,
            releaseName: newVersion,
            userAgent: 'Source',
            uri: `https://api.github.com/repos/${REPO}/releases`,
            github: {
                token: githubToken
            },
            content: [`**Compatible with Ghost ≥ ${compatibleWithGhost}**\n\n`],
            changelogPath: CHANGELOG_PATH
        });
        console.log(`\nRelease draft generated: ${newReleaseResponse.releaseUrl}\n`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
