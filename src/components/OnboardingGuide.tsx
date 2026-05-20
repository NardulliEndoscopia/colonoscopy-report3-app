'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { Language } from '@/lib/types';

interface OnboardingGuideProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
  hasResult: boolean;
}

const guideText: Partial<Record<Language, {
  open: string;
  close: string;
  next: string;
  previous: string;
  finish: string;
  listen: string;
  stop: string;
  stepLabel: string;
  title: string;
  subtitle: string;
  steps: Array<{
    title: string;
    body: string;
    target?: string;
    accent: string;
  }>;
}>> = {
  es: {
    open: 'GuÃ­a',
    close: 'Cerrar',
    next: 'Siguiente',
    previous: 'Anterior',
    finish: 'Comenzar',
    listen: 'Escuchar paso',
    stop: 'Detener',
    stepLabel: 'Paso',
    title: 'CÃ³mo usar ColonReport',
    subtitle: 'Sigue estos pasos antes de analizar tu informe.',
    steps: [
      {
        title: 'Primero elige el idioma',
        body: 'Selecciona el idioma en el que deseas recibir la explicaciÃ³n. No tiene que ser necesariamente el idioma original del informe: la aplicaciÃ³n intentarÃ¡ explicar los hallazgos en el idioma elegido.',
        target: 'language-strip',
        accent: 'Idioma',
      },
      {
        title: 'Carga el informe',
        body: 'Puedes subir una foto, usar la cÃ¡mara, adjuntar un PDF o pegar el texto. Procura que el informe estÃ© completo, legible, sin cortes, sombras ni reflejos.',
        target: 'report-input-card',
        accent: 'Informe',
      },
      {
        title: 'Confirma el consentimiento',
        body: 'Marca la casilla para confirmar que entiendes que esta herramienta ofrece una explicaciÃ³n orientativa y no sustituye la consulta con tu mÃ©dico.',
        target: 'consent-card',
        accent: 'Consentimiento',
      },
      {
        title: 'Analiza el informe',
        body: 'Pulsa Analizar informe. La inteligencia artificial extraerÃ¡ los hallazgos, su localizaciÃ³n anatÃ³mica aproximada y una explicaciÃ³n clara para pacientes.',
        target: 'analyze-button',
        accent: 'AnÃ¡lisis',
      },
      {
        title: 'Revisa el mapa del colon',
        body: 'En la pantalla de resultados, el mapa del colon se abrirÃ¡ automÃ¡ticamente. Los marcadores seÃ±alan de forma aproximada las zonas anatÃ³micas donde aparecen los hallazgos.',
        target: 'colon-map-card',
        accent: 'Mapa',
      },
      {
        title: 'Lee o escucha la explicaciÃ³n',
        body: 'Puedes leer cada tarjeta o escuchar la narraciÃ³n en el idioma seleccionado. TambiÃ©n puedes escuchar todos los hallazgos juntos al final de los resultados.',
        target: 'listen-all-card',
        accent: 'Voz',
      },
    ],
  },
  en: {
    open: 'Guide',
    close: 'Close',
    next: 'Next',
    previous: 'Back',
    finish: 'Start',
    listen: 'Listen',
    stop: 'Stop',
    stepLabel: 'Step',
    title: 'How to use ColonReport',
    subtitle: 'Follow these steps before analyzing your report.',
    steps: [
      {
        title: 'Choose the language first',
        body: 'Select the language in which you want the explanation. It does not need to be the original language of the report.',
        target: 'language-strip',
        accent: 'Language',
      },
      {
        title: 'Upload the report',
        body: 'Upload a photo, use the camera, attach a PDF, or paste the text. Make sure the report is complete, readable, and without glare or cuts.',
        target: 'report-input-card',
        accent: 'Report',
      },
      {
        title: 'Confirm consent',
        body: 'Check the box to confirm that this tool provides guidance and does not replace consultation with your doctor.',
        target: 'consent-card',
        accent: 'Consent',
      },
      {
        title: 'Analyze the report',
        body: 'Press Analyze report. The AI will extract findings, approximate anatomical location, and a patient-friendly explanation.',
        target: 'analyze-button',
        accent: 'Analysis',
      },
      {
        title: 'Review the colon map',
        body: 'On the results screen, the colon map opens automatically. Markers show approximate anatomical areas for the findings.',
        target: 'colon-map-card',
        accent: 'Map',
      },
      {
        title: 'Read or listen',
        body: 'You can read each card or listen to the narration in the selected language. You can also listen to all findings together.',
        target: 'listen-all-card',
        accent: 'Voice',
      },
    ],
  },
  fr: {
    open: 'Guide',
    close: 'Fermer',
    next: 'Suivant',
    previous: 'Retour',
    finish: 'Commencer',
    listen: 'Ã‰couter',
    stop: 'ArrÃªter',
    stepLabel: 'Ã‰tape',
    title: 'Comment utiliser ColonReport',
    subtitle: 'Suivez ces Ã©tapes avant dâ€™analyser votre compte rendu.',
    steps: [
      { title: 'Choisissez dâ€™abord la langue', body: 'SÃ©lectionnez la langue dans laquelle vous souhaitez recevoir lâ€™explication. Elle ne doit pas nÃ©cessairement Ãªtre la langue originale du rapport.', target: 'language-strip', accent: 'Langue' },
      { title: 'Chargez le rapport', body: 'TÃ©lÃ©chargez une photo, utilisez la camÃ©ra, joignez un PDF ou collez le texte. Assurez-vous que le rapport est complet, lisible, sans coupures ni reflets.', target: 'report-input-card', accent: 'Rapport' },
      { title: 'Confirmez le consentement', body: 'Cochez la case pour confirmer que cet outil fournit une explication informative et ne remplace pas la consultation avec votre mÃ©decin.', target: 'consent-card', accent: 'Consentement' },
      { title: 'Analysez le rapport', body: 'Appuyez sur Analyser le rapport. Lâ€™intelligence artificielle extraira les rÃ©sultats, leur localisation approximative et une explication claire.', target: 'analyze-button', accent: 'Analyse' },
      { title: 'Consultez la carte du cÃ´lon', body: 'Sur lâ€™Ã©cran des rÃ©sultats, la carte du cÃ´lon sâ€™ouvre automatiquement. Les marqueurs indiquent approximativement les zones anatomiques des rÃ©sultats.', target: 'colon-map-card', accent: 'Carte' },
      { title: 'Lisez ou Ã©coutez', body: 'Vous pouvez lire chaque carte ou Ã©couter la narration dans la langue sÃ©lectionnÃ©e. Vous pouvez aussi Ã©couter tous les rÃ©sultats ensemble.', target: 'listen-all-card', accent: 'Voix' },
    ],
  },
  it: {
    open: 'Guida',
    close: 'Chiudi',
    next: 'Avanti',
    previous: 'Indietro',
    finish: 'Inizia',
    listen: 'Ascolta',
    stop: 'Ferma',
    stepLabel: 'Passo',
    title: 'Come usare ColonReport',
    subtitle: 'Segui questi passaggi prima di analizzare il referto.',
    steps: [
      { title: 'Scegli prima la lingua', body: 'Seleziona la lingua in cui desideri ricevere la spiegazione. Non deve essere necessariamente la lingua originale del referto.', target: 'language-strip', accent: 'Lingua' },
      { title: 'Carica il referto', body: 'Puoi caricare una foto, usare la fotocamera, allegare un PDF o incollare il testo. Il referto deve essere completo, leggibile e senza riflessi.', target: 'report-input-card', accent: 'Referto' },
      { title: 'Conferma il consenso', body: 'Spunta la casella per confermare che lo strumento fornisce informazioni orientative e non sostituisce la visita con il medico.', target: 'consent-card', accent: 'Consenso' },
      { title: 'Analizza il referto', body: 'Premi Analizza referto. Lâ€™intelligenza artificiale estrarrÃ  i reperti, la posizione anatomica approssimativa e una spiegazione chiara.', target: 'analyze-button', accent: 'Analisi' },
      { title: 'Consulta la mappa del colon', body: 'Nella schermata dei risultati, la mappa del colon si apre automaticamente. I marcatori indicano approssimativamente le zone anatomiche dei reperti.', target: 'colon-map-card', accent: 'Mappa' },
      { title: 'Leggi o ascolta', body: 'Puoi leggere ogni scheda o ascoltare la narrazione nella lingua selezionata. Puoi anche ascoltare tutti i reperti insieme.', target: 'listen-all-card', accent: 'Voce' },
    ],
  },
  pt: {
    open: 'Guia',
    close: 'Fechar',
    next: 'Seguinte',
    previous: 'Anterior',
    finish: 'ComeÃ§ar',
    listen: 'Ouvir',
    stop: 'Parar',
    stepLabel: 'Passo',
    title: 'Como usar o ColonReport',
    subtitle: 'Siga estes passos antes de analisar o relatÃ³rio.',
    steps: [
      { title: 'Escolha primeiro o idioma', body: 'Selecione o idioma em que deseja receber a explicaÃ§Ã£o. NÃ£o precisa ser o idioma original do relatÃ³rio.', target: 'language-strip', accent: 'Idioma' },
      { title: 'Carregue o relatÃ³rio', body: 'Pode carregar uma fotografia, usar a cÃ¢mara, anexar um PDF ou colar o texto. Garanta que estÃ¡ completo, legÃ­vel e sem reflexos.', target: 'report-input-card', accent: 'RelatÃ³rio' },
      { title: 'Confirme o consentimento', body: 'Marque a caixa para confirmar que esta ferramenta oferece orientaÃ§Ã£o informativa e nÃ£o substitui a consulta com o seu mÃ©dico.', target: 'consent-card', accent: 'Consentimento' },
      { title: 'Analise o relatÃ³rio', body: 'Prima Analisar relatÃ³rio. A inteligÃªncia artificial extrairÃ¡ os achados, a localizaÃ§Ã£o aproximada e uma explicaÃ§Ã£o clara.', target: 'analyze-button', accent: 'AnÃ¡lise' },
      { title: 'Veja o mapa do cÃ³lon', body: 'Na tela de resultados, o mapa do cÃ³lon abre automaticamente. Os marcadores indicam aproximadamente as zonas anatÃ³micas dos achados.', target: 'colon-map-card', accent: 'Mapa' },
      { title: 'Leia ou ouÃ§a', body: 'Pode ler cada cartÃ£o ou ouvir a narraÃ§Ã£o no idioma selecionado. TambÃ©m pode ouvir todos os achados em conjunto.', target: 'listen-all-card', accent: 'Voz' },
    ],
  },
  de: {
    open: 'Anleitung',
    close: 'SchlieÃŸen',
    next: 'Weiter',
    previous: 'ZurÃ¼ck',
    finish: 'Starten',
    listen: 'AnhÃ¶ren',
    stop: 'Stoppen',
    stepLabel: 'Schritt',
    title: 'So verwenden Sie ColonReport',
    subtitle: 'Befolgen Sie diese Schritte vor der Analyse Ihres Berichts.',
    steps: [
      { title: 'WÃ¤hlen Sie zuerst die Sprache', body: 'WÃ¤hlen Sie die Sprache aus, in der Sie die ErklÃ¤rung erhalten mÃ¶chten. Sie muss nicht die Originalsprache des Berichts sein.', target: 'language-strip', accent: 'Sprache' },
      { title: 'Laden Sie den Bericht hoch', body: 'Sie kÃ¶nnen ein Foto hochladen, die Kamera verwenden, eine PDF anhÃ¤ngen oder den Text einfÃ¼gen. Der Bericht sollte vollstÃ¤ndig und gut lesbar sein.', target: 'report-input-card', accent: 'Bericht' },
      { title: 'BestÃ¤tigen Sie die Einwilligung', body: 'Markieren Sie das KÃ¤stchen, um zu bestÃ¤tigen, dass dieses Tool nur eine Orientierung bietet und keinen Arztbesuch ersetzt.', target: 'consent-card', accent: 'Einwilligung' },
      { title: 'Analysieren Sie den Bericht', body: 'DrÃ¼cken Sie Bericht analysieren. Die kÃ¼nstliche Intelligenz extrahiert Befunde, ungefÃ¤hre Lokalisation und eine verstÃ¤ndliche ErklÃ¤rung.', target: 'analyze-button', accent: 'Analyse' },
      { title: 'PrÃ¼fen Sie die Darmkarte', body: 'Auf der Ergebnisseite Ã¶ffnet sich die Darmkarte automatisch. Die Marker zeigen ungefÃ¤hr die anatomischen Bereiche der Befunde.', target: 'colon-map-card', accent: 'Karte' },
      { title: 'Lesen oder hÃ¶ren', body: 'Sie kÃ¶nnen jede Karte lesen oder die ErzÃ¤hlung in der ausgewÃ¤hlten Sprache anhÃ¶ren. Sie kÃ¶nnen auch alle Befunde zusammen anhÃ¶ren.', target: 'listen-all-card', accent: 'Stimme' },
    ],
  },
  nl: {
    open: 'Gids',
    close: 'Sluiten',
    next: 'Volgende',
    previous: 'Terug',
    finish: 'Starten',
    listen: 'Luisteren',
    stop: 'Stoppen',
    stepLabel: 'Stap',
    title: 'ColonReport gebruiken',
    subtitle: 'Volg deze stappen voordat u het rapport analyseert.',
    steps: [
      { title: 'Kies eerst de taal', body: 'Selecteer de taal waarin u de uitleg wilt ontvangen. Dit hoeft niet de oorspronkelijke taal van het rapport te zijn.', target: 'language-strip', accent: 'Taal' },
      { title: 'Upload het rapport', body: 'Upload een foto, gebruik de camera, voeg een PDF toe of plak de tekst. Zorg dat het rapport volledig, leesbaar en zonder reflecties is.', target: 'report-input-card', accent: 'Rapport' },
      { title: 'Bevestig toestemming', body: 'Vink het vakje aan om te bevestigen dat dit hulpmiddel informatief is en geen medisch consult vervangt.', target: 'consent-card', accent: 'Toestemming' },
      { title: 'Analyseer het rapport', body: 'Druk op Rapport analyseren. De AI haalt bevindingen, geschatte locatie en een duidelijke uitleg uit het rapport.', target: 'analyze-button', accent: 'Analyse' },
      { title: 'Bekijk de colonkaart', body: 'In het resultatenscherm opent de colonkaart automatisch. De markeringen tonen ongeveer de anatomische gebieden van de bevindingen.', target: 'colon-map-card', accent: 'Kaart' },
      { title: 'Lees of luister', body: 'U kunt elke kaart lezen of de vertelling beluisteren in de gekozen taal. U kunt ook alle bevindingen samen beluisteren.', target: 'listen-all-card', accent: 'Stem' },
    ],
  },
  pl: {
    open: 'Przewodnik',
    close: 'Zamknij',
    next: 'Dalej',
    previous: 'Wstecz',
    finish: 'Zacznij',
    listen: 'OdsÅ‚uchaj',
    stop: 'Zatrzymaj',
    stepLabel: 'Krok',
    title: 'Jak uÅ¼ywaÄ‡ ColonReport',
    subtitle: 'Wykonaj te kroki przed analizÄ… raportu.',
    steps: [
      { title: 'Najpierw wybierz jÄ™zyk', body: 'Wybierz jÄ™zyk, w ktÃ³rym chcesz otrzymaÄ‡ wyjaÅ›nienie. Nie musi to byÄ‡ oryginalny jÄ™zyk raportu.', target: 'language-strip', accent: 'JÄ™zyk' },
      { title: 'Dodaj raport', body: 'MoÅ¼esz przesÅ‚aÄ‡ zdjÄ™cie, uÅ¼yÄ‡ kamery, doÅ‚Ä…czyÄ‡ PDF albo wkleiÄ‡ tekst. Raport powinien byÄ‡ kompletny, czytelny i bez odblaskÃ³w.', target: 'report-input-card', accent: 'Raport' },
      { title: 'PotwierdÅº zgodÄ™', body: 'Zaznacz pole, aby potwierdziÄ‡, Å¼e narzÄ™dzie ma charakter informacyjny i nie zastÄ™puje konsultacji z lekarzem.', target: 'consent-card', accent: 'Zgoda' },
      { title: 'Przeanalizuj raport', body: 'NaciÅ›nij Analizuj raport. Sztuczna inteligencja wyodrÄ™bni wyniki, przybliÅ¼onÄ… lokalizacjÄ™ i jasne wyjaÅ›nienie.', target: 'analyze-button', accent: 'Analiza' },
      { title: 'SprawdÅº mapÄ™ jelita', body: 'Na ekranie wynikÃ³w mapa jelita otworzy siÄ™ automatycznie. Znaczniki pokazujÄ… przybliÅ¼one obszary anatomiczne wynikÃ³w.', target: 'colon-map-card', accent: 'Mapa' },
      { title: 'Czytaj albo sÅ‚uchaj', body: 'MoÅ¼esz czytaÄ‡ kaÅ¼dÄ… kartÄ™ lub sÅ‚uchaÄ‡ narracji w wybranym jÄ™zyku. MoÅ¼esz teÅ¼ odsÅ‚uchaÄ‡ wszystkie wyniki razem.', target: 'listen-all-card', accent: 'GÅ‚os' },
    ],
  },
  ro: {
    open: 'Ghid',
    close: 'ÃŽnchide',
    next: 'UrmÄƒtorul',
    previous: 'ÃŽnapoi',
    finish: 'ÃŽncepe',
    listen: 'AscultÄƒ',
    stop: 'OpreÈ™te',
    stepLabel: 'Pasul',
    title: 'Cum se foloseÈ™te ColonReport',
    subtitle: 'UrmaÈ›i aceÈ™ti paÈ™i Ã®nainte de analizarea raportului.',
    steps: [
      { title: 'AlegeÈ›i mai Ã®ntÃ¢i limba', body: 'SelectaÈ›i limba Ã®n care doriÈ›i explicaÈ›ia. Nu trebuie sÄƒ fie neapÄƒrat limba originalÄƒ a raportului.', target: 'language-strip', accent: 'Limba' },
      { title: 'ÃŽncÄƒrcaÈ›i raportul', body: 'PuteÈ›i Ã®ncÄƒrca o fotografie, folosi camera, ataÈ™a un PDF sau lipi textul. Raportul trebuie sÄƒ fie complet È™i lizibil.', target: 'report-input-card', accent: 'Raport' },
      { title: 'ConfirmaÈ›i consimÈ›ÄƒmÃ¢ntul', body: 'BifaÈ›i caseta pentru a confirma cÄƒ instrumentul oferÄƒ informaÈ›ii orientative È™i nu Ã®nlocuieÈ™te consultaÈ›ia medicalÄƒ.', target: 'consent-card', accent: 'ConsimÈ›ÄƒmÃ¢nt' },
      { title: 'AnalizaÈ›i raportul', body: 'ApÄƒsaÈ›i AnalizaÈ›i raportul. InteligenÈ›a artificialÄƒ va extrage constatÄƒrile, localizarea aproximativÄƒ È™i o explicaÈ›ie clarÄƒ.', target: 'analyze-button', accent: 'AnalizÄƒ' },
      { title: 'VerificaÈ›i harta colonului', body: 'ÃŽn ecranul de rezultate, harta colonului se deschide automat. Markerii indicÄƒ aproximativ zonele anatomice ale constatÄƒrilor.', target: 'colon-map-card', accent: 'HartÄƒ' },
      { title: 'CitiÈ›i sau ascultaÈ›i', body: 'PuteÈ›i citi fiecare card sau asculta naraÈ›iunea Ã®n limba selectatÄƒ. PuteÈ›i asculta È™i toate constatÄƒrile Ã®mpreunÄƒ.', target: 'listen-all-card', accent: 'Voce' },
    ],
  },
  ar: {
    open: 'Ø§Ù„Ø¯Ù„ÙŠÙ„',
    close: 'Ø¥ØºÙ„Ø§Ù‚',
    next: 'Ø§Ù„ØªØ§Ù„ÙŠ',
    previous: 'Ø§Ù„Ø³Ø§Ø¨Ù‚',
    finish: 'Ø§Ø¨Ø¯Ø£',
    listen: 'Ø§Ø³ØªÙ…Ø§Ø¹',
    stop: 'Ø¥ÙŠÙ‚Ø§Ù',
    stepLabel: 'Ø§Ù„Ø®Ø·ÙˆØ©',
    title: 'ÙƒÙŠÙÙŠØ© Ø§Ø³ØªØ®Ø¯Ø§Ù… ColonReport',
    subtitle: 'Ø§ØªØ¨Ø¹ Ù‡Ø°Ù‡ Ø§Ù„Ø®Ø·ÙˆØ§Øª Ù‚Ø¨Ù„ ØªØ­Ù„ÙŠÙ„ Ø§Ù„ØªÙ‚Ø±ÙŠØ±.',
    steps: [
      { title: 'Ø§Ø®ØªØ± Ø§Ù„Ù„ØºØ© Ø£ÙˆÙ„Ø§Ù‹', body: 'Ø§Ø®ØªØ± Ø§Ù„Ù„ØºØ© Ø§Ù„ØªÙŠ ØªØ±ÙŠØ¯ Ø£Ù† ØªØ­ØµÙ„ Ø¨Ù‡Ø§ Ø¹Ù„Ù‰ Ø§Ù„Ø´Ø±Ø­. Ù„Ø§ ÙŠÙ„Ø²Ù… Ø£Ù† ØªÙƒÙˆÙ† Ù†ÙØ³ Ù„ØºØ© Ø§Ù„ØªÙ‚Ø±ÙŠØ± Ø§Ù„Ø£ØµÙ„ÙŠØ©.', target: 'language-strip', accent: 'Ø§Ù„Ù„ØºØ©' },
      { title: 'Ø§Ø±ÙØ¹ Ø§Ù„ØªÙ‚Ø±ÙŠØ±', body: 'ÙŠÙ…ÙƒÙ†Ùƒ Ø±ÙØ¹ ØµÙˆØ±Ø©ØŒ Ø£Ùˆ Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„ÙƒØ§Ù…ÙŠØ±Ø§ØŒ Ø£Ùˆ Ø¥Ø±ÙØ§Ù‚ Ù…Ù„Ù PDFØŒ Ø£Ùˆ Ù„ØµÙ‚ Ø§Ù„Ù†Øµ. ØªØ£ÙƒØ¯ Ø£Ù† Ø§Ù„ØªÙ‚Ø±ÙŠØ± ÙˆØ§Ø¶Ø­ ÙˆÙƒØ§Ù…Ù„.', target: 'report-input-card', accent: 'Ø§Ù„ØªÙ‚Ø±ÙŠØ±' },
      { title: 'Ø£ÙƒØ¯ Ø§Ù„Ù…ÙˆØ§ÙÙ‚Ø©', body: 'Ø¶Ø¹ Ø¹Ù„Ø§Ù…Ø© ÙÙŠ Ø§Ù„Ù…Ø±Ø¨Ø¹ Ù„ØªØ£ÙƒÙŠØ¯ Ø£Ù† Ù‡Ø°Ù‡ Ø§Ù„Ø£Ø¯Ø§Ø© ØªÙ‚Ø¯Ù… Ø´Ø±Ø­Ø§Ù‹ Ø¥Ø±Ø´Ø§Ø¯ÙŠØ§Ù‹ ÙˆÙ„Ø§ ØªØ­Ù„ Ù…Ø­Ù„ Ø§Ø³ØªØ´Ø§Ø±Ø© Ø§Ù„Ø·Ø¨ÙŠØ¨.', target: 'consent-card', accent: 'Ø§Ù„Ù…ÙˆØ§ÙÙ‚Ø©' },
      { title: 'Ø­Ù„Ù„ Ø§Ù„ØªÙ‚Ø±ÙŠØ±', body: 'Ø§Ø¶ØºØ· Ø¹Ù„Ù‰ ØªØ­Ù„ÙŠÙ„ Ø§Ù„ØªÙ‚Ø±ÙŠØ±. Ø³ÙŠØ³ØªØ®Ø±Ø¬ Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ Ø§Ù„Ù†ØªØ§Ø¦Ø¬ ÙˆØ§Ù„Ù…ÙˆÙ‚Ø¹ Ø§Ù„ØªØ´Ø±ÙŠØ­ÙŠ Ø§Ù„ØªÙ‚Ø±ÙŠØ¨ÙŠ ÙˆØ´Ø±Ø­Ø§Ù‹ ÙˆØ§Ø¶Ø­Ø§Ù‹.', target: 'analyze-button', accent: 'Ø§Ù„ØªØ­Ù„ÙŠÙ„' },
      { title: 'Ø±Ø§Ø¬Ø¹ Ø®Ø±ÙŠØ·Ø© Ø§Ù„Ù‚ÙˆÙ„ÙˆÙ†', body: 'ÙÙŠ Ø´Ø§Ø´Ø© Ø§Ù„Ù†ØªØ§Ø¦Ø¬ØŒ ØªÙØªØ­ Ø®Ø±ÙŠØ·Ø© Ø§Ù„Ù‚ÙˆÙ„ÙˆÙ† ØªÙ„Ù‚Ø§Ø¦ÙŠØ§Ù‹. ØªØ´ÙŠØ± Ø§Ù„Ø¹Ù„Ø§Ù…Ø§Øª ØªÙ‚Ø±ÙŠØ¨ÙŠØ§Ù‹ Ø¥Ù„Ù‰ Ø§Ù„Ù…Ù†Ø§Ø·Ù‚ Ø§Ù„ØªØ´Ø±ÙŠØ­ÙŠØ© Ù„Ù„Ù†ØªØ§Ø¦Ø¬.', target: 'colon-map-card', accent: 'Ø§Ù„Ø®Ø±ÙŠØ·Ø©' },
      { title: 'Ø§Ù‚Ø±Ø£ Ø£Ùˆ Ø§Ø³ØªÙ…Ø¹', body: 'ÙŠÙ…ÙƒÙ†Ùƒ Ù‚Ø±Ø§Ø¡Ø© ÙƒÙ„ Ø¨Ø·Ø§Ù‚Ø© Ø£Ùˆ Ø§Ù„Ø§Ø³ØªÙ…Ø§Ø¹ Ø¥Ù„Ù‰ Ø§Ù„Ø´Ø±Ø­ Ø¨Ø§Ù„Ù„ØºØ© Ø§Ù„Ù…Ø®ØªØ§Ø±Ø©. ÙˆÙŠÙ…ÙƒÙ†Ùƒ Ø£ÙŠØ¶Ø§Ù‹ Ø§Ù„Ø§Ø³ØªÙ…Ø§Ø¹ Ø¥Ù„Ù‰ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ù†ØªØ§Ø¦Ø¬ Ù…Ø¹Ø§Ù‹.', target: 'listen-all-card', accent: 'Ø§Ù„ØµÙˆØª' },
    ],
  },
  ru: {
    open: 'Ð“Ð¸Ð´',
    close: 'Ð—Ð°ÐºÑ€Ñ‹Ñ‚ÑŒ',
    next: 'Ð”Ð°Ð»ÐµÐµ',
    previous: 'ÐÐ°Ð·Ð°Ð´',
    finish: 'ÐÐ°Ñ‡Ð°Ñ‚ÑŒ',
    listen: 'Ð¡Ð»ÑƒÑˆÐ°Ñ‚ÑŒ',
    stop: 'Ð¡Ñ‚Ð¾Ð¿',
    stepLabel: 'Ð¨Ð°Ð³',
    title: 'ÐšÐ°Ðº Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒÑÑ ColonReport',
    subtitle: 'Ð¡Ð»ÐµÐ´ÑƒÐ¹Ñ‚Ðµ ÑÑ‚Ð¸Ð¼ ÑˆÐ°Ð³Ð°Ð¼ Ð¿ÐµÑ€ÐµÐ´ Ð°Ð½Ð°Ð»Ð¸Ð·Ð¾Ð¼ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð°.',
    steps: [
      { title: 'Ð¡Ð½Ð°Ñ‡Ð°Ð»Ð° Ð²Ñ‹Ð±ÐµÑ€Ð¸Ñ‚Ðµ ÑÐ·Ñ‹Ðº', body: 'Ð’Ñ‹Ð±ÐµÑ€Ð¸Ñ‚Ðµ ÑÐ·Ñ‹Ðº, Ð½Ð° ÐºÐ¾Ñ‚Ð¾Ñ€Ð¾Ð¼ Ñ…Ð¾Ñ‚Ð¸Ñ‚Ðµ Ð¿Ð¾Ð»ÑƒÑ‡Ð¸Ñ‚ÑŒ Ð¾Ð±ÑŠÑÑÐ½ÐµÐ½Ð¸Ðµ. Ð­Ñ‚Ð¾ Ð½Ðµ Ð¾Ð±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾ Ð´Ð¾Ð»Ð¶ÐµÐ½ Ð±Ñ‹Ñ‚ÑŒ Ð¸ÑÑ…Ð¾Ð´Ð½Ñ‹Ð¹ ÑÐ·Ñ‹Ðº Ð¾Ñ‚Ñ‡Ñ‘Ñ‚Ð°.', target: 'language-strip', accent: 'Ð¯Ð·Ñ‹Ðº' },
      { title: 'Ð—Ð°Ð³Ñ€ÑƒÐ·Ð¸Ñ‚Ðµ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚', body: 'ÐœÐ¾Ð¶Ð½Ð¾ Ð·Ð°Ð³Ñ€ÑƒÐ·Ð¸Ñ‚ÑŒ Ñ„Ð¾Ñ‚Ð¾, Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒ ÐºÐ°Ð¼ÐµÑ€Ñƒ, Ð¿Ñ€Ð¸ÐºÑ€ÐµÐ¿Ð¸Ñ‚ÑŒ PDF Ð¸Ð»Ð¸ Ð²ÑÑ‚Ð°Ð²Ð¸Ñ‚ÑŒ Ñ‚ÐµÐºÑÑ‚. ÐžÑ‚Ñ‡Ñ‘Ñ‚ Ð´Ð¾Ð»Ð¶ÐµÐ½ Ð±Ñ‹Ñ‚ÑŒ Ð¿Ð¾Ð»Ð½Ñ‹Ð¼ Ð¸ Ñ‡Ð¸Ñ‚Ð°ÐµÐ¼Ñ‹Ð¼.', target: 'report-input-card', accent: 'ÐžÑ‚Ñ‡Ñ‘Ñ‚' },
      { title: 'ÐŸÐ¾Ð´Ñ‚Ð²ÐµÑ€Ð´Ð¸Ñ‚Ðµ ÑÐ¾Ð³Ð»Ð°ÑÐ¸Ðµ', body: 'ÐžÑ‚Ð¼ÐµÑ‚ÑŒÑ‚Ðµ Ð¿Ð¾Ð»Ðµ, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¿Ð¾Ð´Ñ‚Ð²ÐµÑ€Ð´Ð¸Ñ‚ÑŒ, Ñ‡Ñ‚Ð¾ Ð¸Ð½ÑÑ‚Ñ€ÑƒÐ¼ÐµÐ½Ñ‚ Ð´Ð°Ñ‘Ñ‚ ÑÐ¿Ñ€Ð°Ð²Ð¾Ñ‡Ð½ÑƒÑŽ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸ÑŽ Ð¸ Ð½Ðµ Ð·Ð°Ð¼ÐµÐ½ÑÐµÑ‚ ÐºÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ñ†Ð¸ÑŽ Ð²Ñ€Ð°Ñ‡Ð°.', target: 'consent-card', accent: 'Ð¡Ð¾Ð³Ð»Ð°ÑÐ¸Ðµ' },
      { title: 'ÐŸÑ€Ð¾Ð°Ð½Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÐ¹Ñ‚Ðµ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚', body: 'ÐÐ°Ð¶Ð¼Ð¸Ñ‚Ðµ ÐÐ½Ð°Ð»Ð¸Ð·Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ Ð¾Ñ‚Ñ‡Ñ‘Ñ‚. Ð˜Ð˜ Ð¸Ð·Ð²Ð»ÐµÑ‡Ñ‘Ñ‚ Ð½Ð°Ñ…Ð¾Ð´ÐºÐ¸, Ð¿Ñ€Ð¸Ð¼ÐµÑ€Ð½ÑƒÑŽ Ð»Ð¾ÐºÐ°Ð»Ð¸Ð·Ð°Ñ†Ð¸ÑŽ Ð¸ Ð¿Ð¾Ð½ÑÑ‚Ð½Ð¾Ðµ Ð¾Ð±ÑŠÑÑÐ½ÐµÐ½Ð¸Ðµ.', target: 'analyze-button', accent: 'ÐÐ½Ð°Ð»Ð¸Ð·' },
      { title: 'ÐŸÐ¾ÑÐ¼Ð¾Ñ‚Ñ€Ð¸Ñ‚Ðµ ÐºÐ°Ñ€Ñ‚Ñƒ Ñ‚Ð¾Ð»ÑÑ‚Ð¾Ð¹ ÐºÐ¸ÑˆÐºÐ¸', body: 'ÐÐ° ÑÐºÑ€Ð°Ð½Ðµ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð¾Ð² ÐºÐ°Ñ€Ñ‚Ð° Ð¾Ñ‚ÐºÑ€Ð¾ÐµÑ‚ÑÑ Ð°Ð²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸. ÐœÐ°Ñ€ÐºÐµÑ€Ñ‹ Ð¿Ñ€Ð¸Ð¼ÐµÑ€Ð½Ð¾ Ð¿Ð¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÑŽÑ‚ Ð°Ð½Ð°Ñ‚Ð¾Ð¼Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð·Ð¾Ð½Ñ‹ Ð½Ð°Ñ…Ð¾Ð´Ð¾Ðº.', target: 'colon-map-card', accent: 'ÐšÐ°Ñ€Ñ‚Ð°' },
      { title: 'Ð§Ð¸Ñ‚Ð°Ð¹Ñ‚Ðµ Ð¸Ð»Ð¸ ÑÐ»ÑƒÑˆÐ°Ð¹Ñ‚Ðµ', body: 'ÐœÐ¾Ð¶Ð½Ð¾ Ñ‡Ð¸Ñ‚Ð°Ñ‚ÑŒ ÐºÐ°Ð¶Ð´ÑƒÑŽ ÐºÐ°Ñ€Ñ‚Ð¾Ñ‡ÐºÑƒ Ð¸Ð»Ð¸ ÑÐ»ÑƒÑˆÐ°Ñ‚ÑŒ Ð¾Ð·Ð²ÑƒÑ‡Ð¸Ð²Ð°Ð½Ð¸Ðµ Ð½Ð° Ð²Ñ‹Ð±Ñ€Ð°Ð½Ð½Ð¾Ð¼ ÑÐ·Ñ‹ÐºÐµ. Ð¢Ð°ÐºÐ¶Ðµ Ð¼Ð¾Ð¶Ð½Ð¾ Ð¿Ñ€Ð¾ÑÐ»ÑƒÑˆÐ°Ñ‚ÑŒ Ð²ÑÐµ Ð½Ð°Ñ…Ð¾Ð´ÐºÐ¸ Ð²Ð¼ÐµÑÑ‚Ðµ.', target: 'listen-all-card', accent: 'Ð“Ð¾Ð»Ð¾Ñ' },
    ],
  },
  zh: {
    open: 'æŒ‡å—',
    close: 'å…³é—­',
    next: 'ä¸‹ä¸€æ­¥',
    previous: 'ä¸Šä¸€æ­¥',
    finish: 'å¼€å§‹',
    listen: 'æ”¶å¬',
    stop: 'åœæ­¢',
    stepLabel: 'æ­¥éª¤',
    title: 'å¦‚ä½•ä½¿ç”¨ ColonReport',
    subtitle: 'åˆ†æžæŠ¥å‘Šå‰ï¼Œè¯·æŒ‰è¿™äº›æ­¥éª¤æ“ä½œã€‚',
    steps: [
      { title: 'å…ˆé€‰æ‹©è¯­è¨€', body: 'è¯·é€‰æ‹©æ‚¨å¸Œæœ›æŽ¥æ”¶è§£é‡Šçš„è¯­è¨€ã€‚å®ƒä¸ä¸€å®šè¦ä¸ŽæŠ¥å‘ŠåŽŸæ–‡è¯­è¨€ç›¸åŒã€‚', target: 'language-strip', accent: 'è¯­è¨€' },
      { title: 'ä¸Šä¼ æŠ¥å‘Š', body: 'æ‚¨å¯ä»¥ä¸Šä¼ ç…§ç‰‡ã€ä½¿ç”¨ç›¸æœºã€é™„åŠ  PDFï¼Œæˆ–ç²˜è´´æ–‡æœ¬ã€‚è¯·ç¡®ä¿æŠ¥å‘Šå®Œæ•´ã€æ¸…æ™°ã€æ— é®æŒ¡å’Œåå…‰ã€‚', target: 'report-input-card', accent: 'æŠ¥å‘Š' },
      { title: 'ç¡®è®¤åŒæ„', body: 'è¯·å‹¾é€‰åŒæ„æ¡†ï¼Œç¡®è®¤æœ¬å·¥å…·ä»…æä¾›ä¿¡æ¯è§£é‡Šï¼Œä¸èƒ½æ›¿ä»£åŒ»ç”Ÿå’¨è¯¢ã€‚', target: 'consent-card', accent: 'åŒæ„' },
      { title: 'åˆ†æžæŠ¥å‘Š', body: 'ç‚¹å‡»åˆ†æžæŠ¥å‘Šã€‚äººå·¥æ™ºèƒ½ä¼šæå–å‘çŽ°ã€è¿‘ä¼¼è§£å‰–ä½ç½®ï¼Œå¹¶ç”Ÿæˆæ¸…æ™°è§£é‡Šã€‚', target: 'analyze-button', accent: 'åˆ†æž' },
      { title: 'æŸ¥çœ‹ç»“è‚ åœ°å›¾', body: 'åœ¨ç»“æžœé¡µé¢ï¼Œç»“è‚ åœ°å›¾ä¼šè‡ªåŠ¨æ‰“å¼€ã€‚æ ‡è®°ä¼šå¤§è‡´æ˜¾ç¤ºå‘çŽ°æ‰€åœ¨çš„è§£å‰–åŒºåŸŸã€‚', target: 'colon-map-card', accent: 'åœ°å›¾' },
      { title: 'é˜…è¯»æˆ–æ”¶å¬', body: 'æ‚¨å¯ä»¥é˜…è¯»æ¯å¼ å¡ç‰‡ï¼Œä¹Ÿå¯ä»¥ç”¨æ‰€é€‰è¯­è¨€æ”¶å¬è®²è§£ã€‚è¿˜å¯ä»¥ä¸€æ¬¡æ”¶å¬æ‰€æœ‰å‘çŽ°ã€‚', target: 'listen-all-card', accent: 'è¯­éŸ³' },
    ],
  },
};

