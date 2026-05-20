'use client';

import { useMemo, useState } from 'react';
import { ColonSegment, Language } from '@/lib/types';
import { getTranslations } from '@/lib/translations';

interface ColonDiagramProps {
  highlightedSegments: ColonSegment[];
  language: Language;
  findingsBySegment: Record<ColonSegment, string[]>;
  onSegmentClick?: (segment: ColonSegment) => void;
}

type AnatomicalSegment = Exclude<ColonSegment, 'multiple' | 'unspecified'>;

const COLON_MAP_URL = '/models/colon-map.png';

const allSegments: AnatomicalSegment[] = [
  'terminal_ileum',
  'cecum',
  'ascending_colon',
  'hepatic_flexure',
  'transverse_colon',
  'splenic_flexure',
  'descending_colon',
  'sigmoid_colon',
  'rectum',
  'anal_canal',
];

const markerPositions: Record<AnatomicalSegment, { left: number; top: number }> = {
  terminal_ileum: { left: 43, top: 59 },
  cecum: { left: 40, top: 62 },
  ascending_colon: { left: 40, top: 47 },
  hepatic_flexure: { left: 43, top: 32 },
  transverse_colon: { left: 52, top: 30 },
  splenic_flexure: { left: 63, top: 32 },
  descending_colon: { left: 65, top: 48 },
  sigmoid_colon: { left: 60, top: 66 },
  rectum: { left: 51, top: 76 },
  anal_canal: { left: 49, top: 84 },
};

const uiText: Record<Language, { normal: string; withFinding: string; number: string; empty: string; tap: string; loading: string; fixed: string }> = {
  es: {
    normal: 'Sin hallazgos',
    withFinding: 'Con hallazgo',
    number: 'Hallazgo #',
    empty: 'No hay hallazgos en este segmento',
    tap: 'Toca un marcador para ver su tarjeta',
    loading: 'Cargando mapa anatómico...',
    fixed: 'Mapa anatómico fijo',
  },
  en: {
    normal: 'No findings',
    withFinding: 'With finding',
    number: 'Finding #',
    empty: 'No findings in this segment',
    tap: 'Tap a marker to view its card',
    loading: 'Loading anatomical map...',
    fixed: 'Fixed anatomical map',
  },
  fr: {
    normal: 'Sans resultat',
    withFinding: 'Avec resultat',
    number: 'Resultat #',
    empty: 'Aucun resultat dans ce segment',
    tap: 'Touchez un marqueur pour voir sa carte',
    loading: 'Chargement de la carte anatomique...',
    fixed: 'Carte anatomique fixe',
  },
  it: {
    normal: 'Senza reperti',
    withFinding: 'Con reperto',
    number: 'Reperto #',
    empty: 'Nessun reperto in questo segmento',
    tap: 'Tocca un marcatore per vedere la scheda',
    loading: 'Caricamento mappa anatomica...',
    fixed: 'Mappa anatomica fissa',
  },
  pt: {
    normal: 'Sem achados',
    withFinding: 'Com achado',
    number: 'Achado #',
    empty: 'Sem achados neste segmento',
    tap: 'Toque num marcador para ver o cartao',
    loading: 'A carregar mapa anatomico...',
    fixed: 'Mapa anatomico fixo',
  },
  de: {
    normal: 'Ohne Befund',
    withFinding: 'Mit Befund',
    number: 'Befund #',
    empty: 'Keine Befunde in diesem Segment',
    tap: 'Tippen Sie auf einen Marker, um die Karte zu sehen',
    loading: 'Anatomische Karte wird geladen...',
    fixed: 'Feste anatomische Karte',
  },
  nl: {
    normal: 'Geen bevindingen',
    withFinding: 'Met bevinding',
    number: 'Bevinding #',
    empty: 'Geen bevindingen in dit segment',
    tap: 'Tik op een markering om de kaart te bekijken',
    loading: 'Anatomische kaart laden...',
    fixed: 'Vaste anatomische kaart',
  },
  pl: {
    normal: 'Bez zmian',
    withFinding: 'Ze znaleziskiem',
    number: 'Znalezisko #',
    empty: 'Brak znalezisk w tym odcinku',
    tap: 'Dotknij znacznika, aby zobaczyc karte',
    loading: 'Ladowanie mapy anatomicznej...',
    fixed: 'Stala mapa anatomiczna',
  },
  ro: {
    normal: 'Fara constatari',
    withFinding: 'Cu constatare',
    number: 'Constatare #',
    empty: 'Nu exista constatari in acest segment',
    tap: 'Atingeti un marker pentru a vedea cardul',
    loading: 'Se incarca harta anatomica...',
    fixed: 'Harta anatomica fixa',
  },
  ar: {
    normal: 'No findings',
    withFinding: 'With finding',
    number: 'Finding #',
    empty: 'No findings in this segment',
    tap: 'Tap a marker to view its card',
    loading: 'Loading anatomical map...',
    fixed: 'Fixed anatomical map',
  },
  ru: {
    normal: 'No findings',
    withFinding: 'With finding',
    number: 'Finding #',
    empty: 'No findings in this segment',
    tap: 'Tap a marker to view its card',
    loading: 'Loading anatomical map...',
    fixed: 'Fixed anatomical map',
  },
  zh: {
    normal: 'No findings',
    withFinding: 'With finding',
    number: 'Finding #',
    empty: 'No findings in this segment',
    tap: 'Tap a marker to view its card',
    loading: 'Loading anatomical map...',
    fixed: 'Fixed anatomical map',
  },
};

