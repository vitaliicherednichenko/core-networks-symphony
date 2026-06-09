# Exercise: the character template (Mario Bros style)

## The statement

Imagine we're designing a simple game like Mario Bros. All the characters that appear
on the screen are created from the **same template**. This template defines that each
character has a **name** and always starts with **3 lives**.

## The character template (in natural language)

Think of the template as a **blueprint** — a written description that says
*"every character in our game is built like this."* It is not a character itself; it's
the mold from which characters are stamped out.

Our template, which we call **`Personaje`**, says two things:

1. **What every character has (its properties):**
   - a **`nombre`** (name) — provided at the moment the character is created (Mario,
     Luigi, an enemy, etc.).
   - a number of **`vidas`** (lives) — which is *not* asked for, because the template
     already decides it: **every character always starts with 3 lives.**

2. **The rule for building one (its "constructor"):**
   - *"To create a character, give me a `nombre`. I'll store that name, and I'll
     automatically set its `vidas` to 3."*

So the template carries one piece of information that changes per character (the name)
and one piece that is fixed for everyone at birth (3 lives). Whoever uses the template
only needs to say the name — the 3 lives come for free.

> In programming terms, this template is a **class**, the properties are its
> **fields/attributes**, the building rule is the **constructor**, and each character we
> build is an **object** (an *instance*) of that class.

## Simulation: creating two heroes

**Creating Mario** — we hand the template the name `"Mario"`:

- The template runs its building rule.
- It stores `nombre = "Mario"`.
- It automatically sets `vidas = 3`.
- Result → a `Personaje` object: **Mario, 3 lives.**

**Creating Luigi** — we hand the template the name `"Luigi"`:

- The template runs the same rule again, independently.
- It stores `nombre = "Luigi"`.
- It automatically sets `vidas = 3`.
- Result → a separate `Personaje` object: **Luigi, 3 lives.**

| Hero (object) | nombre  | vidas |
|---------------|---------|-------|
| Mario         | "Mario" | 3     |
| Luigi         | "Luigi" | 3     |

## The important idea

Both heroes came from the **same** template, yet they are **two independent
characters**. If Mario later loses a life (Mario → 2 lives), Luigi is unaffected
(Luigi → still 3), because each object keeps its **own** copy of the properties.
