/* ============================================================
   Taal Inside – script.js
   Alle JavaScript voor navigatie, tabs en quizzen.

   Optimalisaties t.o.v. de oorspronkelijke inline-handlers:
   ① Navigatie (nav-item links)   → event delegation op <nav>
   ② Sectie-tabs (sub-tab)        → event delegation op .tab-container
   ③ Tab-groepknoppen             → event delegation op .tab-groep-bar
   ④ Tab-in-groep knoppen         → event delegation op .tab-groep-inner-bar
   ⑤ mqVolgende-knoppen           → event delegation op document
   ⑥ mqHerstart-knoppen           → event delegation op document (was al zo)
   Alle onclick-attributen in de HTML zijn hierdoor overbodig en
   kunnen worden verwijderd zonder functionaliteitsverlies.
   ============================================================ */

'use strict';

/* ============================================================
   QUIZ-DATA (hoofd-quizzen)
   ============================================================ */
const quizData = {
  lezen: [
    { v: "Wat is globaal lezen?", o: ["Je leest nauwkeurig elk woord", "Je leest snel voor een eerste indruk van de hoofdgedachte", "Je zoekt alleen naar een specifiek woord", "Je leest niet, maar bekijkt alleen plaatjes"], a: 1, u: "Globaal lezen = snel lezen voor de hoofdgedachte, zonder aandacht voor details." },
    { v: "Wat is het verschil tussen het onderwerp en de hoofdgedachte?", o: ["Er is geen verschil", "Het onderwerp is een woordgroep; de hoofdgedachte is een volledige zin", "De hoofdgedachte is een kort woord", "Het onderwerp bevat altijd een standpunt"], a: 1, u: "Onderwerp = kort. Hoofdgedachte = volledige zin met de boodschap." },
    { v: "Welk signaalwoord hoort bij 'tegenstelling'?", o: ["bovendien", "want", "echter", "ten eerste"], a: 2, u: "Echter = tegenstelling. Bovendien = opsomming, want = oorzaak." },
    { v: "Wat is een feit?", o: ["Een mening die je niet kunt bewijzen", "Een bewering die je kunt controleren of bewijzen", "De persoonlijke kijk van de schrijver", "Een overdrijving voor effect"], a: 1, u: "Een feit is objectief en te bewijzen." },
    { v: "Wat is de functie van een betoog?", o: ["De lezer vermaken", "De lezer informeren over feiten", "De lezer overtuigen van een standpunt", "De lezer instrueren"], a: 2, u: "Een betoog heeft als doel de lezer te overtuigen." }
  ],
  schrijven: [
    { v: "Wat staat er in de inleiding?", o: ["De belangrijkste argumenten", "Introductie van het onderwerp en aandachttrekker", "Samenvatting van de conclusie", "Alle feiten en cijfers"], a: 1, u: "De inleiding introduceert het onderwerp en trekt de aandacht." },
    { v: "Wat is een kernzin?", o: ["De langste zin", "Een zin met veel feiten", "De zin die de kern van de alinea weergeeft", "De laatste zin van de tekst"], a: 2, u: "De kernzin geeft aan waar de alinea over gaat." },
    { v: "Welk signaalwoord gebruik je bij een opsomming?", o: ["Echter", "Bovendien", "Want", "Hoewel"], a: 1, u: "Bovendien = opsomming. Echter = tegenstelling." },
    { v: "Wanneer schrijf je formeel?", o: ["Aan een vriend via WhatsApp", "In een gesprek met je broer", "In een sollicitatiebrief", "In een dagboek"], a: 2, u: "Formeel schrijf je in officiële situaties." },
    { v: "Wat doe je bij reviseren?", o: ["Je schrijft een nieuw onderwerp", "Je controleert en verbetert je tekst", "Je bedenkt argumenten", "Je zoekt informatie"], a: 1, u: "Reviseren = terugkijken en verbeteren op inhoud, structuur en taal." }
  ],
  taal: [
    { v: "Wat is een zelfstandig naamwoord?", o: ["Een handeling", "De naam van een persoon, dier, ding of begrip", "Een eigenschap", "Een verbindingswoord"], a: 1, u: "Zelfstandig naamwoord = naam van iets of iemand: hond, tafel, vrijheid." },
    { v: "Welke vraag stel je voor het lijdend voorwerp?", o: ["Wie of wat + werkwoord?", "Hoe? Waar? Wanneer?", "Wie of wat + persoonsvorm + onderwerp?", "Aan wie?"], a: 2, u: "Lijdend voorwerp: wie of wat [persoonsvorm] [onderwerp]?" },
    { v: "Welke zin bevat een fout met de dt-regel?", o: ["Hij loopt hard.", "Loopt hij hard?", "Loop ik hard?", "Loopt ik hard?"], a: 3, u: "Bij inversie met ik schrijf je GEEN -t. Dus: Loop ik – niet Loopt ik." },
    { v: "Wat is een voegwoord?", o: ["Een eigenschap", "Een woord dat zinnen verbindt", "Een naam", "Een lidwoord"], a: 1, u: "Voegwoorden verbinden zinnen: en, maar, want, omdat." },
    { v: "Wat is alliteratie?", o: ["Eindrijm", "Herhaling van beginletters/-klanken", "Vergelijking zonder als", "Overdrijving"], a: 1, u: "Alliteratie = dezelfde beginklank herhalen." }
  ],
  lit: [
    { v: "Wat is een metafoor?", o: ["A lijkt op B, met als", "A ís B, zonder vergelijkingswoord", "Overdrijving voor effect", "Tegenovergestelde zeggen"], a: 1, u: "Metafoor: A ís B. Geen als of zoals." },
    { v: "Wat is het verschil tussen fictie en non-fictie?", o: ["Fictie is op feiten gebaseerd", "Fictie is verzonnen, non-fictie is werkelijkheid", "Er is geen verschil", "Fictie is altijd poëzie"], a: 1, u: "Fictie = verzonnen. Non-fictie = feiten en werkelijkheid." },
    { v: "Wat is personificatie?", o: ["Vergelijking met als", "Iets niet-menselijks krijgt menselijke eigenschappen", "Een rijmvorm", "Een overdrijving"], a: 1, u: "Personificatie: De wind zuchtte – de wind krijgt menselijke eigenschappen." },
    { v: "Wat is het thema van een verhaal?", o: ["De naam van de hoofdpersoon", "De diepere betekenis of boodschap", "De samenvatting", "De setting"], a: 1, u: "Thema = de diepere laag: vriendschap, verlies, vrijheid." },
    { v: "Wat is eindrijm?", o: ["Eerste woorden rijmen", "Laatste woorden van regels rijmen", "Klinkers in het midden rijmen", "Alle beginletters zijn gelijk"], a: 1, u: "Eindrijm = laatste woorden van versregels rijmen: roos – kloos." }
  ]
};

