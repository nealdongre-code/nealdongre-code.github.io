"use strict";

const {coverage, recordings, trend} = window.dashboardData;
const get = id => document.getElementById(id);
const number = new Intl.NumberFormat("en-US");
const percent = (a, b) => b ? (100 * a / b).toFixed(1) + "%" : "—";
const years = d => d === 2020 ? "2020–2025" : d + "–" + String(d + 9).slice(-2);
const measures = [
  ["Linked to a work", "has_work", "dated_audio", "Share of dated audio recordings linked to a work."],
  ["Specific lyric language", "has_lyric_language", "has_work", "Share of linked recordings with a specific lyric language."],
  ["English-tagged recordings", "english", "dated_audio", "Share of dated audio recordings with a qualifying English-tagged work."],
  ["Writer credit", "english_with_writer", "english", "Share of English-tagged recordings with a writer credit."],
  ["Writer in displayed credit", "english_writer_matches_credit", "english_with_writer", "Share of English-tagged recordings with a writer whose ID appears in the displayed artist credit."],
  ["Writer in performance credit", "english_writer_matches_explicit_performer", "english_with_writer", "Share of English-tagged recordings with a writer whose ID appears in an explicit performance credit."],
  ["Band membership supported", "english_writer_member_year_supported", "english_writer_member_any_date", "Share of recordings with a writer-to-band edge whose membership dates support the release year."],
];
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function option(value, text) {
  const node = element("option", text);
  node.value = value;
  return node;
}
for (const id of ["coverageDecade", "sampleDecade"]) {
  get(id).append(option("", "All decades"), ...coverage.map(row => option(row.decade, years(row.decade))));
}
get("measure").append(...measures.map(([label], index) => option(index, label)));

function showView(view) {
  for (const name of ["trend", "coverage", "sample"]) {
    get(name).hidden = name !== view;
    get(name + "Tab").setAttribute("aria-pressed", String(name === view));
  }
}
get("trendTab").onclick = () => showView("trend");
get("coverageTab").onclick = () => showView("coverage");
get("sampleTab").onclick = () => showView("sample");

const trendCategories = [
  ["Artist appears as a writer", "writer-match"],
  ["Artist does not appear as a writer", "writer-no-match"],
  ["Missing credit evidence", "writer-missing"],
];
const trendRows = (trend?.years ?? coverage).map(row => {
  const {english, english_with_credit: credited, english_with_writer: writers,
    english_writer_matches_credit: matched} = row;
  if (trend) return {...row, period: row.year, counts: [matched, row.no_match, row.missing_evidence]};
  // Every English-tagged recording in this audit has a displayed artist credit.
  // Marginal counts alone cannot identify the joint denominator if that changes.
  if (credited !== english || matched > writers || writers > english || matched < 0) {
    throw new Error("Songwriter trend needs validated joint credit counts.");
  }
  return {...row, period: row.decade, counts: [matched, writers - matched, english - writers]};
});

function yearRange(first, last) {
  return first === last ? String(first) : first + "–" + last;
}

function drawTrend() {
  const start = Number(get("startDecade").value);
  const end = Number(get("endDecade").value);
  const groups = new Map();
  for (const row of trendRows) {
    if (row.period < start || row.period > end) continue;
    const decade = Math.floor(row.period / 10) * 10;
    const first = Math.max(start, decade);
    const last = Math.min(end, decade + 9);
    const label = trend ? yearRange(first, last) : years(decade);
    const group = groups.get(decade) ?? {label, english: 0, counts: [0, 0, 0]};
    group.english += row.english;
    row.counts.forEach((count, index) => { group.counts[index] += count; });
    groups.set(decade, group);
  }
  const rows = [...groups.values()];
  const total = rows.reduce((sum, row) => sum + row.english, 0);
  get("rangeSummary").textContent = yearRange(start, trend ? end : Math.min(end + 9, 2025))
    + " · " + number.format(total) + " English-tagged recordings";
  get("trendMetrics").replaceChildren(...trendCategories.map(([label], index) => {
    const count = rows.reduce((sum, row) => sum + row.counts[index], 0);
    const card = element("div", undefined, "metric");
    card.append(element("span", label), element("strong", percent(count, total)),
      element("small", number.format(count) + " recordings"));
    return card;
  }));
  const chartRows = [];
  const head = element("thead");
  const headings = element("tr");
  for (const label of ["Release years", ...trendCategories.map(([label]) => label), "Total"]) {
    const cell = element("th", label);
    cell.scope = "col";
    headings.append(cell);
  }
  head.append(headings);
  const body = element("tbody");
  for (const row of rows) {
    const chartRow = element("div", undefined, "trend-row");
    const stack = element("div", undefined, "trend-stack");
    stack.setAttribute("aria-hidden", "true");
    const tableRow = element("tr");
    const year = element("th", row.label);
    year.scope = "row";
    tableRow.append(year);
    const values = [];
    row.counts.forEach((count, index) => {
      const [label, color] = trendCategories[index];
      const share = percent(count, row.english);
      const segment = element("span", undefined, color);
      segment.style.width = (row.english ? 100 * count / row.english : 0) + "%";
      segment.title = label + " · " + share + " (" + number.format(count) + ")";
      stack.append(segment);
      values.push(label + " " + share);
      tableRow.append(element("td", number.format(count) + " (" + share + ")"));
    });
    tableRow.append(element("td", number.format(row.english)));
    body.append(tableRow);
    chartRow.append(element("strong", row.label), stack,
      element("span", values.join(" · "), "trend-values"));
    chartRows.push(chartRow);
  }
  get("trendChart").replaceChildren(...chartRows);
  get("trendCounts").replaceChildren(head, body);
}

