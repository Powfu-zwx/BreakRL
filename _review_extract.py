import nbformat, sys, io, os

base = r"C:\Users\admin\Desktop\Zwx\开源\BreakRL\book\notes"
nbfiles = [
    ("MAB-CN",  "multi-armed-bandit/multi-armed-bandit_experiments.ipynb"),
    ("MAB-EN",  "multi-armed-bandit/multi-armed-bandit_experiments_en.ipynb"),
    ("MDP-CN",  "mdp/mdp_experiments.ipynb"),
    ("MDP-EN",  "mdp/mdp_experiments_en.ipynb"),
    ("TD-CN",   "temporal-difference-learning/temporal-difference-learning_experiments.ipynb"),
    ("TD-EN",   "temporal-difference-learning/temporal-difference-learning_experiments_en.ipynb"),
]
which = sys.argv[1] if len(sys.argv) > 1 else None
for tag, rel in nbfiles:
    if which and which not in tag:
        continue
    path = os.path.join(base, rel)
    nb = nbformat.read(path, as_version=4)
    print("=" * 100)
    print(f"NOTEBOOK {tag}  ({path})  cells={len(nb.cells)}")
    print("=" * 100)
    for i, c in enumerate(nb.cells):
        src = c.source
        if c.cell_type == "markdown":
            print(f"\n----- [{i}] MARKDOWN -----")
            print(src)
        elif c.cell_type == "code":
            print(f"\n----- [{i}] CODE -----")
            print(src)
            for o in c.get("outputs", []):
                ot = o.get("output_type")
                if ot == "stream":
                    print(f"  [stream:{o.get('name')}] " + o.get("text", "").rstrip())
                elif ot in ("execute_result", "display_data"):
                    data = o.get("data", {})
                    if "text/plain" in data:
                        txt = data["text/plain"]
                        print(f"  [{ot}:text/plain] " + txt[:3000])
                    else:
                        print(f"  [{ot}] <non-text keys: {list(data.keys())}>")
                elif ot == "error":
                    print(f"  [ERROR] {o.get('ename')}: {o.get('evalue')}")
        else:
            print(f"\n----- [{i}] {c.cell_type} -----")
