---
tags:
  - home
---

# Getting Started

Unofficial study notes for **Georgia Tech CS 6250: Computer Networks** (OMSCS and on-campus). This site is not affiliated with Georgia Tech or the course staff.

!!! tip "Exam prep"
    Sibling formats per lesson: **[Plain-language](lesson-01/plain-language.md)** → **[Guide](lesson-01/introduction.md)** → **[Quick study](lesson-01/quick-study-guide.md)** → **[Quiz](lesson-01/quiz.md)**. Start with plain-language if the topic is new; use quick study and quiz before exams.

---

## Who this is for

Graduate students in CS 6250 who want structured answers to module study questions, condensed review sheets, and interactive quizzes. Content follows the course modules and Kurose & Ross where the full guides cite readings.

---

## How to navigate

| Tab | What's inside |
|-----|----------------|
| **Home** | Overview, this page, and the [tags index](tags.md) |
| **Lessons** | All 12 modules grouped by course section (Foundations, Routing, Router Design, SDN, Security, Applications) |
| **Practice** | [Written practice questions](practice-questions.md) with hidden answers |

Inside each lesson, the sidebar lists four formats when available:

| Format | Use when |
|--------|----------|
| **Guide** | Full module answers — primary reference |
| **Plain-language** | First pass; analogies and minimal jargon |
| **Quick study** | Exam cram — tables, memory aids, short Q&A |
| **Quiz** | Self-test with immediate feedback |

Lessons 1–5 and 6–12 now follow the same four-format pattern.

---

## Recommended study path

1. Skim the **[Plain-language](lesson-01/plain-language.md)** guide for the module.
2. Read the **Guide** for definitions, diagrams, and exam-level detail.
3. Review the **Quick study** sheet the night before the exam.
4. Run through the **Quiz** and [practice questions](practice-questions.md).

Use **search** (header) or **[tags](tags.md)** to jump to topics like BGP, SDN, or security.

---

## Run the site locally

```bash
git clone https://github.com/lukehiura/cs6250-study-guide.git
cd cs6250-study-guide
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
mkdocs serve
```

Open `http://127.0.0.1:8000`. Edits to `docs/` reload automatically.

---

## Contribute

Found an error or want to improve a section? Use the **Was this page helpful?** widget at the bottom of any page, or [open a GitHub issue](https://github.com/lukehiura/cs6250-study-guide/issues/new/).

---

!!! abstract "Takeaway"
    **Plain-language → Guide → Quick study → Quiz.** Use the Lessons tab for module content and Practice for written drills.