/* ============================================================
   MINI-QUIZ-DATA
   ============================================================ */
const miniQuizData = {
  woordraad: [
    { v: "Je leest: \"De leerling was apathisch; hij zat stil aan zijn bureau en deed niets.\" Wat betekent 'apathisch'?", o: ["Heel blij en enthousiast", "Lusteloos en zonder interesse", "Druk en ongeconcentreerd", "Bang en nerveus"], a: 1, u: "De context na de puntkomma beschrijft het gedrag (stil, niets doen) – dat is een contextclue die op lusteloosheid wijst." },
    { v: "Wat betekent het voorvoegsel 'her-' in het woord 'herschrijven'?", o: ["Niet", "Snel", "Opnieuw", "Extra"], a: 2, u: "'Her-' betekent altijd opnieuw/nogmaals. Herschrijven = opnieuw schrijven." },
    { v: "Welke strategie gebruik je bij het woord 'werkeloos'?", o: ["Contextclue", "Woordopbouw (achtervoegsel -loos = zonder)", "Signaalwoorden zoeken", "Bekende taal vergelijken"], a: 1, u: "'Werke-loos' is opgebouwd uit 'werk' + '-loos' (= zonder). Je gebruikt woordopbouw." }
  ],
  strategieen: [
    { v: "Je zoekt het telefoonnummer van een organisatie op in een lange folder. Welke leesstrategie gebruik je?", o: ["Oriënterend lezen", "Globaal lezen", "Intensief lezen", "Zoekend lezen"], a: 3, u: "Zoekend lezen: je zoekt één specifiek gegeven en leest de rest niet." },
    { v: "Je krijgt een krantenartikel en wilt snel weten waar het over gaat. Wat doe je als eerste?", o: ["Direct het hele artikel lezen", "Titel, kopjes en eerste alinea bekijken", "Alleen de laatste alinea lezen", "Alle moeilijke woorden opzoeken"], a: 1, u: "Oriënterend lezen: snel verkennen via structuurelementen voor je echt begint." },
    { v: "Bij welke strategie lees je elk woord nauwkeurig en let je op alle details?", o: ["Oriënterend lezen", "Globaal lezen", "Intensief lezen", "Zoekend lezen"], a: 2, u: "Intensief lezen: grondig lezen waarbij je alle informatie meeneemt." }
  ],
  onderwerp: [
    { v: "Een tekst gaat over de gevolgen van sociale media voor tieners. Wat is het onderwerp?", o: ["Tieners gebruiken te veel sociale media en dat is slecht voor hen.", "Sociale media en tieners", "Gevolgen", "Sociale media zijn gevaarlijk."], a: 1, u: "Het onderwerp is kort: een woordgroep die aangeeft waarover de tekst gaat." },
    { v: "Welke van de volgende zinnen is een correcte hoofdgedachte?", o: ["Klimaatverandering", "De gevolgen van klimaat", "Klimaatverandering bedreigt de biodiversiteit van oceanen.", "Het klimaat verandert."], a: 2, u: "Een hoofdgedachte is een volledige zin met een duidelijke boodschap van de schrijver." },
    { v: "Waar vind je de hoofdgedachte het vaakst in een tekst?", o: ["Midden in de tekst", "In de eerste of laatste alinea", "Altijd in de tweede alinea", "Nooit expliciet – je moet hem zelf bedenken"], a: 1, u: "De eerste en laatste alinea bevatten vrijwel altijd de kern van de boodschap." }
  ],
  hoofdzaak: [
    { v: "\"Jongeren slapen te weinig. Uit onderzoek blijkt dat 63% minder dan 8 uur slaapt.\" Wat is de hoofdzaak?", o: ["63% slaapt minder dan 8 uur.", "Jongeren slapen te weinig.", "Onderzoek is gedaan naar slaap.", "Slaap is belangrijk."], a: 1, u: "De eerste zin bevat de kern. Het percentage is een bijzaak die de hoofdzaak onderbouwt." },
    { v: "Welk signaalwoord kondigt meestal een bijzaak aan?", o: ["Dus", "Echter", "Bijvoorbeeld", "Maar"], a: 2, u: "'Bijvoorbeeld' kondigt een voorbeeld aan – dat is per definitie een bijzaak." },
    { v: "Wat is het doel van bijzaken in een tekst?", o: ["De hoofdzaak vervangen", "De hoofdzaak ondersteunen en verduidelijken", "De lezer afleiden", "De tekst langer maken"], a: 1, u: "Bijzaken (voorbeelden, cijfers, anekdotes) onderbouwen de hoofdzaak – ze staan in dienst van de kern." }
  ],
  actieflezen: [
    { v: "Wat is een kenmerk van actief lezen?", o: ["Je leest snel zonder na te denken", "Je stelt jezelf vragen tijdens het lezen", "Je leest elk woord meerdere keren", "Je slaat moeilijke stukken over"], a: 1, u: "Actief lezen = meedenken: W-vragen stellen, aantekeningen maken, verbanden leggen." },
    { v: "Je hebt een alinea gelezen maar kunt de kernboodschap niet samenvatten. Wat doe je?", o: ["Verdergaan – het komt later wel", "Die alinea herlezen", "Alle woorden opzoeken in het woordenboek", "Stoppen met lezen"], a: 1, u: "Als je de kern niet kunt verwoorden, heb je de alinea niet begrepen. Herlees bewust." },
    { v: "Wat is het gevaar van alles onderstrepen in een tekst?", o: ["Het is te tijdrovend", "Niets valt meer op – de selectie ontbreekt", "Het is slecht voor het boek", "Je onthoudt te veel"], a: 1, u: "Onderstrepen heeft pas zin als je selecteert. Alles markeren = niets markeren." }
  ],
  tekstdoel: [
    { v: "Een handleiding voor een koffiemachine heeft als tekstdoel...", o: ["Informeren over koffie", "Overtuigen van de kwaliteit", "Instrueren – de lezer stap voor stap begeleiden", "Amuseren"], a: 2, u: "Een handleiding is een instructieve tekst: het doel is de lezer te begeleiden bij het uitvoeren van handelingen." },
    { v: "Een column in de krant waarin de schrijver vindt dat jongeren vaker moeten stemmen, heeft als tekstsoort...", o: ["Informatief", "Betogend", "Instructief", "Beschouwend"], a: 1, u: "De schrijver geeft een mening en probeert de lezer te overtuigen → betogend." },
    { v: "Wat is het verschil tussen tekstsoort en tekstvorm?", o: ["Er is geen verschil – het is hetzelfde", "Tekstsoort = doel (informeren, overtuigen), tekstvorm = concrete verschijningsvorm (artikel, blog)", "Tekstvorm = doel, tekstsoort = vorm", "Tekstsoort bepaalt de lengte van de tekst"], a: 1, u: "Tekstsoort beschrijft het communicatieve doel. Tekstvorm is de concrete vorm: krantenartikel, brief, blog, gedicht." }
  ],
  zakelijk: [
    { v: "Welke tekst is een voorbeeld van een NIET-zakelijke tekst?", o: ["Een schoolboektekst over de Franse Revolutie", "Een recept voor bananenmuffins", "Een roman over een vluchteling", "Een nieuwsbericht over de gemeenteraadsverkiezingen"], a: 2, u: "Een roman is literair en gericht op beleving – dat is niet-zakelijk." },
    { v: "Een essay heeft een persoonlijke toon maar behandelt een serieus onderwerp. Is het zakelijk of niet-zakelijk?", o: ["Niet-zakelijk, want de toon is persoonlijk", "Zakelijk, want het doel is beschouwen of overtuigen", "Dat is nooit te zeggen", "Hangt af van het onderwerp"], a: 1, u: "Essays en columns worden voor het examen als zakelijk beschouwd, ook al hebben ze een persoonlijke stijl." },
    { v: "Wat staat centraal in zakelijke teksten?", o: ["De beleving van de lezer", "De stijl van de schrijver", "De informatieoverdracht", "De emotie achter de woorden"], a: 2, u: "Zakelijke teksten zijn gericht op het overbrengen van informatie of het bereiken van een communicatief doel." }
  ],
  alineas: [
    { v: "Waar staat de kernzin van een alinea het vaakst?", o: ["Altijd in het midden", "Aan het begin of het einde", "Altijd aan het begin", "Er is geen vaste plek"], a: 1, u: "Een kernzin staat het vaakst aan het begin (deductief) maar kan ook aan het einde staan (inductief)." },
    { v: "\"Bewegen is goed voor je. Zo vermindert hardlopen de kans op hartziekten.\" Wat is de functie van de tweede zin?", o: ["Kernzin", "Tegenstelling", "Voorbeeld ter ondersteuning van de kernzin", "Conclusie"], a: 2, u: "'Zo' is een signaalwoord voor een voorbeeld. De tweede zin ondersteunt de kernzin met een concreet voorbeeld." },
    { v: "Hoe weet je dat je een goede kernzin hebt gevonden?", o: ["Als hij de langste zin is", "Als alle andere zinnen in de alinea die zin uitleggen of onderbouwen", "Als hij aan het begin staat", "Als hij een signaalwoord bevat"], a: 1, u: "De kernzin is de overkoepelende gedachte. Alle overige zinnen leggen uit, bewijzen of illustreren die gedachte." }
  ],
  opbouw: [
    { v: "Welk deel van een tekst introduceert het onderwerp en trekt de aandacht?", o: ["Kern", "Slot", "Inleiding", "Alinea"], a: 2, u: "De inleiding introduceert het onderwerp, schetst de aanleiding en wekt de interesse van de lezer." },
    { v: "Een tekst eindigt met: \"Kortom: het is tijd dat we anders omgaan met plastic.\" Wat is de functie van dit slot?", o: ["Aanleiding geven", "Een nieuw argument introduceren", "Een oproep tot actie doen als conclusie", "Het onderwerp beschrijven"], a: 2, u: "'Kortom' is een samenvatting-signaalwoord. De zin doet een oproep aan de lezer – typisch voor een betoogtekst." },
    { v: "Welk deel van een tekst bevat de argumenten, feiten en voorbeelden ter uitwerking?", o: ["Inleiding", "Kern", "Slot", "Alle drie even veel"], a: 1, u: "De kern (±80% van de tekst) bevat de uitwerking: alle argumenten, feiten, voorbeelden en bewijzen." }
  ],
  signaalwoorden: [
    { v: "\"Hij was moe. Toch ging hij naar school.\" Welk tekstverband staat er tussen de twee zinnen?", o: ["Oorzaak – gevolg", "Tegenstelling", "Opsomming", "Voorbeeld"], a: 1, u: "'Toch' markeert een tegenstelling: je verwacht dat hij thuisblijft, maar hij gaat toch." },
    { v: "\"Sporten is gezond. Bovendien is het leuk.\" Welk verband geeft 'bovendien' aan?", o: ["Tegenstelling", "Oorzaak – gevolg", "Opsomming (extra punt toevoegen)", "Samenvatting"], a: 2, u: "'Bovendien' voegt een extra punt toe aan een opsomming – het versterkt de bewering." },
    { v: "In welke zin ontbreekt een signaalwoord, maar is er tóch een duidelijk tekstverband?", o: ["\"Ik was ziek, dus bleef ik thuis.\"", "\"Het regende. De wedstrijd ging niet door.\"", "\"Bovendien is het goedkoop.\"", "\"Omdat hij laat was, miste hij de bus.\""], a: 1, u: "Geen signaalwoord, maar het verband is oorzaak-gevolg: regen → wedstrijd afgelast. Verbanden kunnen impliciet zijn." }
  ],
  tekststructuren: [
    { v: "Een artikel beschrijft eerst een probleem en daarna meerdere mogelijke oplossingen. Welke tekststructuur is dit?", o: ["Chronologie", "Vergelijking", "Beschrijving", "Probleem – oplossing"], a: 3, u: "Probleem-oplossing: eerst het probleem geschetst, dan een of meer oplossingen aangedragen." },
    { v: "\"Eerst werd de wet ingediend. Daarna stemde de Tweede Kamer. Vervolgens ondertekende de koning.\" Welke structuur is dit?", o: ["Beschrijving", "Oorzaak – gevolg", "Chronologie", "Vergelijking"], a: 2, u: "Tijdssignaalwoorden (eerst, daarna, vervolgens) wijzen op chronologie: volgorde in de tijd." },
    { v: "Een tekst vergelijkt het onderwijssysteem van Finland met dat van Nederland op punten als klasgrootte, leraarsopleiding en toetscultuur. Welke structuur?", o: ["Beschrijving", "Vergelijking", "Probleem – oplossing", "Chronologie"], a: 1, u: "Twee zaken naast elkaar zetten op meerdere punten = vergelijkingsstructuur." }
  ],
  'feit-mening': [
    { v: "Welke van de volgende uitspraken is een FEIT?", o: ["Nederland is het beste land om te wonen.", "In 2023 telde Nederland 17,9 miljoen inwoners.", "Nederlanders zijn te nuchter.", "De winter van 2023 was vreselijk koud."], a: 1, u: "Alleen de tweede uitspraak is controleerbaar en verifieerbaar via officiële bronnen – dat maakt het een feit." },
    { v: "Wat is het verschil tussen een mening en een standpunt?", o: ["Er is geen verschil", "Een standpunt is een bewust geformuleerde en verdedigbare mening", "Een mening is altijd onderbouwd met argumenten", "Een standpunt is objectiever dan een mening"], a: 1, u: "Een standpunt is een mening die de schrijver bewust inneemt en wil verdedigen – niet alle meningen zijn standpunten." },
    { v: "Welk signaalwoord wijst op een argument dat een standpunt ondersteunt?", o: ["Echter", "Weliswaar", "Want", "Tegenstanders zeggen"], a: 2, u: "'Want' en 'omdat' kondigen argumenten aan die het standpunt ondersteunen. 'Echter' en 'weliswaar' wijzen op tegenargumenten." }
  ],
  objectief: [
    { v: "Welke zin is het meest OBJECTIEF?", o: ["Die nieuwe wet is echt een ramp voor ondernemers.", "Gelukkig heeft het kabinet eindelijk een besluit genomen.", "Uit het rapport blijkt dat de werkloosheid met 0,3% is gedaald.", "Onbegrijpelijk dat niemand dit eerder heeft gezien."], a: 2, u: "De derde zin noemt een verifieerbaar getal uit een rapport – neutraal en controleerbaar. De andere zinnen bevatten subjectieve oordelen." },
    { v: "Wat is kenmerkend voor een SUBJECTIEVE tekst?", o: ["Bronvermelding en cijfers", "Neutraal taalgebruik en passieve zinnen", "Persoonlijk perspectief en waarderende woorden", "Verifieerbare feiten en data"], a: 2, u: "Subjectieve teksten zijn gekleurd door persoonlijke ervaringen, gevoelens en meningen – herkenbaar aan waarderende woorden en ik-perspectief." },
    { v: "Een journalist schrijft: \"De burgemeester nam eindelijk de juiste beslissing.\" Waarom is dit subjectief?", o: ["Omdat een journalist altijd subjectief schrijft", "Omdat 'eindelijk' en 'juiste' persoonlijke oordelen uitdrukken", "Omdat het over een burgemeester gaat", "Omdat het geen bronnen noemt"], a: 1, u: "'Eindelijk' impliceert ongeduld en 'juiste' is een oordeel. Beide woorden drukken de mening van de schrijver uit." }
  ],
  argumentatie: [
    { v: "Welke functie heeft een TEGENARGUMENT in een betoog?", o: ["Het verzwakt altijd het betoog", "Het toont dat de schrijver andere perspectieven erkent en eerlijk is", "Het vervangt het standpunt", "Het is hetzelfde als een weerlegging"], a: 1, u: "Een schrijver die tegenargumenten noemt toont intellectuele eerlijkheid. De weerlegging ontkracht het tegenargument daarna." },
    { v: "\"Jongeren moeten meer bewegen. Want uit onderzoek blijkt dat beweging de hersenfunctie verbetert.\" Wat is het argument?", o: ["Jongeren moeten meer bewegen.", "Beweging verbetert de hersenfunctie.", "Uit onderzoek blijkt...", "Jongeren bewegen te weinig."], a: 1, u: "'Want' kondigt het argument aan. De reden (beweging verbetert hersenfunctie) onderbouwt het standpunt (jongeren moeten meer bewegen)." },
    { v: "Wat is een drogreden?", o: ["Een erg sterk argument gebaseerd op feiten", "Een redenering die onlogisch lijkt maar klopt", "Een schijnargument dat lijkt te kloppen maar redeneerfouten bevat", "Een argument gebaseerd op gevoel"], a: 2, u: "Drogredenen zijn schijnargumenten: ze zien er logisch uit maar bevatten een redenerfout. Voorbeelden: stroman, ad hominem, valse dichotomie." }
  ]
};

