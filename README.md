# TOEIC Quest

A small Phaser 3 platform game for practicing TOEIC-style workplace English. Run through five themed stages, read each sentence, and collect the matching answer card.

## Play

Serve this folder over HTTP (the Phaser library is loaded from jsDelivr):

```powershell
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Controls and scoring

- Left / right arrows or **A / D**: move
- **Space**, **Up**, or **W**: jump
- Correct answer: **+5 points**
- Incorrect answer: **−5 points**
- Five stages, two questions per stage

The project is plain HTML, CSS, and JavaScript; there is no build step.
