"""Build and validate the canonical six-page illustrated report with Tectonic."""
from pathlib import Path
import argparse
import shutil
import subprocess
import sys

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--tectonic', default='tectonic', help='Tectonic executable or absolute path')
    parser.add_argument('--refresh-figures', action='store_true', help='Re-export numerical inputs and vector figures; requires Node and plotting dependencies')
    args = parser.parse_args()
    compiler = shutil.which(args.tectonic)
    if compiler is None:
        parser.error('Tectonic was not found. Install it or pass --tectonic with its executable path.')
    if args.refresh_figures:
        for command in [['node', 'export-illustrated.cjs'], ['node', 'export-media.cjs'],
                        [sys.executable, 'report-latex/build_figures.py']]:
            subprocess.run(command, cwd=ROOT, check=True)
    staging = ROOT / 'tmp/latex-report'
    staging.mkdir(parents=True, exist_ok=True)
    subprocess.run([compiler, '--keep-logs', '--outdir', str(staging),
                    str(ROOT / 'report-latex/main.tex')], cwd=ROOT, check=True)
    candidate = staging / 'main.pdf'
    pdf = PdfReader(candidate)
    if len(pdf.pages) != 6:
        raise ValueError(f'Expected six pages, got {len(pdf.pages)}; canonical PDF was not replaced.')
    if pdf.metadata.author != 'Biswajit Jana':
        raise ValueError('Author metadata is missing or changed; canonical PDF was not replaced.')
    for number, page in enumerate(pdf.pages, 1):
        if len(page.extract_text()) < 500:
            raise ValueError(f'Page {number} has unexpectedly little extractable text.')
    destination = ROOT / 'output/pdf/Moving_Observer_Illustrated_Report.pdf'
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(candidate, destination)
    print(f'Built six-page report: {destination}')
    print('Render and inspect all pages before publishing a revised layout.')


if __name__ == '__main__':
    main()