/* ============================================================
   HOOFD-QUIZ FUNCTIES
   ============================================================ */
const quizState = {};

function toonSectie(naam, navEl) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item a').forEach(a => a.classList.remove('active'));
  const target = document.getElementById('section-' + naam);
  if (target) target.classList.add('active');
  if (navEl) navEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (naam === 'lezen')      initQuiz('lezen');
  if (naam === 'schrijven')  initQuiz('schrijven');
  if (naam === 'taalbasis')  initQuiz('taal');
  if (naam === 'literatuur') initQuiz('lit');
}

function toonTab(sectie, tab, btn) {
  const panels = document.querySelectorAll('#section-' + sectie + ' .content-panel');
  panels.forEach(p => p.classList.remove('active'));
  if (btn) btn.parentElement.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
  const panel = document.getElementById(sectie + '-' + tab);
  if (panel) panel.classList.add('active');
  if (btn) btn.classList.add('active');
  if (tab.startsWith('quiz-')) initQuiz(tab.replace('quiz-', ''));
}

function initQuiz(id) {
  const container = document.getElementById('quiz-' + id + '-container');
  if (!container || container.dataset.init) return;
  container.dataset.init = '1';
  quizState[id] = { current: 0, score: 0, answered: false };
  renderVraag(id);
}

