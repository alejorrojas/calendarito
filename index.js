const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { google } = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');
const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
];

// All-day event: end date must be the next day (exclusive)
function nextDay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function makeEvent(name, topic, date) {
  return {
    summary: `${topic} - ${name}`,
    colorId: '3', // Grape (purple)
    start: { date },
    end: { date: nextDay(date) },
    reminders: {
      useDefault: false,
      overrides: [
        // 2 weeks before at 9am = 14*24*60 - 9*60 = 19620 minutes before midnight
        { method: 'email', minutes: 19620 },
      ],
    },
  };
}

const EVENTS = [
  makeEvent('1er Sprint',           'Inv Operativa',    '2026-04-01'),
  makeEvent('1er formativa',        'Adm de Recursos',  '2026-04-22'),
  makeEvent('1er Coloquio',         'Simulacion',       '2026-05-04'),
  makeEvent('1er parcial',          'Ing y Calidad',    '2026-05-05'),
  makeEvent('1er parcial teórico',  'Inv Operativa',    '2026-05-07'),
  makeEvent('1er parcial práctico', 'Inv Operativa',    '2026-05-08'),
  makeEvent('1er parcial teoria',   'Simulacion',       '2026-05-09'),
  makeEvent('2do parcial',          'Ing y Calidad',    '2026-06-11'),
  makeEvent('2do parcial teórico',  'Inv Operativa',    '2026-06-11'),
  makeEvent('2do parcial práctico', 'Inv Operativa',    '2026-06-12'),
  makeEvent('2do Coloquio',         'Simulacion',       '2026-06-22'),
  makeEvent('3er Parcial',          'Ing y Calidad',    '2026-06-25'),
  makeEvent('2do Parcial teorico',  'Simulacion',       '2026-06-27'),
  makeEvent('1er Recu',             'Ing y Calidad',    '2026-06-30'),
  makeEvent('2da formativa',        'Adm de Recursos',  '2026-07-01'),
  makeEvent('Examen Final',         'Ing y Calidad',    '2026-07-02'),
  makeEvent('1er Recu',             'Simulacion',       '2026-07-04'),
  makeEvent('Presentacion TPI',     'Simulacion',       '2026-07-06'),
  makeEvent('Recu final',           'Ing y Calidad',    '2026-07-07'),
  makeEvent('1er parcial',          'Adm de Recursos',  '2026-07-08'),
  makeEvent('2do Recu',             'Simulacion',       '2026-07-14'),
  makeEvent('Recus Formativas',     'Adm de Recursos',  '2026-07-15'),
  makeEvent('1er Recu',             'Adm de Recursos',  '2026-08-12'),
  makeEvent('3er formativa',        'Adm de Recursos',  '2026-09-30'),
  makeEvent('4ta formativa',        'Adm de Recursos',  '2026-10-28'),
  makeEvent('2do parcial',          'Adm de Recursos',  '2026-11-04'),
  makeEvent('2do Recu + formativas','Adm de Recursos',  '2026-11-18'),
  makeEvent('Presentacion TPI',     'Adm de Recursos',  '2026-11-25'),
  makeEvent('Recu TPI',             'Adm de Recursos',  '2026-12-02'),
];

async function authorize() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_id, client_secret, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
    return oAuth2Client;
  }

  const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
  console.log('\nAbre esta URL en tu navegador y autoriza el acceso:\n');
  console.log(authUrl);
  console.log('');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const code = await new Promise(resolve => rl.question('Pega aquí el código de autorización: ', resolve));
  rl.close();

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log('Token guardado.\n');
  return oAuth2Client;
}

async function getCalendarId(calendar, name) {
  const res = await calendar.calendarList.list();
  const cal = res.data.items.find(c => c.summary === name);
  if (!cal) throw new Error(`No se encontró el calendario "${name}". Verificá que existe y que está en tu cuenta.`);
  return cal.id;
}

async function main() {
  const auth = await authorize();
  const calendar = google.calendar({ version: 'v3', auth });

  const calendarId = await getCalendarId(calendar, 'Alejo Parciales 2026');
  console.log(`Calendario encontrado: ${calendarId}\n`);

  console.log(`Creando ${EVENTS.length} eventos...\n`);
  for (const event of EVENTS) {
    const res = await calendar.events.insert({ calendarId, resource: event });
    console.log(`✓ ${event.summary} (${event.start.date}) → ${res.data.htmlLink}`);
  }
  console.log('\nTodos los eventos creados.');
}

main().catch(console.error);