const startDecade = get("startDecade");
const endDecade = get("endDecade");
if (trend) {
  get("trendCohort").textContent = "ALL ELIGIBLE RECORDINGS IN THE MUSICBRAINZ SNAPSHOT";
  get("startLabel").textContent = "Start year";
  get("endLabel").textContent = "End year";
}
for (const select of [startDecade, endDecade]) {
  select.append(...trendRows.map(row => option(row.period, trend ? row.period : years(row.period))));
}
function resetRange() {
  startDecade.selectedIndex = 0;
  endDecade.selectedIndex = trendRows.length - 1;
  drawTrend();
}
startDecade.onchange = () => {
  if (Number(startDecade.value) > Number(endDecade.value)) endDecade.value = startDecade.value;
  drawTrend();
};
endDecade.onchange = () => {
  if (Number(endDecade.value) < Number(startDecade.value)) startDecade.value = endDecade.value;
  drawTrend();
};
get("resetRange").onclick = resetRange;
resetRange();

function drawCoverage() {
  const selected = get("coverageDecade").value;
  const rows = coverage.filter(row => !selected || String(row.decade) === selected);
  const sum = key => rows.reduce((total, row) => total + row[key], 0);
  const metrics = [
    ["Dated audio", number.format(sum("dated_audio")), "Recording observations"],
    ["Linked to a work", percent(sum("has_work"), sum("dated_audio")), number.format(sum("has_work")) + " recordings"],
    ["English-tagged", number.format(sum("english")), percent(sum("english"), sum("dated_audio")) + " of dated audio"],
  ];
  get("metrics").replaceChildren(...metrics.map(([label, value, detail]) => {
    const card = element("div", undefined, "metric");
    card.append(element("span", label), element("strong", value), element("small", detail));
    return card;
  }));
  const [label, numerator, denominator, description] = measures[Number(get("measure").value)];
  get("chartTitle").textContent = label;
  get("chartDescription").textContent = description + (selected ? " The selected decade is highlighted." : "");
  get("chart").replaceChildren(...coverage.map(row => {
    const rate = percent(row[numerator], row[denominator]);
    const bar = element("div", undefined, "bar" + (selected && String(row.decade) !== selected ? " dim" : ""));
    const track = element("div", undefined, "track");
    track.setAttribute("aria-hidden", "true");
    const fill = element("div", undefined, "fill");
    fill.style.width = rate === "—" ? "0%" : rate;
    track.append(fill);
    bar.append(element("span", years(row.decade)), track, element("strong", rate));
    return bar;
  }));
  const header = element("tr");
  for (const label of ["Release years", "Numerator", "Denominator", "Share"]) {
    const cell = element("th", label);
    cell.scope = "col";
    header.append(cell);
  }
  const head = element("thead");
  head.append(header);
  const body = element("tbody");
  for (const row of coverage) {
    const line = element("tr");
    for (const value of [years(row.decade), number.format(row[numerator]), number.format(row[denominator]), percent(row[numerator], row[denominator])]) {
      line.append(element("td", value));
    }
    body.append(line);
  }
  get("counts").replaceChildren(head, body);
}
get("coverageDecade").onchange = get("measure").onchange = drawCoverage;

const statusLabels = {
  matched: "Writer matched",
  no_overlap_in_available_evidence: "Available credits contain no writer overlap",
  missing_writer_evidence: "No writer evidence on qualifying works",
  missing_artist_evidence: "No artist evidence for this signal",
  no_credited_group: "No group in the displayed credit",
  no_writer_membership_evidence: "No writer-to-group edge in the audit",
  year_supported: "Membership supported at release year",
  year_uncertain: "Membership dates uncertain",
  outside_year_only: "Membership edges fall outside the release year",
};
const signalFields = {
  displayed: ["displayed_artist_credit", "matched"],
  explicit: ["explicit_recording_performance", "matched"],
  supported: ["credited_group_membership", "year_supported"],
  uncertain: ["credited_group_membership", "year_uncertain"],
  outside: ["credited_group_membership", "outside_year_only"],
};
function artistCredit(row) {
  return row.evidence.credited_artists.map(artist => artist.credited_as + artist.join_phrase).join("");
}
function normalize(value) {
  return value.toLocaleLowerCase("en").normalize("NFKD").replace(/\p{Diacritic}/gu, "");
}
const searchIndex = new Map(recordings.map(row => [row.recording_mbid, normalize([
  row.title, row.recording_mbid, artistCredit(row),
  ...row.evidence.credited_artists.map(a => a.name),
  ...row.evidence.explicit_performers.map(a => a.name),
  ...row.evidence.works.flatMap(work => [work.title, ...work.writers.map(a => a.name)]),
].join(" "))]));
let selectedRecording;