function renderVraag(id) {
  const container = document.getElementById('quiz-' + id + '-container');
  const data = quizData[id];
  const state = quizState[id];
  if (!data || !container) return;
  const q = data[state.current];
  const isLast = state.current === data.length - 1;
  container.innerHTML = `
    <div class="quiz-teller">Vraag ${state.current + 1} van ${data.length}</div>
    <div class="vraag-tekst">${q.v}</div>
    <div class="antwoord-opties">
      ${q.o.map((opt, i) =>
        `<button class="antwoord-optie" data-quizcheck="${id}" data-quizi="${i}" id="opt-${id}-${i}">${String.fromCharCode(65 + i)}. ${opt}</button>`
      ).join('')}
    </div>
    <div class="quiz-feedback" id="feedback-${id}"></div>
    <div class="quiz-nav">
      <div class="quiz-score">Score: ${state.score}/${data.length}</div>
      <button class="quiz-btn" id="next-${id}" data-quiznext="${id}" disabled>${isLast ? '🏁 Resultaat' : 'Volgende →'}</button>
    </div>`;
  state.answered = false;
}

function checkAntwoord(id, gekozen) {
  const state = quizState[id];
  if (state.answered) return;
  state.answered = true;
  const q = quizData[id][state.current];
  const feedback = document.getElementById('feedback-' + id);
  const nextBtn = document.getElementById('next-' + id);
  q.o.forEach((_, i) => {
    const btn = document.getElementById('opt-' + id + '-' + i);
    if (btn) {
      btn.disabled = true;
      if (i === q.a)      btn.classList.add('correct');
      else if (i === gekozen) btn.classList.add('fout');
    }
  });
  if (gekozen === q.a) {
    state.score++;
    feedback.className = 'quiz-feedback correct';
    feedback.style.display = 'block';
    feedback.innerHTML = '✅ Goed! ' + q.u;
  } else {
    feedback.className = 'quiz-feedback fout';
    feedback.style.display = 'block';
    feedback.innerHTML = '❌ Helaas! Antwoord ' + String.fromCharCode(65 + q.a) + ' is correct. ' + q.u;
  }
  if (nextBtn) nextBtn.disabled = false;
}

