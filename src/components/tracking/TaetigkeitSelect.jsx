import { SelectList } from '../ui/SelectList'

export function TaetigkeitSelect({ taetigkeitstypen, onSelect, loading }) {
  return (
    <SelectList
      items={taetigkeitstypen}
      onSelect={onSelect}
      loading={loading}
      title="Tätigkeit wählen"
      emptyMessage="Keine Tätigkeitstypen vorhanden"
    />
  )
}