function showEvidence(row) {
  const target = get("evidence");
  if (!row) {
    target.replaceChildren(element("p", "No recording matches those filters."));
    return;
  }
  const {evidence, signals} = row;
  const link = element("a", "Recording on MusicBrainz ↗");
  link.href = "https://musicbrainz.org/recording/" + encodeURIComponent(row.recording_mbid);
  const signalList = element("div", undefined, "signals");
  for (const [label, key] of [
    ["Displayed artist credit", "displayed_artist_credit"],
    ["Explicit recording performance", "explicit_recording_performance"],
    ["Credited group membership", "credited_group_membership"],
  ]) {
    const signal = signals[key];
    const names = [...new Set(evidence.works.flatMap(work => work.writers)
      .filter(artist => signal.artist_mbids?.includes(artist.mbid)).map(artist => artist.name))];
    const badge = element("div", undefined, "signal" + (["matched", "year_supported"].includes(signal.status) ? " match" : ""));
    badge.append(element("strong", label), element("small", statusLabels[signal.status] + (names.length ? " · " + names.join(", ") : "")));
    signalList.append(badge);
  }
  target.replaceChildren(element("h3", row.title), element("p", [artistCredit(row), row.earliest_known_release_year].filter(Boolean).join(" · ")), link, signalList);
  target.append(element("h4", "Linked works and writers"));
  const works = element("ul");
  for (const work of evidence.works) {
    const item = element("li");
    const workLink = element("a", work.title);
    workLink.href = "https://musicbrainz.org/work/" + encodeURIComponent(work.work_mbid);
    const languages = work.lyric_languages.map(language => language.name).join(", ") || "Language missing";
    const writers = work.writers.map(artist => artist.name + " (" + artist.role + ")").join(", ") || "No writer evidence";
    item.append(workLink, element("div", [languages, work.qualifying_english_work ? "Qualifies for writer joins" : "Outside English writer joins", ...work.relationship_attributes].join(" · "), "note"), element("div", writers));
    works.append(item);
  }
  target.append(works, element("h4", "Explicit performance credits"));
  target.append(element("p", evidence.explicit_performers.map(a => a.name + " (" + a.role + ")").join(", ") || "No explicit performance credits in the audit."));
  target.append(element("h4", "Writer-to-group edges"));
  const edges = element("ul");
  for (const edge of evidence.writer_group_memberships) {
    edges.append(element("li", edge.writer.name + " → " + edge.group.name + " · " +
      (edge.begin_year ?? "Start unknown") + " to " + (edge.end_year ?? (edge.ended ? "End unknown" : "Open or unknown end")) +
      " · " + (edge.release_year_status === "outside_year" ? "Outside release year" : statusLabels[edge.release_year_status])));
  }
  target.append(edges.childElementCount ? edges : element("p", "No writer-to-group edges in the audit."));
}

function drawRecordings() {
  const query = normalize(get("query").value.trim()).split(/\s+/);
  const decade = get("sampleDecade").value;
  const signal = signalFields[get("signal").value];
  const rows = recordings.filter(row =>
    (!decade || String(row.decade) === decade) &&
    (!signal || row.signals[signal[0]].status === signal[1]) &&
    query.every(word => searchIndex.get(row.recording_mbid).includes(word))
  );
  if (!rows.includes(selectedRecording)) selectedRecording = rows[0];
  get("resultCount").textContent = number.format(rows.length) + " of 240 recordings";
  const list = get("recordings");
  const buttons = rows.map(row => {
    const button = element("button");
    button.type = "button";
    button.setAttribute("aria-pressed", String(row === selectedRecording));
    button.append(element("strong", row.title), element("small", [artistCredit(row), row.earliest_known_release_year].filter(Boolean).join(" · ")));
    button.onclick = () => {
      list.querySelector('[aria-pressed="true"]')?.setAttribute("aria-pressed", "false");
      button.setAttribute("aria-pressed", "true");
      selectedRecording = row;
      showEvidence(row);
    };
    return button;
  });
  list.replaceChildren(...(buttons.length ? buttons : [element("p", "Try another search or clear the filters.")]));
  list.scrollTop = 0;
  showEvidence(selectedRecording);
}

get("query").oninput = get("sampleDecade").onchange = get("signal").onchange = drawRecordings;
drawCoverage();
drawRecordings();