function volgendeVraag(id) {
  const state = quizState[id];
  const data = quizData[id];
  state.current++;
  if (state.current >= data.length) {
    const container = document.getElementById('quiz-' + id + '-container');
    const perc = Math.round((state.score / data.length) * 100);
    const emoji = perc >= 80 ? '🏆' : perc >= 60 ? '😊' : '📚';
    const msg   = perc >= 80 ? 'Uitstekend! Je kent de stof goed.' : perc >= 60 ? 'Goed gedaan! Oefen de fouten nog even.' : 'Blijf oefenen – je komt er!';
    container.innerHTML = `<div style="text-align:center;padding:28px 0">
      <div style="font-size:3.5rem;margin-bottom:14px">${emoji}</div>
      <div style="font-family:Bangers,cursive;font-size:1.9rem;letter-spacing:2px;margin-bottom:6px">Score: ${state.score}/${data.length}</div>
      <div style="font-size:1.1rem;margin-bottom:6px">${perc}%</div>
      <div style="opacity:0.85;margin-bottom:22px">${msg}</div>
      <button class="quiz-btn" data-quizherstart="${id}">🔄 Opnieuw</button>
    </div>`;
    return;
  }
  renderVraag(id);
}

function herstart(id) {
  const container = document.getElementById('quiz-' + id + '-container');
  delete container.dataset.init;
  initQuiz(id);
}

