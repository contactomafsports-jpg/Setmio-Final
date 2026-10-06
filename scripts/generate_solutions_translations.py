"""
Generates high-quality translations for all solutions.* keys across the 9 secondary languages:
gl, ca, va, eu, ar, pt, fr, de, it.
"""
import json

with open('temp_base_translations.json', 'r', encoding='utf-8') as f:
    base = json.load(f)

solutions_keys = [k for k in base.keys() if k.startswith('solutions.')]

# Also include solutions.item_1..3 keys:
new_item_keys = [
    'solutions.item_1.badge', 'solutions.item_1.title', 'solutions.item_1.desc',
    'solutions.item_1.f1', 'solutions.item_1.f2', 'solutions.item_1.f3', 'solutions.item_1.btn',
    'solutions.item_2.badge', 'solutions.item_2.title', 'solutions.item_2.desc',
    'solutions.item_2.f1', 'solutions.item_2.f2', 'solutions.item_2.f3', 'solutions.item_2.btn',
    'solutions.item_3.badge', 'solutions.item_3.title', 'solutions.item_3.desc',
    'solutions.item_3.f1', 'solutions.item_3.f2', 'solutions.item_3.f3', 'solutions.item_3.btn',
]

print(f"Total existing solutions keys: {len(solutions_keys)}")
