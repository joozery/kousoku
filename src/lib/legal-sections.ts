export type LegalSection = { id: string; heading: string; paragraphs: string[] };
export function splitLegalContent(content: string): { intro: string[]; sections: LegalSection[] } {
  const intro: string[] = [];
  const sections: LegalSection[] = [];
  for (const paragraph of content.replace(/\r\n/g, '\n').split(/\n\s*\n/).map(value => value.trim()).filter(Boolean)) {
    const lines = paragraph.split('\n');
    if (/^\d+[.)]\s+/.test(lines[0])) {
      sections.push({ id: `section-${sections.length + 1}`, heading: lines[0], paragraphs: lines.length > 1 ? [lines.slice(1).join('\n')] : [] });
    } else if (sections.length) sections[sections.length - 1].paragraphs.push(paragraph);
    else intro.push(paragraph);
  }
  return { intro, sections };
}
