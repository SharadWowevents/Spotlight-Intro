export const STEPS = [
  {
    id: 'identity',
    kicker: 'Step 1 of 5',
    question: 'Who’s speaking?',
    fields: [
      { key: 'fullName', label: 'Full name', placeholder: 'e.g. Rohan Mehta' },
      { key: 'designation', label: 'Designation', placeholder: 'e.g. Founder & CEO' }
    ]
  },
  {
    id: 'business',
    kicker: 'Step 2 of 5',
    question: 'Your business, in brief',
    fields: [
      { key: 'company', label: 'Company', placeholder: 'e.g. Bright Path Interiors' },
      { key: 'city', label: 'City', placeholder: 'e.g. Pune' },
      { key: 'teamSize', label: 'Team size', placeholder: 'e.g. 12' }
    ]
  },
  {
    id: 'audience',
    kicker: 'Step 3 of 5',
    question: 'Who do you help?',
    fields: [
      { key: 'icp', label: 'Your ideal customer (ICP)', placeholder: 'e.g. Boutique hotel owners with under 50 rooms', textarea: true }
    ],
    hint: 'Be specific — not “business owners,” but the exact kind you’re built for.'
  },
  {
    id: 'outcome',
    kicker: 'Step 4 of 5',
    question: 'What’s the dream outcome?',
    fields: [
      { key: 'dreamOutcome', label: 'The result you deliver — put a number on it', placeholder: 'e.g. cut project delays by 30%', textarea: true }
    ],
    hint: 'A number, a percentage, or a timeframe. “Grow their business” isn’t tangible — “30% revenue growth in 6 months” is.',
    suggestField: 'dreamOutcome',
    suggestLabel: '✨ Suggest a number for me'
  },
  {
    id: 'promise',
    kicker: 'Step 5 of 5',
    question: 'What’s your big promise?',
    fields: [
      { key: 'bigPromise', label: 'The method or number behind it', placeholder: 'e.g. our 90-day sprint system', textarea: true }
    ],
    hint: 'Name the mechanism — a number, a system, or a guarantee — that makes the outcome believable.',
    suggestField: 'bigPromise',
    suggestLabel: '✨ Suggest a method for me'
  }
];

export const INITIAL_STATE = {
  fullName: '', designation: '', company: '', city: '', teamSize: '',
  icp: '', dreamOutcome: '', bigPromise: ''
};