"""The files make_site.py and the app build write: the page for every address, sitemap.xml, boot.js, assets/ and bundle/.
Only the "Build site" workflow commits them, on main, after a merge. Pull requests leave them alone, so two PRs (or a PR
and the daily data updates) never clash over them.

    python3 build/built_files.py            list them (one per line)
    python3 build/built_files.py --reset    undo a local build: put them back as the last commit has them
    python3 build/built_files.py --check A  fail if any file listed in A (changed files, one per line) is a built file
"""
import json, os, subprocess, sys
H = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(H, '..')
PAGES = [k for k in json.load(open(os.path.join(H, 'pages.json'), encoding='utf-8')) if not k.startswith('_')]
FILES = ['index.html', '404.html', 'sitemap.xml', 'boot.js'] + ['%s/index.html' % p for p in PAGES if p != 'home']
# plus a page for every item, mod, arcane, relic, resource and enemy (build/seo_pages.py)
DIRS = ['assets/', 'bundle/', 'item/', 'mod/', 'arcane/', 'relic/', 'resource/', 'enemy/']


def built(path):
    return path in FILES or any(path.startswith(d) for d in DIRS)


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a:
        print('\n'.join(FILES + DIRS))
    elif a[0] == '--reset':
        git = lambda *x: subprocess.run(['git', *x], cwd=ROOT, check=True)
        git('checkout', 'HEAD', '--', *[p for p in FILES + DIRS if subprocess.run(['git', 'cat-file', '-e', 'HEAD:' + p.rstrip('/')], cwd=ROOT, capture_output=True).returncode == 0])
        git('clean', '-fdq', '--', *DIRS, *[os.path.dirname(f) for f in FILES if '/' in f])
        # a built file the last commit doesn't have yet (boot.js before its first build)
        for f in FILES:
            if subprocess.run(['git', 'cat-file', '-e', 'HEAD:' + f], cwd=ROOT, capture_output=True).returncode and os.path.isfile(os.path.join(ROOT, f)):
                os.remove(os.path.join(ROOT, f))
    elif a[0] == '--check':
        bad = [l.strip() for l in open(a[1]) if built(l.strip())]
        if bad:
            print('::error::This pull request changes built files. They are made after the merge, by the "Build site" workflow, '
                  'so leave them out (undo a local build with: python3 build/built_files.py --reset):')
            print('\n'.join('  ' + b for b in bad))
            sys.exit(1)
        print('No built files changed.')