/* ============================================================
   MINI-QUIZ FUNCTIES
   ============================================================ */
const mqState = {};

function mqInit(id) {
  if (mqState[id]) return;
  mqState[id] = { current: 0, score: 0, answered: false };
  mqRender(id);
}

function mqRender(id) {
  const data  = miniQuizData[id];
  const state = mqState[id];
  if (!data || !state) return;
  const q = data[state.current];

  const teller   = document.getElementById('mq-' + id + '-teller');
  const vraag    = document.getElementById('mq-' + id + '-vraag');
  const opties   = document.getElementById('mq-' + id + '-opties');
  const fb       = document.getElementById('mq-' + id + '-feedback');
  const volgende = document.getElementById('mq-' + id + '-volgende');
  const score    = document.getElementById('mq-' + id + '-score');
  if (!teller || !vraag || !opties) return;

  teller.textContent = 'Vraag ' + (state.current + 1) + ' van ' + data.length;
  vraag.textContent  = q.v;
  opties.innerHTML   = q.o.map((opt, i) =>
    '<button class="antwoord-optie" data-mqcheck="' + id + '" data-mqi="' + i + '" id="mq-' + id + '-opt-' + i + '">' + String.fromCharCode(65 + i) + '. ' + opt + '</button>'
  ).join('');

  if (fb)       { fb.style.display = 'none'; fb.className = 'quiz-feedback'; fb.textContent = ''; }
  if (volgende) { volgende.disabled = true; volgende.dataset.mqvolgende = id; volgende.textContent = state.current < data.length - 1 ? 'Volgende' : 'Bekijk score'; }
  if (score)    { score.textContent = ''; }
  state.answered = false;
}

