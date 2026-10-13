import { ExternalLink } from "lucide-react";
import { SPECIES_PROFILES } from "../data/speciesProfiles";

export default function SpeciesDossier({ id }: { id: string }) {
  const profile = SPECIES_PROFILES[id];
  if (!profile) return null;
  return (
    <section className="species-dossier" aria-label="完整物种档案">
      <h3>完整物种档案</h3>
      <p className="dossier-taxonomy">
        {profile.group} · {profile.family}
      </p>
      {[
        ["栖息环境", profile.habitat],
        ["食性与生活习性", profile.behavior],
        ["发现与命名", profile.discovery],
        ["化石证据与不确定性", profile.evidence],
        ["影视游戏与科学", profile.mediaNote],
      ].map(([title, body]) => (
        <details key={`${id}-${title}`}>
          <summary>{title}</summary>
          <p>{body}</p>
        </details>
      ))}
      <div className="dossier-sources">
        <h4>查阅资料</h4>
        {profile.sources.map((source) => (
          <a
            key={source.url}
            href={source.url}
            target="_blank"
            rel="noreferrer"
          >
            {source.title}
            <ExternalLink size={12} />
          </a>
        ))}
      </div>
      <p className="small-note">
        文字为中文科普整理；化石发现地用现代地名表示，模型外观为艺术复原。
      </p>
    </section>
  );
}
