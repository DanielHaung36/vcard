module.exports = (req, res) => {
  const { n, t, c, p, e, w, a } = req.query;

  if (!n) {
    res.status(400).send('Missing name parameter');
    return;
  }

  const name = n || '';
  const title = t || '';
  const company = c || '';
  const phone = p || '';
  const email = e || '';
  const website = w || '';
  const address = a || '';

  function esc(s) {
    return String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  }

  var nameParts = name.trim().split(/\s+/);
  var lastName = nameParts.length > 1 ? nameParts.pop() : '';
  var firstName = nameParts.join(' ');

  var v = 'BEGIN:VCARD\r\nVERSION:3.0\r\n';
  v += 'N:' + esc(lastName) + ';' + esc(firstName) + ';;;\r\n';
  v += 'FN:' + esc(name) + '\r\n';
  if (company) v += 'ORG:' + esc(company) + '\r\n';
  if (title) v += 'TITLE:' + esc(title) + '\r\n';
  if (phone) v += 'TEL;TYPE=WORK,VOICE:' + phone + '\r\n';
  if (email) v += 'EMAIL;TYPE=WORK:' + email + '\r\n';
  if (website) {
    var url = website.startsWith('http') ? website : 'https://' + website;
    v += 'URL:' + url + '\r\n';
  }
  if (address) v += 'ADR;TYPE=WORK:;;' + esc(address) + ';;;;\r\n';
  v += 'END:VCARD\r\n';

  var fileName = (name || 'contact') + '.vcf';

  res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
  res.setHeader('Content-Disposition', 'inline; filename="' + fileName + '"');
  res.status(200).send(v);
};