function getGuideCopy(language: Language) {
  return guideText[language] ?? guideText.es!;
}

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const stepBadges = [
  'PASO 1 / First Step',
  'PASO 2 / Second Step',
  'PASO 3 / Third Step',
  'PASO 4 / Fourth Step',
  'PASO 5 / Fifth Step',
  'PASO 6 / Sixth Step',
];

const languageChoices: Array<{ code: Language; short: string; name: string; nativeName: string }> = [
  { code: 'es', short: 'ES', name: 'Español', nativeName: 'Español' },
  { code: 'en', short: 'EN', name: 'English', nativeName: 'English' },
  { code: 'fr', short: 'FR', name: 'Français', nativeName: 'Français' },
  { code: 'it', short: 'IT', name: 'Italiano', nativeName: 'Italiano' },
  { code: 'pt', short: 'PT', name: 'Português', nativeName: 'Português' },
  { code: 'de', short: 'DE', name: 'Deutsch', nativeName: 'Deutsch' },
  { code: 'nl', short: 'NL', name: 'Nederlands', nativeName: 'Nederlands' },
  { code: 'pl', short: 'PL', name: 'Polski', nativeName: 'Polski' },
  { code: 'ro', short: 'RO', name: 'Română', nativeName: 'Română' },
  { code: 'ar', short: 'AR', name: 'العربية', nativeName: 'العربية' },
  { code: 'ru', short: 'RU', name: 'Русский', nativeName: 'Русский' },
  { code: 'zh', short: 'ZH', name: '中文', nativeName: '中文' },
];

