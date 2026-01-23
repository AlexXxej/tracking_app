import { SelectList } from '../ui/SelectList'

export function SubTaetigkeitSelect({ subTaetigkeiten, onSelect, loading }) {
  return (
    <SelectList
      items={subTaetigkeiten}
      onSelect={onSelect}
      loading={loading}
      title="Subtätigkeit wählen"
      emptyMessage="Keine Subtätigkeiten vorhanden"
    />
  )
}
