export function assembleFallback(state) {
  const full = `I am ${state.fullName}, ${state.designation} of ${state.company}, ${state.city}, with a team of ${state.teamSize}. We help ${state.icp} ${state.dreamOutcome} by ${state.bigPromise}.`;
  
  const shortIcp = state.icp.split(/\s+/).slice(0, 4).join(' ');
  const shortOutcome = state.dreamOutcome.split(/\s+/).slice(0, 6).join(' ');
  const short = `${state.fullName} — ${shortOutcome} for ${shortIcp}.`;
  
  return { full, short, source: 'fallback' };
}

export function buildSuggestPrompt(step, state) {
  const ctx = `Designation: ${state.designation}\nCompany: ${state.company}\nCity: ${state.city}\nTeam size: ${state.teamSize}\nThey help (ICP): ${state.icp}`;
  
  if (step.suggestField === 'dreamOutcome') {
    return `You are helping a business owner craft a one-line self-introduction for a live workshop.\n\nContext:\n${ctx}\n\nSuggest exactly 3 short "Dream Outcome" phrases — the tangible result they deliver for that customer. Each MUST contain one concrete number, percentage, or timeframe. 6-14 words each, lowercase start, no trailing period, no quotation marks, no numbering.\n\nReply with only a JSON array of 3 strings, e.g. ["cut project delays by 30%", "...", "..."]`;
  }
  
  return `You are helping a business owner craft a one-line self-introduction for a live workshop.\n\nContext:\n${ctx}\nDream outcome: ${state.dreamOutcome}\n\nSuggest exactly 3 short "Big Promise" phrases — the mechanism, method, or guarantee that makes that outcome happen. Each MUST contain a concrete number, a percentage, or a specific named method (for example "our 90-day sprint system" or "a 3-step vendor-vetting process"). 5-12 words each, lowercase start, no trailing period, no quotation marks, no numbering.\n\nReply with only a JSON array of 3 strings.`;
}

export function buildFinalPrompt(state) {
  return `Craft a spoken self-introduction for a live business workshop from these facts. Do not invent anything not given, and do not change any numbers.\n\nFull name: ${state.fullName}\nDesignation: ${state.designation}\nCompany: ${state.company}\nCity: ${state.city}\nTeam size: ${state.teamSize}\nWho they serve (ICP): ${state.icp}\nDream outcome: ${state.dreamOutcome}\nBig promise: ${state.bigPromise}\n\nWrite it as exactly one sentence following this shape: "I am [Full Name], [Designation] of [Company], [City], with a team of [Team Size]. We help [ICP] [Dream Outcome] by [Big Promise]."\n\nRules:\n- Sayable in one breath, 25-40 words total\n- Preserve the Dream Outcome's number/percentage and the Big Promise's number/method exactly as given\n- No filler words like "best", "leading", "world-class", "passionate", "innovative"\n- Only tighten grammar and flow — never add claims that weren't given\n\nAlso write a "short" version: an ultra-compact 8-12 word version for a fast-round intro that still includes one number.\n\nReply with only a JSON object shaped exactly like: {"full": "...", "short": "..."}`;
}