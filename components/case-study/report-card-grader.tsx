"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { formatScore, score } from "@/lib/grading/engine";
import { INPUT_FIELDS } from "@/lib/grading/inputs";
import { PRESETS } from "@/lib/grading/presets";
import type { GradingInputs, NetworkType, Rubric } from "@/lib/grading/rubric";

const NETWORKS: { id: NetworkType; label: string }[] = [
  { id: "mobile", label: "Mobile" },
  { id: "fixed", label: "Fixed broadband" },
];

const START = PRESETS.find((p) => p.id === "middling")!;

function formatValue(value: number, step: number): string {
  return step < 1 ? value.toFixed(step < 0.1 ? 2 : 1) : String(value);
}

/**
 * The Report Card grader (spec.md module 3): a display over the grading
 * engine, with no scoring logic of its own. It is handed the active rubric as
 * a prop, so only the definition the content switch names is ever bundled.
 */
export function ReportCardGrader({ rubric }: { rubric: Rubric }) {
  const [network, setNetwork] = useState<NetworkType>("mobile");
  const [inputs, setInputs] = useState<GradingInputs>(START.inputs);
  const [presetId, setPresetId] = useState<string | null>(START.id);

  const result = score(rubric, network, inputs);
  const preset = PRESETS.find((p) => p.id === presetId);
  const networkLabel = NETWORKS.find((n) => n.id === network)!.label;

  return (
    <div className="grader">
      <p className="gr-note">
        <b>Illustrative Data.</b> The telcos and figures here are made up; no
        real provider&rsquo;s result appears. {rubric.demoSimplifications[0]}{" "}
        {rubric.demoSimplifications[1]}
      </p>

      <div className="gr-group">
        <p className="gr-label" id="gr-network-label">
          Network
        </p>
        <ToggleGroup
          aria-labelledby="gr-network-label"
          value={[network]}
          onValueChange={(value) => {
            if (value[0]) setNetwork(value[0] as NetworkType);
          }}
        >
          {NETWORKS.map((n) => (
            <ToggleGroupItem key={n.id} value={n.id}>
              {n.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="gr-group">
        <p className="gr-label" id="gr-preset-label">
          Presets
        </p>
        <ToggleGroup
          aria-labelledby="gr-preset-label"
          value={presetId ? [presetId] : []}
          onValueChange={(value) => {
            const chosen = PRESETS.find((p) => p.id === value[0]);
            if (!chosen) return;
            setInputs(chosen.inputs);
            setPresetId(chosen.id);
          }}
        >
          {PRESETS.map((p) => (
            <ToggleGroupItem key={p.id} value={p.id}>
              {p.role}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <figure className="rc">
        <figcaption className="rc-head">
          <b>Report Card</b>
          <span>Illustrative Data</span>
        </figcaption>
        <dl className="rc-who">
          <div>
            <dt>Provider</dt>
            <dd>{preset ? preset.name : "Your telco"} (fictional)</dd>
          </div>
          <div>
            <dt>Network</dt>
            <dd>{networkLabel}</dd>
          </div>
          <div>
            <dt>Method</dt>
            <dd>{rubric.versionLabel}</dd>
          </div>
        </dl>
        <ul className="rc-pillars">
          {result.pillars.map((pillar) => (
            <li key={pillar.name}>
              <span className="name">
                {pillar.name} <small>{pillar.weight}%</small>
              </span>
              <span className="num">{formatScore(pillar.score)}</span>
              <span className="bar" aria-hidden="true">
                <i style={{ width: `${pillar.score}%` }} />
              </span>
            </li>
          ))}
        </ul>
        <div className="rc-verdict" aria-live="polite" aria-atomic="true">
          <span className="sr-only">Grade </span>
          <span className="letter">{result.grade.letter}</span>
          <span className="label">{result.grade.label}</span>
          <span className="overall">
            <span className="sr-only">, overall score </span>
            {formatScore(result.overall)}
            <small> / 100</small>
          </span>
        </div>
      </figure>

      <div className="gr-group" role="group" aria-labelledby="gr-inputs-label">
        <p className="gr-label" id="gr-inputs-label">
          Inputs
        </p>
        <ul className="gr-sliders">
          {INPUT_FIELDS.map((field) => (
            <li key={field.input}>
              <div className="gr-slider-head">
                <span>{field.label}</span>
                <span className="value">
                  {formatValue(inputs[field.input], field.step)}{" "}
                  <small>{field.unit}</small>
                </span>
              </div>
              <Slider
                label={field.label}
                valueText={(value) =>
                  `${formatValue(value, field.step)} ${field.unit}`
                }
                min={field.min}
                max={field.max}
                step={field.step}
                value={inputs[field.input]}
                onValueChange={(value) => {
                  setInputs((current) => ({ ...current, [field.input]: value }));
                  setPresetId(null);
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