function mqCheck(id, gekozen) {
  const state = mqState[id];
  if (!state || state.answered) return;
  state.answered = true;
  const q = miniQuizData[id][state.current];
  const correct = gekozen === q.a;
  if (correct) state.score++;

  const opts = document.querySelectorAll('#mq-' + id + '-opties .antwoord-optie');
  opts.forEach(function (btn, i) {
    if (i === q.a)      btn.classList.add('correct');
    else if (i === gekozen) btn.classList.add('fout');
    btn.disabled = true;
  });

  const fb = document.getElementById('mq-' + id + '-feedback');
  if (fb) {
    fb.style.display = 'block';
    fb.className     = 'quiz-feedback ' + (correct ? 'correct' : 'fout');
    fb.textContent   = (correct ? '✅ Goed! ' : '❌ Helaas. ') + q.u;
  }
  const volgende = document.getElementById('mq-' + id + '-volgende');
  if (volgende) volgende.disabled = false;
}

function mqVolgende(id) {
  const state = mqState[id];
  if (!state) return;
  if (state.current < miniQuizData[id].length - 1) {
    state.current++;
    mqRender(id);
  } else {
    const perc      = Math.round(state.score / miniQuizData[id].length * 100);
    const emoji     = perc >= 80 ? '🏆' : perc >= 50 ? '👍' : '📚';
    const msg       = perc >= 80 ? 'Uitstekend!' : perc >= 50 ? 'Goed bezig!' : 'Blijf oefenen!';
    const container = document.getElementById('mq-' + id);
    if (container) {
      container.innerHTML =
        '<div style="text-align:center;padding:28px 0">' +
        '<div style="font-size:3rem">' + emoji + '</div>' +
        '<div style="font-family:Bangers,cursive;font-size:1.9rem">' + perc + '%</div>' +
        '<p>' + msg + '</p>' +
        '<button class="quiz-btn" data-mqherstart="' + id + '">🔄 Opnieuw</button>' +
        '</div>';
    }
  }
}

