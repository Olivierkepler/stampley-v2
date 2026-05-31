"use client"

type ScaleOption = {
  value: number
  label: string
}

type MatrixRow = {
  id: string
  text: string
}

export default function MatrixRadioTable({
  rows,
  scale,
  answers,
  onChange,
  prefixNumber = true,
}: {
  rows: MatrixRow[]
  scale: readonly ScaleOption[]
  answers: Record<string, number | undefined>
  onChange: (id: string, value: number) => void
  prefixNumber?: boolean
}) {
  return (
    <div className="overflow-x-auto border border-gray-300 bg-white">
      <table className="w-full min-w-[880px] border-collapse">
        <thead>
          <tr className="border-b border-gray-300 bg-gray-50">
            <th className="w-[45%] px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
              Question
            </th>
            {scale.map((option) => (
              <th
                key={option.value}
                className="px-3 py-3 text-center text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500"
              >
                <span className="block text-gray-900">{option.label}</span>
                <span className="mt-1 block text-[10px] font-normal text-gray-400">
                  {option.value}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.id}
              className="border-b border-gray-200 last:border-b-0"
            >
              <td className="px-4 py-4 align-middle">
                <div className="flex items-start gap-3">
                  {prefixNumber ? (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-gray-300 bg-gray-50 text-[11px] font-semibold text-gray-600">
                      {index + 1}
                    </span>
                  ) : null}
                  <p className="text-[13px] font-medium leading-5 text-gray-900">
                    {row.text}
                  </p>
                </div>
              </td>
              {scale.map((option) => {
                const selected = answers[row.id] === option.value
                return (
                  <td
                    key={option.value}
                    className={`px-3 py-4 text-center align-middle transition ${
                      selected ? "bg-[#f0f6fc]" : "bg-white"
                    }`}
                  >
                    <label className="inline-flex cursor-pointer items-center justify-center">
                      <input
                        type="radio"
                        name={row.id}
                        value={option.value}
                        checked={selected}
                        onChange={() => onChange(row.id, option.value)}
                        className="sr-only"
                      />
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                          selected
                            ? "border-[#005ea8] bg-[#005ea8]"
                            : "border-gray-400 bg-white hover:border-[#005ea8]"
                        }`}
                        aria-hidden="true"
                      >
                        {selected ? (
                          <span className="h-2 w-2 rounded-full bg-white" />
                        ) : null}
                      </span>
                      <span className="sr-only">{option.label}</span>
                    </label>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
