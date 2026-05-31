import {
  POST_DDS_QUESTIONS,
  POST_DDS_SCALE,
  POST_PHQ_QUESTIONS,
  POST_PHQ_SCALE,
  POST_STAMPLEY_QUESTIONS,
  POST_SUS_QUESTIONS,
  POST_LIKERT_5_SCALE,
} from "@/lib/post-survey-constants"

export type PostSurveyResponseRecord = {
  dds_answers?: unknown
  dds_scores?: unknown
  phq_answers?: unknown
  phq_total?: number | null
  phq_severity?: string | null
  sus_answers?: unknown
  sus_score?: number | null
  stampley_feedback?: unknown
  open_reflection?: string | null
  future_research_contact?: boolean | null
  contact_name?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  completed_at?: string | Date | null
}

export function asJsonObject(value: unknown): Record<string, unknown> | null {
  if (value == null) return null
  if (typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>
      }
    } catch {
      return null
    }
  }
  return null
}

export function formatPostSurveyScore(value: unknown): string {
  if (value == null || value === "") return "—"
  const n = Number(value)
  return Number.isFinite(n) ? n.toFixed(2) : "—"
}

export function formatPostSurveyNumber(value: unknown): string {
  if (value == null || value === "") return "—"
  const n = Number(value)
  return Number.isFinite(n) ? String(n) : "—"
}

export function getDdsTotal(scores: Record<string, unknown> | null): string {
  return formatPostSurveyScore(scores?.total)
}

export function getDdsDomainScores(scores: Record<string, unknown> | null) {
  return {
    emotional: formatPostSurveyScore(scores?.emotional),
    physician: formatPostSurveyScore(scores?.physician),
    regimen: formatPostSurveyScore(scores?.regimen),
    interpersonal: formatPostSurveyScore(scores?.interpersonal),
  }
}

function labelForValue(
  value: unknown,
  scale: readonly { value: number; label: string }[]
): string {
  if (value == null || value === "") return "—"
  const n = Number(value)
  if (!Number.isFinite(n)) return "—"
  return scale.find((option) => option.value === n)?.label ?? String(n)
}

function formatContactYesNo(value: boolean | null | undefined): string {
  if (value === null || value === undefined) return "—"
  return value ? "Yes" : "No"
}

function formatText(value: string | null | undefined): string {
  if (value == null || value.trim() === "") return "Not provided"
  return value
}

