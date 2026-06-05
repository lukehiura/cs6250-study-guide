# CS 6250 Study Guide

Unofficial study notes and solutions for **Georgia Tech CS 6250: Computer Networks**.

**Live site:** [lukehiura.github.io/cs6250-study-guide](https://lukehiura.github.io/cs6250-study-guide/)

---

## What's here

| Format | Description |
|--------|-------------|
| **Guide** | Full module answers with diagrams and citations |
| **Plain-language** | Simplified explanations with analogies |
| **Quick study** | Condensed exam review |
| **Quiz** | Interactive multiple-choice practice |

Twelve course modules plus [practice questions](docs/practice-questions.md).

---

## Local development

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

Open `http://127.0.0.1:8000`.

Image optimization and social preview cards run in **CI only** (requires `pngquant` and Cairo system libraries). Local `mkdocs build` skips optimization by default.

---

## Project layout

```
docs/
  lesson-NN/          # Per-lesson guides and sibling formats
  images/             # Shared diagrams
  getting-started.md  # Onboarding for new readers
  tags.md             # Topic index
mkdocs.yml            # Site configuration
```

---

## Contributing

Open an issue or pull request on GitHub. See [Getting started](docs/getting-started.md) on the site for the recommended study path and navigation overview.

**Disclaimer:** These notes are not official course material and are not affiliated with Georgia Tech.
