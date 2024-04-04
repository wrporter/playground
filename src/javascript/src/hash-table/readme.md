# Doctor Data

Given the following input:

```javascript
[
  ['name', 'labels'],
  ['Matt', 'board certified,primary care,male,takes_new_patients'],
  ['Belda', 'board certified,internal medicine,female'],
  ['Wyatt', 'primary care,male,takes_new_patients'],
  ['Emma', 'board certified,oncology'],
  ['Aaron', 'sanctioned,primary care'],
  ['Josh', 'board certified, internal medicine, takes_new_patients'],
  ['Adrien', 'oncology,board certified, takes_new_patients'],
  ['Andy', 'internal medicine,male,sanctioned']
]
```

1. Write a function that returns all of the **oncologists** that are **board certified**, like this: `['Emma', 'Adrien']`
2. Now, update th function so it can be used to find **doctors of internal medicine** that are **board certified**, like this: `['Belda', 'Josh']`
3. Generalize the function to be able to take arbitrary combinations of requirements. Try some more cases including **primary care doctors** that **aren't sanctioned**: `['Matt', 'Wyatt']`
4. How can we generalize it further to deal with any combination of different types of columns? How would you change your algorithm to accommodate the following input?

```javascript
[
  ['name', 'languages', 'labels'],
  ['Matt', 'english,cantonese', 'board certified,primary care,male,takes_new_patients'],
  ['Belda', 'english, tagalog', 'board certified,internal medicine,female'],
  ['Wyatt', 'english,french', 'primary care,male,takes_new_patients'],
  ['Emma', 'english,spanish', 'board certified, oncology'],
  ['Aaron', 'english, mandarin', 'sanctioned,primary care'],
  ['Josh', 'english,spanish', 'board certified, internal medicine, takes_new_patients'],
  ['Adrien', 'english,japanese', 'oncology,board certified, takes_new_patients'],
  ['Andy', 'english,german', 'internal medicine,male,sanctioned']
]
```