function getSegmentHasFindings(segment: ColonSegment, findingsBySegment: Record<ColonSegment, string[]>) {
  return findingsBySegment[segment]?.length > 0;
}

export default function ColonDiagram({
  highlightedSegments,
  language,
  findingsBySegment,
  onSegmentClick,
}: ColonDiagramProps) {
  const t = getTranslations(language);
  const labels = uiText[language] ?? uiText.es;
  const [hoveredSegment, setHoveredSegment] = useState<ColonSegment | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);

  const segmentsWithFindings = useMemo(
    () => allSegments.filter((seg) => getSegmentHasFindings(seg, findingsBySegment)),
    [findingsBySegment],
  );

  const findingIndexMap = useMemo(() => {
    const map: Partial<Record<ColonSegment, number>> = {};
    segmentsWithFindings.forEach((seg, i) => {
      map[seg] = i + 1;
    });
    return map;
  }, [segmentsWithFindings]);

  const activeSegment = hoveredSegment ?? segmentsWithFindings[0] ?? null;
  const activeFindings = activeSegment ? findingsBySegment[activeSegment] ?? [] : [];

  return (
    <div className="glass-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="section-title text-lg">{t.colonDiagramTitle}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{labels.tap}</p>
        </div>
        {segmentsWithFindings.length > 0 && (
          <span className="rounded-full bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
            {segmentsWithFindings.length}
          </span>
        )}
      </div>

      <div className="relative w-full mx-auto overflow-hidden rounded-2xl border border-slate-100 bg-slate-950 dark:border-slate-800">
        <div className="relative aspect-[16/9] w-full">
          <img
            src={COLON_MAP_URL}
            alt={t.colonDiagramTitle}
            className="absolute inset-0 h-full w-full object-contain"
            onLoad={() => setIsMapLoading(false)}
          />

          <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/20 bg-slate-950/70 px-2.5 py-1 text-[11px] font-semibold text-slate-100 shadow-sm backdrop-blur">
            {labels.fixed}
          </div>

          {isMapLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-xs font-semibold text-slate-300">
              {labels.loading}
            </div>
          )}

          {segmentsWithFindings.map((seg) => {
            const num = findingIndexMap[seg];
            const isActive = hoveredSegment === seg || highlightedSegments.includes(seg);

            return (
              <button
                key={`marker-${seg}`}
                data-testid={`lesion-marker-${seg}`}
                type="button"
                onMouseEnter={() => setHoveredSegment(seg)}
                onMouseLeave={() => setHoveredSegment(null)}
                onFocus={() => setHoveredSegment(seg)}
                onBlur={() => setHoveredSegment(null)}
                onClick={() => onSegmentClick?.(seg)}
                style={{
                  left: `${markerPositions[seg].left}%`,
                  top: `${markerPositions[seg].top}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-black text-white shadow-lg transition-[box-shadow,background-color,transform] ${
                  isActive ? 'bg-blue-700 shadow-blue-500/40' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                aria-label={`${t.colonSegments[seg]}: ${findingsBySegment[seg]?.join(', ') || labels.empty}`}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 text-xs text-slate-600 dark:text-slate-300 sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-200 border border-rose-300" />
          <span>{labels.normal}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-blue-500 border border-blue-700" />
          <span>{labels.withFinding}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-700 text-[10px] font-bold text-white">1</span>
          <span>{labels.number}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {allSegments.map((seg) => {
          const hasFindings = findingsBySegment[seg]?.length > 0;
          const isActive = hoveredSegment === seg || highlightedSegments.includes(seg);

          return (
            <button
              key={seg}
              data-testid={`segment-button-${seg}`}
              type="button"
              onMouseEnter={() => setHoveredSegment(seg)}
              onMouseLeave={() => setHoveredSegment(null)}
              onFocus={() => setHoveredSegment(seg)}
              onBlur={() => setHoveredSegment(null)}
              onClick={() => {
                if (hasFindings) onSegmentClick?.(seg);
              }}
              disabled={!hasFindings}
              className={`min-h-10 rounded-lg border px-2 py-1.5 text-left text-[11px] font-semibold transition ${
                hasFindings
                  ? isActive
                    ? 'border-blue-300 bg-blue-50 text-blue-800 shadow-sm dark:border-blue-700 dark:bg-blue-950/50 dark:text-blue-200'
                    : 'border-blue-100 bg-white text-blue-700 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-900 dark:bg-slate-900/70 dark:text-blue-300'
                  : 'border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-600'
              }`}
              aria-label={`${t.colonSegments[seg]}: ${hasFindings ? findingsBySegment[seg].join(', ') : labels.empty}`}
            >
              {t.colonSegments[seg]}
            </button>
          );
        })}
      </div>

      {activeSegment && (
        <div className="rounded-lg border border-blue-100 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 px-3 py-2 text-xs text-slate-700 dark:text-slate-300">
          <span className="font-semibold text-blue-800 dark:text-blue-300">{t.colonSegments[activeSegment]}: </span>
          {activeFindings.length > 0 ? activeFindings.join(', ') : labels.empty}
        </div>
      )}
    </div>
  );
}