export function PostSurveyResponseDetails({
  record,
  summaryLabel = "View full response",
}: {
  record: PostSurveyResponseRecord
  summaryLabel?: string
}) {
  const ddsAnswers = asJsonObject(record.dds_answers)
  const ddsScores = asJsonObject(record.dds_scores)
  const phqAnswers = asJsonObject(record.phq_answers)
  const susAnswers = asJsonObject(record.sus_answers)
  const stampleyFeedback = asJsonObject(record.stampley_feedback)

  return (
    <details className="group">
      <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-[0.08em] text-[#005ea8] hover:underline [&::-webkit-details-marker]:hidden">
        {summaryLabel}
      </summary>

      <div className="mt-3 space-y-4 min-w-[320px]">
        <DetailBlock title="DDS-17 Answers & Scores">
          <div className="mb-3 grid gap-2 sm:grid-cols-2">
            <ScorePill label="Total" value={getDdsTotal(ddsScores)} />
            <ScorePill
              label="Emotional"
              value={formatPostSurveyScore(ddsScores?.emotional)}
            />
            <ScorePill
              label="Physician"
              value={formatPostSurveyScore(ddsScores?.physician)}
            />
            <ScorePill
              label="Regimen"
              value={formatPostSurveyScore(ddsScores?.regimen)}
            />
            <ScorePill
              label="Interpersonal"
              value={formatPostSurveyScore(ddsScores?.interpersonal)}
            />
          </div>
          <ItemTable
            headers={["#", "Question", "Score", "Label"]}
            rows={POST_DDS_QUESTIONS.map((question, index) => {
              const value = ddsAnswers?.[question.id]
              return [
                String(index + 1),
                question.text,
                formatPostSurveyNumber(value),
                labelForValue(value, POST_DDS_SCALE),
              ]
            })}
          />
        </DetailBlock>

        <DetailBlock title="PHQ-9 Answers">
          <div className="mb-3 flex flex-wrap gap-2">
            <ScorePill
              label="PHQ Total"
              value={formatPostSurveyNumber(record.phq_total)}
            />
            <ScorePill
              label="Severity"
              value={record.phq_severity ?? "—"}
            />
          </div>
          <ItemTable
            headers={["#", "Question", "Score", "Label"]}
            rows={POST_PHQ_QUESTIONS.map((question, index) => {
              const key = `phq${index + 1}`
              const value = phqAnswers?.[key]
              return [
                String(index + 1),
                question,
                formatPostSurveyNumber(value),
                labelForValue(value, POST_PHQ_SCALE),
              ]
            })}
          />
        </DetailBlock>

        <DetailBlock title="System Usability Scale (SUS)">
          <div className="mb-3">
            <ScorePill
              label="SUS Score"
              value={formatPostSurveyScore(record.sus_score)}
            />
          </div>
          <ItemTable
            headers={["#", "Statement", "Score", "Label"]}
            rows={POST_SUS_QUESTIONS.map((question, index) => {
              const key = `sus${index + 1}`
              const value = susAnswers?.[key]
              return [
                String(index + 1),
                question,
                formatPostSurveyNumber(value),
                labelForValue(value, POST_LIKERT_5_SCALE),
              ]
            })}
          />
        </DetailBlock>

        <DetailBlock title="Stampley Experience">
          <ItemTable
            headers={["#", "Statement", "Score", "Label"]}
            rows={POST_STAMPLEY_QUESTIONS.map((question, index) => {
              const key = `se${index + 1}`
              const value = stampleyFeedback?.[key]
              return [
                String(index + 1),
                question,
                formatPostSurveyNumber(value),
                labelForValue(value, POST_LIKERT_5_SCALE),
              ]
            })}
          />
        </DetailBlock>

        <DetailBlock title="Open Reflection">
          <p className="text-sm leading-6 text-slate-700 whitespace-pre-wrap">
            {formatText(record.open_reflection)}
          </p>
        </DetailBlock>

        <DetailBlock title="Future Research Contact">
          <div className="grid gap-2 text-sm text-slate-700">
            <p>
              <span className="font-medium text-slate-900">Interested:</span>{" "}
              {formatContactYesNo(record.future_research_contact)}
            </p>
            <p>
              <span className="font-medium text-slate-900">Name:</span>{" "}
              {formatText(record.contact_name)}
            </p>
            <p>
              <span className="font-medium text-slate-900">Email:</span>{" "}
              {formatText(record.contact_email)}
            </p>
            <p>
              <span className="font-medium text-slate-900">Phone:</span>{" "}
              {formatText(record.contact_phone)}
            </p>
          </div>
        </DetailBlock>
      </div>
    </details>
  )
}

function DetailBlock({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
        {title}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function ScorePill({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex border border-slate-200 bg-white px-3 py-1.5 text-xs">
      <span className="font-medium text-slate-500">{label}:</span>
      <span className="ml-1.5 font-semibold text-slate-900">{value}</span>
    </div>
  )
}

function ItemTable({
  headers,
  rows,
}: {
  headers: string[]
  rows: string[][]
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            {headers.map((header) => (
              <th key={header} className="pb-2 pr-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-slate-100 last:border-b-0">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`py-1.5 pr-3 ${
                    cellIndex === 0
                      ? "font-medium text-slate-800"
                      : cellIndex === 1
                        ? "text-slate-700"
                        : "text-slate-900"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function PostSurveySummaryCards({
  record,
}: {
  record: PostSurveyResponseRecord
}) {
  const ddsScores = asJsonObject(record.dds_scores)
  const domains = getDdsDomainScores(ddsScores)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <SummaryCard label="DDS Total" value={getDdsTotal(ddsScores)} />
      <SummaryCard label="PHQ Total" value={formatPostSurveyNumber(record.phq_total)} />
      <SummaryCard label="PHQ Severity" value={record.phq_severity ?? "—"} />
      <SummaryCard label="SUS Score" value={formatPostSurveyScore(record.sus_score)} />
      <SummaryCard label="Emotional" value={domains.emotional} />
      <SummaryCard label="Physician" value={domains.physician} />
      <SummaryCard label="Regimen" value={domains.regimen} />
      <SummaryCard label="Interpersonal" value={domains.interpersonal} />
      <SummaryCard
        label="Future Contact"
        value={
          record.future_research_contact === null ||
          record.future_research_contact === undefined
            ? "—"
            : record.future_research_contact
              ? "Yes"
              : "No"
        }
      />
      <SummaryCard
        label="Submitted"
        value={
          record.completed_at
            ? new Date(record.completed_at).toLocaleString()
            : "—"
        }
      />
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-slate-100 bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  )
}