function mqHerstart(id) {
  mqState[id] = { current: 0, score: 0, answered: false };
  mqRender(id);
}

/* ============================================================
   TAB-GROEP NAVIGATIE
   ============================================================ */
function toonTabGroep(sectie, groepId, btn) {
  const sectionEl = document.getElementById('section-' + sectie);
  if (!sectionEl) return;
  sectionEl.querySelectorAll('.tab-groep-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  sectionEl.querySelectorAll('.tab-groep-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(sectie + '-groep-' + groepId);
  if (panel) panel.classList.add('active');
  if (groepId === 'vd') mqInit('feit-mening');
}

function toonTabInGroep(sectie, groep, tabId, btn) {
  const groepEl = document.getElementById(sectie + '-groep-' + groep);
  if (!groepEl) return;
  groepEl.querySelectorAll('.sub-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  groepEl.querySelectorAll('.content-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(sectie + '-' + groep + '-' + tabId);
  if (panel) panel.classList.add('active');
  if (miniQuizData[tabId]) mqInit(tabId);
}

/* ============================================================
   EVENT DELEGATION (① – ⑥)
   Vervangt alle inline onclick-handlers in de HTML.
   ============================================================ */

document.addEventListener('click', function (e) {

  /* ① Navigatie – nav-item links */
  const navLink = e.target.closest('.nav-item a[onclick]');
  /* (De nav-links bevatten al onclick voor achterwaartse compatibiliteit;
      als je die verwijdert kun je data-sectie attributen toevoegen en hier
      afhandelen. Hieronder alvast de hook: */
  const navDataLink = e.target.closest('[data-sectie]');
  if (navDataLink) {
    e.preventDefault();
    toonSectie(navDataLink.dataset.sectie, navDataLink);
    return;
  }

  /* ② Hoofd-quiz antwoordknoppen (gegenereerd via renderVraag) */
  const quizOptie = e.target.closest('[data-quizcheck]');
  if (quizOptie) {
    checkAntwoord(quizOptie.dataset.quizcheck, parseInt(quizOptie.dataset.quizi, 10));
    return;
  }

  /* ③ Hoofd-quiz volgende-knop (gegenereerd via renderVraag) */
  const quizNext = e.target.closest('[data-quiznext]');
  if (quizNext && !quizNext.disabled) {
    volgendeVraag(quizNext.dataset.quiznext);
    return;
  }

  /* ④ Hoofd-quiz herstart-knop (gegenereerd in volgendeVraag) */
  const quizHerstart = e.target.closest('[data-quizherstart]');
  if (quizHerstart) {
    herstart(quizHerstart.dataset.quizherstart);
    return;
  }

  /* ⑤ Mini-quiz antwoordknoppen */
  const mqOptie = e.target.closest('[data-mqcheck]');
  if (mqOptie) {
    mqCheck(mqOptie.dataset.mqcheck, parseInt(mqOptie.dataset.mqi, 10));
    return;
  }

  /* ⑥ Mini-quiz volgende-knop */
  const mqVolgBtn = e.target.closest('[data-mqvolgende]');
  if (mqVolgBtn && !mqVolgBtn.disabled) {
    mqVolgende(mqVolgBtn.dataset.mqvolgende);
    return;
  }

  /* ⑦ Mini-quiz herstart-knop (dynamisch gegenereerd) */
  const mqHerstartBtn = e.target.closest('[data-mqherstart]');
  if (mqHerstartBtn) {
    mqHerstart(mqHerstartBtn.dataset.mqherstart);
    return;
  }
});

/* ============================================================
   INITIALISATIE
   ============================================================ */
initQuiz('lezen');
