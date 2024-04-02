import { getPeople } from './main';

const input = [
    ['name', 'languages', 'labels'],
    ['Matt', 'english,cantonese', 'board certified,primary care,male,takes_new_patients'],
    ['Belda', 'english, tagalog', 'board certified,internal medicine,female'],
    ['Wyatt', 'english,french', 'primary care,male,takes_new_patients'],
    ['Emma', 'english,spanish', 'board certified, oncology'],
    ['Aaron', 'english, mandarin', 'sanctioned,primary care'],
    ['Josh', 'english,spanish', 'board certified, internal medicine, takes_new_patients'],
    ['Adrien', 'english,japanese', 'oncology,board certified, takes_new_patients'],
    ['Andy', 'english,german', 'internal medicine,male,sanctioned'],
];

it.each([
    {
        input,
        labels: ['oncology', 'board certified'],
        want: ['Emma', 'Adrien'],
    },
    {
        input,
        labels: ['internal medicine', 'board certified'],
        want: ['Belda', 'Josh'],
    },
    {
        input,
        labels: ['primary care'],
        notLabels: ['sanctioned'],
        want: ['Matt', 'Wyatt'],
    },
])('returns the correct people - %#', ({ input, labels, notLabels, want }) => {
    expect(getPeople(input, labels, notLabels)).toEqual(want);
});