const languageIntroText: Record<Language, { eyebrow: string; title: string; body: string; selected: string; change: string; continue: string }> = {
  es: {
    eyebrow: 'Antes de comenzar',
    title: 'Elige tu idioma',
    body: 'Toda la aplicación, el onboarding y la explicación del informe se mostrarán en el idioma seleccionado.',
    selected: 'Idioma seleccionado',
    change: 'Cambiar idioma',
    continue: 'Continuar',
  },
  en: {
    eyebrow: 'Before starting',
    title: 'Choose your language',
    body: 'The app, onboarding, and report explanation will be shown in the selected language.',
    selected: 'Selected language',
    change: 'Change language',
    continue: 'Continue',
  },
  fr: {
    eyebrow: 'Avant de commencer',
    title: 'Choisissez votre langue',
    body: 'L’application, le guide et l’explication du compte rendu s’afficheront dans la langue choisie.',
    selected: 'Langue sélectionnée',
    change: 'Changer de langue',
    continue: 'Continuer',
  },
  it: {
    eyebrow: 'Prima di iniziare',
    title: 'Scegli la lingua',
    body: 'L’applicazione, il percorso guidato e la spiegazione del referto saranno mostrati nella lingua scelta.',
    selected: 'Lingua selezionata',
    change: 'Cambia lingua',
    continue: 'Continua',
  },
  pt: {
    eyebrow: 'Antes de começar',
    title: 'Escolha o idioma',
    body: 'A aplicação, o guia e a explicação do relatório serão apresentados no idioma selecionado.',
    selected: 'Idioma selecionado',
    change: 'Alterar idioma',
    continue: 'Continuar',
  },
  de: {
    eyebrow: 'Vor dem Start',
    title: 'Sprache wählen',
    body: 'App, Einführung und Berichtserklärung werden in der ausgewählten Sprache angezeigt.',
    selected: 'Ausgewählte Sprache',
    change: 'Sprache ändern',
    continue: 'Weiter',
  },
  nl: {
    eyebrow: 'Voor het starten',
    title: 'Kies uw taal',
    body: 'De app, onboarding en uitleg van het rapport worden in de gekozen taal getoond.',
    selected: 'Gekozen taal',
    change: 'Taal wijzigen',
    continue: 'Doorgaan',
  },
  pl: {
    eyebrow: 'Przed rozpoczęciem',
    title: 'Wybierz język',
    body: 'Aplikacja, przewodnik i wyjaśnienie raportu będą pokazane w wybranym języku.',
    selected: 'Wybrany język',
    change: 'Zmień język',
    continue: 'Dalej',
  },
  ro: {
    eyebrow: 'Înainte de start',
    title: 'Alegeți limba',
    body: 'Aplicația, ghidul și explicația raportului vor fi afișate în limba selectată.',
    selected: 'Limba selectată',
    change: 'Schimbați limba',
    continue: 'Continuați',
  },
  ar: {
    eyebrow: 'قبل البدء',
    title: 'اختر لغتك',
    body: 'سيتم عرض التطبيق والدليل وشرح التقرير باللغة المختارة.',
    selected: 'اللغة المختارة',
    change: 'تغيير اللغة',
    continue: 'متابعة',
  },
  ru: {
    eyebrow: 'Перед началом',
    title: 'Выберите язык',
    body: 'Приложение, обучение и объяснение отчета будут показаны на выбранном языке.',
    selected: 'Выбранный язык',
    change: 'Изменить язык',
    continue: 'Продолжить',
  },
  zh: {
    eyebrow: '开始之前',
    title: '选择语言',
    body: '应用、引导流程和报告解释都会以所选语言显示。',
    selected: '已选语言',
    change: '更改语言',
    continue: '继续',
  },
};

