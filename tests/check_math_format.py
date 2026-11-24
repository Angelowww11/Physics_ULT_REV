"""Check that the reading page exposes rendered mathematics, without raw equation text."""
from pathlib import Path
from html.parser import HTMLParser
import json,re

root=Path(__file__).resolve().parents[1]
void={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}

class ReadingMath(HTMLParser):
    def __init__(self):
        super().__init__();self.math_depth=0;self.count=0;self.raw=[];self.errors=0
    def handle_starttag(self,tag,attrs):
        classes=dict(attrs).get('class','').split()
        if 'katex-error' in classes:self.errors+=1
        if 'katex' in classes:self.count+=1;self.math_depth=1
        elif self.math_depth and tag not in void:self.math_depth+=1
    def handle_endtag(self,tag):
        if self.math_depth:self.math_depth-=1
    def handle_data(self,text):
        if not self.math_depth and re.search(r'[\\$=√∫∝]|MATHPLACEHOLDER|BLOCKPLACEHOLDER',text):self.raw.append(text.strip())

page=ReadingMath();page.feed((root/'reviewer.html').read_text(encoding='utf-8'))
stats=json.loads((root/'note-stats.json').read_text())
assert page.errors==0
assert page.count==stats['inline_equations']+stats['derivation_blocks']+stats['reference_equations'],(page.count,stats)
assert not page.raw,page.raw
assert stats['worked_examples']==69 and stats['expanded_derivations']==34
print(f'PASS: {page.count} rendered equations; no raw formulas or placeholders; all solution cards retained.')
