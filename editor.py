"""
KahootEditor

Description:
Kahoot code: https://github.com/cs6413110/kahoot
"""
# Primitive editor for generating kahoots
import json
data = []
print('Basic editor for generating "kahoots"')
while input('Add a question(y)? Hit enter if finished.') == 'y':
  data.append({
    "question": input("What is the question?"),
    "answers": [input("What is the first answer?"), input("What is the second answer?"), input('What is the third answer?'), input('What is the fourth answer?')],
    "correct": input("Which is the correct answer(0-3)? (Subtract 1 for array index)"),
  })
print(json.dumps(data))