function getWheelPosition(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const radius = 42;
  return {
    left: `${50 + Math.cos(angle) * radius}%`,
    top: `${50 + Math.sin(angle) * radius}%`,
  };
}

export default function OnboardingGuide({ language, onLanguageChange, hasResult }: OnboardingGuideProps) {
  const copy = getGuideCopy(language);
  const [isOpen, setIsOpen] = useState(true);
  const [hasChosenLanguage, setHasChosenLanguage] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoRunning, setIsAutoRunning] = useState(true);
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null);
  const [cardStyle, setCardStyle] = useState<CSSProperties>({});

  const steps = copy.steps;
  const step = steps[currentStep];
  const targetId = step.target;
  const isLastStep = currentStep === steps.length - 1;
  const currentBadge = stepBadges[currentStep] ?? `PASO ${currentStep + 1} / Step ${currentStep + 1}`;
  const selectedLanguageIndex = Math.max(0, languageChoices.findIndex((item) => item.code === language));
  const selectedLanguage = languageChoices[selectedLanguageIndex] ?? languageChoices[0];
  const introCopy = languageIntroText[language] ?? languageIntroText.es;

  useEffect(() => {
    if (!isOpen || !hasChosenLanguage) return;
    const target = targetId ? document.getElementById(targetId) : null;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const measureStep = () => {
      const activeTarget = targetId ? document.getElementById(targetId) : null;
      if (!activeTarget) {
        setSpotlightRect(null);
        setCardStyle({ left: '50%', bottom: 24, transform: 'translateX(-50%)' });
        return;
      }

      const rect = activeTarget.getBoundingClientRect();
      const padding = 10;
      const nextRect = {
        top: clamp(rect.top - padding, 8, window.innerHeight - 32),
        left: clamp(rect.left - padding, 8, window.innerWidth - 32),
        width: Math.min(rect.width + padding * 2, window.innerWidth - 16),
        height: Math.min(rect.height + padding * 2, window.innerHeight - 16),
      };

      setSpotlightRect(nextRect);

      const cardWidth = Math.min(460, window.innerWidth - 24);
      const left = clamp(nextRect.left + nextRect.width / 2 - cardWidth / 2, 12, window.innerWidth - cardWidth - 12);
      const spaceBelow = window.innerHeight - (nextRect.top + nextRect.height);
      const top = spaceBelow > 290
        ? nextRect.top + nextRect.height + 16
        : Math.max(12, nextRect.top - 290);

      setCardStyle({ left, top, width: cardWidth });
    };

    const measureTimer = window.setTimeout(measureStep, 280);
    window.addEventListener('resize', measureStep);
    window.addEventListener('scroll', measureStep, true);

    return () => {
      window.clearTimeout(measureTimer);
      window.removeEventListener('resize', measureStep);
      window.removeEventListener('scroll', measureStep, true);
    };
  }, [hasChosenLanguage, isOpen, targetId]);

  useEffect(() => {
    if (!isOpen || !hasChosenLanguage || !isAutoRunning || isLastStep) return;

    const advanceTimer = window.setTimeout(() => {
      if (currentStep >= steps.length - 2) {
        setIsAutoRunning(false);
      }
      setCurrentStep((stepIndex) => Math.min(stepIndex + 1, steps.length - 1));
    }, 9500);

    return () => window.clearTimeout(advanceTimer);
  }, [currentStep, hasChosenLanguage, isAutoRunning, isLastStep, isOpen, steps.length]);

  const closeGuide = () => {
    setIsOpen(false);
  };

  const openGuide = () => {
    setHasChosenLanguage(false);
    setCurrentStep(0);
    setIsAutoRunning(true);
    setIsOpen(true);
  };

  const startGuidedTour = () => {
    setCurrentStep(0);
    setIsAutoRunning(true);
    setHasChosenLanguage(true);
  };

  const nextStep = () => {
    if (isLastStep) {
      setIsAutoRunning(false);
      setIsOpen(false);
    } else {
      if (currentStep >= steps.length - 2) {
        setIsAutoRunning(false);
      }
      setCurrentStep((stepIndex) => stepIndex + 1);
    }
  };

  const previousStep = () => {
    setCurrentStep((stepIndex) => Math.max(0, stepIndex - 1));
  };

  const toggleAutoRun = () => {
    if (isAutoRunning) {
      setIsAutoRunning(false);
      return;
    }

    setCurrentStep(0);
    setIsAutoRunning(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={openGuide}
        className="fixed bottom-4 right-4 z-[60] inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/95 px-4 py-2 text-sm font-semibold text-blue-700 shadow-lg shadow-slate-900/10 backdrop-blur transition hover:bg-blue-50 dark:border-blue-800 dark:bg-slate-900/95 dark:text-blue-300"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253" />
        </svg>
        {copy.open}
      </button>

      {isOpen && !hasChosenLanguage && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/65 px-4 py-6 backdrop-blur-[4px]">
          <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 shadow-2xl">
            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="flex flex-col justify-center border-b border-slate-800 p-6 text-white lg:border-b-0 lg:border-r lg:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-300">{introCopy.eyebrow}</p>
                <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{introCopy.title}</h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-slate-300">{introCopy.body}</p>

                <div className="mt-6 rounded-2xl border border-blue-500/40 bg-blue-500/10 p-4">
                  <p className="text-sm font-semibold text-blue-200">{introCopy.selected}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="rounded-xl bg-blue-600 px-3 py-2 text-xl font-black text-white">{selectedLanguage.short}</span>
                    <span className="text-2xl font-bold text-white">{selectedLanguage.nativeName}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={startGuidedTour}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-5 py-4 text-lg font-bold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 sm:w-auto"
                >
                  {introCopy.continue}
                </button>
              </div>

              <div className="relative min-h-[520px] overflow-hidden bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.22),_rgba(15,23,42,0)_60%)] p-5 sm:p-8">
                <div
                  className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90 transition-transform duration-700 sm:h-[450px] sm:w-[450px]"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${-selectedLanguageIndex * 30}deg)`,
                    background: 'conic-gradient(from -15deg, rgba(37,99,235,0.95) 0deg 30deg, rgba(30,41,59,0.86) 30deg 60deg, rgba(15,23,42,0.78) 60deg 90deg, rgba(30,41,59,0.86) 90deg 120deg, rgba(15,23,42,0.78) 120deg 150deg, rgba(30,41,59,0.86) 150deg 180deg, rgba(15,23,42,0.78) 180deg 210deg, rgba(30,41,59,0.86) 210deg 240deg, rgba(15,23,42,0.78) 240deg 270deg, rgba(30,41,59,0.86) 270deg 300deg, rgba(15,23,42,0.78) 300deg 330deg, rgba(30,41,59,0.86) 330deg 360deg)',
                  }}
                />
                <div className="absolute left-1/2 top-1/2 h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-700 bg-slate-950/95 shadow-2xl sm:h-[260px] sm:w-[260px]" />

                <div className="absolute inset-0">
                  {languageChoices.map((item, index) => {
                    const active = item.code === language;
                    const position = getWheelPosition(index, languageChoices.length);

                    return (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => onLanguageChange(item.code)}
                        className={`absolute flex h-20 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl border text-center transition-all duration-300 sm:h-24 sm:w-32 ${
                          active
                            ? 'scale-110 border-blue-200 bg-blue-600 text-white shadow-xl shadow-blue-950/40'
                            : 'border-slate-600 bg-slate-900/85 text-slate-300 hover:border-blue-400 hover:bg-slate-800 hover:text-white'
                        }`}
                        style={position}
                        aria-pressed={active}
                      >
                        <span className="text-xl font-black sm:text-2xl">{item.short}</span>
                        <span className="mt-1 text-[11px] font-bold sm:text-sm">{item.nativeName}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-blue-500/50 bg-slate-950 text-center text-white shadow-lg sm:h-44 sm:w-44">
                  <span className="text-4xl font-black text-blue-300 sm:text-5xl">{selectedLanguage.short}</span>
                  <span className="mt-2 px-3 text-sm font-bold sm:text-base">{selectedLanguage.nativeName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isOpen && hasChosenLanguage && (
        <div className="fixed inset-0 z-[70] pointer-events-none">
          {spotlightRect ? (
            <>
              <div className="absolute left-0 right-0 top-0 bg-slate-950/55 backdrop-blur-[3px]" style={{ height: spotlightRect.top }} />
              <div className="absolute left-0 bg-slate-950/55 backdrop-blur-[3px]" style={{ top: spotlightRect.top, width: spotlightRect.left, height: spotlightRect.height }} />
              <div className="absolute bg-slate-950/55 backdrop-blur-[3px]" style={{ top: spotlightRect.top, left: spotlightRect.left + spotlightRect.width, right: 0, height: spotlightRect.height }} />
              <div className="absolute left-0 right-0 bottom-0 bg-slate-950/55 backdrop-blur-[3px]" style={{ top: spotlightRect.top + spotlightRect.height }} />
              <div
                className="absolute rounded-2xl border-2 border-blue-400 shadow-[0_0_0_9999px_rgba(15,23,42,0.02),0_0_32px_rgba(59,130,246,0.8)]"
                style={spotlightRect}
              />
              <div
                className="absolute rounded-full border border-blue-200 bg-blue-600 px-3 py-1 text-[11px] font-bold tracking-[0.08em] text-white shadow-lg shadow-blue-950/30"
                style={{
                  top: Math.max(8, spotlightRect.top - 34),
                  left: Math.max(8, spotlightRect.left),
                  maxWidth: 'calc(100vw - 16px)',
                }}
              >
                {currentBadge}
              </div>
            </>
          ) : (
            <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-[3px]" />
          )}

          <div
            className="pointer-events-auto fixed max-h-[calc(100vh-24px)] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-950"
            style={cardStyle}
          >
            <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
                    {copy.stepLabel} {currentStep + 1} / {steps.length} · {step.accent}
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{step.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={closeGuide}
                  className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                  aria-label={copy.close}
                  title={copy.close}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-4 py-4">
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{step.body}</p>

              {currentStep === 0 && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="rounded-xl bg-blue-600 px-3 py-2 text-lg font-black text-white">{selectedLanguage.short}</span>
                      <span className="text-base font-bold text-slate-900 dark:text-slate-100">{selectedLanguage.nativeName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAutoRunning(false);
                        setHasChosenLanguage(false);
                      }}
                      className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/40"
                    >
                      {introCopy.change}
                    </button>
                  </div>
                </div>
              )}

              {currentStep >= 4 && !hasResult && (
                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                  Este paso aparecerá en la pantalla de resultados después de analizar un informe.
                </p>
              )}

              <div className="mt-4 grid grid-cols-6 gap-1.5">
                {steps.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => {
                      if (index === steps.length - 1) {
                        setIsAutoRunning(false);
                      }
                      setCurrentStep(index);
                    }}
                    className={`h-1.5 rounded-full transition ${
                      index === currentStep ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                    aria-label={`${copy.stepLabel} ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleAutoRun}
                  className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-2 text-xs font-semibold transition ${
                    isAutoRunning
                      ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                      : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                  }`}
                  title={isAutoRunning ? 'Pausar autorun' : 'Repetir desde el primer paso'}
                >
                  {isAutoRunning ? 'Pausar' : 'Repetir'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={previousStep}
                  disabled={currentStep === 0}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  {copy.previous}
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {isLastStep ? copy.finish : copy.next}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
