"""Build the complete source-checked Physics notebook."""
from build_reviewer import build
from pathlib import Path
import subprocess

if __name__=='__main__':
    subprocess.run(["node",str(Path(__file__).with_name("build_challenges.cjs"))],check=True)
    build()
